/**
 * DCTracker — DC Universe watch tracker.
 * Matches Marvel tracker layout (search, filter tabs, era sections, same card style).
 * DC theme: dark blue #0a0e1a bg, gold #FFD700 accents, blue #1a3a6b borders.
 * State stored under dc- prefixed localStorage keys.
 */
import { useState, useMemo } from 'react'
import { DC_TITLES } from './data/dcTitles.js'
import { DC_ERAS } from './data/dcEras.js'

const SK_DC_WATCHED   = 'dc-watched-v1'
const SK_DC_LIST_SIZE = 'dc-list-size'

const DC_FILTERS       = ['all', 'unwatched', 'watched', 'movies', 'tv']
const DC_FILTER_LABELS = { all: 'All', unwatched: 'Unwatched', watched: 'Watched', movies: 'Movies', tv: 'TV' }

function loadJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) } catch {}
  return fallback
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function getTitlesForListSize(size) {
  switch (size) {
    case 'rookie':   return DC_TITLES.filter(t => t.tier === 1)
    case 'hero':     return DC_TITLES.filter(t => t.tier <= 2)
    case 'infinity': return DC_TITLES
    default:         return DC_TITLES.filter(t => t.tier <= 2)
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────────

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

function DCCheckCircle({ watched, comingSoon }) {
  if (comingSoon) return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ border: '2px solid rgba(255,215,0,0.2)', background: '#050811' }}
    >
      <span className="text-[11px] leading-none">⏳</span>
    </div>
  )
  return (
    <div
      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
      style={watched
        ? { background: 'linear-gradient(135deg, #FFD700 0%, #d4a017 100%)', boxShadow: '0 0 10px rgba(255,215,0,0.4)' }
        : { border: '2px solid #1a3a6b', background: '#050811' }
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

function DCTitleCard({ title, isWatched, isNextUp, onToggle }) {
  const comingSoon = !!title.comingSoon
  return (
    <li
      onClick={() => !comingSoon && onToggle(title.id)}
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 select-none relative overflow-hidden',
        comingSoon ? 'cursor-default opacity-50 border-[#0d1829]'
        : isWatched ? 'cursor-pointer border-[#0d1829] opacity-60 hover:opacity-80 active:scale-[0.99]'
        : isNextUp  ? 'cursor-pointer active:scale-[0.99]'
        : 'cursor-pointer border-[#0d1829] hover:border-[#1a3a6b] hover:bg-[#0d1829]/60 active:scale-[0.99]',
      ].join(' ')}
      style={isNextUp && !isWatched && !comingSoon
        ? { background: 'rgba(255,215,0,0.04)', borderColor: 'rgba(255,215,0,0.35)', boxShadow: '0 0 16px rgba(255,215,0,0.08)' }
        : {}
      }
    >
      {isNextUp && !isWatched && !comingSoon && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: '#FFD700' }}/>
      )}

      <DCCheckCircle watched={isWatched} comingSoon={comingSoon}/>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <TypeBadge type={title.type}/>
          {isNextUp && !isWatched && !comingSoon && (
            <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest"
              style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700', borderColor: 'rgba(255,215,0,0.3)' }}
            >
              ▶ NEXT UP
            </span>
          )}
          {comingSoon && (
            <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest"
              style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700', borderColor: 'rgba(255,215,0,0.25)' }}
            >
              COMING SOON
            </span>
          )}
        </div>
        <p className={`text-sm leading-snug font-medium transition-all ${
          isWatched    ? 'line-through text-[#2a4060]'
          : comingSoon ? 'text-[#2a4060]'
          : isNextUp   ? 'text-white font-semibold'
          : 'text-[#c8d8e8]'
        }`}>{title.title}</p>
      </div>

      {!comingSoon && (
        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#1a3a6b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      )}
    </li>
  )
}

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
            <span className="text-[9px] uppercase tracking-wider hidden sm:inline" style={{ color: '#2a4060' }}>{era.sub}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 h-0.5 rounded-full overflow-hidden max-w-[80px]" style={{ background: '#0d1829' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: allWatched ? '#22c55e' : '#FFD700' }}
              />
            </div>
            <span className="text-[9px] tabular-nums" style={{ color: '#2a4060' }}>
              {watchedCount}/{totalCount}{allWatched && ' ✓'}
            </span>
          </div>
        </div>
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-90'}`}
          style={{ color: '#2a4060' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      {!allWatched && !collapsed && (
        confirm ? (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setConfirm(false)} className="text-[10px] hover:text-white px-2 py-1 transition-colors" style={{ color: '#2a4060' }}>
              Cancel
            </button>
            <button
              onClick={() => { onMarkAll(); setConfirm(false) }}
              className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${era.border} ${era.color} ${era.bg} hover:opacity-80 transition-opacity`}
            >
              ✓ Confirm
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirm(true)}
            className="flex-shrink-0 text-[10px] hover:text-white border rounded-lg px-2 py-1 transition-colors"
            style={{ color: '#2a4060', borderColor: '#1a3a6b' }}
          >
            ✓ All
          </button>
        )
      )}
    </div>
  )
}

function DCShield({ size = 32 }) {
  return (
    <div
      className="flex items-center justify-center font-black text-black flex-shrink-0"
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
export default function DCTracker({ onBack, dcListSize = 'hero' }) {
  const [watched,      setWatched]      = useState(() => new Set(loadJSON(SK_DC_WATCHED, [])))
  const [listSize,     setListSize]     = useState(() => loadJSON(SK_DC_LIST_SIZE, null) ?? dcListSize)
  const [filter,       setFilter]       = useState('all')
  const [search,       setSearch]       = useState('')
  const [collapsedEras, setCollapsedEras] = useState(() => new Set())

  function toggleWatched(id) {
    setWatched(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      saveJSON(SK_DC_WATCHED, [...next])
      return next
    })
  }

  function changeListSize(size) {
    setListSize(size)
    saveJSON(SK_DC_LIST_SIZE, size)
  }

  const listTitles = useMemo(() => getTitlesForListSize(listSize), [listSize])

  // Era ID lookup: { titleId → eraKey }
  const eraForId = useMemo(() => {
    const m = {}
    for (const era of DC_ERAS) {
      for (const id of era.ids) m[id] = era.key
    }
    return m
  }, [])

  // Stats (exclude coming-soon from counts)
  const countable    = useMemo(() => listTitles.filter(t => !t.comingSoon), [listTitles])
  const watchedCount = useMemo(() => countable.filter(t => watched.has(t.id)).length, [countable, watched])
  const total        = countable.length
  const remaining    = total - watchedCount
  const pct          = total > 0 ? Math.round((watchedCount / total) * 100) : 0

  // Next up (first unwatched, non-coming-soon title in era order)
  const nextUpId = useMemo(() => {
    for (const era of DC_ERAS) {
      for (const id of era.ids) {
        if (listTitles.some(t => t.id === id) && !watched.has(id)) {
          const t = listTitles.find(lt => lt.id === id)
          if (t && !t.comingSoon) return id
        }
      }
    }
    return null
  }, [watched, listTitles])

  // Filter + search → visible titles
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

  // Group visible titles by era
  const groupedByEra = useMemo(() =>
    DC_ERAS.map(era => ({
      era,
      titles: visible.filter(t => eraForId[t.id] === era.key),
    })).filter(g => g.titles.length > 0),
    [visible, eraForId]
  )

  function markEraWatched(eraKey) {
    const ids = listTitles
      .filter(t => eraForId[t.id] === eraKey && !t.comingSoon && !watched.has(t.id))
      .map(t => t.id)
    if (!ids.length) return
    setWatched(prev => {
      const next = new Set(prev)
      ids.forEach(id => next.add(id))
      saveJSON(SK_DC_WATCHED, [...next])
      return next
    })
  }

  const LIST_SIZE_OPTS = [
    { id: 'rookie',   label: 'Rookie',   count: DC_TITLES.filter(t => t.tier === 1 && !t.comingSoon).length },
    { id: 'hero',     label: 'Hero',     count: DC_TITLES.filter(t => t.tier <= 2 && !t.comingSoon).length },
    { id: 'infinity', label: 'Infinity', count: DC_TITLES.filter(t => !t.comingSoon).length },
  ]

  return (
    <div className="min-h-screen pb-32" style={{ background: '#0a0e1a', color: '#c8d8e8' }}>

      {/* ── Sticky header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b" style={{ background: 'rgba(10,14,26,0.96)', backdropFilter: 'blur(12px)', borderColor: '#0d1829' }}>
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">

          {/* Logo row */}
          <div className="flex items-center gap-2.5 mb-3">
            <DCShield size={36}/>
            <div className="flex-1 min-w-0">
              <h1 className="font-bebas text-[26px] tracking-[0.1em] text-white leading-none">
                DC UNIVERSE TRACKER
              </h1>
              <div className="text-[10px] tracking-wide leading-none mt-0.5" style={{ color: '#2a4060' }}>
                {watchedCount} of {total} titles watched
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all hover:opacity-80 flex-shrink-0"
              style={{ background: '#E81C2E', color: 'white' }}
            >
              ⚡ MARVEL
            </button>
          </div>

          {/* Stats pills */}
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

          {/* List size chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {LIST_SIZE_OPTS.map(opt => (
              <button
                key={opt.id}
                onClick={() => changeListSize(opt.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                style={listSize === opt.id
                  ? { background: '#FFD700', color: '#000' }
                  : { background: '#0d1829', color: '#2a4060', border: '1px solid #1a3a6b33' }
                }
              >
                {opt.label} <span style={{ opacity: 0.6 }}>({opt.count})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Search + filter tabs ──────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-4 pt-3 pb-2 space-y-2.5">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#2a4060' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
          <input
            type="search"
            placeholder="Search titles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#2a4060] focus:outline-none transition-colors"
            style={{ background: '#0d1829', border: '1px solid #1a3a6b44' }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {DC_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all"
              style={filter === f
                ? { background: '#FFD700', color: '#000', boxShadow: '0 0 10px rgba(255,215,0,0.3)' }
                : { background: '#0d1829', color: '#2a4060', border: '1px solid #1a3a6b33' }
              }
            >
              {DC_FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Era-grouped title list ────────────────────────────────────────────── */}
      <main className="max-w-lg mx-auto px-4 pb-32">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center mt-16 gap-3" style={{ color: '#1a3a6b' }}>
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
                      />
                    ))}
                  </ul>
                )}
              </div>
            )
          })
        )}
      </main>
    </div>
  )
}
