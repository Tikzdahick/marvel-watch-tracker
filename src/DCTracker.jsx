/**
 * DCTracker — Self-contained DC Universe watch tracker.
 * DC theme: dark blue #0a0e1a bg, gold #FFD700, blue #1a3a6b accents.
 * All state is stored under dc- prefixed localStorage keys.
 */
import { useState, useMemo } from 'react'
import { DC_TITLES } from './data/dcTitles.js'
import { DC_ERAS } from './data/dcEras.js'

const SK_DC_WATCHED   = 'dc-watched-v1'
const SK_DC_LIST_SIZE = 'dc-list-size'

function loadJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) } catch {}
  return fallback
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  const styles = {
    movie: 'bg-blue-950 text-blue-300 border-blue-500/25',
    tv:    'bg-amber-950 text-amber-400 border-amber-400/25',
  }
  return (
    <span className={`inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest ${styles[type] ?? styles.movie}`}>
      {type === 'tv' ? 'TV' : 'FILM'}
    </span>
  )
}

function DCCheckCircle({ watched, comingSoon }) {
  if (comingSoon) return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-[#FFD700]/20 bg-[#050811]">
      <span className="text-[11px] leading-none">⏳</span>
    </div>
  )
  return (
    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
      watched
        ? 'shadow-[0_0_10px_rgba(255,215,0,0.4)]'
        : 'border-2 border-[#1a3a6b] bg-[#050811] hover:border-[#FFD700]/40'
    }`}
    style={watched ? { background: 'linear-gradient(135deg, #FFD700 0%, #d4a017 100%)' } : undefined}
    >
      {watched && (
        <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      )}
    </div>
  )
}

function DCTitleCard({ title, isWatched, onToggle, isNextUp }) {
  const comingSoon = !!title.comingSoon
  return (
    <div
      onClick={() => !comingSoon && onToggle(title.id)}
      className={[
        'flex items-center gap-3 px-4 py-3 transition-all duration-150 border-b select-none',
        comingSoon
          ? 'cursor-default opacity-50'
          : 'cursor-pointer active:scale-[0.995]',
        isWatched
          ? 'border-[#0d1829]'
          : 'border-[#0d1829] hover:bg-[#0d1829]/60',
        isNextUp && !isWatched && !comingSoon
          ? 'bg-[#FFD700]/5'
          : '',
      ].join(' ')}
    >
      <DCCheckCircle watched={isWatched} comingSoon={comingSoon}/>
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-medium leading-tight truncate ${isWatched ? 'text-[#3a5a7a]' : 'text-[#c8d8e8]'}`}>
          {title.title}
        </div>
        {isNextUp && !isWatched && !comingSoon && (
          <div className="text-[9px] text-[#FFD700] uppercase tracking-widest mt-0.5 font-bold">▶ UP NEXT</div>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <TypeBadge type={title.type}/>
      </div>
    </div>
  )
}

function DCEraSection({ era, titles, watched, onToggle, nextUpId, showTV }) {
  const [collapsed, setCollapsed] = useState(false)

  const visibleTitles = useMemo(() =>
    titles.filter(t => showTV || t.type !== 'tv'),
    [titles, showTV]
  )
  const watchedHere  = visibleTitles.filter(t => watched.has(t.id) && !t.comingSoon).length
  const totalHere    = visibleTitles.filter(t => !t.comingSoon).length
  const pct          = totalHere > 0 ? Math.round((watchedHere / totalHere) * 100) : 0
  const allWatched   = watchedHere >= totalHere && totalHere > 0

  if (visibleTitles.length === 0) return null

  return (
    <div>
      {/* Era header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center gap-2 px-4 pt-5 pb-2 select-none group"
      >
        <span className="text-base flex-shrink-0">{era.emoji}</span>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bebas text-[13px] tracking-widest ${era.color}`}>{era.label}</span>
            <span className="text-[9px] text-[#2a4060] uppercase tracking-wider hidden sm:inline">{era.sub}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 h-0.5 bg-[#0d1829] rounded-full overflow-hidden max-w-[80px]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: allWatched ? '#22c55e' : '#FFD700' }}
              />
            </div>
            <span className="text-[9px] text-[#2a4060] tabular-nums">
              {watchedHere}/{totalHere}{allWatched && ' ✓'}
            </span>
          </div>
        </div>
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 text-[#2a4060] transition-transform duration-200 ${collapsed ? '' : 'rotate-90'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      {/* Title list */}
      {!collapsed && (
        <div className={`rounded-xl mx-3 overflow-hidden border ${era.border} ${era.bg}`}>
          {visibleTitles.map(t => (
            <DCTitleCard
              key={t.id}
              title={t}
              isWatched={watched.has(t.id)}
              onToggle={onToggle}
              isNextUp={t.id === nextUpId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── DC Shield Logo ─────────────────────────────────────────────────────────────
function DCShield({ size = 32 }) {
  return (
    <div
      className="flex items-center justify-center font-black text-black rounded-sm flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #FFD700 0%, #d4a017 100%)',
        fontSize: size * 0.55,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        boxShadow: `0 0 ${size * 0.5}px rgba(255,215,0,0.4)`,
      }}
    >
      DC
    </div>
  )
}

// ── Main DCTracker ─────────────────────────────────────────────────────────────
export default function DCTracker({ onBack }) {
  const [watched,  setWatched]  = useState(() => new Set(loadJSON(SK_DC_WATCHED, [])))
  const [listSize, setListSize] = useState(() => loadJSON(SK_DC_LIST_SIZE, 'all'))

  function toggleWatched(id) {
    setWatched(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      saveJSON(SK_DC_WATCHED, [...next])
      return next
    })
  }

  // Build titles per era, respecting listSize (tier1 = movies only, all = movies+TV)
  const titlesForSize = useMemo(() =>
    DC_TITLES.filter(t => listSize === 'all' || t.tier === 1),
    [listSize]
  )

  const titleMap = useMemo(() => {
    const m = {}
    for (const t of DC_TITLES) m[t.id] = t
    return m
  }, [])

  const erasWithTitles = useMemo(() =>
    DC_ERAS.map(era => ({
      ...era,
      titles: era.ids.map(id => titleMap[id]).filter(Boolean).filter(t =>
        listSize === 'all' || t.tier === 1
      ),
    })),
    [listSize, titleMap]
  )

  const countable = titlesForSize.filter(t => !t.comingSoon)
  const watchedCount = countable.filter(t => watched.has(t.id)).length
  const total = countable.length
  const pct = total > 0 ? Math.round((watchedCount / total) * 100) : 0
  const remaining = total - watchedCount

  const nextUpId = useMemo(() => {
    for (const era of DC_ERAS) {
      for (const id of era.ids) {
        const t = titleMap[id]
        if (t && !t.comingSoon && !watched.has(id) && (listSize === 'all' || t.tier === 1)) {
          return id
        }
      }
    }
    return null
  }, [watched, listSize, titleMap])

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0a0e1a', color: '#c8d8e8' }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b" style={{ background: 'rgba(10,14,26,0.96)', backdropFilter: 'blur(12px)', borderColor: '#0d1829' }}>
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          {/* Logo row */}
          <div className="flex items-center gap-3 mb-3">
            <DCShield size={36}/>
            <div className="flex-1 min-w-0">
              <h1 className="font-bebas text-[26px] tracking-[0.1em] text-white leading-none"
                style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}
              >
                DC UNIVERSE TRACKER
              </h1>
              <div className="text-[10px] tracking-wide leading-none mt-0.5" style={{ color: '#2a4060' }}>
                {watchedCount} of {total} titles watched
              </div>
            </div>
            {/* Back to Marvel */}
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all hover:opacity-80 flex-shrink-0"
              style={{ background: '#E81C2E', color: 'white' }}
            >
              <span>⚡</span> MARVEL
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: 'Watched',   value: watchedCount, color: '#FFD700' },
              { label: 'Remaining', value: remaining,    color: '#c8d8e8' },
              { label: 'Complete',  value: `${pct}%`,    color: '#FFD700' },
              { label: 'Total',     value: total,        color: '#2a4060' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className="font-bebas text-2xl tracking-wider leading-none" style={{ color }}>{value}</span>
                <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: '#2a4060' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: '#0d1829' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #1a3a6b 0%, #FFD700 100%)' }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-3">
            {/* List size toggle */}
            <div className="flex gap-1.5">
              {[
                { id: 'tier1', label: 'Movies' },
                { id: 'all',   label: 'Movies + TV' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setListSize(opt.id); saveJSON(SK_DC_LIST_SIZE, opt.id) }}
                  className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                  style={listSize === opt.id
                    ? { background: '#FFD700', color: '#000' }
                    : { background: '#0d1829', color: '#2a4060', border: '1px solid #0d1829' }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="text-[9px] uppercase tracking-widest" style={{ color: '#2a4060' }}>
              Chronological order
            </div>
          </div>
        </div>
      </header>

      {/* ── Era sections ───────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto">
        {erasWithTitles.map(era => (
          <DCEraSection
            key={era.key}
            era={era}
            titles={era.titles}
            watched={watched}
            onToggle={toggleWatched}
            nextUpId={nextUpId}
            showTV={listSize === 'all'}
          />
        ))}

        {/* Bottom padding + back button */}
        <div className="px-4 pt-8 pb-4 flex flex-col items-center gap-4">
          <div className="text-center text-[11px]" style={{ color: '#2a4060' }}>
            {pct === 100
              ? '🏆 DC Universe Complete! You\'re a true hero.'
              : `${remaining} title${remaining !== 1 ? 's' : ''} remaining in your watchlist`}
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bebas text-lg tracking-widest transition-all hover:opacity-80"
            style={{ background: '#E81C2E', color: 'white' }}
          >
            ⚡ BACK TO MARVEL
          </button>
        </div>
      </div>
    </div>
  )
}
