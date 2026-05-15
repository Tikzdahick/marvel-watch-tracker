/**
 * supabaseHelpers.js — all Supabase database operations for:
 *   • Friends system  (friendships table)
 *   • Community feed  (posts, post_likes, post_comments, post_reports tables)
 *
 * Every function returns { data, error } matching Supabase's convention.
 * All functions gracefully return { data: null, error: 'no-client' } when
 * Supabase is not configured (SUPABASE_ENABLED = false).
 *
 * ── Required tables (create in Supabase → SQL Editor) ──────────────────────
 *
 * -- public.user_profiles (extended profile, readable by all authenticated users)
 * create table public.user_profiles (
 *   id           uuid primary key references auth.users(id) on delete cascade,
 *   username     text unique not null,
 *   avatar       text,
 *   list_size    text default 'avenger',
 *   watched_ids  int4[] default '{}',
 *   watch_history jsonb default '{}',
 *   streak       int4 default 0,
 *   updated_at   timestamptz default now()
 * );
 * alter table public.user_profiles enable row level security;
 * create policy "Profiles readable by authenticated users"
 *   on public.user_profiles for select using (auth.role() = 'authenticated');
 * create policy "Users manage own profile"
 *   on public.user_profiles for all using (auth.uid() = id);
 *
 * -- public.friendships
 * create table public.friendships (
 *   id           uuid primary key default gen_random_uuid(),
 *   requester_id uuid not null references auth.users(id) on delete cascade,
 *   addressee_id uuid not null references auth.users(id) on delete cascade,
 *   status       text not null check (status in ('pending','accepted','declined')),
 *   created_at   timestamptz default now(),
 *   unique (requester_id, addressee_id)
 * );
 * alter table public.friendships enable row level security;
 * create policy "Users see their own friendships"
 *   on public.friendships for select
 *   using (auth.uid() = requester_id or auth.uid() = addressee_id);
 * create policy "Users manage friendships they created"
 *   on public.friendships for all using (auth.uid() = requester_id);
 * create policy "Addressee can update status"
 *   on public.friendships for update using (auth.uid() = addressee_id);
 *
 * -- public.posts
 * create table public.posts (
 *   id         uuid primary key default gen_random_uuid(),
 *   user_id    uuid not null references auth.users(id) on delete cascade,
 *   type       text not null check (type in ('review','progress','opinion')),
 *   content    text not null,
 *   title_id   int4,
 *   rating     int4 check (rating between 1 and 5),
 *   visibility text not null default 'public' check (visibility in ('public','friends')),
 *   created_at timestamptz default now()
 * );
 * alter table public.posts enable row level security;
 * create policy "Public posts readable by authenticated"
 *   on public.posts for select
 *   using (auth.role() = 'authenticated' and (visibility = 'public' or user_id = auth.uid()));
 * create policy "Users manage own posts"
 *   on public.posts for all using (auth.uid() = user_id);
 *
 * -- public.post_likes
 * create table public.post_likes (
 *   id      uuid primary key default gen_random_uuid(),
 *   post_id uuid not null references public.posts(id) on delete cascade,
 *   user_id uuid not null references auth.users(id) on delete cascade,
 *   unique (post_id, user_id)
 * );
 * alter table public.post_likes enable row level security;
 * create policy "Likes readable by authenticated"
 *   on public.post_likes for select using (auth.role() = 'authenticated');
 * create policy "Users manage own likes"
 *   on public.post_likes for all using (auth.uid() = user_id);
 *
 * -- public.post_comments
 * create table public.post_comments (
 *   id         uuid primary key default gen_random_uuid(),
 *   post_id    uuid not null references public.posts(id) on delete cascade,
 *   user_id    uuid not null references auth.users(id) on delete cascade,
 *   content    text not null,
 *   created_at timestamptz default now()
 * );
 * alter table public.post_comments enable row level security;
 * create policy "Comments readable by authenticated"
 *   on public.post_comments for select using (auth.role() = 'authenticated');
 * create policy "Users manage own comments"
 *   on public.post_comments for all using (auth.uid() = user_id);
 *
 * -- public.post_reports
 * create table public.post_reports (
 *   id         uuid primary key default gen_random_uuid(),
 *   post_id    uuid not null references public.posts(id) on delete cascade,
 *   user_id    uuid not null references auth.users(id) on delete cascade,
 *   reason     text,
 *   created_at timestamptz default now(),
 *   unique (post_id, user_id)
 * );
 * alter table public.post_reports enable row level security;
 * create policy "Users manage own reports"
 *   on public.post_reports for all using (auth.uid() = user_id);
 */

import { getSupabase } from './supabase.js'

function sb() { return getSupabase() }
function noClient() { return { data: null, error: 'no-client' } }

// ── User profiles ─────────────────────────────────────────────────────────────

/** Fetch a single user's public profile by their auth uid */
export async function fetchProfile(userId) {
  const s = sb(); if (!s) return noClient()
  return s.from('user_profiles').select('*').eq('id', userId).single()
}

/** Upsert the current user's public profile */
export async function upsertProfile(userId, data) {
  const s = sb(); if (!s) return noClient()
  return s.from('user_profiles').upsert({ id: userId, ...data, updated_at: new Date().toISOString() })
}

/** Search users by username prefix (case-insensitive, excludes self) */
export async function searchUsers(query, selfId) {
  const s = sb(); if (!s) return noClient()
  return s
    .from('user_profiles')
    .select('id, username, avatar, list_size, streak')
    .ilike('username', `${query}%`)
    .neq('id', selfId)
    .limit(20)
}

// ── Friends ────────────────────────────────────────────────────────────────────

/** Get all friendships for the current user (both directions) */
export async function fetchFriendships(userId) {
  const s = sb(); if (!s) return noClient()
  return s
    .from('friendships')
    .select(`
      id, status, created_at,
      requester:requester_id ( id, username, avatar, streak ),
      addressee:addressee_id ( id, username, avatar, streak )
    `)
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .order('created_at', { ascending: false })
}

/** Send a friend request */
export async function sendFriendRequest(requesterId, addresseeId) {
  const s = sb(); if (!s) return noClient()
  return s.from('friendships').insert({ requester_id: requesterId, addressee_id: addresseeId, status: 'pending' })
}

/** Accept a friend request (addressee only) */
export async function acceptFriendRequest(friendshipId) {
  const s = sb(); if (!s) return noClient()
  return s.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
}

/** Decline a friend request (addressee only) */
export async function declineFriendRequest(friendshipId) {
  const s = sb(); if (!s) return noClient()
  return s.from('friendships').update({ status: 'declined' }).eq('id', friendshipId)
}

/** Remove a friendship / cancel a request */
export async function removeFriendship(friendshipId) {
  const s = sb(); if (!s) return noClient()
  return s.from('friendships').delete().eq('id', friendshipId)
}

/** Fetch a friend's full profile (watched ids, watch_history for stats) */
export async function fetchFriendProfile(userId) {
  const s = sb(); if (!s) return noClient()
  return s
    .from('user_profiles')
    .select('id, username, avatar, list_size, watched_ids, watch_history, streak, updated_at')
    .eq('id', userId)
    .single()
}

// ── Posts ──────────────────────────────────────────────────────────────────────

/**
 * Fetch community feed posts.
 * friendIds — array of friend user uids; their posts surface first.
 * cursor    — ISO timestamp to paginate (posts older than cursor).
 */
export async function fetchPosts({ friendIds = [], cursor = null, limit = 20 } = {}) {
  const s = sb(); if (!s) return noClient()
  let q = s
    .from('posts')
    .select(`
      id, type, content, title_id, rating, visibility, created_at,
      author:user_id ( id, username, avatar ),
      likes:post_likes ( user_id ),
      comments:post_comments ( count )
    `)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (cursor) q = q.lt('created_at', cursor)
  return q
}

/** Fetch posts by a specific user (public + own friends-only) */
export async function fetchUserPosts(userId, selfId) {
  const s = sb(); if (!s) return noClient()
  return s
    .from('posts')
    .select(`
      id, type, content, title_id, rating, visibility, created_at,
      author:user_id ( id, username, avatar ),
      likes:post_likes ( user_id ),
      comments:post_comments ( count )
    `)
    .eq('user_id', userId)
    .or(`visibility.eq.public${userId === selfId ? ',visibility.eq.friends' : ''}`)
    .order('created_at', { ascending: false })
    .limit(50)
}

/** Create a new post */
export async function createPost({ userId, type, content, titleId = null, rating = null, visibility = 'public' }) {
  const s = sb(); if (!s) return noClient()
  return s.from('posts').insert({
    user_id:    userId,
    type,
    content,
    title_id:   titleId,
    rating,
    visibility,
  }).select().single()
}

/** Delete a post (only by its author — enforced by RLS) */
export async function deletePost(postId) {
  const s = sb(); if (!s) return noClient()
  return s.from('posts').delete().eq('id', postId)
}

// ── Likes ──────────────────────────────────────────────────────────────────────

/** Toggle like on a post. Returns { liked: boolean } */
export async function toggleLike(postId, userId) {
  const s = sb(); if (!s) return noClient()
  const { data: existing } = await s.from('post_likes').select('id').eq('post_id', postId).eq('user_id', userId).maybeSingle()
  if (existing) {
    await s.from('post_likes').delete().eq('id', existing.id)
    return { data: { liked: false }, error: null }
  } else {
    await s.from('post_likes').insert({ post_id: postId, user_id: userId })
    return { data: { liked: true }, error: null }
  }
}

// ── Comments ───────────────────────────────────────────────────────────────────

/** Fetch all comments for a post */
export async function fetchComments(postId) {
  const s = sb(); if (!s) return noClient()
  return s
    .from('post_comments')
    .select('id, content, created_at, author:user_id ( id, username, avatar )')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
}

/** Add a comment to a post */
export async function addComment(postId, userId, content) {
  const s = sb(); if (!s) return noClient()
  return s.from('post_comments').insert({ post_id: postId, user_id: userId, content }).select().single()
}

/** Delete a comment (only by its author) */
export async function deleteComment(commentId) {
  const s = sb(); if (!s) return noClient()
  return s.from('post_comments').delete().eq('id', commentId)
}

// ── Reports ────────────────────────────────────────────────────────────────────

/** Report a post */
export async function reportPost(postId, userId, reason = '') {
  const s = sb(); if (!s) return noClient()
  return s.from('post_reports').upsert({ post_id: postId, user_id: userId, reason })
}

// ── Realtime subscriptions ─────────────────────────────────────────────────────

/**
 * Subscribe to new public posts in real time.
 * Returns an unsubscribe function.
 */
export function subscribeToNewPosts(onInsert) {
  const s = sb(); if (!s) return () => {}
  const channel = s
    .channel('public-posts')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts', filter: 'visibility=eq.public' }, onInsert)
    .subscribe()
  return () => s.removeChannel(channel)
}

/**
 * Subscribe to likes changes on a specific post.
 * Returns an unsubscribe function.
 */
export function subscribeToPostLikes(postId, onChange) {
  const s = sb(); if (!s) return () => {}
  const channel = s
    .channel(`post-likes-${postId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes', filter: `post_id=eq.${postId}` }, onChange)
    .subscribe()
  return () => s.removeChannel(channel)
}
