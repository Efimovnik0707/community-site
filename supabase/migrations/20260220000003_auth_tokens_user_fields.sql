-- Add user fields to auth tokens (filled when bot receives /start)
ALTER TABLE comm_auth_tokens
  ADD COLUMN telegram_id BIGINT,
  ADD COLUMN first_name  TEXT,
  ADD COLUMN last_name   TEXT,
  ADD COLUMN username    TEXT,
  ADD COLUMN role        TEXT DEFAULT 'free';
