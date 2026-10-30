import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

// Every route here needs a signed-in user
router.use(requireAuth)

// GET /api/orders/7 -> that order with its items, if it belongs to the signed-in user.
// The success page calls this to show whether the webhook has marked it paid yet.
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be a number' })

    // "AND user_id = $2" means people can only ever see their own orders
    const { rows: [order] } = await pool.query(
      `SELECT id, status, total_cents, currency, created_at, paid_at
       FROM orders WHERE id = $1 AND user_id = $2`,
      [id, req.user.id],
    )
    if (!order) return res.status(404).json({ error: 'Order not found' })

    const { rows: items } = await pool.query(
      `SELECT menu_item_id, name, unit_price_cents, quantity
       FROM order_items WHERE order_id = $1 ORDER BY id`,
      [id],
    )

    res.json({ ...order, items })
  } catch (error) {
    next(error)
  }
})

export default router
