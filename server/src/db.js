import pg from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Copy server/.env.example to server/.env and fill it in.')
}

// One shared pool of connections to Postgres, reused by every request.
// SSL settings come from the connection string (Neon's ends in ?sslmode=require).
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})
