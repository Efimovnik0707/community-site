-- ============================================================
-- Email/Google auth + purchase history
-- ============================================================

-- Bridge table: Supabase Auth user ↔ Telegram profile
CREATE TABLE comm_auth_users (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_uid uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  telegram_id  bigint REFERENCES comm_profiles(telegram_id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE comm_auth_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own record" ON comm_auth_users
  FOR SELECT USING (auth.uid() = supabase_uid);
CREATE POLICY "Service role full access" ON comm_auth_users
  USING (true)
  WITH CHECK (true);

-- Purchase history: one row per (user, product)
CREATE TABLE comm_purchases (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_uid   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id     uuid NOT NULL REFERENCES comm_products(id),
  license_key    text NOT NULL,
  ls_instance_id text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(supabase_uid, product_id)
);

ALTER TABLE comm_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own purchases" ON comm_purchases
  FOR SELECT USING (auth.uid() = supabase_uid);
CREATE POLICY "Service role full access on purchases" ON comm_purchases
  USING (true)
  WITH CHECK (true);

CREATE INDEX comm_purchases_user_idx ON comm_purchases(supabase_uid);
