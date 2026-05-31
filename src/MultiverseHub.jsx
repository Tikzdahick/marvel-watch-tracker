/**
 * MultiverseHub — neutral multi-franchise hub home page.
 * Shows all 4 universes as equal portal tiles with live cross-franchise stats.
 */
import { useMemo, useState, useEffect } from 'react'
import { DC_TITLES } from './data/dcTitles.js'
import { HP_TITLES } from './data/hpTitles.js'
import { SW_TITLES } from './data/swTitles.js'
import { AvatarDisplay } from './AvatarDisplay.jsx'

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadJSON(k, fb) { try { const r = localStorage.getItem(k); if (r) return JSON.parse(r) } catch {} return fb }

// ── Franchise definitions ─────────────────────────────────────────────────────
const FRANCHISES = [
  {
    id:        'marvel',
    name:      'MARVEL',
    sub:       'Cinematic Universe',
    color:     '#E81C2E',
    bg:        'rgba(232,28,46,0.06)',
    glow:      'rgba(232,28,46,0.25)',
    watchKey:  'mvt-watched-v1',
    emoji:     null,
    logo:      'M',
    logoStyle: { background: 'linear-gradient(135deg, #E81C2E 0%, #a0001a 100%)', color: '#fff', borderRadius: 16 },
    tagline:   'Assemble the Infinity Saga',
  },
  {
    id:        'dc',
    name:      'DC',
    sub:       'Universe',
    color:     '#FFD700',
    bg:        'rgba(255,215,0,0.04)',
    glow:      'rgba(255,215,0,0.22)',
    watchKey:  'dc-watched-v1',
    emoji:     null,
    logo:      'DC',
    logoStyle: {
      background: 'linear-gradient(135deg, #FFD700 0%, #d4a017 100%)',
      color: '#000',
      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    },
    tagline:   'Gotham. Metropolis. Beyond.',
  },
  {
    id:        'hp',
    name:      'HARRY POTTER',
    sub:       'Wizarding World',
    color:     '#c9a227',
    bg:        'rgba(201,162,39,0.05)',
    glow:      'rgba(201,162,39,0.22)',
    watchKey:  'hp-watched-v1',
    emoji:     '⚡',
    logo:      null,
    logoStyle: { background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1555 100%)', border: '1px solid rgba(201,162,39,0.4)' },
    tagline:   'Hogwarts awaits.',
  },
  {
    id:        'sw',
    name:      'STAR WARS',
    sub:       'The Skywalker Saga & beyond',
    color:     '#ffe81f',
    bg:        'rgba(255,232,31,0.03)',
    glow:      'rgba(255,232,31,0.18)',
    watchKey:  'sw-watched-v1',
    emoji:     '⚔️',
    logo:      null,
    logoStyle: { background: '#000', border: '1px solid rgba(255,232,31,0.35)' },
    tagline:   'May the Force be with you.',
  },
]

// Total countable titles per franchise (non-comingSoon)
const FRANCHISE_TOTALS = {
  marvel: null, // passed in from app (varies by listSize)
  dc:     DC_TITLES.filter(t => !t.comingSoon).length,
  hp:     HP_TITLES.filter(t => !t.comingSoon).length,
  sw:     SW_TITLES.filter(t => !t.comingSoon).length,
}

// ── Star field ────────────────────────────────────────────────────────────────
function StarField() {
  const stars = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    x: (i * 43 + 11) % 100, y: (i * 67 + 19) % 100,
    size: i % 5 === 0 ? 2 : i % 8 === 0 ? 3 : 1,
    opacity: 0.08 + (i % 6) * 0.06,
    color: i % 4 === 0 ? '#E81C2E' : i % 4 === 1 ? '#FFD700' : i % 4 === 2 ? '#c9a227' : '#ffe81f',
  })), [])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: s.color, opacity: s.opacity }}/>
      ))}
    </div>
  )
}

// ── Multiverse Logo ───────────────────────────────────────────────────────────
function MultiLogo({ size = 48 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38
  const rings = ['#E81C2E', '#FFD700', '#c9a227', '#ffe81f']
  const angles = [0, 90, 180, 270]
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer orbit ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>
      {/* Franchise dots on orbit */}
      {rings.map((color, i) => {
        const angle = (angles[i] * Math.PI) / 180
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        return <circle key={i} cx={x} cy={y} r={size * 0.07} fill={color} style={{ filter: `drop-shadow(0 0 ${size*0.05}px ${color})` }}/>
      })}
      {/* Center M */}
      <text x={cx} y={cy + size * 0.12} textAnchor="middle"
        style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: size * 0.38, fill: '#fff', letterSpacing: '0.05em' }}>
        MT
      </text>
    </svg>
  )
}

// ── Daily cross-franchise challenge ──────────────────────────────────────────
const DAILY_CHALLENGES = [
  { icon: '🎯', text: 'Watch one film from a universe you haven\'t visited in a while.', franchise: null },
  { icon: '⚔️', text: 'Pick the franchise you\'re furthest behind in and watch one title today.', franchise: null },
  { icon: '🦸', text: 'Start the franchise you\'ve never opened — every multiverse begins with a first step.', franchise: null },
  { icon: '📺', text: 'Watch at least one TV episode from any franchise today.', franchise: null },
  { icon: '🌟', text: 'Find a title with over 90% Rotten Tomatoes and watch it tonight.', franchise: null },
  { icon: '⚡', text: 'Complete an entire era in any franchise — start to finish.', franchise: null },
  { icon: '🔄', text: 'Rewatch your all-time favourite movie from any universe.', franchise: null },
  { icon: '🎬', text: 'Watch a film you\'ve been putting off for months. Today\'s the day.', franchise: null },
  { icon: '🏆', text: 'Watch the highest-rated film in whichever universe you\'ve completed least.', franchise: null },
  { icon: '🌌', text: 'Watch one film from each of two different universes today.', franchise: null },
  { icon: '🧙', text: 'Visit Hogwarts — pick any Harry Potter film and let the magic begin.', franchise: 'hp' },
  { icon: '🔵', text: 'Feel the Force — pick any Star Wars episode and continue the Skywalker Saga.', franchise: 'sw' },
  { icon: '🦇', text: 'Enter Gotham — watch a Batman film from any era tonight.', franchise: 'dc' },
  { icon: '🦾', text: 'Suit up — watch an Iron Man or Avengers film in the MCU tonight.', franchise: 'marvel' },
]

function getDailyChallenge() {
  const daysSinceEpoch = Math.floor(Date.now() / 86400000)
  return DAILY_CHALLENGES[daysSinceEpoch % DAILY_CHALLENGES.length]
}

// ── Featured title pool (one per franchise, rotates weekly) ──────────────────
const FEATURED_POOL = [
  { franchise: 'marvel', title: 'Avengers: Endgame',        year: 2019, why: 'The greatest superhero event ever filmed.',           color: '#E81C2E' },
  { franchise: 'marvel', title: 'Captain America: The Winter Soldier', year: 2014, why: 'MCU\'s finest political thriller.', color: '#4a9eff' },
  { franchise: 'dc',     title: 'The Dark Knight',           year: 2008, why: 'The greatest comic book film ever made.',             color: '#FFD700' },
  { franchise: 'dc',     title: 'The Batman',                year: 2022, why: 'Robert Pattinson redefines the Dark Knight.',        color: '#c0c0c0' },
  { franchise: 'hp',     title: "Harry Potter and the Prisoner of Azkaban", year: 2004, why: 'Alfonso Cuarón\'s darkest, most beautiful HP film.', color: '#c9a227' },
  { franchise: 'hp',     title: 'Harry Potter and the Deathly Hallows Part 2', year: 2011, why: 'The epic conclusion to an era. Tissues required.', color: '#9b59b6' },
  { franchise: 'sw',     title: 'Star Wars: The Empire Strikes Back', year: 1980, why: 'The greatest sequel in cinema history.',       color: '#ffe81f' },
  { franchise: 'sw',     title: 'Andor S1',                  year: 2022, why: 'The most mature, intelligent Star Wars ever told.',   color: '#4a9eff' },
  { franchise: 'marvel', title: 'Thor: Ragnarok',            year: 2017, why: 'Taika Waititi\'s joyful reinvention of Marvel.',     color: '#a855f7' },
  { franchise: 'dc',     title: 'Peacemaker S1',             year: 2022, why: 'Wildly funny, surprisingly deep. Best DC show.',     color: '#3498db' },
  { franchise: 'sw',     title: 'The Mandalorian S1',        year: 2019, why: 'This is the way. A modern classic.',                  color: '#95a5a6' },
  { franchise: 'hp',     title: 'Harry Potter and the Goblet of Fire', year: 2005, why: 'Darker, bigger, Voldemort is back.',        color: '#e74c3c' },
]

function getFeaturedTitle() {
  const weeksSinceEpoch = Math.floor(Date.now() / (7 * 86400000))
  return FEATURED_POOL[weeksSinceEpoch % FEATURED_POOL.length]
}

const FRANCHISE_EMOJIS = { marvel: '🔴', dc: '⚡', hp: '⚡', sw: '⭐' }

// ── Franchise Tile ────────────────────────────────────────────────────────────
function FranchiseTile({ f, watchedCount, total, onSelect }) {
  const pct = total > 0 ? Math.round((watchedCount / total) * 100) : 0
  return (
    <button
      onClick={() => onSelect(f.id)}
      className="relative flex flex-col gap-3 p-4 rounded-2xl text-left transition-all active:scale-[0.96] group overflow-hidden"
      style={{ background: f.bg, border: `1px solid ${f.color}33`, boxShadow: `0 0 0 0 ${f.glow}` }}
    >
      {/* Portal glow pulse on hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all group-hover:opacity-100 opacity-0"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${f.glow} 0%, transparent 70%)` }}/>

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 font-black text-[15px] relative z-10"
          style={{ ...f.logoStyle, width: 40, height: 40, boxShadow: `0 0 16px ${f.glow}` }}>
          {f.emoji ?? f.logo}
        </div>
        <div className="relative z-10">
          <div className="font-bebas text-[16px] tracking-widest text-white leading-none">{f.name}</div>
          <div className="text-[9px] tracking-wider mt-0.5" style={{ color: f.color + 'aa' }}>{f.sub}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-semibold" style={{ color: f.color }}>{watchedCount} / {total}</span>
          <span className="text-[11px] font-bold" style={{ color: pct === 100 ? f.color : '#555' }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: f.color, boxShadow: `0 0 6px ${f.color}66` }}/>
        </div>
      </div>

      {/* Enter CTA */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[9px] italic" style={{ color: '#555' }}>{f.tagline}</span>
        <div className="text-[10px] font-bold px-3 py-1 rounded-lg transition-all group-hover:opacity-100 opacity-70"
          style={{ background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}33` }}>
          ENTER →
        </div>
      </div>
    </button>
  )
}

// ── Main Hub ──────────────────────────────────────────────────────────────────
export default function MultiverseHub({ profile, marvelWatched, marvelTotal, xp, onSelectFranchise, onNavigateMarvel }) {
  const firstName = (profile?.name ?? 'Explorer').split(' ')[0]

  // Read cross-franchise watched counts (live from localStorage)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    // Re-read when tab gains focus (catches updates from other franchise trackers)
    const handler = () => setTick(t => t + 1)
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])

  const dcWatched  = useMemo(() => new Set(loadJSON('dc-watched-v1', [])),  [tick])
  const hpWatched  = useMemo(() => new Set(loadJSON('hp-watched-v1', [])),  [tick])
  const swWatched  = useMemo(() => new Set(loadJSON('sw-watched-v1', [])),  [tick])

  const marvelWatchedCount = marvelWatched?.size ?? 0
  const dcWatchedCount     = DC_TITLES.filter(t => !t.comingSoon && dcWatched.has(t.id)).length
  const hpWatchedCount     = HP_TITLES.filter(t => !t.comingSoon && hpWatched.has(t.id)).length
  const swWatchedCount     = SW_TITLES.filter(t => !t.comingSoon && swWatched.has(t.id)).length

  const totalWatched = marvelWatchedCount + dcWatchedCount + hpWatchedCount + swWatchedCount
  const totalTitles  = (marvelTotal ?? 0) + FRANCHISE_TOTALS.dc + FRANCHISE_TOTALS.hp + FRANCHISE_TOTALS.sw
  const overallPct   = totalTitles > 0 ? Math.round((totalWatched / totalTitles) * 100) : 0

  const challenge = useMemo(getDailyChallenge, [])
  const featured  = useMemo(getFeaturedTitle,  [])

  const watchCounts = {
    marvel: marvelWatchedCount,
    dc:     dcWatchedCount,
    hp:     hpWatchedCount,
    sw:     swWatchedCount,
  }

  const totals = {
    marvel: marvelTotal ?? FRANCHISE_TOTALS.dc, // fallback
    dc:     FRANCHISE_TOTALS.dc,
    hp:     FRANCHISE_TOTALS.hp,
    sw:     FRANCHISE_TOTALS.sw,
  }

  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen pb-24" style={{ background: '#04060f' }}>
      {/* ── Hero header ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #04060f 0%, #060b18 60%, #04060f 100%)', minHeight: 210 }}>
        <StarField/>
        {/* Central glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)' }}/>

        <div className="relative max-w-lg mx-auto px-5 pt-10 pb-16">
          {/* Logo + title row */}
          <div className="flex items-center gap-4 mb-6">
            <MultiLogo size={52}/>
            <div>
              <div className="text-[9px] tracking-[0.5em] uppercase font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                WELCOME TO THE
              </div>
              <div className="font-bebas text-[26px] tracking-[0.15em] leading-none text-white">
                MULTIVERSE TRACKER
              </div>
            </div>
          </div>

          {/* Welcome + avatar */}
          <div className="flex items-center gap-3">
            <AvatarDisplay avatar={profile?.avatar} name={profile?.name} size="home"/>
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Explorer</div>
              <div className="font-bebas text-[28px] text-white tracking-wide leading-none">{firstName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-lg mx-auto px-4 w-full space-y-4 mt-4">

        {/* ── Combined stats ── */}
        <div className="rounded-2xl p-4" style={{ background: '#0a0d18', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[9px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
            🌌 Multiverse Progress
          </div>
          <div className="flex items-end gap-4 mb-3">
            <div>
              <span className="font-bebas text-5xl text-white leading-none">{totalWatched}</span>
              <span className="text-sm ml-2" style={{ color: 'rgba(255,255,255,0.35)' }}>/ {totalTitles} titles</span>
            </div>
            <div className="pb-1">
              <div className="font-bebas text-2xl leading-none" style={{ color: overallPct > 50 ? '#ffe81f' : overallPct > 25 ? '#c9a227' : '#E81C2E' }}>
                {overallPct}%
              </div>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>complete</div>
            </div>
          </div>
          {/* 4-segment progress bar */}
          <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {FRANCHISES.map(f => {
              const w = watchCounts[f.id]; const t = totals[f.id]
              const pct = totalTitles > 0 ? (w / totalTitles) * 100 : 0
              return <div key={f.id} style={{ width: `${pct}%`, background: f.color, transition: 'width 0.7s ease' }}/>
            })}
          </div>
          {/* Legend */}
          <div className="flex gap-3 mt-2 flex-wrap">
            {FRANCHISES.map(f => (
              <div key={f.id} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: f.color }}/>
                <span className="text-[8px] uppercase tracking-wider" style={{ color: f.color + '99' }}>{f.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          {/* Per-franchise quick stats */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {FRANCHISES.map(f => {
              const w = watchCounts[f.id]; const t = totals[f.id]
              return (
                <div key={f.id} className="rounded-xl p-2 text-center" style={{ background: `${f.color}08`, border: `1px solid ${f.color}1a` }}>
                  <div className="font-bold text-[15px] leading-none mb-0.5" style={{ color: f.color }}>{w}</div>
                  <div className="text-[7px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>{f.name.split(' ')[0].slice(0,6)}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── XP display (if passed in) ── */}
        {xp != null && (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: '#0a0d18', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-2xl">⚡</span>
            <div className="flex-1">
              <div className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Multiverse XP</div>
              <div className="font-bebas text-xl text-white">{(xp ?? 0).toLocaleString()} XP</div>
            </div>
            <div className="text-[9px] font-semibold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(255,232,31,0.1)', color: '#ffe81f', border: '1px solid rgba(255,232,31,0.2)' }}>
              Explorer
            </div>
          </div>
        )}

        {/* ── Daily Multiverse Challenge ── */}
        <div className="rounded-2xl p-4" style={{ background: '#0a0d18', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.25)' }}>
              🎯 Daily Multiverse Challenge
            </div>
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{todayFormatted}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none flex-shrink-0 mt-0.5">{challenge.icon}</span>
            <p className="text-[13px] leading-relaxed text-white font-medium">{challenge.text}</p>
          </div>
          {challenge.franchise && (
            <button onClick={() => onSelectFranchise(challenge.franchise)}
              className="mt-3 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all active:scale-[0.97]"
              style={{ background: FRANCHISES.find(f => f.id === challenge.franchise)?.color + '18',
                color: FRANCHISES.find(f => f.id === challenge.franchise)?.color,
                border: `1px solid ${FRANCHISES.find(f => f.id === challenge.franchise)?.color}33` }}>
              Open {FRANCHISES.find(f => f.id === challenge.franchise)?.name} →
            </button>
          )}
        </div>

        {/* ── 4 Franchise tiles ── */}
        <div>
          <div className="text-[9px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Choose Your Universe
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FRANCHISES.map(f => (
              <FranchiseTile
                key={f.id}
                f={f}
                watchedCount={watchCounts[f.id]}
                total={totals[f.id]}
                onSelect={onSelectFranchise}
              />
            ))}
          </div>
        </div>

        {/* ── Featured Title of the Week ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0d18', border: `1px solid ${featured.color}25` }}>
          <div className="px-4 pt-4 pb-2">
            <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: featured.color + '99' }}>
              ✦ Featured This Week
            </div>
          </div>
          <button onClick={() => onSelectFranchise(featured.franchise)}
            className="w-full flex items-center gap-4 px-4 pb-4 text-left transition-all active:scale-[0.99] group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${featured.color}12`, border: `1px solid ${featured.color}25` }}>
              {FRANCHISE_EMOJIS[featured.franchise]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[14px] text-white leading-snug group-hover:opacity-80 transition-opacity">
                {featured.title}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: featured.color + '99' }}>
                {FRANCHISES.find(f => f.id === featured.franchise)?.name} · {featured.year}
              </div>
              <p className="text-[11px] mt-1 leading-snug" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {featured.why}
              </p>
            </div>
            <div className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex-shrink-0"
              style={{ background: `${featured.color}15`, color: featured.color, border: `1px solid ${featured.color}30` }}>
              Watch →
            </div>
          </button>
        </div>

        {/* ── Footer ── */}
        <div className="text-center pb-4 space-y-1">
          <div className="text-[9px] uppercase tracking-[0.4em]" style={{ color: 'rgba(255,255,255,0.1)' }}>Multiverse Tracker</div>
          <div className="text-[8px]" style={{ color: 'rgba(255,255,255,0.06)' }}>Marvel · DC · Harry Potter · Star Wars</div>
        </div>
      </div>
    </div>
  )
}
