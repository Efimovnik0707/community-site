-- Add Stripe fields to comm_products (replacing Lemon Squeezy)
ALTER TABLE comm_products
  ADD COLUMN IF NOT EXISTS stripe_payment_link text DEFAULT '',
  ADD COLUMN IF NOT EXISTS stripe_price_id text;

-- Add stripe_customer_email to comm_purchases for webhook matching
ALTER TABLE comm_purchases
  ALTER COLUMN license_key DROP NOT NULL;

ALTER TABLE comm_purchases
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS customer_email text;

-- RPC function to look up auth user by email (used by Stripe webhook)
CREATE OR REPLACE FUNCTION get_auth_user_by_email(lookup_email text)
RETURNS TABLE(id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, email::text FROM auth.users WHERE email = lookup_email LIMIT 1;
$$;
