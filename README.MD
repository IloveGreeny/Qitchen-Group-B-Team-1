# Qitchen

Qitchen is a sushi restaurant website: a React frontend that shows the menu, lets customers make table reservations, and lets them create an account and sign in. The menu is stored in a Postgres database and served by an Express API.

## Features

- **Sushi Menu from the database** — Dishes are loaded from `GET /api/menu`, with a filter for Maki, Uramaki and Special Rolls and a heart toggle on every card.
- **Accounts** — Sign up, sign in and sign out with email and password. The session is kept in a cookie, so you stay signed in after a refresh.
- **Table Reservations** — A reservation form with customer details, number of guests, date, time slot, seating preference, and special requests.
- **Responsive Design** — Mobile-first Tailwind layout for phones, tablets and desktops, with no horizontal scrolling.

## Technologies

- **Frontend:** React, Vite, Tailwind CSS (deployed on Vercel)
- **Backend:** Node.js, Express (deployed on Railway)
- **Database:** PostgreSQL on Neon, queried with plain SQL through `pg`
- **Auth:** Better Auth (email + password, cookie sessions)

## Project Structure

```
client/                 React app (Vite)
  src/components/       Header, Hero, Menu, ProductCard, FavoriteToggle, AuthDialog, Reservation, About, Footer
  src/lib/auth-client.js  Better Auth client (useSession, signIn, signUp, signOut)
  src/data/navLinks.js  navigation links
  public/images/        sushi photos
  vite.config.js        forwards /api to the Express server during development
  vercel.json           forwards /api to the Railway server when live
server/                 Express API
  src/index.js          app setup and routes
  src/db.js             Postgres connection pool
  src/auth.js           Better Auth configuration
  src/routes/menu.js    GET /api/menu and GET /api/menu/:id
  db/schema.sql         menu_items table
  db/auth-schema.sql    Better Auth tables (user, session, account, verification)
  db/setup.js           creates all tables      (npm run db:setup)
  db/seed.js            fills menu_items        (npm run db:seed)
  db/menu-data.js       the Week 2 menu used by the seed script
  .env.example          which environment variables are needed
```

## How the pieces talk to each other

The browser only ever talks to the frontend's own address. Any request to `/api/...` is forwarded to the Express server: by Vite locally, and by Vercel's rewrite when live. Because of that, the login cookie belongs to the frontend's domain, and no CORS setup is needed.

```
Browser ──> Vercel (React app) ──/api/*──> Railway (Express) ──> Neon (Postgres)
```

## Database schema

- **menu_items** — one row per dish: `id`, `name` (unique), `type` (Maki / Uramaki / Special Rolls), `description`, `price` (exact decimal), `image` file name, `alt` text.
- **user** — one row per person who signed up: name, email (unique).
- **account** — how a user signs in; for email login it holds the *hashed* password. Linked to `user`.
- **session** — one row per signed-in browser; the cookie holds its token. Deleted on sign-out. Linked to `user`.
- **verification** — short-lived codes (for things like email verification); created by Better Auth.

Deleting a user also deletes their accounts and sessions (`ON DELETE CASCADE`).

## API

| Method | Route | Returns |
| --- | --- | --- |
| GET | `/api/health` | `{ ok: true }` |
| GET | `/api/menu` | all dishes (optional `?type=Maki`) |
| GET | `/api/menu/:id` | one dish, or 404 |
| GET | `/api/me` | the signed-in user, or 401 |
| * | `/api/auth/*` | Better Auth: `sign-up/email`, `sign-in/email`, `sign-out`, `get-session` |

## Running locally

1. Create a free Postgres database on [Neon](https://neon.tech) and copy its connection string.
2. Set up the server:
   ```
   cd server
   npm install
   cp .env.example .env      # then fill in DATABASE_URL and BETTER_AUTH_SECRET
   npm run db:setup          # creates the tables
   npm run db:seed           # puts the menu into menu_items
   npm run dev               # http://localhost:3000
   ```
3. In a second terminal, start the client:
   ```
   cd client
   npm install
   npm run dev               # http://localhost:5173
   ```

`.env` is listed in `.gitignore`, so secrets are never committed. Only `.env.example` (with placeholder values) is in git.

## Deploying

1. **Railway (backend):** create a project from this GitHub repo, set the **Root Directory** to `server`, and add the variables `DATABASE_URL`, `BETTER_AUTH_SECRET` and `CLIENT_URL` (your Vercel URL). Railway runs `npm start`. Under Networking, generate a public domain.
2. **Vercel (frontend):** import the same repo, set the **Root Directory** to `client` (framework: Vite). Put your Railway domain into `client/vercel.json` in place of `YOUR-RAILWAY-APP.up.railway.app`.
3. Set Railway's `CLIENT_URL` to the final Vercel URL and redeploy.

## Note

Qitchen is a learning project built with React, Vite, Tailwind CSS, Express, Postgres and Better Auth.
