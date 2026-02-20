-- ============================================================
-- Community Site — Initial Schema
-- Prefix: comm_
-- ============================================================

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table comm_profiles (
  telegram_id   bigint primary key,
  username      text,
  first_name    text    not null,
  last_name     text,
  photo_url     text,
  role          text    not null default 'free' check (role in ('free', 'member', 'admin')),
  role_checked_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table comm_profiles is 'Telegram-authenticated users';
comment on column comm_profiles.role is 'free | member | admin';

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger comm_profiles_updated_at
  before update on comm_profiles
  for each row execute function update_updated_at();

-- ============================================================
-- 2. CONTENT ITEMS (tools section resources)
-- ============================================================
create table comm_content_items (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text,
  type        text not null check (type in ('template', 'prompt', 'skill', 'guide', 'workflow')),
  tool        text not null check (tool in ('n8n', 'claude-code', 'chatgpt', 'lovable', 'other')),
  content_url  text,
  content_body text,
  is_premium  boolean not null default false,
  tags        text[] default '{}',
  sort_order  int not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table comm_content_items is 'Templates, prompts, skills, guides — shown in /tools/[slug]';

create index comm_content_items_tool_idx on comm_content_items(tool);
create index comm_content_items_published_idx on comm_content_items(published);

create trigger comm_content_items_updated_at
  before update on comm_content_items
  for each row execute function update_updated_at();

-- ============================================================
-- 3. COURSES
-- ============================================================
create table comm_courses (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text,
  cover_url   text,
  is_premium  boolean not null default true,
  sort_order  int not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger comm_courses_updated_at
  before update on comm_courses
  for each row execute function update_updated_at();

-- ============================================================
-- 4. COURSE MODULES
-- ============================================================
create table comm_course_modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references comm_courses(id) on delete cascade,
  title       text not null,
  sort_order  int not null default 0
);

create index comm_course_modules_course_idx on comm_course_modules(course_id);

-- ============================================================
-- 5. LESSONS
-- ============================================================
create table comm_lessons (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references comm_course_modules(id) on delete cascade,
  slug        text not null,
  title       text not null,
  youtube_id  text,
  content     text,
  duration    int,             -- seconds
  sort_order  int not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);

create index comm_lessons_module_idx on comm_lessons(module_id);
create unique index comm_lessons_slug_module_idx on comm_lessons(module_id, slug);

-- ============================================================
-- 6. LESSON PROGRESS
-- ============================================================
create table comm_lesson_progress (
  telegram_id  bigint not null references comm_profiles(telegram_id) on delete cascade,
  lesson_id    uuid   not null references comm_lessons(id) on delete cascade,
  completed    boolean not null default false,
  completed_at timestamptz,
  primary key (telegram_id, lesson_id)
);

create index comm_lesson_progress_user_idx on comm_lesson_progress(telegram_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table comm_profiles        enable row level security;
alter table comm_content_items   enable row level security;
alter table comm_courses         enable row level security;
alter table comm_course_modules  enable row level security;
alter table comm_lessons         enable row level security;
alter table comm_lesson_progress enable row level security;

-- IMPORTANT: All auth is handled via Telegram login + server-side API routes.
-- Supabase anon key is used on frontend only for reading public content.
-- Mutations go through server API routes using service_role key.
-- Therefore: anon can read published public content; everything else is service_role only.

-- comm_profiles: no anon access (PII); service_role handles all writes
create policy "Service role only" on comm_profiles
  using (false);

-- comm_content_items: anon can read published free content only
-- Premium content is served via server API routes using service_role key
create policy "Public can read free published content" on comm_content_items
  for select using (published = true and is_premium = false);

-- comm_courses: anon sees published courses (metadata only, not lesson content)
create policy "Public can see published courses" on comm_courses
  for select using (published = true);

-- comm_course_modules: visible if parent course is published
create policy "Public can see modules of published courses" on comm_course_modules
  for select using (
    exists (
      select 1 from comm_courses c
      where c.id = course_id and c.published = true
    )
  );

-- comm_lessons: published lessons visible (but content gating is done in app layer)
create policy "Public can see published lessons" on comm_lessons
  for select using (published = true);

-- comm_lesson_progress: no anon access
create policy "No anon access to progress" on comm_lesson_progress
  using (false);
