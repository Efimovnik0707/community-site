-- Add file attachments to products (same structure as lesson attachments)
ALTER TABLE comm_products ADD COLUMN attachments jsonb NOT NULL DEFAULT '[]';
