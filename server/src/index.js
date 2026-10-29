import 'dotenv/config' // loads server/.env into process.env (local only)
import express from 'express'
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node'
import { auth } from './auth.js'
import menuRouter from './routes/menu.js'

const app = express()
const PORT = process.env.PORT || 3000

// Better Auth handles everything under /api/auth (sign-up, sign-in, sign-out, get-session).
// It must come BEFORE express.json(), because it reads the request body itself.
app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())

// Quick check that the server is up: GET /api/health -> { ok: true }
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/menu', menuRouter)

// Example of a protected route: only works when signed in.
// GET /api/me -> { user } or 401
app.get('/api/me', async (req, res) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Not signed in' })
  res.json({ user: session.user })
})

// Any error passed to next(error) ends up here
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Something went wrong on the server' })
})

app.listen(PORT, () => {
  console.log(`Qitchen API listening on http://localhost:${PORT}`)
})
