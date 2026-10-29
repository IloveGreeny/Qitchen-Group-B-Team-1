-- Our own app data. The user/session tables come from Better Auth (see auth-schema.sql).

-- One row per dish on the menu.
CREATE TABLE IF NOT EXISTS menu_items (
  id          SERIAL PRIMARY KEY,               -- auto-numbered 1, 2, 3...
  name        TEXT NOT NULL UNIQUE,             -- "Tekka Maki" (no duplicates)
  type        TEXT NOT NULL,                    -- "Maki", "Uramaki" or "Special Rolls" (used by the filter)
  description TEXT NOT NULL,                    -- short line under the name
  price       NUMERIC(6, 2) NOT NULL CHECK (price >= 0), -- exact money value, e.g. 9.50
  image       TEXT NOT NULL,                    -- file name in client/public/images
  alt         TEXT NOT NULL,                    -- alt text for the photo
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per purchase. Created as 'pending' when checkout starts;
-- ONLY the Stripe webhook may change it to 'paid'.
CREATE TABLE IF NOT EXISTS orders (
  id                SERIAL PRIMARY KEY,
  user_id           TEXT NOT NULL REFERENCES "user" ("id"),  -- who bought it (from the session, never the browser)
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'paid', 'expired')),
  total_cents       INTEGER NOT NULL CHECK (total_cents >= 0), -- money in cents, like Stripe: $9.50 = 950
  currency          TEXT NOT NULL DEFAULT 'usd',
  stripe_session_id TEXT UNIQUE,                              -- links this order to its Stripe Checkout Session
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at           TIMESTAMPTZ                               -- set by the webhook
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id);

-- What was bought in each order, and at what price.
-- name and unit_price_cents are copied at purchase time, so later menu
-- price changes never rewrite old orders.
CREATE TABLE IF NOT EXISTS order_items (
  id               SERIAL PRIMARY KEY,
  order_id         INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  menu_item_id     INTEGER NOT NULL REFERENCES menu_items (id),
  name             TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  quantity         INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);
