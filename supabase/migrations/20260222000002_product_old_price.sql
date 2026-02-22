-- Add old_price_display for strikethrough pricing on product pages
ALTER TABLE comm_products ADD COLUMN old_price_display text;
