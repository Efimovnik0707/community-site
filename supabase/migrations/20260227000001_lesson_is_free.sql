-- Add is_free flag to lessons
-- Allows marking individual lessons as free within a premium course

ALTER TABLE comm_lessons
  ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN comm_lessons.is_free IS 'If true, this lesson is accessible to all logged-in users even if the parent course is premium';
