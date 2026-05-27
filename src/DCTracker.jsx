/**
 * DCTracker — Full DC Universe tracker app.
 * Mirrors Marvel tracker in features and layout; DC blue/gold theme.
 * Self-contained: all state under dc- prefixed localStorage keys.
 */
import { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DC_TITLES } from './data/dcTitles.js'
import { DC_ERAS } from './data/dcEras.js'
import { DC_CHARACTERS } from './data/dcCharacters.js'
import { DC_ACHIEVEMENTS } from './data/dcAchievements.js'
import { DC_TRIVIA_QUESTIONS, getDCDailyTrivia, saveDCTriviaAnswer, getDCTriviaStreak } from './data/dcTrivia.js'
import { DC_MULTIVERSE, DC_VILLAINS, DC_CITIES, DC_BATMAN_ACTORS, SNYDER_COMPARISON, JL_TEAM } from './data/dcExtras.js'
import { getDCRank, getNextDCRank } from './data/dcRanks.js'
import { AvatarDisplay } from './AvatarDisplay.jsx'
import CommunityFeed from './CommunityFeed.jsx'
import { SUPABASE_ENABLED, signOut } from './hooks/useAuth.js'

// ── Constants ─────────────────────────────────────────────────────────────────
const DC_DOOMSDAY  = new Date('2027-07-04T00:00:00')  // Batman: The Brave and the Bold
const SK_WATCHED   = 'dc-watched-v1'
const SK_LIST_SIZE = 'dc-list-size'
const SK_LOGIN     = 'dc-login-dates'
const SK_ACHIEVE   = 'dc-achievements'
const SK_VILLAIN_RATINGS = 'dc-villain-ratings'
const SK_MOOD_RATINGS    = 'dc-mood-ratings'
const SK_BATMAN_SEEN     = 'dc-batman-seen'

const DC_FILTERS       = ['all','unwatched','watched','movies','tv']
const DC_FILTER_LABELS = { all:'All', unwatched:'Unwatched', watched:'Watched', movies:'Movies', tv:'TV' }

const ACCENT   = '#FFD700'
const ACCENT2  = '#1a3a6b'
const BG_MAIN  = '#0a0e1a'
const BG_CARD  = '#0d1829'
const BG_CARD2 = '#081020'
const BORDER   = '#0d1829'
const TEXT_DIM = '#2a4060'
const TEXT_MID = '#6a8aaa'
const TEXT_MAIN = '#c8d8e8'

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadJSON(key, fallback) {
  try { const r = localStorage.getItem(key); if (r) return JSON.parse(r) } catch {}
  return fallback
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}
function pad2(n) { return String(n).padStart(2, '0') }
function todayStr() { return new Date().toISOString().slice(0,10) }

function getTitlesForSize(size) {
  switch (size) {
    case 'rookie':   return DC_TITLES.filter(t => t.tier === 1)
    case 'hero':     return DC_TITLES.filter(t => t.tier <= 2)
    case 'infinity': return DC_TITLES
    default:         return DC_TITLES.filter(t => t.tier <= 2)
  }
}

function calcCountdown(target) {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function calcStreak(dates) {
  if (!dates?.length) return 0
  const sorted = [...new Set(dates)].sort().reverse()
  let streak = 0
  let cur = new Date(); cur.setHours(0,0,0,0)
  for (const d of sorted) {
    const dt = new Date(d); dt.setHours(0,0,0,0)
    const diff = Math.round((cur - dt) / 86400000)
    if (diff <= 1) { streak++; cur = dt } else break
  }
  return streak
}

// ── DC Shield ─────────────────────────────────────────────────────────────────
function DCShield({ size = 32 }) {
  return (
    <div className="flex items-center justify-center font-black text-black flex-shrink-0"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${ACCENT} 0%, #d4a017 100%)`,
        fontSize: size * 0.5,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        boxShadow: `0 0 ${size * 0.5}px rgba(255,215,0,0.4)`,
      }}
    >DC</div>
  )
}

// ── TypeBadge ─────────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const s = {
    movie: 'bg-blue-950 text-blue-300 border-blue-500/25',
    tv:    'bg-amber-950 text-amber-400 border-amber-400/25',
  }
  return (
    <span className={`inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest ${s[type] ?? s.movie}`}>
      {type === 'tv' ? 'TV' : 'FILM'}
    </span>
  )
}

// ── CheckCircle ───────────────────────────────────────────────────────────────
function DCCheck({ watched, comingSoon }) {
  if (comingSoon) return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ border: `2px solid ${ACCENT}33`, background: BG_CARD }}>
      <span className="text-[11px]">⏳</span>
    </div>
  )
  return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
      style={watched
        ? { background: `linear-gradient(135deg, ${ACCENT} 0%, #d4a017 100%)`, boxShadow: `0 0 10px rgba(255,215,0,0.4)` }
        : { border: `2px solid ${ACCENT2}`, background: '#050811' }
      }
    >
      {watched && (
        <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      )}
    </div>
  )
}

// ── DC Title Detail Panel ─────────────────────────────────────────────────────
function DCTitleDetailPanel({ title, isWatched, onToggle, villainRatings, onRateVillain, moodRatings, onSetMood, onClose }) {
  const mv      = DC_MULTIVERSE[title.id]
  const villain = DC_VILLAINS[title.id]
  const cities  = DC_CITIES[title.id] ?? []
  const villainRating = villainRatings[title.id] ?? 0
  const moodRating    = moodRatings[title.id] ?? null
  const isSnyderTitle = title.id === 1014 || title.id === 1019

  return (
    <div className="fixed inset-0 flex flex-col" style={{ zIndex: 10010, background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(12px)' }}>
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b" style={{ background: BG_CARD2, borderColor: BORDER }}>
        <button onClick={onClose} className="flex items-center gap-2 hover:text-white transition-colors py-1 pr-2" style={{ color: TEXT_MID }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
        {!title.comingSoon && (
          <button onClick={() => onToggle(title.id)}
            className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all"
            style={isWatched
              ? { background: 'rgba(255,215,0,0.1)', color: ACCENT, border: `1px solid ${ACCENT}33` }
              : { background: ACCENT, color: '#000' }}>
            {isWatched ? '✓ Watched' : 'Mark Watched'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-5 pb-10 max-w-lg mx-auto w-full">

          {/* Title + universe badges */}
          <div className="mb-5">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <TypeBadge type={title.type}/>
              {mv && (
                <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest"
                  style={{ background: `${mv.color}18`, color: mv.color, borderColor: `${mv.color}44` }}>
                  {mv.universe}
                </span>
              )}
            </div>
            <h2 className="font-bebas text-3xl tracking-widest text-white leading-tight mb-1">{title.title}</h2>
            {mv && <p className="text-[12px] leading-relaxed" style={{ color: TEXT_MID }}>{mv.desc}</p>}
          </div>

          {/* City tags */}
          {cities.length > 0 && (
            <div className="mb-4">
              <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>📍 Setting</div>
              <div className="flex flex-wrap gap-1.5">
                {cities.map(c => (
                  <span key={c} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                    style={{ background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30` }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Villain tracker */}
          {villain && (
            <div className="rounded-2xl p-4 mb-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
              <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>🦹 Main Villain</div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {villain.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm">{villain.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: TEXT_MID }}>Played by {villain.actor}</div>
                  <p className="text-[11px] mt-1.5 leading-snug" style={{ color: TEXT_MAIN }}>{villain.desc}</p>
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest mb-1.5 font-semibold" style={{ color: TEXT_DIM }}>Your Rating</div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button key={star}
                      onClick={() => onRateVillain(title.id, star === villainRating ? 0 : star)}
                      className="text-xl transition-transform active:scale-90 select-none">
                      {star <= villainRating ? '⭐' : '☆'}
                    </button>
                  ))}
                  {villainRating > 0 && (
                    <span className="ml-1 text-[10px]" style={{ color: TEXT_DIM }}>{villainRating}/5</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dark / Light mood slider */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
            <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>🎭 Tone / Mood</div>
            <div className="flex justify-between text-[10px] mb-2" style={{ color: TEXT_MID }}>
              <span>🌑 Dark &amp; Gritty</span>
              <span>☀️ Fun &amp; Hopeful</span>
            </div>
            <input type="range" min={1} max={10}
              value={moodRating ?? 5}
              onChange={e => onSetMood(title.id, Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: ACCENT }}/>
            <div className="text-center mt-1 text-[10px]" style={{ color: TEXT_DIM }}>
              {moodRating === null
                ? 'Drag to rate the tone'
                : moodRating <= 3 ? `Dark & Gritty (${moodRating}/10)`
                : moodRating <= 6 ? `Balanced (${moodRating}/10)`
                : `Fun & Hopeful (${moodRating}/10)`}
            </div>
          </div>

          {/* Snyder Cut comparison */}
          {isSnyderTitle && (
            <div className="rounded-2xl p-4 mb-4" style={{ background: BG_CARD2, border: `1px solid ${ACCENT}22` }}>
              <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>⚔️ Snyder Cut Comparison</div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <div className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: TEXT_DIM }}>Category</div>
                <div className="text-[9px] uppercase tracking-wider font-semibold text-center" style={{ color: '#60a5fa' }}>Theatrical</div>
                <div className="text-[9px] uppercase tracking-wider font-semibold text-center" style={{ color: ACCENT }}>Snyder Cut</div>
              </div>
              {SNYDER_COMPARISON.comparisons.map(row => (
                <div key={row.category} className="grid grid-cols-3 gap-1 py-1.5 border-t text-[10px]" style={{ borderColor: BORDER }}>
                  <div className="font-medium" style={{ color: TEXT_MID }}>{row.category}</div>
                  <div className="text-center leading-tight" style={{ color: '#94a3b8' }}>{row.theatrical}</div>
                  <div className="text-center leading-tight" style={{ color: TEXT_MAIN }}>{row.snyderCut}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Title Card ────────────────────────────────────────────────────────────────
function DCTitleCard({ title, isWatched, isNextUp, onToggle, onOpenDetail }) {
  const cs = !!title.comingSoon
  const mv = DC_MULTIVERSE[title.id]
  return (
    <li
      onClick={() => !cs && (onOpenDetail ? onOpenDetail(title) : onToggle(title.id))}
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 select-none relative overflow-hidden',
        cs        ? 'cursor-default opacity-50'
        : isWatched ? `cursor-pointer active:scale-[0.99] opacity-60 hover:opacity-80`
        : isNextUp  ? 'cursor-pointer active:scale-[0.99]'
        : 'cursor-pointer active:scale-[0.99] hover:bg-[#0d1829]/60',
      ].join(' ')}
      style={{
        borderColor: isNextUp && !isWatched && !cs ? `${ACCENT}50` : BORDER,
        background:  isNextUp && !isWatched && !cs ? `rgba(255,215,0,0.04)` : undefined,
        boxShadow:   isNextUp && !isWatched && !cs ? `0 0 16px rgba(255,215,0,0.08)` : undefined,
      }}
    >
      {isNextUp && !isWatched && !cs && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: ACCENT }}/>
      )}
      <DCCheck watched={isWatched} comingSoon={cs}/>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <TypeBadge type={title.type}/>
          {mv && (
            <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest"
              style={{ background: `${mv.color}18`, color: mv.color, borderColor: `${mv.color}44` }}>
              {mv.universe}
            </span>
          )}
          {isNextUp && !isWatched && !cs && (
            <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest"
              style={{ background: `${ACCENT}1a`, color: ACCENT, borderColor: `${ACCENT}44` }}>
              ▶ NEXT UP
            </span>
          )}
          {cs && (
            <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest"
              style={{ background: `${ACCENT}0d`, color: ACCENT, borderColor: `${ACCENT}33` }}>
              COMING SOON
            </span>
          )}
        </div>
        <p className={`text-sm leading-snug font-medium transition-all ${
          isWatched ? 'line-through text-[#2a4060]'
          : cs      ? 'text-[#2a4060]'
          : isNextUp ? 'text-white font-semibold'
          : 'text-[#c8d8e8]'
        }`}>{title.title}</p>
      </div>
      {!cs && (
        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      )}
    </li>
  )
}

// ── Era Header ────────────────────────────────────────────────────────────────
function DCEraHeader({ era, watchedCount, totalCount, onMarkAll, collapsed, onToggleCollapse }) {
  const [confirm, setConfirm] = useState(false)
  const allWatched = watchedCount >= totalCount && totalCount > 0
  const pct = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0
  return (
    <div className="flex items-center gap-2 px-1 pt-5 pb-2 select-none">
      <button onClick={onToggleCollapse} className="flex items-center gap-2 flex-1 min-w-0 group">
        <span className="text-base flex-shrink-0">{era.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bebas text-[13px] tracking-widest ${era.color}`}>{era.label}</span>
            <span className="text-[9px] uppercase tracking-wider hidden sm:inline" style={{ color: TEXT_DIM }}>{era.sub}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 h-0.5 rounded-full overflow-hidden max-w-[80px]" style={{ background: BORDER }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: allWatched ? '#22c55e' : ACCENT }}/>
            </div>
            <span className="text-[9px] tabular-nums" style={{ color: TEXT_DIM }}>
              {watchedCount}/{totalCount}{allWatched && ' ✓'}
            </span>
          </div>
        </div>
        <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-90'}`}
          style={{ color: TEXT_DIM }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      {!allWatched && !collapsed && (
        confirm ? (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setConfirm(false)} className="text-[10px] hover:text-white px-2 py-1 transition-colors" style={{ color: TEXT_DIM }}>Cancel</button>
            <button onClick={() => { onMarkAll(); setConfirm(false) }}
              className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${era.border} ${era.color} ${era.bg} hover:opacity-80 transition-opacity`}>
              ✓ Confirm
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)}
            className="flex-shrink-0 text-[10px] hover:text-white border rounded-lg px-2 py-1 transition-colors"
            style={{ color: TEXT_DIM, borderColor: ACCENT2 }}>
            ✓ All
          </button>
        )
      )}
    </div>
  )
}

// ── Countdown ticker ──────────────────────────────────────────────────────────
function DCCountdown() {
  const [cd, setCd] = useState(() => calcCountdown(DC_DOOMSDAY))
  useEffect(() => {
    const id = setInterval(() => setCd(calcCountdown(DC_DOOMSDAY)), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="font-mono text-xs font-semibold" style={{ color: ACCENT }}>
      {cd.days}d {pad2(cd.hours)}h {pad2(cd.minutes)}m {pad2(cd.seconds)}s
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── HOME PAGE ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function getDCMessage(pct, daysLeft) {
  if (pct >= 100) return { msg: "World's Finest. The DC Universe bows to you.", color: ACCENT }
  if (pct >= 90)  return { msg: "You're nearly there. One final push before Batman arrives.", color: ACCENT }
  if (pct >= 75)  return { msg: 'Outstanding. The Justice League approves.', color: '#4ade80' }
  if (pct >= 50)  return { msg: 'The Multiverse is half-explored. Keep going.', color: '#60a5fa' }
  if (pct >= 25)  return { msg: 'Your DC journey has begun. Many battles ahead.', color: ACCENT }
  if (daysLeft < 90) return { msg: '⚠️ Batman arrives soon. The universe needs you.', color: '#ef4444' }
  return { msg: 'Every hero starts somewhere. Begin your DC saga.', color: TEXT_MID }
}

function DCHomePage({ profile, watched, listTitles, loginDates, onNavigate, onOpenTrivia, nextUpId }) {
  const countable    = listTitles.filter(t => !t.comingSoon)
  const watchedCount = countable.filter(t => watched.has(t.id)).length
  const total        = countable.length
  const pct          = total > 0 ? Math.round((watchedCount / total) * 100) : 0
  const remaining    = total - watchedCount
  const streak       = calcStreak(loginDates)
  const firstName    = (profile?.name ?? 'Hero').split(' ')[0]
  const cd           = calcCountdown(DC_DOOMSDAY)
  const { msg, color: msgColor } = getDCMessage(pct, cd.days)
  const nextUp = nextUpId ? listTitles.find(t => t.id === nextUpId) : null

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: BG_MAIN }}>
      {/* Hero banner */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #050d1a 0%, #080f1e 45%, #0a0e1a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 90% 70% at 50% -10%, rgba(255,215,0,0.1) 0%, transparent 65%)` }}/>
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: `linear-gradient(rgba(255,215,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}/>

        <div className="max-w-lg mx-auto px-5 pt-14 pb-8 relative">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-7">
            <DCShield size={32}/>
            <div>
              <div className="font-bebas text-[10px] tracking-[0.35em] leading-none mb-0.5" style={{ color: ACCENT }}>DC UNIVERSE</div>
              <div className="font-bebas text-[20px] tracking-[0.15em] text-white leading-none">WATCH TRACKER</div>
            </div>
          </div>

          {/* Avatar + welcome */}
          <div className="flex items-center gap-4 mb-7">
            <AvatarDisplay avatar={profile?.avatar} name={profile?.name} size="home"/>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: TEXT_DIM }}>Welcome back</div>
              <div className="font-bebas text-[32px] text-white tracking-wide leading-none truncate">{firstName}</div>
              {streak > 1 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-sm">🔥</span>
                  <span className="font-semibold text-[12px]" style={{ color: ACCENT }}>{streak}-day streak</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[
              { label: 'Watched',   value: watchedCount, color: ACCENT },
              { label: 'Remaining', value: remaining,    color: '#fff' },
              { label: 'Complete',  value: `${pct}%`,   color: ACCENT },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl p-4 flex flex-col items-center text-center" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
                <span className="font-bebas text-3xl leading-none mb-1" style={{ color }}>{value}</span>
                <span className="text-[9px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: BORDER }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${ACCENT2} 0%, ${ACCENT} 100%)` }}/>
          </div>
          <div className="flex justify-between">
            <span className="text-[9px]" style={{ color: TEXT_DIM }}>0</span>
            <span className="text-[9px] font-mono" style={{ color: TEXT_MID }}>{watchedCount} / {total} titles</span>
            <span className="text-[9px]" style={{ color: TEXT_DIM }}>{total}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-lg mx-auto px-5 w-full space-y-4 mt-5">

        {/* Motivational */}
        <div className="rounded-2xl px-5 py-4" style={{ background: BG_CARD2, border: `1px solid ${msgColor}22` }}>
          <p className="text-[13px] leading-relaxed font-medium italic" style={{ color: msgColor }}>"{msg}"</p>
        </div>

        {/* Batman countdown */}
        <div className="rounded-2xl px-5 py-4" style={{ background: BG_CARD2, border: `1px solid ${ACCENT}1a` }}>
          <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>Batman: The Brave and the Bold</div>
          <div className="flex items-center gap-2">
            <DCCountdown/>
            <span className="text-[9px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>until Batman arrives</span>
          </div>
        </div>

        {/* Next up */}
        {nextUp && (
          <div>
            <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>▶ Up Next</div>
            <button onClick={() => onNavigate('tracker')}
              className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
              style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(255,215,0,0.1)`, border: `1px solid rgba(255,215,0,0.2)` }}>
                  <svg className="w-5 h-5" style={{ color: ACCENT }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: ACCENT }}>UP NEXT</div>
                  <div className="text-sm text-white font-semibold truncate">{nextUp.title}</div>
                  <div className="text-[10px] mt-0.5 capitalize" style={{ color: TEXT_MID }}>{nextUp.type}</div>
                </div>
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: TEXT_DIM }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Lantern Corps rank */}
        {(() => {
          const rank = getDCRank(watchedCount)
          const next = getNextDCRank(watchedCount)
          return (
            <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${rank.color}33` }}>
              <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>Your Lantern Rank</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{rank.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bebas text-lg tracking-widest leading-none" style={{ color: rank.color }}>{rank.label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: TEXT_MID }}>{rank.corps} · {rank.emotion}</div>
                  <p className="text-[10px] mt-1 italic leading-snug" style={{ color: TEXT_DIM }}>"{rank.oath.slice(0, 55)}…"</p>
                </div>
              </div>
              {next && (
                <div className="mt-2 text-[10px]" style={{ color: TEXT_DIM }}>
                  Next: {next.icon} {next.label} at {next.minWatched} watched · {next.minWatched - watchedCount} to go
                </div>
              )}
            </div>
          )
        })()}

        {/* Quick actions */}
        <div>
          <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>Quick Actions</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '⚡', label: 'Trivia', sub: 'Daily DC quiz', onClick: onOpenTrivia },
              { icon: '🦸', label: 'Heroes', sub: 'DC characters', onClick: () => onNavigate('heroes') },
              { icon: '📊', label: 'Stats',  sub: 'Your progress', onClick: () => onNavigate('stats') },
            ].map(({ icon, label, sub, onClick }) => (
              <button key={label} onClick={onClick}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl transition-all active:scale-[0.97]"
                style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}28` }}>
                  {icon}
                </div>
                <div>
                  <div className="text-white text-[12px] font-semibold leading-tight">{label}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: TEXT_DIM }}>{sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── STATS PAGE ────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function DCStatsPage({ watched, listTitles, villainRatings }) {
  const countable    = listTitles.filter(t => !t.comingSoon)
  const watchedCount = countable.filter(t => watched.has(t.id)).length
  const total        = countable.length
  const pct          = total > 0 ? Math.round((watchedCount / total) * 100) : 0

  // ID → era key
  const eraForId = useMemo(() => {
    const m = {}
    DC_ERAS.forEach(era => era.ids.forEach(id => { m[id] = era.key }))
    return m
  }, [])

  // Movies vs TV
  const movies = countable.filter(t => t.type === 'movie')
  const tv     = countable.filter(t => t.type === 'tv')
  const moviesW = movies.filter(t => watched.has(t.id)).length
  const tvW     = tv.filter(t => watched.has(t.id)).length

  const eraStats = DC_ERAS.map(era => {
    const titles = listTitles.filter(t => eraForId[t.id] === era.key && !t.comingSoon)
    const watchedHere = titles.filter(t => watched.has(t.id)).length
    return { ...era, totalHere: titles.length, watchedHere }
  }).filter(e => e.totalHere > 0)

  function EraBar({ e }) {
    const p = e.totalHere > 0 ? Math.round((e.watchedHere / e.totalHere) * 100) : 0
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-2">
            <span>{e.emoji}</span>
            <span className="text-[11px] uppercase tracking-widest" style={{ color: TEXT_MID }}>{e.label}</span>
          </div>
          <span className="text-[11px] font-mono" style={{ color: ACCENT }}>{e.watchedHere}/{e.totalHere} · {p}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${p}%`, background: p === 100 ? '#22c55e' : ACCENT }}/>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <div className="font-bebas text-2xl tracking-[0.15em] text-white mb-5">DC STATS</div>

      {/* Overall */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
        <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>Overall Progress</div>
        <div className="flex items-end gap-4 mb-4">
          <div>
            <span className="font-bebas text-6xl leading-none" style={{ color: ACCENT }}>{pct}%</span>
          </div>
          <div className="pb-1" style={{ color: TEXT_MID }}>
            <div className="text-sm">{watchedCount} of {total} titles</div>
            <div className="text-[10px]">{total - watchedCount} remaining</div>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: BORDER }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${ACCENT2} 0%, ${ACCENT} 100%)` }}/>
        </div>
      </div>

      {/* Type breakdown */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
        <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>By Type</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Movies', w: moviesW, t: movies.length },
            { label: 'TV',     w: tvW,     t: tv.length     },
          ].map(({ label, w, t }) => {
            const p = t > 0 ? Math.round((w / t) * 100) : 0
            return (
              <div key={label} className="rounded-xl p-3" style={{ background: BG_MAIN, border: `1px solid ${BORDER}` }}>
                <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: TEXT_DIM }}>{label}</div>
                <div className="font-bebas text-2xl leading-none mb-1" style={{ color: ACCENT }}>{w}/{t}</div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: BORDER }}>
                  <div className="h-full rounded-full" style={{ width: `${p}%`, background: ACCENT }}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Era breakdown */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
        <div className="text-[9px] uppercase tracking-widest mb-4 font-semibold" style={{ color: TEXT_DIM }}>By Era</div>
        {eraStats.map(e => <EraBar key={e.key} e={e}/>)}
      </div>

      {/* Villain leaderboard */}
      {(() => {
        const rated = Object.entries(villainRatings ?? {})
          .filter(([, r]) => r > 0)
          .map(([id, rating]) => ({ id: Number(id), rating, villain: DC_VILLAINS[Number(id)] }))
          .filter(v => v.villain)
          .sort((a, b) => b.rating - a.rating)
        if (!rated.length) return (
          <div className="rounded-2xl p-5" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
            <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>🦹 Villain Leaderboard</div>
            <p className="text-[11px]" style={{ color: TEXT_DIM }}>Rate villains on title pages to build your leaderboard.</p>
          </div>
        )
        return (
          <div className="rounded-2xl p-5" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
            <div className="text-[9px] uppercase tracking-widest mb-4 font-semibold" style={{ color: TEXT_DIM }}>🦹 Villain Leaderboard</div>
            {rated.map(({ id, rating, villain }, i) => (
              <div key={id} className="flex items-center gap-3 py-2 border-t first:border-t-0" style={{ borderColor: BORDER }}>
                <div className="text-base font-bold w-5 text-center flex-shrink-0" style={{ color: i === 0 ? ACCENT : TEXT_DIM }}>
                  {i === 0 ? '👑' : i + 1}
                </div>
                <div className="text-xl flex-shrink-0">{villain.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-white truncate">{villain.name}</div>
                  <div className="text-[9px]" style={{ color: TEXT_MID }}>{villain.actor}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[11px]">{'⭐'.repeat(rating)}</div>
                  <div className="text-[9px] font-bold" style={{ color: ACCENT }}>{rating}/5</div>
                </div>
              </div>
            ))}
          </div>
        )
      })()}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AWARDS PAGE ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function DCAwardsPage({ watched, listTitles }) {
  const states = useMemo(() => {
    const result = {}
    for (const a of DC_ACHIEVEMENTS) {
      result[a.id] = { unlocked: a.check(watched) }
    }
    return result
  }, [watched])

  const unlockedCount = Object.values(states).filter(s => s.unlocked).length

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="font-bebas text-2xl tracking-[0.15em] text-white">DC AWARDS</div>
        <div className="text-[11px] font-semibold" style={{ color: ACCENT }}>
          {unlockedCount}/{DC_ACHIEVEMENTS.length} unlocked
        </div>
      </div>

      {/* Justice League team tracker */}
      <div className="mb-6">
        <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>⚡ Justice League Team Tracker</div>
        <div className="rounded-2xl p-4 mb-3" style={{ background: BG_CARD2, border: `1px solid ${ACCENT}22` }}>
          <div className="text-[10px] font-semibold mb-2" style={{ color: TEXT_MID }}>Team Films</div>
          {JL_TEAM.teamMovies.map(id => {
            const t = (listTitles ?? []).find(lt => lt.id === id)
            if (!t) return null
            const w = watched.has(id)
            return (
              <div key={id} className="flex items-center gap-2.5 py-1.5">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={w ? { background: ACCENT, boxShadow: `0 0 6px rgba(255,215,0,0.4)` } : { border: `1.5px solid ${ACCENT2}`, background: '#050811' }}>
                  {w && (
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
                <span className="text-[12px]" style={{ color: w ? ACCENT : TEXT_MID }}>{t.title}</span>
              </div>
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {JL_TEAM.members.map(m => {
            const memberTitles = m.titleIds.filter(id => (listTitles ?? []).some(t => t.id === id && !t.comingSoon))
            const watchedHere = memberTitles.filter(id => watched.has(id)).length
            const allDone = memberTitles.length > 0 && watchedHere === memberTitles.length
            return (
              <div key={m.key} className="flex items-center gap-2 p-2.5 rounded-xl border"
                style={{ background: allDone ? `${ACCENT}08` : BG_MAIN, borderColor: allDone ? `${ACCENT}44` : BORDER }}>
                <span className="text-xl">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold truncate" style={{ color: allDone ? ACCENT : TEXT_MAIN }}>{m.name}</div>
                  <div className="text-[9px]" style={{ color: TEXT_DIM }}>
                    {memberTitles.length > 0 ? `${watchedHere}/${memberTitles.length}` : 'No films yet'}
                  </div>
                </div>
                {allDone && <span className="text-xs flex-shrink-0" style={{ color: ACCENT }}>✓</span>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        {DC_ACHIEVEMENTS.map(a => {
          const unlocked = states[a.id]?.unlocked
          return (
            <div key={a.id} className={[
              'flex items-center gap-3 p-3 rounded-xl border transition-all',
              unlocked
                ? 'border-[#FFD700]/25'
                : 'border-[#0d1829]',
            ].join(' ')}
              style={{ background: unlocked ? `rgba(255,215,0,0.05)` : BG_CARD2 }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0`}
                style={{ background: unlocked ? `${ACCENT}22` : '#151a25' }}>
                {unlocked ? a.icon : <span style={{ opacity: 0.25 }}>{a.icon}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold leading-tight" style={{ color: unlocked ? ACCENT : '#2a4060' }}>
                  {a.name}
                </div>
                <div className="text-[11px] leading-snug mt-0.5" style={{ color: unlocked ? TEXT_MID : '#1a2a3a' }}>
                  {a.desc}
                </div>
              </div>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center`}
                style={unlocked
                  ? { background: ACCENT, boxShadow: `0 0 8px rgba(255,215,0,0.4)` }
                  : { background: '#151a25', border: '1px solid #1a2a3a' }
                }>
                {unlocked ? (
                  <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                ) : (
                  <svg className="w-3 h-3" style={{ color: '#1a2a3a' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── HEROES PAGE ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function DCHeroesPage({ watched, batmanSeen, onToggleBatmanSeen }) {
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim()
    return DC_CHARACTERS.filter(c => !q || c.name.toLowerCase().includes(q) || c.realName.toLowerCase().includes(q))
  }, [search])

  const ROLE_COLORS = { Hero: '#60a5fa', Villain: '#f87171', 'Anti-Hero': ACCENT, Antagonist: '#f97316' }

  if (selected) {
    const c = selected
    const relevantTitles = DC_TITLES.filter(t => c.titleIds.includes(t.id) && !t.comingSoon)
    const watchedHere = relevantTitles.filter(t => watched.has(t.id)).length
    return (
      <div className="fixed inset-0 flex flex-col" style={{ zIndex: 10010, background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(12px)' }}>
        {/* Top bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b" style={{ background: BG_CARD2, borderColor: BORDER }}>
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 hover:text-white transition-colors py-1 pr-2" style={{ color: TEXT_MID }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            <span className="text-sm font-medium">Heroes</span>
          </button>
        </div>
        {/* Character detail */}
        <div className="flex-1 overflow-y-auto">
          {/* Banner */}
          <div className="w-full h-48 flex items-center justify-center relative overflow-hidden" style={{ background: c.bg }}>
            <span className="text-8xl" style={{ filter: `drop-shadow(0 0 24px ${c.color}80)` }}>{c.emoji}</span>
            <div className="absolute bottom-0 inset-x-0 h-12" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}/>
          </div>
          <div className="px-5 pt-5 pb-10 max-w-lg mx-auto">
            <div className="inline-block text-[9px] px-2 py-1 rounded-full font-bold tracking-widest mb-2"
              style={{ background: `${ROLE_COLORS[c.role] ?? '#60a5fa'}22`, color: ROLE_COLORS[c.role] ?? '#60a5fa', border: `1px solid ${ROLE_COLORS[c.role] ?? '#60a5fa'}33` }}>
              {c.role}
            </div>
            <h2 className="font-bebas text-4xl tracking-widest text-white leading-none mb-0.5">{c.name}</h2>
            <div className="text-sm mb-5" style={{ color: TEXT_MID }}>{c.realName}</div>
            <p className="text-[13px] leading-relaxed mb-6" style={{ color: TEXT_MAIN }}>{c.desc}</p>
            {relevantTitles.length > 0 && (
              <div>
                <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>
                  Appearances — {watchedHere}/{relevantTitles.length} watched
                </div>
                <div className="space-y-1.5">
                  {relevantTitles.map(t => (
                    <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                      style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
                      <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={watched.has(t.id)
                          ? { background: ACCENT, boxShadow: `0 0 6px rgba(255,215,0,0.4)` }
                          : { border: `1.5px solid ${ACCENT2}`, background: '#050811' }
                        }>
                        {watched.has(t.id) && (
                          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-[12px] font-medium ${watched.has(t.id) ? 'line-through text-[#2a4060]' : 'text-[#c8d8e8]'}`}>{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 pt-4 max-w-lg mx-auto px-4">
      <div className="font-bebas text-2xl tracking-[0.15em] text-white mb-4">DC HEROES & VILLAINS</div>

      {/* Batman Counter */}
      <div className="mb-5">
        <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>
          🦇 Batman Counter — {(batmanSeen?.size ?? 0)}/{DC_BATMAN_ACTORS.length} actors seen
        </div>
        <div className="space-y-2">
          {DC_BATMAN_ACTORS.map(actor => {
            const seen = batmanSeen?.has(actor.key) ?? false
            return (
              <button key={actor.key} onClick={() => onToggleBatmanSeen?.(actor.key)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all active:scale-[0.98]"
                style={{ background: seen ? `${actor.color}10` : BG_CARD2, borderColor: seen ? `${actor.color}44` : BORDER }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: seen ? `${actor.color}22` : '#151a25' }}>
                  {actor.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[13px] text-white">{actor.actor}</span>
                    <span className="text-[9px] px-1.5 py-[2px] rounded font-bold" style={{ color: actor.color, background: `${actor.color}18` }}>{actor.era}</span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: TEXT_DIM }}>{actor.note}</div>
                </div>
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={seen
                    ? { background: actor.color, boxShadow: `0 0 8px ${actor.color}60` }
                    : { border: `1.5px solid ${BORDER}`, background: '#050811' }}>
                  {seen && (
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TEXT_DIM }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
        </svg>
        <input type="search" placeholder="Search characters…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
          style={{ background: BG_CARD2, border: `1px solid ${ACCENT2}44`, color: TEXT_MAIN }}/>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {visible.map(c => {
          const relevantTitles = DC_TITLES.filter(t => c.titleIds.includes(t.id) && !t.comingSoon)
          const watchedHere = relevantTitles.filter(t => watched.has(t.id)).length
          return (
            <button key={c.key} onClick={() => setSelected(c)}
              className="relative rounded-2xl overflow-hidden flex flex-col items-center text-center active:scale-95 transition-all"
              style={{ background: BG_CARD2, border: `1px solid ${BORDER}`, boxShadow: `0 2px 12px ${c.color}10` }}>
              {/* Banner */}
              <div className="w-full h-28 flex items-center justify-center relative" style={{ background: c.bg }}>
                <span className="text-5xl" style={{ filter: `drop-shadow(0 0 12px ${c.color}80)` }}>{c.emoji}</span>
                <div className="absolute bottom-0 inset-x-0 h-0.5" style={{ background: c.color + '80' }}/>
              </div>
              {/* Info */}
              <div className="w-full px-2.5 py-2.5 text-left">
                <div className="font-bebas text-[13px] tracking-widest leading-tight truncate" style={{ color: c.color }}>
                  {c.name}
                </div>
                <div className="text-[9px] truncate mt-0.5" style={{ color: TEXT_DIM }}>{c.realName}</div>
                {relevantTitles.length > 0 && (
                  <div className="text-[9px] font-semibold mt-1" style={{ color: watchedHere > 0 ? ACCENT : '#1a3a6b' }}>
                    {watchedHere}/{relevantTitles.length} watched
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── TRIVIA MODAL ──────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function DCTriviaModal({ onClose }) {
  const { question, answeredToday } = getDCDailyTrivia()
  const streak = getDCTriviaStreak()
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(answeredToday)

  function handleAnswer(idx) {
    if (result) return
    setSelected(idx)
    const correct = idx === question.answer
    const r = saveDCTriviaAnswer(correct)
    setResult(r)
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-3xl border p-6"
        style={{ background: '#080f1e', borderColor: `${ACCENT}33` }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-bebas text-xl tracking-widest text-white">DC TRIVIA</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>Daily Question</div>
          </div>
          <div className="flex items-center gap-3">
            {streak.current > 0 && (
              <div className="text-right">
                <div className="text-[10px]" style={{ color: TEXT_DIM }}>Streak</div>
                <div className="font-bebas text-lg leading-none" style={{ color: ACCENT }}>{streak.current}🔥</div>
              </div>
            )}
            <button onClick={onClose} style={{ color: TEXT_DIM }} className="hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="text-[13px] text-white font-semibold leading-snug mb-4">{question.q}</div>

        <div className="space-y-2 mb-4">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.answer
            const isSelected = i === selected
            let borderColor = `${ACCENT2}55`
            let bgColor = BG_CARD
            let textColor = TEXT_MAIN
            if (result) {
              if (isCorrect)  { borderColor = '#22c55e'; bgColor = 'rgba(34,197,94,0.1)'; textColor = '#22c55e' }
              else if (isSelected && !isCorrect) { borderColor = '#ef4444'; bgColor = 'rgba(239,68,68,0.1)'; textColor = '#ef4444' }
            } else if (isSelected) {
              borderColor = ACCENT; bgColor = `${ACCENT}15`; textColor = ACCENT
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={!!result}
                className="w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium"
                style={{ borderColor, background: bgColor, color: textColor }}>
                {opt}
              </button>
            )
          })}
        </div>

        {result && (
          <div className="mt-4 p-3 rounded-xl" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-[11px] font-bold mb-1" style={{ color: result.correct ? '#22c55e' : '#ef4444' }}>
              {result.correct ? '✓ Correct!' : '✗ Not quite.'}
            </div>
            <p className="text-[11px] leading-snug" style={{ color: TEXT_MID }}>{question.fact}</p>
          </div>
        )}

        {result && (
          <button onClick={onClose} className="w-full mt-4 py-3 rounded-xl font-bebas text-lg tracking-widest transition-all"
            style={{ background: ACCENT, color: '#000' }}>
            CLOSE
          </button>
        )}
      </div>
    </div>,
    document.body
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function DCProfilePage({ profile, watched, listTitles, onBack, onSignOut, onDeleteAccount }) {
  const [confirmSignOut, setConfirmSignOut]   = useState(false)
  const [confirmDelete,  setConfirmDelete]    = useState(false)
  const [deleteEmail,    setDeleteEmail]      = useState('')
  const [deleting,       setDeleting]         = useState(false)
  const [signingOut,     setSigningOut]       = useState(false)

  const countable    = listTitles.filter(t => !t.comingSoon)
  const watchedCount = countable.filter(t => watched.has(t.id)).length
  const total        = countable.length
  const pct          = total > 0 ? Math.round((watchedCount / total) * 100) : 0

  const unlockedAwards = DC_ACHIEVEMENTS.filter(a => a.check(watched)).length

  async function doSignOut() {
    setSigningOut(true)
    try { await signOut() } catch {}
    if (onSignOut) onSignOut()
    else onBack()
  }

  async function doDelete() {
    if (!profile || deleteEmail.trim().toLowerCase() !== (profile.email ?? profile.name ?? '').toLowerCase()) {
      alert('Entry does not match.'); return
    }
    setDeleting(true)
    if (onDeleteAccount) await onDeleteAccount(deleteEmail)
  }

  return (
    <div className="min-h-screen pb-24 pt-4 max-w-lg mx-auto px-4" style={{ background: BG_MAIN }}>
      <div className="font-bebas text-2xl tracking-[0.15em] text-white mb-5">PROFILE</div>

      {/* Avatar card */}
      <div className="rounded-2xl p-5 mb-4 flex items-center gap-4"
        style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
        <AvatarDisplay avatar={profile?.avatar} name={profile?.name} size="lg"/>
        <div>
          <div className="font-bebas text-2xl tracking-widest text-white leading-none">{profile?.name ?? 'Hero'}</div>
          <div className="text-[11px] mt-0.5" style={{ color: TEXT_MID }}>DC Universe Tracker</div>
        </div>
      </div>

      {/* DC Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Watched',  value: watchedCount, color: ACCENT },
          { label: 'Complete', value: `${pct}%`,    color: ACCENT },
          { label: 'Awards',   value: `${unlockedAwards}/${DC_ACHIEVEMENTS.length}`, color: ACCENT },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl px-3 py-3 flex flex-col gap-0.5"
            style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
            <span className="font-bebas text-2xl leading-none tracking-wider" style={{ color }}>{value}</span>
            <span className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: TEXT_DIM }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Lantern Corps rank */}
      {(() => {
        const rank = getDCRank(watchedCount)
        const next = getNextDCRank(watchedCount)
        return (
          <div className="rounded-2xl p-4 mb-4" style={{ background: BG_CARD2, border: `1px solid ${rank.color}33` }}>
            <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>Your Lantern Rank</div>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{rank.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bebas text-xl tracking-widest leading-none" style={{ color: rank.color }}>{rank.label}</div>
                <div className="text-[10px] mt-0.5" style={{ color: TEXT_MID }}>{rank.corps} · {rank.emotion}</div>
                <p className="text-[10px] mt-1 italic leading-snug" style={{ color: TEXT_DIM }}>"{rank.desc}"</p>
              </div>
            </div>
            {next && (
              <div className="mt-2 text-[10px]" style={{ color: TEXT_DIM }}>
                Next: {next.icon} {next.label} at {next.minWatched} watched · {next.minWatched - watchedCount} to go
              </div>
            )}
          </div>
        )
      })()}

      {/* Back to Marvel */}
      <button onClick={onBack}
        className="w-full py-3 rounded-xl font-bebas text-lg tracking-widest mb-4 transition-all hover:opacity-80"
        style={{ background: '#E81C2E', color: 'white' }}>
        ⚡ BACK TO MARVEL
      </button>

      {/* Sign out */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
        <div className="text-[10px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>Account</div>
        <button onClick={() => setConfirmSignOut(true)}
          className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
          style={{ background: 'rgba(255,215,0,0.08)', color: ACCENT, border: `1px solid ${ACCENT}33` }}>
          Sign Out
        </button>
      </div>

      {/* Delete account */}
      <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="text-[10px] uppercase tracking-widest mb-1 font-semibold text-red-400">Danger Zone</div>
        <p className="text-[11px] mb-3" style={{ color: TEXT_MID }}>Permanently delete your account and all data.</p>
        <button onClick={() => setConfirmDelete(true)}
          className="w-full py-2.5 rounded-xl font-semibold text-sm text-red-400 transition-all hover:opacity-80"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          Delete Account
        </button>
      </div>

      {/* Sign out modal */}
      {confirmSignOut && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
          onClick={() => !signingOut && setConfirmSignOut(false)}>
          <div className="w-full max-w-xs rounded-3xl border p-6 text-center"
            style={{ background: '#080f1e', borderColor: `${ACCENT}33` }}
            onClick={e => e.stopPropagation()}>
            <div className="text-3xl mb-3">👋</div>
            <h2 className="font-bebas text-xl tracking-widest text-white mb-2">Sign Out?</h2>
            <p className="text-[12px] mb-5" style={{ color: TEXT_MID }}>
              {SUPABASE_ENABLED ? 'Your progress is saved. You can sign back in any time.' : 'This will close your DC session.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmSignOut(false)} disabled={signingOut}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: BG_CARD, color: TEXT_MID, border: `1px solid ${BORDER}` }}>
                Cancel
              </button>
              <button onClick={doSignOut} disabled={signingOut}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: ACCENT, color: '#000' }}>
                {signingOut ? '…' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete modal */}
      {confirmDelete && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)' }}
          onClick={() => !deleting && setConfirmDelete(false)}>
          <div className="w-full max-w-xs rounded-3xl border border-red-500/25 p-6"
            style={{ background: '#0d0505' }}
            onClick={e => e.stopPropagation()}>
            <div className="text-3xl mb-3">⚠️</div>
            <h2 className="font-bebas text-xl tracking-widest text-white mb-2">Delete Account?</h2>
            <p className="text-[12px] text-red-400 mb-4">This cannot be undone. All data will be lost.</p>
            <label className="text-[11px] mb-1 block" style={{ color: TEXT_DIM }}>
              Type your name to confirm: <strong className="text-white">{profile?.name}</strong>
            </label>
            <input value={deleteEmail} onChange={e => setDeleteEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm text-white mb-4 focus:outline-none"
              style={{ background: '#1a0808', border: '1px solid rgba(239,68,68,0.3)' }}
              placeholder={profile?.name ?? 'your name'}/>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: BG_CARD, color: TEXT_MID, border: `1px solid ${BORDER}` }}>
                Cancel
              </button>
              <button onClick={doDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors">
                {deleting ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SOCIAL PAGE ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function DCSocialPage({ user, friendIds }) {
  return (
    <div className="min-h-screen pb-24" style={{ background: BG_MAIN }}>
      <CommunityFeed user={user} friendIds={friendIds}/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── MAIN DC TRACKER ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export default function DCTracker({ onBack, dcListSize = 'hero', profile, user, onSignOut, onDeleteAccount }) {
  const [watched,        setWatched]       = useState(() => new Set(loadJSON(SK_WATCHED, [])))
  const [listSize,       setListSize]      = useState(() => loadJSON(SK_LIST_SIZE, null) ?? dcListSize)
  const [filter,         setFilter]        = useState('all')
  const [search,         setSearch]        = useState('')
  const [collapsedEras,  setCollapsedEras] = useState(() => new Set())
  const [activeTab,      setActiveTab]     = useState('home')
  const [showTrivia,     setShowTrivia]    = useState(false)
  const [selectedTitle,  setSelectedTitle] = useState(null)
  const [villainRatings, setVillainRatings] = useState(() => loadJSON(SK_VILLAIN_RATINGS, {}))
  const [moodRatings,    setMoodRatings]   = useState(() => loadJSON(SK_MOOD_RATINGS, {}))
  const [batmanSeen,     setBatmanSeen]    = useState(() => new Set(loadJSON(SK_BATMAN_SEEN, [])))

  // Track DC login dates for streak
  const [loginDates] = useState(() => {
    const today = todayStr()
    const saved = loadJSON(SK_LOGIN, [])
    if (!saved.includes(today)) {
      const next = [...new Set([...saved, today])]
      saveJSON(SK_LOGIN, next)
      return next
    }
    return saved
  })

  function toggleWatched(id) {
    setWatched(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      saveJSON(SK_WATCHED, [...next])
      return next
    })
  }

  function changeListSize(size) {
    setListSize(size)
    saveJSON(SK_LIST_SIZE, size)
  }

  function rateVillain(titleId, rating) {
    setVillainRatings(prev => {
      const next = { ...prev, [titleId]: rating }
      saveJSON(SK_VILLAIN_RATINGS, next)
      return next
    })
  }

  function setMoodRating(titleId, rating) {
    setMoodRatings(prev => {
      const next = { ...prev, [titleId]: rating }
      saveJSON(SK_MOOD_RATINGS, next)
      return next
    })
  }

  function toggleBatmanSeen(key) {
    setBatmanSeen(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      saveJSON(SK_BATMAN_SEEN, [...next])
      return next
    })
  }

  const listTitles = useMemo(() => getTitlesForSize(listSize), [listSize])

  const eraForId = useMemo(() => {
    const m = {}
    DC_ERAS.forEach(era => era.ids.forEach(id => { m[id] = era.key }))
    return m
  }, [])

  const countable    = useMemo(() => listTitles.filter(t => !t.comingSoon), [listTitles])
  const watchedCount = useMemo(() => countable.filter(t => watched.has(t.id)).length, [countable, watched])
  const total        = countable.length
  const remaining    = total - watchedCount
  const pct          = total > 0 ? Math.round((watchedCount / total) * 100) : 0

  const nextUpId = useMemo(() => {
    for (const era of DC_ERAS) {
      for (const id of era.ids) {
        const t = listTitles.find(lt => lt.id === id)
        if (t && !t.comingSoon && !watched.has(id)) return id
      }
    }
    return null
  }, [watched, listTitles])

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim()
    return listTitles.filter(t => {
      if (q && !t.title.toLowerCase().includes(q)) return false
      switch (filter) {
        case 'watched':   return watched.has(t.id)
        case 'unwatched': return !watched.has(t.id)
        case 'movies':    return t.type === 'movie'
        case 'tv':        return t.type === 'tv'
        default:          return true
      }
    })
  }, [filter, search, listTitles, watched])

  const groupedByEra = useMemo(() =>
    DC_ERAS.map(era => ({
      era,
      titles: visible.filter(t => eraForId[t.id] === era.key),
    })).filter(g => g.titles.length > 0),
    [visible, eraForId]
  )

  function markEraWatched(eraKey) {
    const ids = listTitles.filter(t => eraForId[t.id] === eraKey && !t.comingSoon && !watched.has(t.id)).map(t => t.id)
    if (!ids.length) return
    setWatched(prev => {
      const next = new Set(prev)
      ids.forEach(id => next.add(id))
      saveJSON(SK_WATCHED, [...next])
      return next
    })
  }

  const LIST_SIZE_OPTS = [
    { id: 'rookie',   label: 'Rookie',   count: DC_TITLES.filter(t => t.tier === 1 && !t.comingSoon).length },
    { id: 'hero',     label: 'Hero',     count: DC_TITLES.filter(t => t.tier <= 2 && !t.comingSoon).length },
    { id: 'infinity', label: 'Infinity', count: DC_TITLES.filter(t => !t.comingSoon).length },
  ]

  // ── Nav tabs ─────────────────────────────────────────────────────────────
  const NAV_TABS = [
    { id: 'home',    label: 'HOME',    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
      </svg>
    )},
    { id: 'tracker', label: 'TRACKER', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V3a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v15.75m-18 0H3m16.5 0h1.5m-1.5 0V3.375M6 18.375V3.375m12 15V3.375M6 3.375h12"/>
      </svg>
    )},
    { id: 'awards',  label: 'AWARDS',  icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"/>
      </svg>
    )},
    { id: 'stats',   label: 'STATS',   icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
      </svg>
    )},
    { id: 'social',  label: 'SOCIAL',  icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
      </svg>
    )},
    { id: 'heroes',  label: 'HEROES',  icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>
      </svg>
    )},
    { id: 'profile', label: 'PROFILE', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
      </svg>
    )},
  ]

  return (
    <div className="min-h-screen" style={{ background: BG_MAIN }}>

      {/* ── TRACKER TAB — sticky header ─────────────────────────────────────── */}
      {activeTab === 'tracker' && (
        <header className="sticky top-0 z-10 border-b" style={{ background: `rgba(10,14,26,0.96)`, backdropFilter: 'blur(12px)', borderColor: BORDER }}>
          <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
            {/* Logo row */}
            <div className="flex items-center gap-2.5 mb-3">
              <DCShield size={36}/>
              <div className="flex-1 min-w-0">
                <h1 className="font-bebas text-[26px] tracking-[0.1em] text-white leading-none">DC UNIVERSE TRACKER</h1>
                <div className="text-[10px] tracking-wide leading-none mt-0.5" style={{ color: TEXT_DIM }}>
                  {watchedCount} of {total} titles watched
                </div>
              </div>
              <button onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all hover:opacity-80 flex-shrink-0"
                style={{ background: '#E81C2E', color: 'white' }}>
                ⚡ MARVEL
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { label: 'Watched',   value: watchedCount, color: ACCENT },
                { label: 'Remaining', value: remaining,    color: TEXT_MAIN },
                { label: 'Complete',  value: `${pct}%`,   color: ACCENT },
                { label: 'Total',     value: total,        color: TEXT_DIM },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span className="font-bebas text-2xl tracking-wider leading-none" style={{ color }}>{value}</span>
                  <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: TEXT_DIM }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: BORDER }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${ACCENT2} 0%, ${ACCENT} 100%)` }}/>
            </div>

            {/* List size chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {LIST_SIZE_OPTS.map(opt => (
                <button key={opt.id} onClick={() => changeListSize(opt.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                  style={listSize === opt.id
                    ? { background: ACCENT, color: '#000' }
                    : { background: BG_CARD, color: TEXT_DIM, border: `1px solid ${ACCENT2}33` }
                  }>
                  {opt.label} <span style={{ opacity: 0.6 }}>({opt.count})</span>
                </button>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* ── TABS CONTENT ────────────────────────────────────────────────────── */}

      {activeTab === 'home' && (
        <DCHomePage
          profile={profile}
          watched={watched}
          listTitles={listTitles}
          loginDates={loginDates}
          nextUpId={nextUpId}
          onNavigate={setActiveTab}
          onOpenTrivia={() => setShowTrivia(true)}
        />
      )}

      {activeTab === 'tracker' && (
        <>
          {/* Search + filters */}
          <div className="max-w-lg mx-auto px-4 pt-3 pb-2 space-y-2.5">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TEXT_DIM }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
              <input type="search" placeholder="Search titles…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                style={{ background: BG_CARD, border: `1px solid ${ACCENT2}44`, color: TEXT_MAIN, '::placeholder': { color: TEXT_DIM } }}/>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {DC_FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all"
                  style={filter === f
                    ? { background: ACCENT, color: '#000', boxShadow: `0 0 10px rgba(255,215,0,0.3)` }
                    : { background: BG_CARD, color: TEXT_DIM, border: `1px solid ${ACCENT2}33` }
                  }>
                  {DC_FILTER_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Era list */}
          <main className="max-w-lg mx-auto px-4 pb-32">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center mt-16 gap-3" style={{ color: ACCENT2 }}>
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
                <p className="text-sm">No titles match your filter.</p>
              </div>
            ) : (
              groupedByEra.map(({ era, titles: eraTitles }) => {
                const collapsed  = collapsedEras.has(era.key)
                const eraWatched = eraTitles.filter(t => watched.has(t.id) && !t.comingSoon).length
                const eraCntbl   = eraTitles.filter(t => !t.comingSoon).length
                return (
                  <div key={era.key}>
                    <DCEraHeader
                      era={era}
                      watchedCount={eraWatched}
                      totalCount={eraCntbl}
                      onMarkAll={() => markEraWatched(era.key)}
                      collapsed={collapsed}
                      onToggleCollapse={() => setCollapsedEras(prev => {
                        const next = new Set(prev)
                        collapsed ? next.delete(era.key) : next.add(era.key)
                        return next
                      })}
                    />
                    {!collapsed && (
                      <ul className="space-y-1.5">
                        {eraTitles.map(t => (
                          <DCTitleCard
                            key={t.id}
                            title={t}
                            isWatched={watched.has(t.id)}
                            isNextUp={t.id === nextUpId}
                            onToggle={toggleWatched}
                            onOpenDetail={setSelectedTitle}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })
            )}
          </main>
        </>
      )}

      {activeTab === 'awards'  && <DCAwardsPage watched={watched} listTitles={listTitles}/>}
      {activeTab === 'stats'   && <DCStatsPage watched={watched} listTitles={listTitles} villainRatings={villainRatings}/>}
      {activeTab === 'social'  && <DCSocialPage user={user} friendIds={[]}/>}
      {activeTab === 'heroes'  && <DCHeroesPage watched={watched} batmanSeen={batmanSeen} onToggleBatmanSeen={toggleBatmanSeen}/>}
      {activeTab === 'profile' && (
        <DCProfilePage
          profile={profile}
          watched={watched}
          listTitles={listTitles}
          onBack={onBack}
          onSignOut={onSignOut}
          onDeleteAccount={onDeleteAccount}
        />
      )}

      {/* ── DC Title Detail Panel ─────────────────────────────────────────── */}
      {selectedTitle && (
        <DCTitleDetailPanel
          title={selectedTitle}
          isWatched={watched.has(selectedTitle.id)}
          onToggle={toggleWatched}
          villainRatings={villainRatings}
          onRateVillain={rateVillain}
          moodRatings={moodRatings}
          onSetMood={setMoodRating}
          onClose={() => setSelectedTitle(null)}
        />
      )}

      {/* ── Trivia modal ───────────────────────────────────────────────────── */}
      {showTrivia && <DCTriviaModal onClose={() => setShowTrivia(false)}/>}

      {/* ── Bottom nav ─────────────────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, background: '#080f1e', borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-lg mx-auto flex">
          {NAV_TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition-all relative"
                style={{ color: isActive ? ACCENT : '#3a5a7a' }}>
                {tab.icon}
                <span className="font-bebas text-[9px] tracking-wider">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: ACCENT }}/>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom fade */}
      {activeTab === 'tracker' && (
        <div className="fixed bottom-16 inset-x-0 h-12 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${BG_MAIN} 0%, transparent 100%)` }}/>
      )}
    </div>
  )
}
