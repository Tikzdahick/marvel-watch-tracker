import { useMemo, useState, useEffect } from 'react'
import { MULTIVERSE_NEWS, FRANCHISE_META } from './data/multiverseNews.js'

const TODAY = new Date()

function getCountdown(dateStr) {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  const days    = Math.floor(diff / 86400000)
  const hours   = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds, total: diff }
}

function formatDate(dateStr) {
  if (!dateStr) return 'TBA'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function CountdownBadge({ dateStr }) {
  const [cd, setCd] = useState(() => getCountdown(dateStr))
  useEffect(() => {
    if (!dateStr) return
    const t = setInterval(() => setCd(getCountdown(dateStr)), 1000)
    return () => clearInterval(t)
  }, [dateStr])
  if (!cd) return null
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {cd.days > 0 && (
        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
          {cd.days}d
        </span>
      )}
      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
        {String(cd.hours).padStart(2,'0')}h
      </span>
      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
        {String(cd.minutes).padStart(2,'0')}m
      </span>
      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
        {String(cd.seconds).padStart(2,'0')}s
      </span>
    </div>
  )
}

export default function MultiverseNews() {
  const [filter, setFilter] = useState('all') // 'all'|'upcoming'|'released'|franchise id

  const sorted = useMemo(() => {
    const items = MULTIVERSE_NEWS.filter(n => {
      if (filter === 'upcoming') return !n.released
      if (filter === 'released') return n.released
      if (['marvel','dc','hp','sw'].includes(filter)) return n.franchise === filter
      return true
    })
    // Upcoming sorted by date ASC (earliest first), TBA at bottom
    // Released sorted by date DESC (most recent first)
    const upcoming = items.filter(n => !n.released).sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(a.date) - new Date(b.date)
    })
    const released = items.filter(n => n.released).sort((a, b) => new Date(b.date) - new Date(a.date))
    return { upcoming, released }
  }, [filter])

  const FILTERS = [
    { id: 'all',      label: 'All',          color: '#fff' },
    { id: 'upcoming', label: 'Upcoming',     color: '#4ade80' },
    { id: 'released', label: 'Released',     color: '#60a5fa' },
    { id: 'marvel',   label: 'Marvel',       color: '#E81C2E' },
    { id: 'dc',       label: 'DC',           color: '#FFD700' },
    { id: 'hp',       label: 'Harry Potter', color: '#c9a227' },
    { id: 'sw',       label: 'Star Wars',    color: '#ffe81f' },
  ]

  function NewsCard({ item }) {
    const meta = FRANCHISE_META[item.franchise]
    const isUpcoming = !item.released
    const hasCd = isUpcoming && item.date
    return (
      <div className="rounded-2xl overflow-hidden"
        style={{ background: '#0a0d18', border: `1px solid ${isUpcoming ? meta.color + '35' : 'rgba(255,255,255,0.05)'}` }}>
        {/* Header row */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          {/* Franchise logo */}
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-[13px] font-black"
            style={{ ...meta.logoStyle, width: 32, height: 32, fontSize: 13 }}>
            {meta.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: `${meta.color}18`, color: meta.color }}>
                {meta.name}
              </span>
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                {item.type === 'tv' ? 'TV SERIES' : 'FILM'}
              </span>
              {item.released ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa' }}>
                  ✓ RELEASED
                </span>
              ) : (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                  UPCOMING
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Title + date */}
        <div className="px-4 pb-2">
          <h3 className="font-bebas text-[18px] tracking-wide text-white leading-none">{item.title}</h3>
          <p className="text-[10px] mt-0.5" style={{ color: isUpcoming ? meta.color : 'rgba(255,255,255,0.3)' }}>
            {formatDate(item.date)}
          </p>
        </div>

        {/* Description */}
        <div className="px-4 pb-3">
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {item.desc}
          </p>
        </div>

        {/* Countdown */}
        {hasCd && (
          <div className="px-4 pb-4 flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Releases in
            </span>
            <CountdownBadge dateStr={item.date}/>
          </div>
        )}
      </div>
    )
  }

  const upcomingCount  = MULTIVERSE_NEWS.filter(n => !n.released).length
  const releasedCount  = MULTIVERSE_NEWS.filter(n =>  n.released).length

  return (
    <div className="min-h-screen pb-28" style={{ background: '#04060f' }}>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bebas text-[28px] tracking-[0.12em] text-white leading-none">📰 NEWS FEED</h1>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {upcomingCount} upcoming · {releasedCount} recent
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
              style={filter === f.id
                ? { background: f.color, color: f.id === 'all' ? '#000' : ['marvel','dc','hp','sw','released','upcoming'].includes(f.id) ? '#000' : '#000' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Upcoming section */}
        {sorted.upcoming.length > 0 && (
          <div>
            <div className="text-[9px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#4ade80' }}>
              🚀 UPCOMING RELEASES
            </div>
            <div className="space-y-3">
              {sorted.upcoming.map(item => <NewsCard key={item.id} item={item}/>)}
            </div>
          </div>
        )}

        {/* Released section */}
        {sorted.released.length > 0 && (
          <div>
            <div className="text-[9px] uppercase tracking-widest font-semibold mb-3 mt-2" style={{ color: '#60a5fa' }}>
              ✓ RECENTLY RELEASED
            </div>
            <div className="space-y-3">
              {sorted.released.map(item => <NewsCard key={item.id} item={item}/>)}
            </div>
          </div>
        )}

        {sorted.upcoming.length === 0 && sorted.released.length === 0 && (
          <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <div className="text-4xl mb-3">📰</div>
            <p className="text-[12px]">No news for this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
