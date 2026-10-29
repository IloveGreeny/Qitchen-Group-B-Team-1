import 'dotenv/config' // loads server/.env into process.env (local only)
import express from 'express'
import menuRouter from './routes/menu.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Quick check that the server is up: GET /api/health -> { ok: true }
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/menu', menuRouter)

// Any error passed to next(error) ends up here
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Something went wrong on the server' })
})

app.listen(PORT, () => {
  console.log(`Qitchen API listening on http://localhost:${PORT}`)
})
