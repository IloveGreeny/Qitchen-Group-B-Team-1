// Creates all tables. Safe to run more than once (every statement uses IF NOT EXISTS).
// Run with: npm run db:setup
import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { pool } from '../src/db.js'

const files = ['schema.sql']

for (const file of files) {
  const sql = await readFile(new URL(file, import.meta.url), 'utf8')
  await pool.query(sql)
  console.log(`Ran ${file}`)
}

await pool.end()
