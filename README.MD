# Qitchen

Qitchen is a sushi restaurant website: a React frontend that shows the menu, lets customers make table reservations, and lets them create an account and sign in. The menu is stored in a Postgres database and served by an Express API.

## Features

- **Sushi Menu from the database** — Dishes are loaded from `GET /api/menu`, with a filter for Maki, Uramaki and Special Rolls and a heart toggle on every card.
- **Accounts** — Sign up, sign in and sign out with email and password. The session is kept in a cookie, so you stay signed in after a refresh.
- **Online ordering with Stripe (test mode)** — "Order now" on any dish opens Stripe Checkout. A webhook confirms the payment and marks the order paid, and a success page shows the order status.
- **Table Reservations** — A reservation form with customer details, number of guests, date, time slot, seating preference, and special requests.
- **Responsive Design** — Mobile-first Tailwind layout for phones, tablets and desktops, with no horizontal scrolling.

## Technologies

- **Frontend:** React, Vite, Tailwind CSS (deployed on Vercel)
- **Backend:** Node.js, Express (deployed on Railway)
- **Database:** PostgreSQL on Neon, queried with plain SQL through `pg`
- **Auth:** Better Auth (email + password, cookie sessions)
- **Payments:** Stripe Checkout in test mode, confirmed by a Stripe webhook

## Project Structure

```
client/                 React app (Vite)
  src/components/       Header, Hero, Menu, ProductCard, FavoriteToggle, AuthDialog, OrderSuccess, Reservation, About, Footer
  src/lib/auth-client.js  Better Auth client (useSession, signIn, signUp, signOut)
  src/lib/checkout.js   calls POST /api/checkout and sends the browser to Stripe
  src/data/navLinks.js  navigation links
  public/images/        sushi photos
  vite.config.js        forwards /api to the Express server during development
  vercel.json           forwards /api to the Railway server when live
server/                 Express API
  src/index.js          app setup and routes
  src/db.js             Postgres connection pool
  src/auth.js           Better Auth configuration
  src/stripe.js         Stripe client (uses STRIPE_SECRET_KEY)
  src/middleware/requireAuth.js  blocks a route unless someone is signed in
  src/routes/menu.js    GET /api/menu and GET /api/menu/:id
  src/routes/checkout.js  POST /api/checkout
  src/routes/webhook.js   POST /api/stripe/webhook
  src/routes/orders.js    GET /api/orders/:id
  db/schema.sql         menu_items, orders and order_items tables
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
- **orders** — one row per purchase: which `user_id` bought it, `status` (`pending` → `paid`, or `expired`), `total_cents`, the `stripe_session_id` that links it to Stripe, and when it was created and paid.
- **order_items** — what was bought in each order: which dish (`menu_item_id`), its `name`, `quantity`, and `unit_price_cents` *at the time of purchase*, so later menu price changes never rewrite old orders.

Money in orders is stored in **cents** as whole numbers (like Stripe does), so $9.50 is `950` and there are no rounding errors.

Deleting a user also deletes their accounts and sessions (`ON DELETE CASCADE`). Deleting an order deletes its items.

## API

| Method | Route | Returns |
| --- | --- | --- |
| GET | `/api/health` | `{ ok: true }` |
| GET | `/api/menu` | all dishes (optional `?type=Maki`) |
| GET | `/api/menu/:id` | one dish, or 404 |
| GET | `/api/me` | the signed-in user, or 401 |
| POST | `/api/checkout` | *(signed in)* body `{ items: [{ menuItemId, quantity }] }` → `{ url }` of the Stripe page |
| GET | `/api/orders/:id` | *(signed in)* one of **your** orders with its items, or 404 |
| POST | `/api/stripe/webhook` | called by Stripe only; checks the signature, then marks the order paid |
| * | `/api/auth/*` | Better Auth: `sign-up/email`, `sign-in/email`, `sign-out`, `get-session` |

## How a payment works

1. **Order now** → the browser sends `POST /api/checkout` with only the dish id and quantity. It never sends a price.
2. `requireAuth` checks the session cookie. If no one is signed in, it returns 401 and the sign-in pop-up opens.
3. The server reads the **real price from the database**, saves an `orders` row (`pending`) plus its `order_items`, and creates a Stripe Checkout Session with those prices. All of this happens in one transaction, so nothing is saved if Stripe fails.
4. The browser goes to Stripe's hosted page. You pay with the test card `4242 4242 4242 4242`, any future date and any CVC.
5. Stripe calls `POST /api/stripe/webhook`. The server checks the request's **signature** with `STRIPE_WEBHOOK_SECRET`, so fake requests are rejected. Only then does it set the order to `paid`. This route is the only code that can do that.
6. Stripe sends the customer to `/order/success?order=ID`. The page asks `GET /api/orders/ID` and, while it's still `pending` (the webhook can arrive a moment later), checks again every 2 seconds, up to 6 times.

## Running locally

1. Create a free Postgres database on [Neon](https://neon.tech) and copy its connection string.
2. Set up the server:
   ```
   cd server
   npm install
   cp .env.example .env      # then fill in DATABASE_URL, BETTER_AUTH_SECRET and STRIPE_SECRET_KEY
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

4. In a third terminal, forward Stripe's webhooks to your local server with the [Stripe CLI](https://docs.stripe.com/stripe-cli):
   ```
   stripe login
   stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.expired \
     --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET` in `server/.env`, then **restart the server**. It only reads `.env` when it starts.

`.env` is listed in `.gitignore`, so secrets are never committed. Only `.env.example` (with placeholder values) is in git.

## Deploying

1. **Railway (backend):** create a project from this GitHub repo, set the **Root Directory** to `server`, and add the variables `DATABASE_URL`, `BETTER_AUTH_SECRET`, `CLIENT_URL` (your Vercel URL), `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. Railway runs `npm start`. Under Networking, generate a public domain.
2. **Vercel (frontend):** import the same repo, set the **Root Directory** to `client` (framework: Vite). Put your Railway domain into `client/vercel.json` in place of `YOUR-RAILWAY-APP.up.railway.app`.
3. Set Railway's `CLIENT_URL` to the final Vercel URL and redeploy.
4. **Stripe webhook (live):** in the Stripe Dashboard (Test mode) → Developers → Webhooks → *Add endpoint*, use `https://YOUR-RAILWAY-APP.up.railway.app/api/stripe/webhook` and select the events `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `checkout.session.expired`. Copy its signing secret (`whsec_...`) into Railway's `STRIPE_WEBHOOK_SECRET`.
5. Run `npm run db:setup` against the live database once (from your machine, with Neon's `DATABASE_URL` in `server/.env`) so the orders tables exist.

## Note

Qitchen is a learning project built with React, Vite, Tailwind CSS, Express, Postgres, Better Auth and Stripe.
