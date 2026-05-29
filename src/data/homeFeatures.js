/**
 * homeFeatures.js — Recommendation engine + trending algorithm for the home page.
 */

import { MCU_PHASES } from './marvelExtras.js'
import { ERA_FOR_ID } from './eras.js'

// ── Franchise chains (ordered sequences for sequel detection) ─────────────────
const FRANCHISE_CHAINS = [
  { name: 'Iron Man',        ids: [21, 22, 26] },
  { name: 'Avengers',        ids: [25, 32, 47, 48] },
  { name: 'Thor',            ids: [24, 27, 45, 62] },
  { name: 'Guardians',       ids: [30, 31, 67] },
  { name: 'Spider-Man',      ids: [43, 56, 57] },
  { name: 'Captain America', ids: [28, 40, 41] },
  { name: 'Ant-Man',         ids: [33, 46, 66] },
  { name: 'Doctor Strange',  ids: [44, 58] },
  { name: 'Black Panther',   ids: [42, 63] },
]

const ERA_LABELS = {
  blade:    'Blade Era',
  xmen:     'X-Men Era',
  early:    'Early MCU',
  netflix:  'Netflix Era',
  infinity: 'Infinity Saga',
  disney:   'Disney+ Era',
  recent:   'Recent Releases',
}

// ── Watch Next Recommendation ─────────────────────────────────────────────────
export function getWatchNextRecommendation(watched, ratings, allTitles) {
  if (!watched || !allTitles?.length) return null
  const unwatched = allTitles.filter(t => !watched.has(t.id) && !t.comingSoon)
  if (!unwatched.length) return null

  // Strategy 1: Continue an active franchise chain
  for (const chain of FRANCHISE_CHAINS) {
    const inChain = chain.ids.filter(id => allTitles.some(t => t.id === id))
    const watchedInChain = inChain.filter(id => watched.has(id))
    const nextId = inChain.find(id => !watched.has(id) && allTitles.some(t => t.id === id && !t.comingSoon))
    if (watchedInChain.length > 0 && nextId) {
      const title = allTitles.find(t => t.id === nextId)
      if (title) return { title, reason: `Next in the ${chain.name} saga` }
    }
  }

  // Strategy 2: Phase progression — find highest in-progress phase
  for (const phase of MCU_PHASES) {
    const phaseIds = phase.ids.filter(id => allTitles.some(t => t.id === id))
    const watchedHere = phaseIds.filter(id => watched.has(id))
    const nextId = phaseIds.find(id => !watched.has(id) && allTitles.some(t => t.id === id && !t.comingSoon))
    if (watchedHere.length > 0 && watchedHere.length < phaseIds.length && nextId) {
      const title = allTitles.find(t => t.id === nextId)
      if (title) return { title, reason: `Next in ${phase.label}` }
    }
  }

  // Strategy 3: Highest-rated era → suggest something similar
  const ratedWatched = Object.entries(ratings ?? {})
    .filter(([id]) => watched.has(Number(id)))
    .map(([id, r]) => ({ id: Number(id), rating: r }))

  if (ratedWatched.length > 0) {
    const eraScores = {}
    for (const { id, rating } of ratedWatched) {
      const era = ERA_FOR_ID[id]
      if (era) eraScores[era] = (eraScores[era] ?? 0) + rating
    }
    const topEra = Object.entries(eraScores).sort((a, b) => b[1] - a[1])[0]?.[0]
    if (topEra) {
      const candidate = unwatched.find(t => ERA_FOR_ID[t.id] === topEra)
      if (candidate) {
        return { title: candidate, reason: `Because you enjoy the ${ERA_LABELS[topEra] ?? topEra}` }
      }
    }
  }

  // Fallback: Iron Man as the canonical starting point
  const ironMan = allTitles.find(t => t.id === 21)
  if (ironMan && !watched.has(21)) {
    return { title: ironMan, reason: 'The perfect starting point — where the MCU began' }
  }
  return { title: unwatched[0], reason: 'Up next in your queue' }
}

// ── Trending weights (base popularity score per title) ────────────────────────
const BASE_WEIGHTS = {
  21: 85,  // Iron Man
  22: 68,  // Iron Man 2
  23: 62,  // Incredible Hulk
  24: 72,  // Thor
  25: 95,  // The Avengers
  26: 65,  // Iron Man 3
  27: 60,  // Thor: TDW
  28: 87,  // Winter Soldier
  30: 86,  // GotG
  31: 80,  // GotG Vol.2
  32: 78,  // Age of Ultron
  33: 75,  // Ant-Man
  40: 82,  // Civil War
  41: 72,  // Black Widow
  42: 91,  // Black Panther
  43: 80,  // Homecoming
  44: 79,  // Doctor Strange
  45: 89,  // Ragnarok
  46: 70,  // Ant-Man & Wasp
  47: 98,  // Infinity War
  48: 100, // Endgame
  49: 81,  // Loki
  50: 78,  // WandaVision
  54: 77,  // Shang-Chi
  55: 65,  // Eternals
  56: 74,  // Far From Home
  57: 87,  // No Way Home
  58: 73,  // MoM
  62: 71,  // Love & Thunder
  63: 72,  // Wakanda Forever
  66: 65,  // Quantumania
  67: 82,  // GotG Vol.3
  70: 85,  // Deadpool & Wolverine
}

// ── Trending This Week ────────────────────────────────────────────────────────
export function getTrendingTitles(allTitles, count = 5) {
  const weekSeed = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  const month = new Date().getMonth() + 1
  const isSummer  = month >= 5 && month <= 8
  const isHoliday = month === 11 || month === 12

  const candidates = allTitles.filter(t => !t.comingSoon)

  const scored = candidates.map(t => {
    const base = BASE_WEIGHTS[t.id] ?? 55
    // Deterministic weekly variation ±15
    const hash = (weekSeed * 1664525 + t.id * 22695477 + 1013904223) >>> 0
    const weekBoost = (hash % 31) - 15
    // Seasonal boosts for big blockbusters
    const seasonBoost = (isSummer && base >= 80) ? 10
      : (isHoliday && [47, 48, 25].includes(t.id)) ? 12
      : 0
    return { title: t, score: base + weekBoost + seasonBoost }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, count).map((item, i) => ({ rank: i + 1, title: item.title }))
}
