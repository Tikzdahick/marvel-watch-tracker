/**
 * Supabase client singleton.
 *
 * The client is null when environment variables are not configured,
 * so the app works in "local-only" mode without any Supabase setup.
 *
 * To enable Supabase:
 *   1. Create a project at https://supabase.com
 *   2. Copy your Project URL and anon key into .env.local:
 *        VITE_SUPABASE_URL=https://xxxx.supabase.co
 *        VITE_SUPABASE_ANON_KEY=eyJhbGci...
 *   3. Create the required tables (see README or SUPABASE_SETUP.md)
 *
 * Required tables:
 *
 *   profiles (id uuid PK = auth.uid(), name text, avatar text,
 *             list_size text, pace text, goal jsonb, reminder jsonb)
 *
 *   watch_data (user_id uuid FK, watched int4[], watch_history jsonb,
 *               ratings jsonb, notes jsonb, achievements jsonb, login_dates text[])
 *
 *   content_locks (user_id uuid FK, pg13_pin text, tv14_pin text,
 *                  tvma_pin text, r_pin text)
 *
 *   watch_planner (id uuid PK, user_id uuid FK, title_id int4, scheduled_date date)
 *
 * Enable RLS on all tables with policy: auth.uid() = user_id (or id for profiles)
 */

let _supabase = null

const url = import.meta.env.VITE_SUPABASE_URL
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (url && key && url !== 'YOUR_SUPABASE_URL' && key !== 'YOUR_SUPABASE_ANON_KEY') {
  // Dynamically import only when credentials are present to avoid bundle bloat
  // for users who never configure Supabase.
  import('@supabase/supabase-js').then(({ createClient }) => {
    _supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession:   true,
        detectSessionInUrl: true,
      },
    })
  }).catch(() => {
    console.warn('[MVT] Supabase client failed to initialise — running in local-only mode.')
  })
}

/** Returns the Supabase client, or null in local-only mode */
export function getSupabase() { return _supabase }

/** True when Supabase env vars are present (even if client isn't ready yet) */
export const SUPABASE_ENABLED = !!(url && key && url !== 'YOUR_SUPABASE_URL')
