-- Digital products (one-time purchases via Lemon Squeezy)
CREATE TABLE comm_products (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                     text UNIQUE NOT NULL,
  title                    text NOT NULL,
  tagline                  text,
  description_html         text,
  price_display            text NOT NULL DEFAULT '$5',
  lemon_squeezy_url        text NOT NULL DEFAULT '',
  lemon_squeezy_product_id text,
  content_html             text,
  membership_included      boolean NOT NULL DEFAULT false,
  published                boolean NOT NULL DEFAULT false,
  sort_order               int NOT NULL DEFAULT 0,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER comm_products_updated_at
  BEFORE UPDATE ON comm_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- No anon access — content served via server-side verification only
ALTER TABLE comm_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No anon access to products" ON comm_products USING (false);
