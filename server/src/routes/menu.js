import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// price is NUMERIC in Postgres, which pg returns as a string ("9.50"),
// so cast it to a float in SQL to send a real number in the JSON.
const COLUMNS = 'id, name, type, description, price::float AS price, image, alt'

// GET /api/menu            -> every dish
// GET /api/menu?type=Maki  -> only that type
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query
    const result = type
      ? await pool.query(`SELECT ${COLUMNS} FROM menu_items WHERE type = $1 ORDER BY id`, [type])
      : await pool.query(`SELECT ${COLUMNS} FROM menu_items ORDER BY id`)
    res.json(result.rows)
  } catch (error) {
    next(error)
  }
})

// GET /api/menu/3 -> one dish, or 404
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be a number' })

    const result = await pool.query(`SELECT ${COLUMNS} FROM menu_items WHERE id = $1`, [id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Dish not found' })
    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

export default router
