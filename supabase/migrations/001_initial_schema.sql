-- ============================================================
-- Marvel Watch Tracker — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. user_profiles ─────────────────────────────────────────
-- Extended public profile for every user. Stores watch data
-- (watched_ids, watch_history) so friends can see progress.

create table if not exists public.user_profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  username      text        unique not null,
  avatar        text,
  list_size     text        not null default 'avenger',
  watched_ids   int4[]      not null default '{}',
  watch_history jsonb       not null default '{}',
  streak        int4        not null default 0,
  updated_at    timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

-- Any authenticated user can read profiles (needed for friend search)
create policy "Profiles readable by authenticated users"
  on public.user_profiles for select
  using (auth.role() = 'authenticated');

-- Each user manages their own profile
create policy "Users manage own profile"
  on public.user_profiles for all
  using (auth.uid() = id);


-- ── 2. friendships ───────────────────────────────────────────
-- Tracks friend requests and accepted friendships.
-- status: 'pending' | 'accepted' | 'declined'

create table if not exists public.friendships (
  id           uuid        primary key default gen_random_uuid(),
  requester_id uuid        not null references auth.users(id) on delete cascade,
  addressee_id uuid        not null references auth.users(id) on delete cascade,
  status       text        not null check (status in ('pending','accepted','declined')),
  created_at   timestamptz not null default now(),
  unique (requester_id, addressee_id)
);

alter table public.friendships enable row level security;

-- Users can see their own friendships (either side)
create policy "Users see their own friendships"
  on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Only the requester can insert or delete
create policy "Users manage friendships they created"
  on public.friendships for all
  using (auth.uid() = requester_id);

-- The addressee can update status (accept / decline)
create policy "Addressee can update status"
  on public.friendships for update
  using (auth.uid() = addressee_id);


-- ── 3. posts ─────────────────────────────────────────────────
-- Community posts: reviews, progress updates, opinions.
-- visibility: 'public' | 'friends'

create table if not exists public.posts (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  type       text        not null check (type in ('review','progress','opinion')),
  content    text        not null,
  title_id   int4,
  rating     int4        check (rating between 1 and 5),
  visibility text        not null default 'public' check (visibility in ('public','friends')),
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Any authenticated user can read public posts, owner can read own friends-only posts
create policy "Public posts readable by authenticated"
  on public.posts for select
  using (
    auth.role() = 'authenticated'
    and (visibility = 'public' or user_id = auth.uid())
  );

-- Users manage their own posts
create policy "Users manage own posts"
  on public.posts for all
  using (auth.uid() = user_id);


-- ── 4. post_likes ────────────────────────────────────────────

create table if not exists public.post_likes (
  id      uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id)  on delete cascade,
  unique (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "Likes readable by authenticated"
  on public.post_likes for select
  using (auth.role() = 'authenticated');

create policy "Users manage own likes"
  on public.post_likes for all
  using (auth.uid() = user_id);


-- ── 5. post_comments ─────────────────────────────────────────

create table if not exists public.post_comments (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id)  on delete cascade,
  content    text        not null,
  created_at timestamptz not null default now()
);

alter table public.post_comments enable row level security;

create policy "Comments readable by authenticated"
  on public.post_comments for select
  using (auth.role() = 'authenticated');

create policy "Users manage own comments"
  on public.post_comments for all
  using (auth.uid() = user_id);


-- ── 6. post_reports ──────────────────────────────────────────

create table if not exists public.post_reports (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id)  on delete cascade,
  reason     text,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

alter table public.post_reports enable row level security;

create policy "Users manage own reports"
  on public.post_reports for all
  using (auth.uid() = user_id);


-- ── 7. Realtime — enable for community feed ──────────────────
-- Allows subscribeToNewPosts() in supabaseHelpers.js to work.

alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.post_likes;


-- ── 8. Helper function: auto-create profile on signup ────────
-- Fires when a new user signs up; creates their profile row
-- so username search and friend lookups always have a record.

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, username, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar', '👤')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Attach the trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
