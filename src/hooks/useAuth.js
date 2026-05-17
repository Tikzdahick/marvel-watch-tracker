/**
 * useAuth — React hook for Supabase authentication state.
 *
 * Returns { user, session, loading } where:
 *   - user:    the current Supabase User object, or null if not logged in
 *   - session: the current Session, or null
 *   - loading: true while the initial session is being resolved
 *
 * When Supabase is not configured (SUPABASE_ENABLED = false), this hook
 * always returns { user: null, session: null, loading: false } and the app
 * runs in local-only mode (auth screens are hidden).
 */

import { useState, useEffect } from 'react'
import { getSupabase, SUPABASE_ENABLED } from '../lib/supabase.js'

// Re-export so consumers only need to import from this single module
export { SUPABASE_ENABLED }

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(SUPABASE_ENABLED)

  useEffect(() => {
    if (!SUPABASE_ENABLED) {
      setLoading(false)
      return
    }

    // Poll until the dynamic import resolves (usually < 100ms)
    let attempts = 0
    const waitForClient = setInterval(() => {
      const sb = getSupabase()
      if (sb || attempts++ > 50) {
        clearInterval(waitForClient)
        if (!sb) { setLoading(false); return }

        // Get the existing session on mount
        sb.auth.getSession()
          .then(({ data }) => {
            setSession(data.session)
            setUser(data.session?.user ?? null)
            setLoading(false)
          })
          .catch(err => {
            console.error('[MVT] useAuth getSession error:', err)
            setLoading(false)
          })

        // Subscribe to future auth state changes
        const { data: { subscription } } = sb.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession)
          setUser(newSession?.user ?? null)
        })

        // Store unsubscribe function for cleanup — we can't return from inside
        // a timeout/interval, so we stash it on the cleanup function's closure.
        _cleanup = () => subscription.unsubscribe()
      }
    }, 100)

    let _cleanup = () => clearInterval(waitForClient)
    return () => { _cleanup() }
  }, [])

  return { user, session, loading }
}

/** Sign out the current user */
export async function signOut() {
  const sb = getSupabase()
  if (sb) await sb.auth.signOut()
}

/** Sign in with email and password */
export async function signInWithEmail(email, password) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  return sb.auth.signInWithPassword({ email, password })
}

/** Sign up with email and password */
export async function signUpWithEmail(email, password) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  return sb.auth.signUp({ email, password })
}

/** Sign in with Google OAuth */
export async function signInWithGoogle() {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  return sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })
}
