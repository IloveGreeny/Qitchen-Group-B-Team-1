import express, { Router } from 'express'
import { pool } from '../db.js'
import { stripe } from '../stripe.js'

const router = Router()

// POST /api/stripe/webhook — Stripe calls this, not the browser.
// This is the ONLY place in the app that marks an order as 'paid'.
//
// express.raw keeps the body as the exact bytes Stripe sent. Signature checking
// needs those exact bytes, so this route must be mounted BEFORE express.json().
router.post('/', express.raw({ type: 'application/json' }), async (req, res, next) => {
  // 1. Prove the request really came from Stripe: it is signed with our webhook secret.
  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (error) {
    console.warn('Rejected webhook:', error.message)
    return res.status(400).send(`Webhook signature check failed: ${error.message}`)
  }

  try {
    const session = event.data.object

    // 2. React to the events we care about. The order is found by its Stripe session id.
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        // "completed" can also mean "payment still processing" for some payment methods,
        // so only mark paid when Stripe says the money actually arrived.
        if (session.payment_status === 'paid') {
          const result = await pool.query(
            `UPDATE orders SET status = 'paid', paid_at = now()
             WHERE stripe_session_id = $1 AND status <> 'paid'`,
            [session.id],
          )
          if (result.rowCount > 0) console.log(`Order for ${session.id} marked paid`)
        }
        break

      case 'checkout.session.expired':
        // The customer never paid and the checkout link timed out
        await pool.query(
          `UPDATE orders SET status = 'expired' WHERE stripe_session_id = $1 AND status = 'pending'`,
          [session.id],
        )
        break

      default:
      // Any other event: nothing to do, but still answer 200 so Stripe doesn't retry
    }

    // 3. Tell Stripe we got it. If we answered with an error, Stripe would retry later.
    res.json({ received: true })
  } catch (error) {
    next(error)
  }
})

export default router
