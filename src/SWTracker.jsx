/**
 * SWTracker — Star Wars tracker.
 * Self-contained; all state under sw- prefixed localStorage keys.
 */
import { useState, useEffect, useMemo } from 'react'
import { SW_TITLES } from './data/swTitles.js'
import { SW_ERAS } from './data/swEras.js'
import { SW_CHARACTERS } from './data/swCharacters.js'
import { getSWRank, getNextSWRank } from './data/swRanks.js'
import { SW_LIGHTSABER_COLORS, SW_PLANETS, SW_FORCE_SIDES, SW_GROUPS } from './data/swExtras.js'
import { AvatarDisplay } from './AvatarDisplay.jsx'

// ── Constants ─────────────────────────────────────────────────────────────────
const SK_WATCHED = 'sw-watched-v1'
const SK_HISTORY = 'sw-watch-history'
const SK_FORCE_AFFINITY = 'sw-force-affinity'

const YELLOW  = '#ffe81f'
const BLUE    = '#4a9eff'
const BG      = '#000000'
const BG_CARD = '#0a0a0a'
const BG_CARD2 = '#0f0f0f'
const BORDER  = '#1a1a1a'
const TEXT_DIM  = '#333'
const TEXT_MID  = '#666'
const TEXT_MAIN = '#ccc'

function loadJSON(k, fb) { try { const r = localStorage.getItem(k); if (r) return JSON.parse(r) } catch {} return fb }
function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

// ── Star Field Background ─────────────────────────────────────────────────────
function SpaceStars({ count = 60 }) {
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: (i * 41 + 7) % 100, y: (i * 67 + 11) % 100,
    size: i % 5 === 0 ? 2 : 1, opacity: 0.15 + (i % 4) * 0.1,
  })), [])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
            background: i % 7 === 0 ? YELLOW : i % 5 === 0 ? BLUE : '#fff', opacity: s.opacity }}/>
      ))}
    </div>
  )
}

// ── Lightsaber glow divider ───────────────────────────────────────────────────
function SaberDivider({ color = YELLOW }) {
  return (
    <div className="w-full h-[1px] my-1"
      style={{ background: `linear-gradient(90deg, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%)`,
        boxShadow: `0 0 6px ${color}66` }}/>
  )
}

// ── Check circle ─────────────────────────────────────────────────────────────
function SWCheck({ watched, comingSoon }) {
  if (comingSoon) return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ border: `2px solid ${YELLOW}33`, background: BG_CARD }}>
      <span className="text-[11px]">⏳</span>
    </div>
  )
  return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
      style={watched
        ? { background: `linear-gradient(135deg, ${YELLOW} 0%, #a88a00 100%)`, boxShadow: `0 0 10px ${YELLOW}55` }
        : { border: `2px solid ${BORDER}`, background: '#050505' }}>
      {watched && <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
    </div>
  )
}

// ── Lightsaber Color Tracker ──────────────────────────────────────────────────
function LightsaberTracker({ watched }) {
  const seen = useMemo(() => {
    const s = new Set()
    watched.forEach(id => {
      SW_LIGHTSABER_COLORS.forEach(c => { if (c.filmIds.includes(id)) s.add(c.key) })
    })
    return s
  }, [watched])

  return (
    <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid rgba(74,158,255,0.2)` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: BLUE }}>⚔️ Lightsaber Colors</div>
        <span className="text-[10px] font-bold" style={{ color: TEXT_DIM }}>{seen.size}/{SW_LIGHTSABER_COLORS.length}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SW_LIGHTSABER_COLORS.map(c => {
          const unlocked = seen.has(c.key)
          return (
            <div key={c.key} className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: BG_CARD, border: `1px solid ${unlocked ? c.color + '40' : BORDER}`, opacity: unlocked ? 1 : 0.4 }}>
              <div className="w-1 h-8 rounded-full flex-shrink-0"
                style={{ background: unlocked ? c.color : '#333', boxShadow: unlocked ? `0 0 6px ${c.color}` : 'none' }}/>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold" style={{ color: unlocked ? c.color : TEXT_DIM }}>{c.label}</div>
                <div className="text-[9px] truncate" style={{ color: TEXT_DIM }}>{c.wielders.split(',')[0]}{c.wielders.includes(',') ? '…' : ''}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Planet Tracker ────────────────────────────────────────────────────────────
function PlanetTracker({ watched }) {
  const visited = useMemo(() => {
    const s = new Set()
    watched.forEach(id => { SW_PLANETS[id]?.forEach(p => s.add(p)) })
    return s
  }, [watched])
  const allPlanets = useMemo(() => {
    const s = new Set()
    Object.values(SW_PLANETS).forEach(arr => arr.forEach(p => s.add(p)))
    return [...s].sort()
  }, [])

  return (
    <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${YELLOW}20` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: YELLOW }}>🪐 Planets Visited</div>
        <span className="text-[10px] font-bold" style={{ color: TEXT_DIM }}>{visited.size}/{allPlanets.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {allPlanets.map(p => (
          <span key={p} className="text-[10px] px-2 py-0.5 rounded-lg font-medium"
            style={visited.has(p)
              ? { background: `${YELLOW}18`, color: YELLOW, border: `1px solid ${YELLOW}30` }
              : { background: BG_CARD, color: TEXT_DIM, border: `1px solid ${BORDER}` }}>
            {visited.has(p) ? '🪐 ' : ''}{p}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Force Affinity Card ───────────────────────────────────────────────────────
function ForceAffinityCard({ watched }) {
  const [choice, setChoice] = useState(() => loadJSON(SK_FORCE_AFFINITY, null))

  const lightCount = useMemo(() => SW_CHARACTERS.filter(c => c.side === 'light' && c.titleIds.some(id => watched.has(id))).length, [watched])
  const darkCount  = useMemo(() => SW_CHARACTERS.filter(c => c.side === 'dark'  && c.titleIds.some(id => watched.has(id))).length, [watched])
  const greyCount  = useMemo(() => SW_CHARACTERS.filter(c => c.side === 'grey'  && c.titleIds.some(id => watched.has(id))).length, [watched])
  const total = lightCount + darkCount + greyCount

  function pick(s) { setChoice(s); saveJSON(SK_FORCE_AFFINITY, s) }

  const SIDES = [
    { key: 'light', label: 'Light Side', emoji: '☀️', color: BLUE,    count: lightCount, desc: 'Peace, knowledge, serenity' },
    { key: 'dark',  label: 'Dark Side',  emoji: '🌑', color: '#e74c3c', count: darkCount,  desc: 'Power, passion, strength' },
    { key: 'grey',  label: 'Grey Force', emoji: '⚖️', color: '#9b59b6', count: greyCount,  desc: 'Balance between all things' },
  ]

  return (
    <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid rgba(255,232,31,0.15)` }}>
      <div className="text-[9px] uppercase tracking-widest font-semibold mb-3" style={{ color: YELLOW }}>⚡ The Force — Which Side Are You?</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {SIDES.map(s => (
          <button key={s.key} onClick={() => pick(s.key)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-[0.97]"
            style={{ background: choice === s.key ? `${s.color}18` : BG_CARD, border: `1px solid ${choice === s.key ? s.color + '55' : BORDER}` }}>
            <span className="text-2xl">{s.emoji}</span>
            <span className="text-[9px] font-bold leading-snug text-center" style={{ color: choice === s.key ? s.color : TEXT_MID }}>{s.label}</span>
            <span className="text-[8px]" style={{ color: TEXT_DIM }}>{s.count} chars</span>
          </button>
        ))}
      </div>
      {choice && (
        <div className="text-center text-[10px]" style={{ color: TEXT_MID }}>
          You align with the <span style={{ color: SIDES.find(s => s.key === choice)?.color }}>{SIDES.find(s => s.key === choice)?.label}</span> — {SIDES.find(s => s.key === choice)?.desc}
        </div>
      )}
      {total > 0 && (
        <div className="mt-3">
          <div className="h-2 rounded-full overflow-hidden flex">
            {total > 0 && <div style={{ width: `${(lightCount/total)*100}%`, background: BLUE }}/>}
            {total > 0 && <div style={{ width: `${(darkCount/total)*100}%`, background: '#e74c3c' }}/>}
            {total > 0 && <div style={{ width: `${(greyCount/total)*100}%`, background: '#9b59b6' }}/>}
          </div>
          <div className="flex justify-between text-[8px] mt-1" style={{ color: TEXT_DIM }}>
            <span style={{ color: BLUE }}>☀️ {lightCount}</span>
            <span style={{ color: '#9b59b6' }}>⚖️ {greyCount}</span>
            <span style={{ color: '#e74c3c' }}>🌑 {darkCount}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Midi-chlorian Meter ───────────────────────────────────────────────────────
function MidichlorianMeter({ watched }) {
  const COUNTS = { 3001:8200,3002:9500,3003:9000,3004:11000,3005:8500,3006:9000,3007:7500,3008:12000,3009:13000,3010:12500,3011:10000,3012:8000,3013:9500,3014:9000,3015:11000,3016:8000,3017:11500,3018:12000,3019:10000 }
  const total = useMemo(() => {
    let sum = 0; watched.forEach(id => { sum += COUNTS[id] ?? 7000 }); return sum
  }, [watched])
  const maxPossible = Object.values(COUNTS).reduce((a, b) => a + b, 0)
  const pct = Math.round((total / maxPossible) * 100)
  const label = total === 0 ? 'No midi-chlorians detected'
    : total < 50000 ? 'Force-sensitive'
    : total < 100000 ? 'Jedi Knight potential'
    : total < 150000 ? 'Jedi Master level'
    : total < 200000 ? 'Council-worthy'
    : 'Chosen One potential'

  return (
    <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${YELLOW}18` }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: YELLOW }}>🧬 Midi-chlorian Count</div>
        <span className="font-mono font-bold text-[11px]" style={{ color: YELLOW }}>{total.toLocaleString()}</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: BORDER }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${BLUE} 0%, ${YELLOW} 100%)`, boxShadow: `0 0 8px ${YELLOW}55` }}/>
      </div>
      <div className="text-[10px] italic" style={{ color: TEXT_MID }}>{label}</div>
    </div>
  )
}

// ── SW Stats Page ─────────────────────────────────────────────────────────────
function SWStatsPage({ watched, allTitles }) {
  const countable = allTitles.filter(t => !t.comingSoon)
  const wc = countable.filter(t => watched.has(t.id)).length
  const total = countable.length
  const pct = total > 0 ? Math.round((wc/total)*100) : 0
  const movies = countable.filter(t => t.type === 'movie')
  const tvs = countable.filter(t => t.type === 'tv')

  const eraStats = SW_ERAS.map(era => {
    const titles = allTitles.filter(t => era.ids.includes(t.id) && !t.comingSoon)
    const w = titles.filter(t => watched.has(t.id)).length
    return { era, total: titles.length, watched: w }
  }).filter(e => e.total > 0)

  return (
    <div className="min-h-screen pb-24" style={{ background: BG }}>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: TEXT_DIM }}>📊 Force Progress Report</div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Watched', value: wc, color: YELLOW },
            { label: 'Remaining', value: total-wc, color: TEXT_MAIN },
            { label: 'Movies', value: movies.filter(t=>watched.has(t.id)).length, color: BLUE },
            { label: 'Complete', value: `${pct}%`, color: '#27ae60' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
              <div className="font-bold text-2xl mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
          <div className="text-[9px] uppercase tracking-widest font-semibold mb-3" style={{ color: TEXT_DIM }}>Era Breakdown</div>
          <div className="space-y-3">
            {eraStats.map(({ era, watched: ew, total: et }) => {
              const p = et > 0 ? Math.round((ew/et)*100) : 0
              return (
                <div key={era.key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px]" style={{ color: era.color }}>{era.emoji} {era.label}</span>
                    <span className="text-[10px] font-mono" style={{ color: TEXT_DIM }}>{ew}/{et} · {p}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: era.color }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <MidichlorianMeter watched={watched}/>
        <LightsaberTracker watched={watched}/>
        <PlanetTracker watched={watched}/>
      </div>
    </div>
  )
}

// ── SW Characters Page ────────────────────────────────────────────────────────
function SWCharactersPage({ watched }) {
  const [activeGroup, setActiveGroup] = useState('all')

  const chars = activeGroup === 'all'
    ? SW_CHARACTERS
    : SW_CHARACTERS.filter(c => {
        const grp = SW_GROUPS.find(g => g.key === activeGroup)
        return grp?.charIds.includes(c.id)
      })

  const SIDES = { light: { emoji: '☀️', color: BLUE }, dark: { emoji: '🌑', color: '#e74c3c' }, grey: { emoji: '⚖️', color: '#9b59b6' } }

  return (
    <div className="min-h-screen pb-24" style={{ background: BG }}>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        <ForceAffinityCard watched={watched}/>

        <div>
          <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: TEXT_DIM }}>Filter by Faction</div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button onClick={() => setActiveGroup('all')}
              className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
              style={activeGroup === 'all' ? { background: YELLOW, color: '#000' } : { background: BG_CARD2, color: TEXT_MID, border: `1px solid ${BORDER}` }}>
              All
            </button>
            {SW_GROUPS.filter(g => g.charIds.length > 0).map(g => (
              <button key={g.key} onClick={() => setActiveGroup(g.key)}
                className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
                style={activeGroup === g.key ? { background: g.color, color: '#000' } : { background: BG_CARD2, color: TEXT_MID, border: `1px solid ${BORDER}` }}>
                {g.emoji} {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {chars.map(c => {
            const seen = c.titleIds.filter(id => watched.has(id)).length
            const side = SIDES[c.side]
            return (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${c.color ?? YELLOW}15`, border: `1px solid ${c.color ?? YELLOW}25` }}>
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-[13px]">{c.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                      style={{ background: `${c.color ?? YELLOW}18`, color: c.color ?? YELLOW }}>
                      {c.role}
                    </span>
                    {side && <span className="text-[9px]" style={{ color: side.color }}>{side.emoji}</span>}
                  </div>
                  {c.realName && c.realName !== c.name && (
                    <div className="text-[9px] mt-0.5" style={{ color: TEXT_DIM }}>{c.realName}</div>
                  )}
                  <p className="text-[10px] mt-1 leading-snug" style={{ color: TEXT_MID }}>
                    {c.desc?.slice(0, 90)}{(c.desc?.length ?? 0) > 90 ? '…' : ''}
                  </p>
                  <div className="text-[9px] mt-1" style={{ color: TEXT_DIM }}>
                    Seen in <span style={{ color: YELLOW }}>{seen}</span>/{c.titleIds.length} titles
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── SW Awards ─────────────────────────────────────────────────────────────────
const SW_ACHIEVEMENTS = [
  { id: 'padawan',     label: 'Begin Your Training',  desc: 'Watch your first SW title',         emoji: '🔵', check: (w) => w.size >= 1 },
  { id: 'ot_complete', label: 'A New Hope Fulfilled', desc: 'Watch all 3 Original Trilogy films', emoji: '🌟', check: (w) => [3008,3009,3010].every(id => w.has(id)) },
  { id: 'pt_complete', label: 'Prequel Lord',         desc: 'Watch all 3 Prequel Trilogy films',  emoji: '🌋', check: (w) => [3001,3002,3004].every(id => w.has(id)) },
  { id: 'st_complete', label: 'Sequel Apprentice',    desc: 'Watch all 3 Sequel Trilogy films',   emoji: '💫', check: (w) => [3017,3018,3019].every(id => w.has(id)) },
  { id: 'all_trilogies', label: 'Force Historian',   desc: 'Complete all three trilogies',        emoji: '🏆', check: (w) => [3001,3002,3004,3008,3009,3010,3017,3018,3019].every(id => w.has(id)) },
  { id: 'mando',       label: 'This Is The Way',     desc: 'Watch The Mandalorian',               emoji: '🪖', check: (w) => w.has(3011) },
  { id: 'andor',       label: 'Rebellions Need Spies', desc: 'Watch Andor',                      emoji: '🕵️', check: (w) => w.has(3014) },
  { id: 'rogue_one',   label: 'Rogue One',            desc: 'Watch Rogue One',                    emoji: '💀', check: (w) => w.has(3006) },
  { id: 'clone_wars',  label: 'Clone Commander',      desc: 'Watch The Clone Wars series',        emoji: '⚔️', check: (w) => w.has(3003) },
  { id: 'ahsoka',      label: 'Togruta Warrior',      desc: 'Watch Ahsoka',                       emoji: '⚪', check: (w) => w.has(3015) },
  { id: 'rebels',      label: 'Ghost Crew',           desc: 'Watch Star Wars Rebels',             emoji: '🟢', check: (w) => w.has(3005) },
  { id: 'all_sw',      label: 'One with the Force',   desc: 'Watch every released SW title',      emoji: '🌌', check: (w, t) => t.filter(x=>!x.comingSoon).every(x=>w.has(x.id)) },
]

function SWAwardsPage({ watched, allTitles }) {
  const unlocked = SW_ACHIEVEMENTS.filter(a => a.check(watched, allTitles))
  return (
    <div className="min-h-screen pb-24" style={{ background: BG }}>
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="text-[9px] uppercase tracking-widest font-semibold mb-4" style={{ color: TEXT_DIM }}>
          🏆 Force Achievements — {unlocked.length}/{SW_ACHIEVEMENTS.length}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SW_ACHIEVEMENTS.map(a => {
            const done = a.check(watched, allTitles)
            return (
              <div key={a.id} className="rounded-2xl p-4 flex flex-col items-center text-center gap-2"
                style={{ background: BG_CARD2, border: `1px solid ${done ? YELLOW : BORDER}`, opacity: done ? 1 : 0.4 }}>
                <div className="text-3xl">{a.emoji}</div>
                <div className="font-bold text-sm" style={{ color: done ? YELLOW : TEXT_MID }}>{a.label}</div>
                <div className="text-[10px]" style={{ color: TEXT_DIM }}>{a.desc}</div>
                {done && <div className="text-[9px] font-bold px-2 py-0.5 rounded-lg" style={{ background: `${YELLOW}20`, color: YELLOW }}>✓ UNLOCKED</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── SW Home Page ──────────────────────────────────────────────────────────────
function SWHomePage({ profile, watched, allTitles, onNavigate }) {
  const countable = allTitles.filter(t => !t.comingSoon)
  const wc = countable.filter(t => watched.has(t.id)).length
  const total = countable.length
  const pct = total > 0 ? Math.round((wc/total)*100) : 0
  const remaining = total - wc
  const rank = getSWRank(wc)
  const nextRank = getNextSWRank(wc)
  const firstName = (profile?.name ?? 'Padawan').split(' ')[0]
  const nextUp = allTitles.find(t => !watched.has(t.id) && !t.comingSoon)
  const nextEra = nextUp ? SW_ERAS.find(e => e.ids.includes(nextUp.id)) : null

  const featuredChar = SW_CHARACTERS[Math.floor(Date.now() / 86400000) % SW_CHARACTERS.length]
  const charSeen = featuredChar.titleIds.filter(id => watched.has(id)).length

  const eraProgress = SW_ERAS.map(era => {
    const titles = allTitles.filter(t => era.ids.includes(t.id) && !t.comingSoon)
    const w = titles.filter(t => watched.has(t.id)).length
    return { era, total: titles.length, watched: w }
  }).filter(e => e.total > 0)

  const lightsabersSeen = useMemo(() => {
    const s = new Set(); watched.forEach(id => SW_LIGHTSABER_COLORS.forEach(c => { if (c.filmIds.includes(id)) s.add(c.key) })); return s.size
  }, [watched])

  return (
    <div className="min-h-screen pb-24" style={{ background: BG }}>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #000 0%, #030610 50%, #000 100%)', minHeight: 190 }}>
        <SpaceStars count={80}/>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,232,31,0.06) 0%, transparent 60%)' }}/>
        <div className="relative max-w-lg mx-auto px-5 pt-10 pb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${YELLOW})` }}>⚔️</div>
            <div>
              <div className="font-bebas text-[9px] tracking-[0.4em] leading-none mb-0.5" style={{ color: YELLOW }}>STAR WARS</div>
              <div className="font-bebas text-[21px] tracking-[0.12em] text-white leading-none">WATCH TRACKER</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AvatarDisplay avatar={profile?.avatar} name={profile?.name} size="home"/>
            <div>
              <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: TEXT_DIM }}>Welcome back</div>
              <div className="font-bebas text-[28px] text-white tracking-wide leading-none">{firstName}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 w-full space-y-4 mt-4">
        {/* Rank */}
        <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${rank.color}33` }}>
          <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>Your Force Rank</div>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">{rank.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bebas text-xl tracking-widest" style={{ color: rank.color }}>{rank.label}</div>
              <div className="text-[10px]" style={{ color: TEXT_MID }}>{rank.desc}</div>
            </div>
            <div className="text-right">
              <div className="font-bebas text-2xl" style={{ color: YELLOW }}>{wc}</div>
              <div className="text-[9px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>watched</div>
            </div>
          </div>
          {nextRank && (() => {
            const p = wc - rank.minWatched
            const r = nextRank.minWatched - rank.minWatched
            const bar = Math.round((p / r) * 100)
            return (
              <>
                <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: '#111' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${bar}%`, background: `linear-gradient(90deg, ${BLUE} 0%, ${YELLOW} 100%)`, boxShadow: `0 0 6px ${YELLOW}44` }}/>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px]" style={{ color: rank.color }}>{rank.label}</span>
                  <span className="text-[9px]" style={{ color: TEXT_DIM }}>{nextRank.minWatched - wc} more → {nextRank.label}</span>
                </div>
              </>
            )
          })()}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Watched', value: wc, color: YELLOW },
            { label: 'Remaining', value: remaining, color: TEXT_MAIN },
            { label: 'Complete', value: `${pct}%`, color: BLUE },
            { label: 'Sabers', value: `${lightsabersSeen}/8`, color: '#9b59b6' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
              <div className="font-bebas text-xl mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Era progress */}
        <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
          <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>Era Progress</div>
          <div className="space-y-3">
            {eraProgress.map(({ era, watched: ew, total: et }) => {
              const p = et > 0 ? Math.round((ew/et)*100) : 0
              return (
                <div key={era.key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px]" style={{ color: era.color }}>{era.emoji} {era.label}</span>
                    <span className="text-[10px] font-mono" style={{ color: TEXT_DIM }}>{ew}/{et}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#111' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: era.color, boxShadow: `0 0 4px ${era.color}55` }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Up Next */}
        {nextUp && (
          <button onClick={() => onNavigate('tracker')} className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
            style={{ background: BG_CARD2, border: `1px solid ${YELLOW}22` }}>
            <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>▶ Up Next</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${YELLOW}10`, border: `1px solid ${YELLOW}20` }}>
                {nextEra?.emoji ?? '🌟'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bebas text-lg text-white tracking-wide">{nextUp.title}</div>
                <div className="text-[10px]" style={{ color: TEXT_MID }}>{nextUp.year} · {nextUp.type}</div>
              </div>
              <div className="px-3 py-2 rounded-xl text-[11px] font-bold" style={{ background: YELLOW, color: '#000' }}>Watch</div>
            </div>
          </button>
        )}

        {/* Force affinity */}
        <ForceAffinityCard watched={watched}/>

        {/* Lightsaber tracker */}
        <LightsaberTracker watched={watched}/>

        {/* Featured character */}
        <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${YELLOW}15` }}>
          <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>★ Daily Character Spotlight</div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${featuredChar.color ?? YELLOW}15`, border: `1px solid ${featuredChar.color ?? YELLOW}25` }}>
              {featuredChar.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bebas text-lg leading-none mb-0.5" style={{ color: featuredChar.color ?? YELLOW }}>{featuredChar.name}</div>
              <div className="text-[9px] mb-1" style={{ color: TEXT_DIM }}>{featuredChar.role}</div>
              <p className="text-[10px] leading-relaxed" style={{ color: TEXT_MID }}>
                {featuredChar.desc?.slice(0, 100)}{(featuredChar.desc?.length ?? 0) > 100 ? '…' : ''}
              </p>
              <div className="text-[9px] mt-1" style={{ color: TEXT_DIM }}>
                Seen in <span style={{ color: YELLOW }}>{charSeen}</span>/{featuredChar.titleIds.length} titles
              </div>
            </div>
          </div>
        </div>

        {/* Planet tracker mini */}
        <PlanetTracker watched={watched}/>

        {/* Quick actions */}
        <div>
          <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>Quick Actions</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: '🎬', label: 'Tracker',  onClick: () => onNavigate('tracker') },
              { icon: '⚔️', label: 'Chars',    onClick: () => onNavigate('characters') },
              { icon: '🏆', label: 'Awards',   onClick: () => onNavigate('awards') },
              { icon: '📊', label: 'Stats',    onClick: () => onNavigate('stats') },
            ].map(({ icon, label, onClick }) => (
              <button key={label} onClick={onClick}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-[0.95]"
                style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                  style={{ background: `${YELLOW}10`, border: `1px solid ${YELLOW}1c` }}>
                  {icon}
                </div>
                <span className="text-[10px] text-white font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <SaberDivider color={YELLOW}/>
        <div className="text-center text-[10px] italic pb-4" style={{ color: TEXT_DIM }}>
          "May the Force be with you. Always."
        </div>
      </div>
    </div>
  )
}

// ── Main SWTracker ────────────────────────────────────────────────────────────
export default function SWTracker({ profile, onBack }) {
  const [watched,  setWatched]  = useState(() => new Set(loadJSON(SK_WATCHED, [])))
  const [activeTab,setActiveTab]= useState('home')
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')

  const allTitles = SW_TITLES

  function toggleWatched(id) {
    setWatched(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      saveJSON(SK_WATCHED, [...next])
      return next
    })
  }

  const filtered = useMemo(() => {
    let titles = allTitles
    if (filter === 'movies')   titles = titles.filter(t => t.type === 'movie')
    if (filter === 'tv')       titles = titles.filter(t => t.type === 'tv')
    if (filter === 'watched')  titles = titles.filter(t => watched.has(t.id))
    if (filter === 'unwatched') titles = titles.filter(t => !watched.has(t.id) && !t.comingSoon)
    if (search) titles = titles.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    return titles
  }, [allTitles, filter, search, watched])

  const eraGroups = useMemo(() => {
    return SW_ERAS.map(era => ({
      era, titles: filtered.filter(t => era.ids.includes(t.id))
    })).filter(g => g.titles.length > 0)
  }, [filtered])

  const TABS = [
    { id: 'home',       label: 'HOME',    icon: '⭐' },
    { id: 'tracker',    label: 'TRACKER', icon: '🎬' },
    { id: 'characters', label: 'CHARS',   icon: '⚔️' },
    { id: 'awards',     label: 'AWARDS',  icon: '🏆' },
    { id: 'stats',      label: 'STATS',   icon: '📊' },
  ]

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      {/* Top nav */}
      <div className="sticky top-0 z-20" style={{ background: `${BG}f0`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-lg mx-auto px-4 py-2 flex items-center gap-2">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: TEXT_MID }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Universes
          </button>
          <div className="flex-1 text-center">
            <span className="font-bebas text-[16px] tracking-widest" style={{ color: YELLOW }}>SW TRACKER</span>
          </div>
          <div className="w-12"/>
        </div>
      </div>

      {activeTab === 'home' && (
        <SWHomePage profile={profile} watched={watched} allTitles={allTitles} onNavigate={setActiveTab}/>
      )}

      {activeTab === 'tracker' && (
        <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
          <div className="space-y-2 mb-4">
            <input type="search" placeholder="Search titles…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: TEXT_MAIN }}/>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[['all','All'],['unwatched','Unwatched'],['watched','Watched'],['movies','Movies'],['tv','TV']].map(([k,l]) => (
                <button key={k} onClick={() => setFilter(k)}
                  className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
                  style={filter === k ? { background: YELLOW, color: '#000' } : { background: BG_CARD2, color: TEXT_MID, border: `1px solid ${BORDER}` }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            {eraGroups.map(({ era, titles }) => (
              <div key={era.key}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: era.color }}>{era.emoji}</span>
                  <span className="font-bebas text-[14px] tracking-widest" style={{ color: era.color }}>{era.label}</span>
                  <span className="text-[9px]" style={{ color: TEXT_DIM }}>
                    {titles.filter(t => watched.has(t.id)).length}/{titles.filter(t => !t.comingSoon).length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {titles.map(t => (
                    <button key={t.id} onClick={() => !t.comingSoon && toggleWatched(t.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all active:scale-[0.98]"
                      style={{ background: BG_CARD2, border: `1px solid ${watched.has(t.id) ? YELLOW + '30' : BORDER}` }}>
                      <SWCheck watched={watched.has(t.id)} comingSoon={t.comingSoon}/>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold" style={{ color: watched.has(t.id) ? YELLOW : TEXT_MAIN }}>{t.title}</div>
                        <div className="text-[9px] capitalize mt-0.5" style={{ color: TEXT_DIM }}>{t.year} · {t.type}{t.comingSoon ? ' · Coming Soon' : ''}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'characters' && <SWCharactersPage watched={watched}/>}
      {activeTab === 'awards'     && <SWAwardsPage watched={watched} allTitles={allTitles}/>}
      {activeTab === 'stats'      && <SWStatsPage watched={watched} allTitles={allTitles}/>}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30" style={{ background: `${BG}f5`, backdropFilter: 'blur(16px)', borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-lg mx-auto flex">
          {TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-3 transition-all"
                style={{ color: active ? YELLOW : TEXT_DIM }}>
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className="text-[8px] uppercase tracking-widest font-semibold">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
