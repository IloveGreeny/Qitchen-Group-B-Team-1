import 'dotenv/config' // loads server/.env into process.env (local only)
import express from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import menuRouter from './routes/menu.js'
import checkoutRouter from './routes/checkout.js'
import webhookRouter from './routes/webhook.js'
import ordersRouter from './routes/orders.js'
import { requireAuth } from './middleware/requireAuth.js'

const app = express()
const PORT = process.env.PORT || 3000

// Better Auth handles everything under /api/auth (sign-up, sign-in, sign-out, get-session).
// It must come BEFORE express.json(), because it reads the request body itself.
app.all('/api/auth/*splat', toNodeHandler(auth))

// Stripe's webhook also needs the raw, unparsed body (to check its signature),
// so it too must come BEFORE express.json().
app.use('/api/stripe/webhook', webhookRouter)

app.use(express.json())

// Quick check that the server is up: GET /api/health -> { ok: true }
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/menu', menuRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/orders', ordersRouter)

// Example of a protected route: only works when signed in.
// GET /api/me -> { user } or 401
app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

// Any error passed to next(error) ends up here
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Something went wrong on the server' })
})

app.listen(PORT, () => {
  console.log(`Qitchen API listening on http://localhost:${PORT}`)
})
