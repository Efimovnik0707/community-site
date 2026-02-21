-- ============================================================
-- Streams (live session recordings)
-- ============================================================
create table comm_streams (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text,
  youtube_id  text,             -- YouTube video ID for embed
  recorded_at timestamptz,      -- when the stream happened
  is_premium  boolean not null default true,
  published   boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index comm_streams_published_idx on comm_streams(published);

create trigger comm_streams_updated_at
  before update on comm_streams
  for each row execute function update_updated_at();

-- RLS: members only (premium), handled at app layer via service_role
alter table comm_streams enable row level security;
create policy "No anon access to streams" on comm_streams using (false);

-- ============================================================
-- Add download_url to content items (templates/workflows)
-- ============================================================
alter table comm_content_items add column if not exists download_url text;
