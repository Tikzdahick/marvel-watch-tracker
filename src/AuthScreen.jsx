import { useState } from 'react'
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from './hooks/useAuth.js'

/**
 * AuthScreen — shown when Supabase is enabled but no user is logged in.
 *
 * Props:
 *   onSkip — called when the user taps "Continue without account"
 *            (disabled auth for this session; app runs in local-only mode)
 */
export default function AuthScreen({ onSkip }) {
  const [mode,     setMode]     = useState('login')   // 'login' | 'signup'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)    // signup confirmation shown

  async function handleEmailSubmit(e) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)
    try {
      if (mode === 'login') {
        const { error: err } = await signInWithEmail(email, password)
        if (err) setError(err.message)
      } else {
        const { error: err } = await signUpWithEmail(email, password)
        if (err) setError(err.message)
        else setDone(true)
      }
    } catch (err) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await signInWithGoogle()
      if (err) setError(err.message)
    } catch (err) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Signup confirmation screen ──
  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-900/30 border border-green-500/30 flex items-center justify-center text-3xl mb-4">
          ✉️
        </div>
        <h2 className="font-bebas text-2xl tracking-widest text-white mb-2">CHECK YOUR EMAIL</h2>
        <p className="text-[#666] text-sm mb-6 max-w-xs leading-relaxed">
          We sent a confirmation link to <span className="text-white">{email}</span>.
          Click it to activate your account, then come back to log in.
        </p>
        <button
          onClick={() => { setDone(false); setMode('login') }}
          className="px-6 py-3 rounded-xl font-bebas tracking-widest text-lg bg-[#E81C2E] text-white"
        >
          BACK TO LOGIN
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-16">
        {/* M logo */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black mb-5 shadow-[0_0_24px_rgba(245,197,24,0.3)]"
          style={{ background: 'linear-gradient(135deg, #F5C518 0%, #d4a017 100%)' }}
        >
          <span className="text-black">M</span>
        </div>

        <h1 className="font-bebas text-3xl tracking-[0.15em] text-white mb-1">
          MARVEL WATCH TRACKER
        </h1>
        <p className="text-[#555] text-sm mb-8 text-center">
          {mode === 'login' ? 'Sign in to sync your progress' : 'Create an account to get started'}
        </p>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full max-w-sm flex items-center justify-center gap-3 py-3.5 rounded-xl border border-[#222] bg-[#111] text-white text-sm font-medium mb-4 hover:border-[#333] transition-colors disabled:opacity-50"
        >
          {/* Google G icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="w-full max-w-sm flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#1e1e1e]"/>
          <span className="text-[#444] text-xs">or</span>
          <div className="flex-1 h-px bg-[#1e1e1e]"/>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailSubmit} className="w-full max-w-sm space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#E81C2E]/50 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#E81C2E]/50 transition-colors"
          />

          {error && (
            <p className="text-[#E81C2E] text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3.5 rounded-xl font-bebas text-xl tracking-widest bg-[#E81C2E] text-white disabled:opacity-40 hover:shadow-[0_0_16px_rgba(232,28,46,0.4)] transition-all"
          >
            {loading ? '…' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="mt-4 text-sm text-[#555]">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(null) }}
            className="text-[#E81C2E] hover:text-[#ff3d4e] font-medium"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>

      {/* Skip */}
      <div className="px-6 pb-10 text-center">
        <button
          onClick={onSkip}
          className="text-[#444] text-xs hover:text-[#666] transition-colors"
        >
          Continue without account (local only)
        </button>
      </div>
    </div>
  )
}
