-- Login tokens for bot-based auth flow
CREATE TABLE comm_auth_tokens (
  token       TEXT PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '10 minutes',
  used        BOOLEAN DEFAULT FALSE
);

-- Auto-delete expired tokens (cleanup)
CREATE INDEX idx_auth_tokens_expires ON comm_auth_tokens (expires_at);
