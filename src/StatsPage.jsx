import { useMemo, useState, useRef } from 'react'
import TriviaHistorySection from './TriviaHistorySection.jsx'
import {
  getTitlesForListSize,
  IDS_BLADE, IDS_XMEN_ERA, IDS_INFINITY_SAGA, IDS_DEFENDERS_SAGA, IDS_MULTIVERSE_SAGA,
  getRuntimeMinutes,
} from './data/titles.js'
import { calcStreak, calcLongestStreak } from './data/achievements.js'
import { CHARACTER_TITLES } from './data/characters.js'
import { CHARACTER_PROFILE_MAP } from './data/characterProfiles.js'

const ENDGAME_RUNTIME = 182 // minutes (Avengers: Endgame)
const PACE_START      = new Date('2025-08-27T00:00:00')

const ERAS = [
  { key: 'blade',      label: 'Blade Trilogy',   ids: IDS_BLADE,           color: '#6b7280' },
  { key: 'xmen',       label: 'X-Men Era',        ids: IDS_XMEN_ERA,        color: '#60a5fa' },
  { key: 'infinity',   label: 'Infinity Saga',    ids: IDS_INFINITY_SAGA,   color: '#E81C2E' },
  { key: 'defenders',  label: 'Defenders Saga',   ids: IDS_DEFENDERS_SAGA,  color: '#a78bfa' },
  { key: 'multiverse', label: 'Multiverse Saga',  ids: IDS_MULTIVERSE_SAGA, color: '#F5C518' },
]

// IMDb ratings (out of 10) for notable titles
const IMDB_RATINGS = {
  1:7.1, 2:6.7, 3:5.9,                                          // Blade
  5:7.7, 6:6.6, 7:7.4, 8:7.5, 9:6.8, 10:6.7, 11:8.0, 12:7.0, // X-Men
  13:5.7, 14:8.0, 15:7.7, 16:8.1,                              // Dark Phoenix / Deadpool / Logan
  17:6.9, 20:6.8, 21:7.9, 22:7.0, 23:6.7, 24:7.0, 25:8.0,    // Cap 1, CM, IM1-3, Hulk, Thor, Avengers
  26:7.1, 27:6.8, 28:7.7, 30:8.0, 31:7.6, 32:7.3, 33:7.3,    // IM3, Thor2, CW, GotG1-2, AoU, Ant-Man
  40:7.8, 41:6.7, 42:7.3, 43:7.4, 44:7.5, 45:7.9, 46:7.0,    // Civil War, BW, BP1, SM:HC, DS1, Ragnarok, A&tW
  47:8.4, 48:8.4, 49:8.2, 50:7.9, 51:7.2, 52:7.5,             // IW, EG, Loki, WandaVision, FATWS, Hawkeye
  54:7.4, 55:6.3, 56:7.3, 57:8.2, 58:6.9,                     // Shang-Chi, Eternals, SM:FFH, SM:NWH, DS2
  62:6.3, 63:6.7, 66:6.3, 67:7.9, 69:5.8, 70:7.7,             // Thor L&T, BP2, Quantumania, GotG3, Marvels, D&W
  73:6.6, 74:6.5, 77:6.0,                                       // Venom1, Venom2, Cap:BNW
}

// ── Sub-components ────────────────────────────────────────────────────────────

// SVG donut chart — segments: [{ pct, color, label }]
function DonutChart({ segments, size = 110 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.34, sw = size * 0.16
  const circ = 2 * Math.PI * r
  let deg = -90 // start at 12 o'clock
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a1a" strokeWidth={sw} />
      {segments.map((s, i) => {
        if (s.pct <= 0) return null
        const len = (s.pct / 100) * circ
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${len} ${circ - len}`}
            strokeDashoffset={0}
            transform={`rotate(${deg}, ${cx}, ${cy})`}
          />
        )
        deg += (s.pct / 100) * 360
        return el
      })}
    </svg>
  )
}

function EraBar({ label, total, watchedCount, color }) {
  const pct = total > 0 ? Math.round((watchedCount / total) * 100) : 0
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-[#888] uppercase tracking-widest">{label}</span>
        <span className="text-[11px] font-mono" style={{ color }}>
          {watchedCount}/{total} · {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

function Stars({ count, color = '#F5C518', size = 'text-sm' }) {
  return (
    <span className={size} style={{ color, letterSpacing: '-1px' }}>
      {'★'.repeat(count)}
      <span style={{ color: '#333' }}>{'★'.repeat(5 - count)}</span>
    </span>
  )
}

// ── Canvas share card ─────────────────────────────────────────────────────────

async function downloadShareCard({ profile, watchedCount, totalHours, pct, watchStreak, topRated, bestEra }) {
  try {
    const font = new FontFace(
      'Bebas Neue',
      'url(https://fonts.gstatic.com/s/bebasneueeue/v10/JTUSjIg69CK48gW7PXoo9WdhyyTh89ZNpQ.woff2)'
    )
    await font.load()
    document.fonts.add(font)
  } catch {}

  const W = 640, H = 360
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, W, H)

  // Red top stripe
  ctx.fillStyle = '#E81C2E'
  ctx.fillRect(0, 0, W, 5)

  // Gold bottom stripe
  ctx.fillStyle = '#F5C518'
  ctx.fillRect(0, H - 3, W, 3)

  // Left accent lines
  ctx.fillStyle = '#E81C2E'
  ctx.fillRect(44, 30, 4, 54)
  ctx.fillStyle = '#F5C518'
  ctx.fillRect(44, 86, 4, 18)

  // App title
  ctx.fillStyle = '#ffffff'
  ctx.font = '30px "Bebas Neue", Impact, sans-serif'
  ctx.fillText('MARVEL WATCH TRACKER', 60, 64)

  // Profile name
  ctx.fillStyle = '#E81C2E'
  ctx.font = '22px "Bebas Neue", Impact, sans-serif'
  ctx.fillText((profile?.name ?? 'MARVEL FAN').toUpperCase(), 60, 94)

  // Stats row
  const stats = [
    { label: 'WATCHED', value: String(watchedCount) },
    { label: 'HOURS',   value: `${totalHours}h` },
    { label: 'DONE',    value: `${pct}%` },
    { label: 'STREAK',  value: `${watchStreak}d` },
  ]
  stats.forEach(({ label, value }, i) => {
    const x = 60 + i * 148
    ctx.fillStyle = i === 0 ? '#E81C2E' : i === 3 ? '#F5C518' : '#ffffff'
    ctx.font = '42px "Bebas Neue", Impact, sans-serif'
    ctx.fillText(value, x, 178)
    ctx.fillStyle = '#444444'
    ctx.font = '10px Arial, sans-serif'
    ctx.fillText(label, x, 194)
  })

  // Progress bar
  const bx = 60, by = 212, bw = W - 120, bh = 6
  ctx.fillStyle = '#1a1a1a'
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 3); ctx.fill()
  ctx.fillStyle = '#E81C2E'
  ctx.beginPath(); ctx.roundRect(bx, by, bw * (pct / 100), bh, 3); ctx.fill()

  // Details
  if (topRated) {
    ctx.fillStyle = '#F5C518'
    ctx.font = '12px Arial, sans-serif'
    ctx.fillText(`⭐ Top rated: ${topRated.slice(0, 45)}`, 60, 246)
  }
  if (bestEra) {
    ctx.fillStyle = '#555555'
    ctx.font = '12px Arial, sans-serif'
    ctx.fillText(`🏆 Best era: ${bestEra}`, 60, 266)
  }

  // Tagline
  ctx.fillStyle = '#2a2a2a'
  ctx.font = '11px Arial, sans-serif'
  ctx.fillText("I'm watching every Marvel title before Avengers: Doomsday", 60, 316)

  // Download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `marvel-stats-${(profile?.name ?? 'card').replace(/\s+/g, '-').toLowerCase()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

// ── Main component ────────────────────────────────────────────────────────────

// ── Marvel Wrapped (monthly stats card) ──────────────────────────────────────
function MarvelWrapped({ watched, watchHistory, ratings, listTitles, profile }) {
  const [shared, setShared] = useState(false)

  const now   = new Date()
  const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Titles watched this month
  const monthKey = now.toISOString().slice(0, 7) // 'YYYY-MM'
  const monthWatched = useMemo(() => {
    const ids = new Set()
    Object.entries(watchHistory || {}).forEach(([date, titleIds]) => {
      if (date.startsWith(monthKey)) titleIds.forEach(id => ids.add(id))
    })
    return ids
  }, [watchHistory, monthKey])

  const monthWatchedTitles = useMemo(
    () => listTitles.filter(t => monthWatched.has(t.id)),
    [listTitles, monthWatched]
  )

  const monthHours = useMemo(
    () => Math.floor(monthWatchedTitles.reduce((s, t) => s + getRuntimeMinutes(t), 0) / 60),
    [monthWatchedTitles]
  )

  // Best binge day this month
  const monthBinge = useMemo(() => {
    const entries = Object.entries(watchHistory || {}).filter(([d]) => d.startsWith(monthKey))
    if (!entries.length) return null
    const [date, ids] = entries.sort((a, b) => b[1].length - a[1].length)[0]
    return { date, count: ids.length }
  }, [watchHistory, monthKey])

  // Favourite era this month
  const monthEra = useMemo(() => {
    const ERAS = [
      { label: 'Blade Trilogy',   ids: IDS_BLADE },
      { label: 'X-Men Era',        ids: IDS_XMEN_ERA },
      { label: 'Infinity Saga',    ids: IDS_INFINITY_SAGA },
      { label: 'Defenders Saga',   ids: IDS_DEFENDERS_SAGA },
      { label: 'Multiverse Saga',  ids: IDS_MULTIVERSE_SAGA },
    ]
    const counts = ERAS.map(e => ({
      label: e.label,
      count: monthWatchedTitles.filter(t => e.ids.has(t.id)).length,
    }))
    const top = counts.sort((a, b) => b.count - a.count)[0]
    return top?.count > 0 ? top.label : null
  }, [monthWatchedTitles])

  // Top rated this month
  const monthTopRated = useMemo(() => {
    return monthWatchedTitles
      .filter(t => ratings[t.id] != null)
      .sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0))[0]
  }, [monthWatchedTitles, ratings])

  async function handleShare() {
    const text = [
      `🎬 MARVEL WRAPPED — ${month}`,
      `👤 ${profile?.name ?? 'Marvel Fan'}`,
      '',
      `✅ ${monthWatched.size} titles watched`,
      `⏱ ${monthHours} hours`,
      monthEra  ? `🏆 Favourite era: ${monthEra}` : '',
      monthBinge ? `🍿 Best binge: ${monthBinge.count} in a day` : '',
      monthTopRated ? `⭐ Top pick: ${monthTopRated.title}` : '',
      '',
      '#MarvelWatchTracker #MarvelWrapped',
    ].filter(Boolean).join('\n')

    try {
      if (navigator.share) { await navigator.share({ title: 'Marvel Wrapped', text }) }
      else { await navigator.clipboard.writeText(text); setShared(true); setTimeout(() => setShared(false), 2500) }
    } catch {}
  }

  return (
    <div
      className="rounded-2xl border border-[#F5C518]/25 p-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0800 0%, #0a0a0a 60%, #0a000a 100%)' }}
    >
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 80% 0%, rgba(245,197,24,0.07) 0%, transparent 60%)'
      }}/>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] text-[#F5C518] uppercase tracking-widest font-bold">Marvel Wrapped</div>
            <div className="text-[11px] text-[#555]">{month}</div>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow-[0_0_12px_rgba(245,197,24,0.3)]"
            style={{ background: 'linear-gradient(135deg, #F5C518, #d4a017)' }}
          >
            <span className="text-black">M</span>
          </div>
        </div>

        {monthWatched.size === 0 ? (
          <div className="text-center py-4">
            <div className="text-[#333] text-sm">No titles watched this month yet.</div>
            <div className="text-[#222] text-xs mt-1">Start watching to see your Wrapped!</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-3">
                <div className="font-bebas text-3xl text-[#E81C2E] leading-none">{monthWatched.size}</div>
                <div className="text-[9px] text-[#555] uppercase tracking-widest">Titles</div>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-3">
                <div className="font-bebas text-3xl text-[#F5C518] leading-none">{monthHours}h</div>
                <div className="text-[9px] text-[#555] uppercase tracking-widest">Hours</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {monthEra && (
                <div className="flex items-center gap-2 py-2 border-b border-[#1a1a1a]">
                  <span className="text-base">🏆</span>
                  <div>
                    <div className="text-[10px] text-[#555] uppercase tracking-widest">Favourite Era</div>
                    <div className="text-sm text-white font-medium">{monthEra}</div>
                  </div>
                </div>
              )}
              {monthBinge && (
                <div className="flex items-center gap-2 py-2 border-b border-[#1a1a1a]">
                  <span className="text-base">🍿</span>
                  <div>
                    <div className="text-[10px] text-[#555] uppercase tracking-widest">Best Binge Day</div>
                    <div className="text-sm text-white font-medium">
                      {monthBinge.count} titles on {new Date(monthBinge.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              )}
              {monthTopRated && (
                <div className="flex items-center gap-2 py-2">
                  <span className="text-base">⭐</span>
                  <div>
                    <div className="text-[10px] text-[#555] uppercase tracking-widest">Top Rated</div>
                    <div className="text-sm text-white font-medium">{monthTopRated.title}</div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleShare}
              className="w-full py-3 rounded-xl font-bebas text-lg tracking-widest text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #F5C518 0%, #d4a017 100%)',
                color: '#000',
                boxShadow: shared ? '0 0 20px rgba(245,197,24,0.5)' : '0 0 12px rgba(245,197,24,0.2)',
              }}
            >
              {shared ? '✓ COPIED!' : '📱 SHARE WRAPPED'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Watch Planner ─────────────────────────────────────────────────────────────
function WatchPlanner({ planner, onScheduleTitle, titles }) {
  const today     = new Date().toISOString().slice(0, 10)
  const [adding,  setAdding]  = useState(false)
  const [pickId,  setPickId]  = useState('')
  const [pickDate, setPickDate] = useState(today)

  // Scheduled entries sorted by date
  const scheduled = useMemo(() => {
    return Object.entries(planner)
      .map(([idStr, date]) => {
        const id    = Number(idStr)
        const title = titles.find(t => t.id === id)
        return title ? { id, date, title } : null
      })
      .filter(Boolean)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [planner, titles])

  // Titles not yet planned
  const unplanned = useMemo(
    () => titles.filter(t => !planner[t.id] && !t.comingSoon),
    [titles, planner]
  )

  function handleAdd() {
    if (!pickId || !pickDate) return
    onScheduleTitle(Number(pickId), pickDate)
    setPickId('')
    setPickDate(today)
    setAdding(false)
  }

  return (
    <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] text-[#555] uppercase tracking-widest">📅 Watch Planner</div>
        <button
          onClick={() => setAdding(v => !v)}
          className="text-[10px] font-semibold px-3 py-1.5 rounded-lg border border-[#222] text-[#555] hover:text-white transition-colors"
        >
          {adding ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-[#161616] border border-[#222] rounded-xl p-3 mb-3 space-y-2">
          <select
            value={pickId}
            onChange={e => setPickId(e.target.value)}
            className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E81C2E]/50"
          >
            <option value="">Select a title…</option>
            {unplanned.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={pickDate}
              min={today}
              onChange={e => setPickDate(e.target.value)}
              className="flex-1 bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E81C2E]/50"
            />
            <button
              onClick={handleAdd}
              disabled={!pickId || !pickDate}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#E81C2E] text-white disabled:opacity-30 hover:shadow-[0_0_10px_rgba(232,28,46,0.4)] transition-all"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Scheduled list */}
      {scheduled.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-[#333] text-sm">No titles scheduled yet.</div>
          <div className="text-[#222] text-xs mt-1">Tap + Add to schedule your next watch.</div>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {scheduled.map(({ id, date, title }) => {
            const dt     = new Date(date + 'T12:00')
            const isPast = date < today
            const isToday = date === today
            return (
              <li key={id} className={`flex items-center gap-3 py-2 px-3 rounded-xl border transition-all ${
                isToday ? 'bg-[#180000] border-[#E81C2E]/30'
                : isPast ? 'bg-[#0d0d0d] border-[#161616] opacity-50'
                : 'bg-[#111] border-[#1c1c1c]'
              }`}>
                <div className="flex flex-col items-center w-10 flex-shrink-0">
                  <span className="text-[9px] uppercase tracking-widest text-[#555]">
                    {dt.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className={`font-bebas text-xl leading-none ${isToday ? 'text-[#E81C2E]' : 'text-[#888]'}`}>
                    {dt.getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate font-medium">{title.title}</p>
                  {isToday && <p className="text-[10px] text-[#E81C2E]">Today!</p>}
                </div>
                <button
                  onClick={() => onScheduleTitle(id, null)}
                  className="text-[#333] hover:text-[#E81C2E] transition-colors text-lg leading-none"
                  title="Remove from planner"
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ── Watch History Timeline ─────────────────────────────────────────────────────

const TIMELINE_START = new Date('2025-08-27T00:00:00')

function WatchHistoryTimeline({ watchHistory, listTitles }) {
  const scrollRef = useRef(null)

  // Build an ordered list of days that have at least 1 watch
  const days = useMemo(() => {
    if (!watchHistory) return []
    const titleMap = {}
    listTitles.forEach(t => { titleMap[t.id] = t.title })

    const entries = Object.entries(watchHistory)
      .filter(([, ids]) => ids && ids.length > 0)
      .map(([dateStr, ids]) => {
        const d = new Date(dateStr + 'T00:00:00')
        return {
          dateStr,
          date: d,
          titles: ids.map(id => titleMap[id] || `#${id}`).filter(Boolean),
          binge: ids.length >= 2,
        }
      })
      .filter(e => e.date >= TIMELINE_START)
      .sort((a, b) => a.date - b.date)

    return entries
  }, [watchHistory, listTitles])

  if (days.length === 0) return null

  const monthLabel = d => d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  const dayLabel   = d => d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })

  // Scroll to end on mount so latest is visible
  const scrollToEnd = el => { if (el) el.scrollLeft = el.scrollWidth }

  const bingeCount = days.filter(d => d.binge).length

  return (
    <div className="rounded-2xl border border-[#1e1e1e] bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-0.5">Watch History</div>
          <div className="font-bebas text-xl tracking-widest text-white">YOUR TIMELINE</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-[#E81C2E] font-semibold">{days.length} watch days</div>
          {bingeCount > 0 && (
            <div className="text-[10px] text-[#F5C518]">⚡ {bingeCount} binge {bingeCount === 1 ? 'day' : 'days'}</div>
          )}
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={el => { scrollRef.current = el; scrollToEnd(el) }}
        className="overflow-x-auto pb-4 px-4"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex gap-2 pt-1" style={{ width: 'max-content' }}>
          {days.map((day, i) => {
            const showMonth = i === 0 || monthLabel(day.date) !== monthLabel(days[i - 1].date)
            return (
              <div key={day.dateStr} className="flex flex-col items-center" style={{ width: 72 }}>
                {/* Month marker */}
                <div className="h-4 flex items-center mb-1">
                  {showMonth && (
                    <span className="text-[9px] font-semibold tracking-widest uppercase"
                      style={{ color: '#E81C2E' }}>
                      {monthLabel(day.date)}
                    </span>
                  )}
                </div>

                {/* Card */}
                <div
                  className="rounded-xl border p-2 flex flex-col gap-1 w-full"
                  style={{
                    background: day.binge
                      ? 'linear-gradient(135deg, rgba(245,197,24,0.12) 0%, rgba(232,28,46,0.08) 100%)'
                      : 'rgba(20,20,20,0.8)',
                    borderColor: day.binge ? '#F5C518' : '#222',
                    boxShadow: day.binge ? '0 0 10px rgba(245,197,24,0.15)' : 'none',
                  }}
                >
                  {/* Day label */}
                  <div className="flex items-center gap-1">
                    {day.binge && <span className="text-[9px]">⚡</span>}
                    <span className="text-[9px] font-semibold"
                      style={{ color: day.binge ? '#F5C518' : '#888' }}>
                      {dayLabel(day.date)}
                    </span>
                  </div>

                  {/* Title pills */}
                  <div className="flex flex-col gap-0.5">
                    {day.titles.slice(0, 3).map((title, j) => (
                      <div
                        key={j}
                        className="text-[8px] leading-tight rounded px-1 py-0.5 truncate"
                        style={{
                          background: 'rgba(232,28,46,0.15)',
                          color: '#ddd',
                          maxWidth: 64,
                        }}
                        title={title}
                      >
                        {title}
                      </div>
                    ))}
                    {day.titles.length > 3 && (
                      <div className="text-[8px] text-[#555] px-1">+{day.titles.length - 3} more</div>
                    )}
                  </div>

                  {/* Count badge for binge days */}
                  {day.binge && (
                    <div className="text-[8px] font-bold text-center mt-0.5"
                      style={{ color: '#F5C518' }}>
                      {day.titles.length} titles
                    </div>
                  )}
                </div>

                {/* Timeline spine dot */}
                <div className="flex flex-col items-center mt-1.5">
                  <div
                    className="rounded-full"
                    style={{
                      width: day.binge ? 8 : 5,
                      height: day.binge ? 8 : 5,
                      background: day.binge ? '#F5C518' : '#E81C2E',
                      boxShadow: day.binge ? '0 0 6px #F5C518' : '0 0 4px rgba(232,28,46,0.6)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Spine line */}
        <div className="relative" style={{ marginTop: -6 }}>
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #2a2a2a 10%, #2a2a2a 90%, transparent)' }} />
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#E81C2E' }} />
          <span className="text-[9px] text-[#555]">Single watch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F5C518', boxShadow: '0 0 4px #F5C518' }} />
          <span className="text-[9px] text-[#F5C518]">⚡ Binge day (2+)</span>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StatsPage({
  watched, watchHistory, loginDates, config, ratings,
  goal, onSetGoal, reminder, onSetReminder, profile,
  planner, onScheduleTitle, titles, triviaState = {},
}) {
  const [goalInput,    setGoalInput]    = useState(String(goal.weekly))
  const [reminderTime, setReminderTime] = useState(reminder.time)
  const [reminderOn,   setReminderOn]   = useState(reminder.enabled)
  const [generating,   setGenerating]   = useState(false)

  const listTitles    = useMemo(() => getTitlesForListSize(config.listSize), [config.listSize])
  const watchedTitles = useMemo(() => listTitles.filter(t => watched.has(t.id)), [listTitles, watched])

  // ── Runtime ──
  const totalMinutes    = useMemo(() => watchedTitles.reduce((s, t) => s + getRuntimeMinutes(t), 0), [watchedTitles])
  const totalHours      = Math.floor(totalMinutes / 60)
  const endgameCount    = (totalMinutes / ENDGAME_RUNTIME).toFixed(1)

  // ── Type breakdown ──
  const byType = useMemo(() => {
    const g = { movie: { count: 0, mins: 0 }, tv: { count: 0, mins: 0 }, animated: { count: 0, mins: 0 } }
    for (const t of watchedTitles) {
      const key = g[t.type] ? t.type : 'movie'
      g[key].count++
      g[key].mins += getRuntimeMinutes(t)
    }
    return g
  }, [watchedTitles])

  // ── Era completion ──
  const eraStats = useMemo(() => ERAS.map(era => {
    const eraTitles  = listTitles.filter(t => era.ids.has(t.id))
    const eraWatched = eraTitles.filter(t => watched.has(t.id)).length
    return { ...era, total: eraTitles.length, watchedCount: eraWatched }
  }).filter(e => e.total > 0), [listTitles, watched])

  const bestEra = useMemo(() => {
    const sorted = [...eraStats].sort((a, b) =>
      (b.watchedCount / b.total) - (a.watchedCount / a.total)
    )
    return sorted[0]?.label ?? null
  }, [eraStats])

  // ── Watch pace by week ──
  const weeklyPace = useMemo(() => {
    const now        = new Date()
    const totalWeeks = Math.max(1, Math.ceil((now - PACE_START) / (7 * 86400000)))
    const weeks      = Math.min(totalWeeks, 26)
    const data       = []
    for (let w = 0; w < weeks; w++) {
      const start = new Date(PACE_START)
      start.setDate(start.getDate() + w * 7)
      const end = new Date(start)
      end.setDate(end.getDate() + 7)
      const count = Object.entries(watchHistory || {})
        .filter(([d]) => { const dt = new Date(d); return dt >= start && dt < end })
        .reduce((sum, [, ids]) => sum + ids.length, 0)
      data.push({ label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count })
    }
    return data
  }, [watchHistory])
  const maxPace = Math.max(...weeklyPace.map(w => w.count), 1)

  // ── Best binge day ──
  const bestBinge = useMemo(() => {
    const entries = Object.entries(watchHistory || {})
    if (!entries.length) return null
    const [date, ids] = entries.sort((a, b) => b[1].length - a[1].length)[0]
    return { date, count: ids.length }
  }, [watchHistory])

  // ── Watch calendar heatmap (last 16 weeks) ──
  const calendarData = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const start = new Date(today)
    start.setDate(today.getDate() - 111)
    start.setDate(start.getDate() - start.getDay()) // align to Sunday
    const days = []
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().slice(0, 10)
      days.push({ date: ds, count: (watchHistory[ds] || []).length, dow: d.getDay() })
    }
    return days
  }, [watchHistory])
  const maxDayCount = Math.max(...calendarData.map(d => d.count), 1)

  // ── Streaks ──
  const watchDates  = useMemo(() => Object.keys(watchHistory || {}).sort(), [watchHistory])
  const watchStreak = useMemo(() => calcStreak(watchDates),        [watchDates])
  const watchBest   = useMemo(() => calcLongestStreak(watchDates), [watchDates])

  // ── Ratings ──
  const ratedTitles = useMemo(() =>
    listTitles.filter(t => ratings[t.id] != null && watched.has(t.id))
  , [listTitles, ratings, watched])
  const topRated = useMemo(() =>
    [...ratedTitles].sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0)).slice(0, 5)
  , [ratedTitles, ratings])
  const bottomRated = useMemo(() =>
    [...ratedTitles]
      .sort((a, b) => (ratings[a.id] || 0) - (ratings[b.id] || 0))
      .filter(t => (ratings[t.id] || 5) <= 2)
      .slice(0, 3)
  , [ratedTitles, ratings])

  // ── New stats ────────────────────────────────────────────────────────────────

  // Average rating
  const avgRating = useMemo(() => {
    if (!ratedTitles.length) return null
    const sum = ratedTitles.reduce((s, t) => s + (ratings[t.id] || 0), 0)
    return (sum / ratedTitles.length).toFixed(1)
  }, [ratedTitles, ratings])

  // Best watch day of week
  const bestWatchDay = useMemo(() => {
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const counts = Array(7).fill(0)
    for (const [dateStr, ids] of Object.entries(watchHistory || {})) {
      const dow = new Date(dateStr + 'T12:00').getDay()
      counts[dow] += (ids?.length ?? 0)
    }
    const total = counts.reduce((a, b) => a + b, 0)
    if (!total) return null
    const maxCount = Math.max(...counts)
    const maxDow = counts.indexOf(maxCount)
    return { day: DAYS[maxDow], count: maxCount, counts, days: DAYS, total }
  }, [watchHistory])

  // Favorite character — most appearances in watched titles
  const favoriteChar = useMemo(() => {
    if (!watched.size) return null
    let bestKey = null, bestCount = 0
    for (const [charKey, titleIds] of Object.entries(CHARACTER_TITLES)) {
      const count = titleIds.filter(id => watched.has(id)).length
      if (count > bestCount) { bestCount = count; bestKey = charKey }
    }
    if (!bestKey || bestCount < 2) return null
    const profile = CHARACTER_PROFILE_MAP[bestKey]
    return profile ? { ...profile, watchedCount: bestCount } : null
  }, [watched])

  // IMDb vs user average comparison
  const imdbComparison = useMemo(() => {
    const matched = ratedTitles.filter(t => IMDB_RATINGS[t.id] != null)
    if (matched.length < 3) return null
    const userAvg = matched.reduce((s, t) => s + ratings[t.id], 0) / matched.length
    const imdbAvg = matched.reduce((s, t) => s + IMDB_RATINGS[t.id] / 2, 0) / matched.length
    return { userAvg: userAvg.toFixed(1), imdbAvg: imdbAvg.toFixed(1), count: matched.length }
  }, [ratedTitles, ratings])

  // Completion prediction based on watch pace
  const completionPrediction = useMemo(() => {
    const entries = Object.entries(watchHistory || {}).filter(([, ids]) => ids?.length)
    if (entries.length < 3 || !totalWatched) return null
    const sorted = entries.sort((a, b) => a[0].localeCompare(b[0]))
    const firstDate = new Date(sorted[0][0] + 'T12:00')
    const daysSinceStart = Math.max(1, (Date.now() - firstDate.getTime()) / 86400000)
    const dailyPace = totalWatched / daysSinceStart
    const remaining = totalAvail - totalWatched
    if (remaining <= 0) return { done: true }
    const daysToFinish = Math.ceil(remaining / dailyPace)
    const finishDate = new Date(Date.now() + daysToFinish * 86400000)
    return {
      done: false,
      pacePerWeek: (dailyPace * 7).toFixed(1),
      daysToFinish,
      finishDate: finishDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    }
  }, [watchHistory, totalWatched, totalAvail])

  // ── Weekly goal ──
  const thisWeekStart = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - d.getDay())
    return d
  }, [])
  const thisWeekCount = useMemo(() =>
    Object.entries(watchHistory || {})
      .filter(([date]) => new Date(date) >= thisWeekStart)
      .reduce((sum, [, ids]) => sum + ids.length, 0)
  , [watchHistory, thisWeekStart])
  const goalPct = Math.min(100, Math.round((thisWeekCount / goal.weekly) * 100))

  // ── Overall ──
  const totalWatched = watchedTitles.length
  const totalAvail   = listTitles.length
  const pct          = totalAvail ? Math.round((totalWatched / totalAvail) * 100) : 0

  // ── Helpers ──
  function heatColor(count) {
    if (count === 0) return '#161616'
    const i = count / maxDayCount
    if (i < 0.34) return '#7f0000'
    if (i < 0.67) return '#b01020'
    return '#E81C2E'
  }

  function saveGoal() {
    const val = Math.max(1, Math.min(20, parseInt(goalInput) || 3))
    setGoalInput(String(val))
    onSetGoal({ weekly: val })
  }

  async function toggleReminder() {
    const next = !reminderOn
    if (next && 'Notification' in window) {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        alert('Please allow browser notifications to enable reminders.')
        return
      }
    }
    setReminderOn(next)
    onSetReminder({ time: reminderTime, enabled: next })
  }

  function saveReminderTime(t) {
    setReminderTime(t)
    onSetReminder({ time: t, enabled: reminderOn })
  }

  async function handleSaveCard() {
    setGenerating(true)
    try {
      await downloadShareCard({
        profile,
        watchedCount: totalWatched,
        totalHours,
        pct,
        watchStreak,
        topRated: topRated[0]?.title ?? null,
        bestEra,
      })
    } finally {
      setGenerating(false)
    }
  }

  function handleCopyStats() {
    const lines = [
      '🎬 MARVEL WATCH TRACKER',
      `👤 ${profile?.name ?? 'Marvel Fan'}`,
      '',
      `✅ ${totalWatched} titles · ⏱️ ${totalHours}h · ${pct}% complete`,
      `🎬 ${byType.movie.count} movies · 📺 ${byType.tv.count} TV · 🎨 ${byType.animated.count} animated`,
      bestBinge ? `🍿 Best binge: ${bestBinge.count} titles on ${bestBinge.date}` : '',
      `🔥 Watch streak: ${watchStreak}d  (best: ${watchBest}d)`,
      '',
      'ERA PROGRESS:',
      ...eraStats.map(e => `  ${e.label}: ${e.watchedCount}/${e.total} (${Math.round(e.watchedCount / e.total * 100)}%)`),
      '',
      "⚡ Racing to finish before Avengers: Doomsday!",
      '#MarvelWatchTracker',
    ].filter(Boolean).join('\n')
    navigator.clipboard.writeText(lines)
      .then(() => alert('Stats copied to clipboard!'))
      .catch(() => {})
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-28">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/96 backdrop-blur-md border-b border-[#161616]">
        <div className="max-w-lg mx-auto px-4 pt-12 pb-3">
          <h1 className="font-bebas text-[28px] tracking-[0.15em] text-white leading-none">STATS</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ── Runtime overview ── */}
        <div
          className="rounded-2xl border border-[#1e1e1e] p-5"
          style={{ background: 'linear-gradient(135deg, #120000 0%, #0f0f0f 100%)' }}
        >
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-3">Time Invested</div>
          <div className="flex items-end gap-2 mb-1">
            <span className="font-bebas text-5xl text-[#E81C2E] leading-none">{totalHours}</span>
            <span className="font-bebas text-xl text-[#444] leading-none mb-1">HOURS WATCHED</span>
          </div>
          <p className="text-[11px] text-[#444] mb-4">
            That's {endgameCount}× Avengers: Endgame rewatches
          </p>
          {/* Type breakdown bars */}
          <div className="space-y-1.5">
            {[
              { label: 'Movies',   key: 'movie',    color: '#E81C2E' },
              { label: 'TV',       key: 'tv',        color: '#60a5fa' },
              { label: 'Animated', key: 'animated',  color: '#a78bfa' },
            ].map(({ label, key, color }) => {
              const { count, mins } = byType[key]
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[10px] text-[#555] uppercase tracking-wider w-16 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0}%`, background: color }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#444] w-20 text-right shrink-0">
                    {count} · {Math.floor(mins / 60)}h
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Movies vs TV Donut ── */}
        {totalWatched > 0 && (
          <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
            <div className="text-[10px] text-[#555] uppercase tracking-widest mb-3">Movies vs TV</div>
            <div className="flex items-center gap-5">
              <DonutChart segments={[
                { pct: totalMinutes > 0 ? Math.round(byType.movie.mins / totalMinutes * 100)    : 0, color: '#E81C2E' },
                { pct: totalMinutes > 0 ? Math.round(byType.tv.mins / totalMinutes * 100)       : 0, color: '#60a5fa' },
                { pct: totalMinutes > 0 ? Math.round(byType.animated.mins / totalMinutes * 100) : 0, color: '#a78bfa' },
              ]} />
              <div className="flex-1 space-y-2.5">
                {[
                  { label: 'Movies',   key: 'movie',    color: '#E81C2E' },
                  { label: 'TV',       key: 'tv',       color: '#60a5fa' },
                  { label: 'Animated', key: 'animated', color: '#a78bfa' },
                ].map(({ label, key, color }) => {
                  const { count } = byType[key]
                  const pct = totalWatched > 0 ? Math.round(count / totalWatched * 100) : 0
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <span className="text-[11px] text-[#888]">{label}</span>
                        </div>
                        <span className="text-[11px] font-mono" style={{ color }}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Streaks + binge ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3">
            <div className="font-bebas text-3xl text-[#E81C2E] leading-none">
              {watchStreak}<span className="text-xl text-[#555]">d</span>
            </div>
            <div className="text-[9px] text-[#555] uppercase tracking-widest mt-0.5">Watch Streak</div>
            <div className="text-[10px] text-[#333] mt-0.5">Best: {watchBest}d</div>
          </div>
          {bestBinge ? (
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3">
              <div className="font-bebas text-3xl text-[#F5C518] leading-none">{bestBinge.count}</div>
              <div className="text-[9px] text-[#555] uppercase tracking-widest mt-0.5">Best Binge Day</div>
              <div className="text-[10px] text-[#333] mt-0.5">
                {new Date(bestBinge.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ) : (
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3 flex items-center justify-center">
              <span className="text-[#333] text-sm">No binge days yet</span>
            </div>
          )}
        </div>

        {/* ── Best Watch Day ── */}
        {bestWatchDay && (
          <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] text-[#555] uppercase tracking-widest">Best Watch Day</div>
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                style={{ background: '#F5C51815', color: '#F5C518', border: '1px solid #F5C51830' }}
              >
                {bestWatchDay.day} 🏆
              </span>
            </div>
            <div className="flex items-end gap-1 h-14">
              {bestWatchDay.counts.map((c, i) => {
                const isMax = bestWatchDay.counts[i] === Math.max(...bestWatchDay.counts)
                const pct = bestWatchDay.total > 0 ? c / Math.max(...bestWatchDay.counts) : 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm transition-all duration-700"
                      style={{
                        height: `${Math.max(3, pct * 44)}px`,
                        background: isMax ? '#F5C518' : '#2a2a2a',
                      }}
                    />
                    <span className="text-[8px]" style={{ color: isMax ? '#F5C518' : '#444' }}>
                      {bestWatchDay.days[i]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Weekly Goal ── */}
        <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-3">Weekly Goal</div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm text-white">{thisWeekCount} / {goal.weekly} this week</span>
            {goalPct >= 100 && <span className="text-[11px] text-[#F5C518] font-semibold">🏆 Goal Hit!</span>}
          </div>
          <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${goalPct}%`, background: goalPct >= 100 ? '#F5C518' : '#E81C2E' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#555]">Target:</span>
            <input
              type="number" min="1" max="20"
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              onBlur={saveGoal}
              className="w-14 bg-[#161616] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-white text-sm text-center focus:outline-none focus:border-[#E81C2E]/50"
            />
            <span className="text-[11px] text-[#555]">titles / week</span>
          </div>
        </div>

        {/* ── Era Completion ── */}
        <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] text-[#555] uppercase tracking-widest">Era Completion</div>
            {bestEra && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                style={{ background: '#E81C2E15', border: '1px solid #E81C2E30' }}>
                <span className="text-[9px]">🏆</span>
                <span className="text-[10px] font-bold text-[#E81C2E]">Most Watched: {bestEra}</span>
              </div>
            )}
          </div>
          {eraStats.map(e => (
            <EraBar key={e.key} label={e.label} total={e.total} watchedCount={e.watchedCount} color={e.color} />
          ))}
        </div>

        {/* ── Watch Pace (weekly bars) ── */}
        <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-3">
            Watch Pace (weekly since Aug 27 2025)
          </div>
          <div className="flex items-end gap-[2px] h-20 overflow-x-auto">
            {weeklyPace.map((w, i) => (
              <div
                key={i}
                className="flex-1 min-w-[10px] rounded-t-[2px] shrink-0"
                style={{
                  height: `${Math.max(4, (w.count / maxPace) * 72)}px`,
                  background: w.count > 0 ? '#E81C2E' : '#1a1a1a',
                  opacity: w.count > 0 ? 1 : 0.4,
                }}
                title={`${w.label}: ${w.count}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-[#333]">Aug 27 2025</span>
            <span className="text-[9px] text-[#333]">Now</span>
          </div>
        </div>

        {/* ── Watch Calendar Heatmap ── */}
        <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-3">Watch Calendar</div>
          <div className="flex gap-[3px] overflow-x-auto pb-1">
            {(() => {
              const weeks = []
              let week = []
              calendarData.forEach((day, i) => {
                week.push(day)
                if (day.dow === 6 || i === calendarData.length - 1) {
                  weeks.push(week); week = []
                }
              })
              return weeks.map((wk, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {wk.map((day, di) => (
                    <div
                      key={di}
                      className="w-3 h-3 rounded-[2px]"
                      style={{ background: heatColor(day.count) }}
                      title={`${day.date}: ${day.count} title${day.count !== 1 ? 's' : ''}`}
                    />
                  ))}
                </div>
              ))
            })()}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-2">
            <span className="text-[9px] text-[#444]">Less</span>
            {[0, 0.34, 0.67, 1].map((v, i) => (
              <div key={i} className="w-3 h-3 rounded-[2px]"
                style={{ background: heatColor(Math.round(v * maxDayCount)) }}/>
            ))}
            <span className="text-[9px] text-[#444]">More</span>
          </div>
        </div>

        {/* ── Ratings ── */}
        {ratedTitles.length > 0 && (
          <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] text-[#555] uppercase tracking-widest">Your Ratings</div>
              {avgRating && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#555]">Avg</span>
                  <span className="text-[13px] font-bold text-[#F5C518]">{avgRating}</span>
                  <span className="text-[10px] text-[#F5C518]">★</span>
                  <span className="text-[10px] text-[#444]">/ 5</span>
                </div>
              )}
            </div>

            {/* Top 5 rated */}
            {topRated.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] text-[#F5C518] uppercase tracking-widest mb-2">⭐ Top Rated</div>
                {topRated.map((t, i) => (
                  <div key={t.id}
                    className="flex items-center gap-3 py-2 rounded-xl px-2 -mx-2 mb-1 last:mb-0"
                    style={{ background: i === 0 ? '#F5C51808' : 'transparent' }}
                  >
                    <span className="text-[11px] font-bold w-4 shrink-0 text-center"
                      style={{ color: i === 0 ? '#F5C518' : '#333' }}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-white truncate font-medium">{t.title}</p>
                      <p className="text-[9px] text-[#444] capitalize">{t.type}</p>
                    </div>
                    <Stars count={ratings[t.id]} size={i === 0 ? 'text-base' : 'text-sm'} />
                  </div>
                ))}
              </div>
            )}

            {bottomRated.length > 0 && (
              <div>
                <div className="text-[9px] text-[#555] uppercase tracking-widest mb-2">👎 Lowest Rated</div>
                {bottomRated.map(t => (
                  <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-[#161616] last:border-0">
                    <span className="text-[12px] text-white truncate flex-1 mr-3">{t.title}</span>
                    <Stars count={ratings[t.id]} color="#555" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── IMDb vs Your Rating ── */}
        {imdbComparison && (
          <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
            <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1">IMDb vs Your Rating</div>
            <div className="text-[9px] text-[#333] mb-3">Based on {imdbComparison.count} titles you've rated</div>
            {[
              { label: 'Your Average', value: Number(imdbComparison.userAvg), color: '#F5C518' },
              { label: 'IMDb Average', value: Number(imdbComparison.imdbAvg), color: '#60a5fa' },
            ].map(({ label, value, color }) => (
              <div key={label} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] text-[#888]">{label}</span>
                  <span className="text-[13px] font-bold font-mono" style={{ color }}>
                    {value.toFixed(1)}<span className="text-[10px] text-[#444]">/5</span>
                  </span>
                </div>
                <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(value / 5) * 100}%`, background: color }} />
                </div>
              </div>
            ))}
            <div className="mt-3 text-center text-[10px]"
              style={{ color: Number(imdbComparison.userAvg) > Number(imdbComparison.imdbAvg) ? '#4ade80' : '#f87171' }}>
              {Number(imdbComparison.userAvg) > Number(imdbComparison.imdbAvg)
                ? `You rate ${(Number(imdbComparison.userAvg) - Number(imdbComparison.imdbAvg)).toFixed(1)}★ higher than IMDb consensus`
                : Number(imdbComparison.userAvg) < Number(imdbComparison.imdbAvg)
                ? `You rate ${(Number(imdbComparison.imdbAvg) - Number(imdbComparison.userAvg)).toFixed(1)}★ lower than IMDb consensus`
                : 'Your ratings perfectly match IMDb consensus'}
            </div>
          </div>
        )}

        {/* ── Favorite Character ── */}
        {favoriteChar && (
          <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
            <div className="text-[10px] text-[#555] uppercase tracking-widest mb-3">Favorite Character</div>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background: `radial-gradient(ellipse at center, ${favoriteChar.bg ?? '#111'} 0%, #0a0a0a 100%)`,
                  border: `1.5px solid ${favoriteChar.color ?? '#333'}30`,
                  boxShadow: `0 0 20px ${favoriteChar.color ?? '#333'}20`,
                  filter: `drop-shadow(0 0 8px ${favoriteChar.color ?? '#333'}40)`,
                }}
              >
                {favoriteChar.symbol ?? '🦸'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bebas text-2xl tracking-widest leading-tight text-white">
                  {favoriteChar.alias}
                </div>
                <div className="text-[11px] text-[#555] mb-1">{favoriteChar.name}</div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide"
                    style={{
                      background: favoriteChar.affiliation === 'villain' ? '#E81C2E15' : '#F5C51815',
                      color:      favoriteChar.affiliation === 'villain' ? '#E81C2E'   : '#F5C518',
                    }}
                  >
                    {favoriteChar.affiliation}
                  </span>
                  <span className="text-[10px] text-[#444]">
                    in {favoriteChar.watchedCount} of your watched titles
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Watch Time vs Average ── */}
        {totalHours > 0 && (
          <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
            <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Watch Time Comparison</div>
            <div className="text-[9px] text-[#333] mb-3">Your hours vs estimated app average</div>
            {[
              { label: 'You',          value: totalHours, color: '#E81C2E' },
              { label: 'App Average',  value: 62,         color: '#555' },
              { label: 'Completionist',value: Math.floor(listTitles.reduce((s, t) => s + getRuntimeMinutes(t), 0) / 60), color: '#F5C518' },
            ].map(({ label, value, color }) => {
              const maxHours = Math.floor(listTitles.reduce((s, t) => s + getRuntimeMinutes(t), 0) / 60)
              return (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px]" style={{ color: label === 'You' ? '#ccc' : '#555' }}>{label}</span>
                    <span className="text-[11px] font-mono" style={{ color }}>{value}h</span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (value / maxHours) * 100)}%`, background: color }} />
                  </div>
                </div>
              )
            })}
            <div className="mt-2 text-[9px] text-[#333] text-center">
              Friends comparison available when social features launch
            </div>
          </div>
        )}

        {/* ── Completion Prediction ── */}
        {completionPrediction && (
          <div
            className="rounded-2xl border p-4"
            style={{
              background: 'linear-gradient(135deg, #080012 0%, #0f0f0f 100%)',
              borderColor: completionPrediction.done ? '#F5C51830' : '#a78bfa30',
            }}
          >
            <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Completion Prediction</div>
            {completionPrediction.done ? (
              <div className="text-center py-2">
                <div className="text-4xl mb-2">🏆</div>
                <div className="font-bebas text-2xl tracking-widest text-[#F5C518]">YOU DID IT!</div>
                <div className="text-[12px] text-[#888] mt-1">100% complete — true Marvel champion</div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-bebas text-4xl leading-none" style={{ color: '#a78bfa' }}>
                    {completionPrediction.finishDate.split(',')[0].split(' ')[1]}
                  </div>
                  <div className="font-bebas text-lg leading-none text-white/60">
                    {completionPrediction.finishDate.split(' ')[0]}
                  </div>
                  <div className="font-bebas text-sm leading-none text-white/30">
                    {completionPrediction.finishDate.split(',')[1]?.trim()}
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="text-[11px] text-[#888]">Estimated finish date</div>
                  <div className="text-[11px] text-[#555]">
                    at your pace of <span className="text-[#a78bfa] font-semibold">{completionPrediction.pacePerWeek} titles/week</span>
                  </div>
                  <div className="text-[11px] text-[#555]">
                    <span className="text-white/40">{totalAvail - totalWatched}</span> titles remaining
                    · <span className="text-white/40">{completionPrediction.daysToFinish}</span> days to go
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Reminders ── */}
        <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-3">Daily Reminder</div>
          <div className="flex items-center gap-3">
            <input
              type="time"
              value={reminderTime}
              onChange={e => saveReminderTime(e.target.value)}
              className="bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E81C2E]/50"
            />
            <button
              onClick={toggleReminder}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                reminderOn
                  ? 'bg-[#E81C2E] border-[#E81C2E] text-white'
                  : 'bg-[#151515] border-[#222] text-[#555] hover:text-white'
              }`}
            >
              {reminderOn ? '🔔 Reminder ON' : '🔕 Enable Reminder'}
            </button>
          </div>
          {reminderOn && (
            <p className="text-[10px] text-[#444] mt-2">
              Notify me at {reminderTime} to keep watching (requires page to be open).
            </p>
          )}
        </div>

        {/* ── Marvel Wrapped ── */}
        <MarvelWrapped
          watched={watched}
          watchHistory={watchHistory}
          ratings={ratings}
          listTitles={listTitles}
          profile={profile}
        />

        {/* ── Watch Planner ── */}
        {planner !== undefined && onScheduleTitle && titles && (
          <WatchPlanner
            planner={planner}
            onScheduleTitle={onScheduleTitle}
            titles={titles}
          />
        )}

        {/* ── Watch History Timeline ── */}
        <WatchHistoryTimeline
          watchHistory={watchHistory}
          listTitles={listTitles}
        />

        {/* ── Trivia History ── */}
        <TriviaHistorySection triviaState={triviaState}/>

        {/* ── Shareable card ── */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <button
            onClick={handleCopyStats}
            className="py-3.5 rounded-xl font-bebas text-lg tracking-widest border border-[#1e1e1e] text-[#777] hover:text-white hover:border-[#333] transition-all"
          >
            📋 COPY STATS
          </button>
          <button
            onClick={handleSaveCard}
            disabled={generating}
            className="py-3.5 rounded-xl font-bebas text-lg tracking-widest text-white transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #E81C2E 0%, #b01020 100%)',
              boxShadow: '0 0 16px rgba(232,28,46,0.3)',
            }}
          >
            {generating ? 'SAVING…' : '📊 SAVE CARD'}
          </button>
        </div>
      </div>
    </div>
  )
}
