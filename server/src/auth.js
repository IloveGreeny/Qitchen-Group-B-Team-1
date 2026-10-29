import { betterAuth } from 'better-auth'
import { pool } from './db.js'

// Better Auth handles signup, login, logout and sessions for us.
// It stores users and sessions in our Postgres database (tables in db/auth-schema.sql).
export const auth = betterAuth({
  database: pool,
  // BETTER_AUTH_SECRET is read from the environment automatically; it signs the session cookie.

  // The site the browser is on. The frontend forwards /api/* to this server,
  // so the session cookie belongs to the frontend's own domain.
  baseURL: process.env.CLIENT_URL,
  trustedOrigins: [process.env.CLIENT_URL],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
})
