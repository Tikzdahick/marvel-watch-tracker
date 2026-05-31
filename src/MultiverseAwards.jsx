/**
 * MultiverseAwards — global hub achievements spanning all 4 franchises.
 */
import { useMemo } from 'react'
import { DC_TITLES } from './data/dcTitles.js'
import { HP_TITLES } from './data/hpTitles.js'
import { SW_TITLES } from './data/swTitles.js'

function loadJ(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null } catch { return null } }

// ── Streak helpers ─────────────────────────────────────────────────────────────
function calcLoginStreak(dates) {
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

function calcConsecutiveStreak(dateSet) {
  if (!dateSet.size) return 0
  const sorted = [...dateSet].sort().reverse()
  let streak = 0; let cur = new Date(); cur.setHours(0,0,0,0)
  for (const d of sorted) {
    const dt = new Date(d); dt.setHours(0,0,0,0)
    const diff = Math.round((cur - dt) / 86400000)
    if (diff <= 1) { streak++; cur = dt } else break
  }
  return streak
}

// ── Data aggregation ───────────────────────────────────────────────────────────
function computeData(marvelWatched, marvelTitles, loginDates) {
  // Watched sets
  const dcW = new Set(loadJ('dc-watched-v1') ?? [])
  const hpW = new Set(loadJ('hp-watched-v1') ?? [])
  const swW = new Set(loadJ('sw-watched-v1') ?? [])

  const mCountable = (marvelTitles ?? []).filter(t => !t.comingSoon)
  const mW = mCountable.filter(t => marvelWatched?.has(t.id)).length
  const dW = DC_TITLES.filter(t => !t.comingSoon && dcW.has(t.id)).length
  const hW = HP_TITLES.filter(t => !t.comingSoon && hpW.has(t.id)).length
  const sW = SW_TITLES.filter(t => !t.comingSoon && swW.has(t.id)).length
  const totalWatched = mW + dW + hW + sW

  const mT = mCountable.length
  const dT = DC_TITLES.filter(t => !t.comingSoon).length
  const hT = HP_TITLES.filter(t => !t.comingSoon).length
  const sT = SW_TITLES.filter(t => !t.comingSoon).length
  const mPct = mT > 0 ? Math.round((mW / mT) * 100) : 0
  const dPct = dT > 0 ? Math.round((dW / dT) * 100) : 0
  const hPct = hT > 0 ? Math.round((hW / hT) * 100) : 0
  const sPct = sT > 0 ? Math.round((sW / sT) * 100) : 0

  // Visited franchises (tracked when entering a portal)
  const visited = new Set(loadJ('mvt-visited-franchises') ?? [])

  // Login streak
  const loginStreak = calcLoginStreak(loginDates ?? [])

  // Build per-franchise date sets from watch history
  // Marvel: { 'YYYY-MM-DD': [ids...] }
  const marvelHist = loadJ('mvt-watch-history') ?? {}
  const marvelDates = new Set(Object.keys(marvelHist).filter(d => (marvelHist[d]?.length ?? 0) > 0))

  // DC/HP/SW: [{id, ts}]
  function histToDates(key) {
    const hist = loadJ(key) ?? []
    const s = new Set()
    hist.forEach(e => { if (e?.ts) s.add(new Date(e.ts).toISOString().slice(0,10)) })
    return s
  }
  const dcDates = histToDates('dc-watch-history')
  const hpDates = histToDates('hp-watch-history')
  const swDates = histToDates('sw-watch-history')

  // Combined watch streak
  const allDates = new Set([...marvelDates, ...dcDates, ...hpDates, ...swDates])
  const watchStreak = calcConsecutiveStreak(allDates)

  // Crossover event: any date where 3+ franchises have watches
  let crossoverDayExists = false
  const allUniqueDates = new Set([...marvelDates, ...dcDates, ...hpDates, ...swDates])
  for (const d of allUniqueDates) {
    const count = (marvelDates.has(d) ? 1 : 0) + (dcDates.has(d) ? 1 : 0) + (hpDates.has(d) ? 1 : 0) + (swDates.has(d) ? 1 : 0)
    if (count >= 3) { crossoverDayExists = true; break }
  }

  // Night owl: any watch between midnight and 4 AM (ms % 86400000 < 14400000)
  let hasNightWatch = false
  const dcHistArr = loadJ('dc-watch-history') ?? []
  const hpHistArr = loadJ('hp-watch-history') ?? []
  const swHistArr = loadJ('sw-watch-history') ?? []
  const allTs = [...dcHistArr, ...hpHistArr, ...swHistArr].map(e => e?.ts).filter(Boolean)
  for (const ts of allTs) {
    const hour = new Date(ts).getHours()
    if (hour >= 0 && hour < 4) { hasNightWatch = true; break }
  }

  // Weekend warrior: 10+ watches in any single Sat+Sun pair
  let weekendWarrior = false
  const watchesByDate = {}
  const addToDate = (dateStr, count = 1) => { watchesByDate[dateStr] = (watchesByDate[dateStr] ?? 0) + count }
  Object.entries(marvelHist).forEach(([d, ids]) => addToDate(d, Array.isArray(ids) ? ids.length : 0))
  dcHistArr.forEach(e => { if (e?.ts) addToDate(new Date(e.ts).toISOString().slice(0,10)) })
  hpHistArr.forEach(e => { if (e?.ts) addToDate(new Date(e.ts).toISOString().slice(0,10)) })
  swHistArr.forEach(e => { if (e?.ts) addToDate(new Date(e.ts).toISOString().slice(0,10)) })

  const dateKeys = Object.keys(watchesByDate).sort()
  for (let i = 0; i < dateKeys.length; i++) {
    const d = new Date(dateKeys[i])
    const day = d.getDay()
    if (day === 6) { // Saturday — look for paired Sunday
      const satStr = dateKeys[i]
      const sunDate = new Date(d.getTime() + 86400000)
      const sunStr = sunDate.toISOString().slice(0,10)
      const total = (watchesByDate[satStr] ?? 0) + (watchesByDate[sunStr] ?? 0)
      if (total >= 10) { weekendWarrior = true; break }
    }
  }

  // Trivia
  const mvTrivia = loadJ('mvt-trivia') ?? {}
  const dcTrivia = loadJ('dc-trivia-v1') ?? {}
  const maxTriviaStreak = Math.max(mvTrivia.streak ?? 0, dcTrivia.streak ?? 0)
  const maxTriviaScore  = Math.max(mvTrivia.score  ?? 0, dcTrivia.score  ?? 0)

  // Early adopter: first login before 2026-09-01
  const firstLogin = [...(loginDates ?? [])].sort()[0]
  const isEarlyAdopter = !!firstLogin && firstLogin < '2026-09-01'

  return {
    mW, dW, hW, sW, mPct, dPct, hPct, sPct, totalWatched,
    visited, loginStreak, watchStreak,
    crossoverDayExists, hasNightWatch, weekendWarrior,
    maxTriviaStreak, maxTriviaScore, isEarlyAdopter,
  }
}

// ── Achievement definitions ────────────────────────────────────────────────────
const GROUPS = [
  { key: 'multiverse', label: 'Multiverse', icon: '🌌', color: '#fff' },
  { key: 'streak',     label: 'Streaks',    icon: '🔥', color: '#f97316' },
  { key: 'trivia',     label: 'Trivia',     icon: '🎓', color: '#60a5fa' },
  { key: 'special',    label: 'Special',    icon: '⭐', color: '#ffe81f' },
]

const ACHIEVEMENTS = [
  // ── Multiverse ──────────────────────────────────────────────────────────────
  {
    id: 'universe_hopper', group: 'multiverse', icon: '🌌', color: '#a78bfa',
    label: 'Universe Hopper',
    desc: 'Watch at least 1 title in all 4 franchises',
    check: d => d.mW > 0 && d.dW > 0 && d.hW > 0 && d.sW > 0,
    progress: d => ({ value: [d.mW > 0, d.dW > 0, d.hW > 0, d.sW > 0].filter(Boolean).length, max: 4 }),
  },
  {
    id: 'marvel_vs_dc', group: 'multiverse', icon: '⚔️', color: '#E81C2E',
    label: 'Marvel vs DC',
    desc: 'Watch at least 10 titles in both Marvel and DC',
    check: d => d.mW >= 10 && d.dW >= 10,
    progress: d => ({ value: Math.min(d.mW, 10) + Math.min(d.dW, 10), max: 20 }),
  },
  {
    id: 'chosen_one', group: 'multiverse', icon: '✨', color: '#FFD700',
    label: 'The Chosen One',
    desc: 'Complete any single franchise 100%',
    check: d => d.mPct === 100 || d.dPct === 100 || d.hPct === 100 || d.sPct === 100,
    progress: d => ({ value: Math.max(d.mPct, d.dPct, d.hPct, d.sPct), max: 100, pct: true }),
  },
  {
    id: 'multiverse_explorer', group: 'multiverse', icon: '🚀', color: '#34d399',
    label: 'Multiverse Explorer',
    desc: 'Enter all 4 franchise portals',
    check: d => d.visited.size >= 4 || (d.mW > 0 && d.dW > 0 && d.hW > 0 && d.sW > 0),
    progress: d => ({ value: Math.min(d.visited.size + (d.mW > 0 ? 1 : 0), 4), max: 4 }),
  },
  {
    id: 'crossover_event', group: 'multiverse', icon: '💥', color: '#fb923c',
    label: 'Crossover Event',
    desc: 'Watch titles from 3 different franchises in one day',
    check: d => d.crossoverDayExists,
    progress: null,
  },
  {
    id: 'true_fan', group: 'multiverse', icon: '❤️', color: '#f43f5e',
    label: 'True Fan',
    desc: 'Watch 50 titles across all franchises',
    check: d => d.totalWatched >= 50,
    progress: d => ({ value: Math.min(d.totalWatched, 50), max: 50 }),
  },
  {
    id: 'legendary', group: 'multiverse', icon: '👑', color: '#FFD700',
    label: 'Legendary Status',
    desc: 'Watch 200 titles across all franchises',
    check: d => d.totalWatched >= 200,
    progress: d => ({ value: Math.min(d.totalWatched, 200), max: 200 }),
  },
  {
    id: 'completionist', group: 'multiverse', icon: '🏆', color: '#ffe81f',
    label: 'Completionist',
    desc: 'Complete all 4 franchises 100%',
    check: d => d.mPct === 100 && d.dPct === 100 && d.hPct === 100 && d.sPct === 100,
    progress: d => ({ value: [d.mPct === 100, d.dPct === 100, d.hPct === 100, d.sPct === 100].filter(Boolean).length, max: 4 }),
  },

  // ── Streaks ──────────────────────────────────────────────────────────────────
  {
    id: 'consistent', group: 'streak', icon: '📅', color: '#60a5fa',
    label: 'Consistent',
    desc: 'Log in 7 days in a row',
    check: d => d.loginStreak >= 7,
    progress: d => ({ value: Math.min(d.loginStreak, 7), max: 7 }),
  },
  {
    id: 'dedicated', group: 'streak', icon: '🔥', color: '#f97316',
    label: 'Dedicated',
    desc: 'Watch something every day for 30 days',
    check: d => d.watchStreak >= 30,
    progress: d => ({ value: Math.min(d.watchStreak, 30), max: 30 }),
  },
  {
    id: 'obsessed', group: 'streak', icon: '💜', color: '#c084fc',
    label: 'Obsessed',
    desc: 'Watch something every day for 100 days',
    check: d => d.watchStreak >= 100,
    progress: d => ({ value: Math.min(d.watchStreak, 100), max: 100 }),
  },

  // ── Trivia ───────────────────────────────────────────────────────────────────
  {
    id: 'know_it_all', group: 'trivia', icon: '🎓', color: '#60a5fa',
    label: 'Know It All',
    desc: 'Get 10 trivia questions right in a row',
    check: d => d.maxTriviaStreak >= 10,
    progress: d => ({ value: Math.min(d.maxTriviaStreak, 10), max: 10 }),
  },
  {
    id: 'multiverse_scholar', group: 'trivia', icon: '📚', color: '#818cf8',
    label: 'Multiverse Scholar',
    desc: 'Score 100+ trivia points in any franchise',
    check: d => d.maxTriviaScore >= 100,
    progress: d => ({ value: Math.min(d.maxTriviaScore, 100), max: 100 }),
  },
  {
    id: 'grand_master', group: 'trivia', icon: '🧠', color: '#a78bfa',
    label: 'Grand Master',
    desc: 'Score 200+ trivia points in any franchise',
    check: d => d.maxTriviaScore >= 200,
    progress: d => ({ value: Math.min(d.maxTriviaScore, 200), max: 200 }),
  },

  // ── Special ──────────────────────────────────────────────────────────────────
  {
    id: 'early_adopter', group: 'special', icon: '⭐', color: '#fbbf24',
    label: 'Early Adopter',
    desc: 'One of the first users of Multiverse Tracker',
    check: d => d.isEarlyAdopter,
    progress: null,
  },
  {
    id: 'night_owl', group: 'special', icon: '🦉', color: '#6366f1',
    label: 'Night Owl',
    desc: 'Watch something after midnight (12 AM – 4 AM)',
    check: d => d.hasNightWatch,
    progress: null,
  },
  {
    id: 'weekend_warrior', group: 'special', icon: '⚡', color: '#ffe81f',
    label: 'Weekend Warrior',
    desc: 'Watch 10 titles in one weekend across any franchise',
    check: d => d.weekendWarrior,
    progress: null,
  },
]

// ── Progress bar within a card ─────────────────────────────────────────────────
function ProgressBar({ value, max, color, pct }) {
  const percent = pct ? value : (max > 0 ? Math.round((value / max) * 100) : 0)
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[9px] mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
        <span>{pct ? `${value}%` : `${value} / ${max}`}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: color, boxShadow: `0 0 4px ${color}66` }}/>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function MultiverseAwards({ marvelWatched, marvelTitles, loginDates }) {
  const data = useMemo(
    () => computeData(marvelWatched, marvelTitles, loginDates),
    [marvelWatched, marvelTitles, loginDates]
  )

  const unlocked = ACHIEVEMENTS.filter(a => a.check(data))
  const total    = ACHIEVEMENTS.length

  return (
    <div className="min-h-screen pb-28" style={{ background: '#04060f' }}>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="font-bebas text-[28px] tracking-[0.15em] text-white leading-none">
            🏆 MULTIVERSE AWARDS
          </h1>
          <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Global achievements across all franchises
          </p>
        </div>

        {/* Overall progress bar */}
        <div className="rounded-2xl p-4" style={{ background: '#0a0d18', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-end gap-3 mb-3">
            <div>
              <span className="font-bebas text-5xl text-white leading-none">{unlocked.length}</span>
              <span className="text-sm ml-2" style={{ color: 'rgba(255,255,255,0.3)' }}>/ {total} unlocked</span>
            </div>
            <div className="pb-1">
              <span className="font-bebas text-2xl leading-none" style={{ color: '#ffe81f' }}>
                {Math.round((unlocked.length / total) * 100)}%
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.round((unlocked.length / total) * 100)}%`,
                background: 'linear-gradient(90deg, #E81C2E 0%, #FFD700 50%, #ffe81f 100%)',
                boxShadow: '0 0 8px rgba(255,215,0,0.4)' }}/>
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[
              { label: 'Marvel', value: data.mW, color: '#E81C2E' },
              { label: 'DC',     value: data.dW, color: '#FFD700' },
              { label: 'HP',     value: data.hW, color: '#c9a227' },
              { label: 'SW',     value: data.sW, color: '#ffe81f' },
            ].map(s => (
              <div key={s.label} className="text-center rounded-xl py-2"
                style={{ background: `${s.color}0a`, border: `1px solid ${s.color}18` }}>
                <div className="font-bebas text-lg leading-none" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[7px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements by group */}
        {GROUPS.map(group => {
          const groupAchs = ACHIEVEMENTS.filter(a => a.group === group.key)
          const groupUnlocked = groupAchs.filter(a => a.check(data)).length
          return (
            <div key={group.key}>
              {/* Group header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{group.icon}</span>
                <span className="font-bebas text-[16px] tracking-widest" style={{ color: group.color }}>
                  {group.label}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold ml-1"
                  style={{ background: `${group.color}18`, color: group.color, border: `1px solid ${group.color}30` }}>
                  {groupUnlocked}/{groupAchs.length}
                </span>
              </div>

              {/* Achievement grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {groupAchs.map(a => {
                  const done = a.check(data)
                  const prog = a.progress?.(data)
                  return (
                    <div key={a.id}
                      className="rounded-2xl p-3.5 flex flex-col gap-2 relative overflow-hidden"
                      style={{
                        background: done ? `${a.color}0e` : '#0a0d18',
                        border: `1px solid ${done ? a.color + '40' : 'rgba(255,255,255,0.04)'}`,
                        opacity: done ? 1 : 0.55,
                      }}>
                      {/* Glow bg for unlocked */}
                      {done && (
                        <div className="absolute inset-0 pointer-events-none"
                          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${a.color}10 0%, transparent 70%)` }}/>
                      )}
                      {/* Icon + unlock badge */}
                      <div className="flex items-start justify-between relative z-10">
                        <span className="text-2xl leading-none">{a.icon}</span>
                        {done && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: a.color }}>
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* Text */}
                      <div className="relative z-10">
                        <div className="font-bold text-[12px] leading-snug"
                          style={{ color: done ? a.color : 'rgba(255,255,255,0.5)' }}>
                          {a.label}
                        </div>
                        <p className="text-[9px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.25)' }}>
                          {a.desc}
                        </p>
                      </div>
                      {/* Progress bar (locked state) */}
                      {!done && prog && (
                        <div className="relative z-10">
                          <ProgressBar value={prog.value} max={prog.max} color={a.color} pct={prog.pct}/>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        <div className="text-center pb-4">
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.08)' }}>
            Multiverse Tracker · Global Awards
          </p>
        </div>
      </div>
    </div>
  )
}
