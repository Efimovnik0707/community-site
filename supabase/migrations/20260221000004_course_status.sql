-- Add status field to courses for UI control (active vs coming_soon)
ALTER TABLE comm_courses ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
  CHECK (status IN ('active', 'coming_soon'));

-- Update sort_order for coming_soon courses so they appear after active ones
-- (no data migration needed, new field defaults to 'active')
