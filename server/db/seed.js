// Fills menu_items with the Week 2 menu. Safe to re-run: dishes are matched by name
// and updated in place, so their ids (and any orders pointing at them) stay the same.
// Run with: npm run db:seed   (after npm run db:setup)
import 'dotenv/config'
import { pool } from '../src/db.js'
import { menu } from './menu-data.js'

const client = await pool.connect()

try {
  await client.query('BEGIN') // all-or-nothing: if one insert fails, nothing is saved
  for (const item of menu) {
    await client.query(
      `INSERT INTO menu_items (name, type, description, price, image, alt)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (name) DO UPDATE SET
         type = EXCLUDED.type, description = EXCLUDED.description,
         price = EXCLUDED.price, image = EXCLUDED.image, alt = EXCLUDED.alt`,
      [item.name, item.type, item.description, item.price, item.image, item.alt],
    )
  }

  await client.query('COMMIT')
  console.log(`Seeded ${menu.length} menu items`)
} catch (error) {
  await client.query('ROLLBACK')
  console.error('Seeding failed:', error.message)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
