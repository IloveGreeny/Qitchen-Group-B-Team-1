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
