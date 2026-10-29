import { Router } from 'express'
import { pool } from '../db.js'
import { stripe } from '../stripe.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

// POST /api/checkout   (must be signed in)
// Body: { items: [{ menuItemId: 3, quantity: 2 }, ...] }
// Returns: { url } -> the Stripe-hosted payment page to send the browser to
router.post('/', requireAuth, async (req, res, next) => {
  // 1. Check the request shape. The browser only tells us WHAT and HOW MANY — never the price.
  const items = req.body?.items
  const isValid =
    Array.isArray(items) &&
    items.length > 0 &&
    items.length <= 20 &&
    items.every(
      (item) =>
        Number.isInteger(item?.menuItemId) &&
        Number.isInteger(item?.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 20,
    )
  if (!isValid) {
    return res.status(400).json({ error: 'items must be a list of { menuItemId, quantity } (quantity 1–20)' })
  }

  const client = await pool.connect()
  try {
    // 2. Look up the REAL prices from our database (in cents, like Stripe uses).
    const ids = items.map((item) => item.menuItemId)
    const { rows: dishes } = await client.query(
      `SELECT id, name, image, (price * 100)::int AS unit_price_cents
       FROM menu_items WHERE id = ANY($1)`,
      [ids],
    )
    const dishById = new Map(dishes.map((dish) => [dish.id, dish]))
    if (items.some((item) => !dishById.has(item.menuItemId))) {
      return res.status(400).json({ error: 'One of those dishes does not exist' })
    }

    const lines = items.map((item) => ({ ...dishById.get(item.menuItemId), quantity: item.quantity }))
    const totalCents = lines.reduce((sum, line) => sum + line.unit_price_cents * line.quantity, 0)

    // 3. Save the order as 'pending'. The transaction means: if anything below fails
    //    (including Stripe), none of these rows are kept.
    await client.query('BEGIN')

    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id, total_cents) VALUES ($1, $2) RETURNING id`,
      [req.user.id, totalCents],
    )

    for (const line of lines) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, name, unit_price_cents, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, line.id, line.name, line.unit_price_cents, line.quantity],
      )
    }

    // 4. Start a Stripe Checkout Session using the prices from our database.
    const clientUrl = process.env.CLIENT_URL
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: req.user.email,
      client_reference_id: String(order.id),
      metadata: { orderId: String(order.id) },
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: line.unit_price_cents,
          product_data: {
            name: line.name,
            // Stripe can only show images from a public https address, so only add them when live
            ...(clientUrl.startsWith('https://') && { images: [`${clientUrl}/images/${line.image}`] }),
          },
        },
      })),
      success_url: `${clientUrl}/order/success?order=${order.id}`,
      cancel_url: `${clientUrl}/#menu`,
    })

    // 5. Remember which Stripe session belongs to this order (the webhook looks it up by this).
    await client.query(`UPDATE orders SET stripe_session_id = $1 WHERE id = $2`, [session.id, order.id])
    await client.query('COMMIT')

    res.status(201).json({ url: session.url, orderId: order.id })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {}) // harmless if no transaction was open
    next(error)
  } finally {
    client.release()
  }
})

export default router
