-- Add Loom video support to lessons
ALTER TABLE comm_lessons ADD COLUMN IF NOT EXISTS loom_id text;

-- Add file attachments to lessons (array of {url, name, size})
ALTER TABLE comm_lessons ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]';

-- Add file attachments to content items
ALTER TABLE comm_content_items ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]';
