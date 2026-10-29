import 'dotenv/config' // loads server/.env into process.env (local only)
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Quick check that the server is up: GET /api/health -> { ok: true }
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Qitchen API listening on http://localhost:${PORT}`)
})
