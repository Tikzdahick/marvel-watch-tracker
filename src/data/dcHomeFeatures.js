/**
 * dcHomeFeatures.js — DC Watch Next recommendation engine + trending algorithm.
 */

import { DC_ERAS } from './dcEras.js'

// ── ERA lookup map ─────────────────────────────────────────────────────────────
export const DC_ERA_FOR_ID = (() => {
  const m = {}
  DC_ERAS.forEach(era => era.ids.forEach(id => { m[id] = era.key }))
  return m
})()

// ── Franchise chains (ordered watch sequences) ────────────────────────────────
const DC_FRANCHISE_CHAINS = [
  { name: 'Dark Knight Trilogy',  ids: [1007, 1008, 1009] },
  { name: 'Superman Donner Era',  ids: [1001, 1002] },
  { name: 'Batman Burton Era',    ids: [1003, 1004] },
  { name: 'Batman Schumacher',    ids: [1005, 1006] },
  { name: 'DCEU',                 ids: [1010, 1011, 1013, 1014, 1015, 1016, 1018, 1019] },
  { name: 'Suicide Squad',        ids: [1012, 1020] },
  { name: 'Wonder Woman',         ids: [1013, 1018] },
  { name: 'Aquaman',              ids: [1015, 1026] },
  { name: 'Shazam!',              ids: [1016, 1023] },
  { name: 'New DCU',              ids: [1027, 1028] },
  { name: 'Dark Knight Returns',  ids: [1053, 1054] },
  { name: 'Long Halloween',       ids: [1076, 1077] },
]

// ── Batman-related IDs (for cross-recommendation) ─────────────────────────────
const BATMAN_IDS = [1003, 1004, 1005, 1006, 1007, 1008, 1009, 1011, 1019, 1033,
  1034, 1036, 1037, 1038, 1041, 1046, 1050, 1053, 1054, 1057, 1060, 1062, 1064,
  1066, 1068, 1071, 1076, 1077, 1079]

// ── Superman-related IDs ───────────────────────────────────────────────────────
const SUPERMAN_IDS = [1001, 1002, 1010, 1011, 1014, 1019, 1039, 1044, 1047, 1048,
  1052, 1055, 1069, 1070, 1074]

// ── Era label overrides for display ──────────────────────────────────────────
const ERA_LABELS = {
  'classic-dc':       'Classic DC Era',
  'dceu':             'DCEU',
  'reevesverse':      'Reevesverse',
  'new-dcu':          'New DCU',
  'dc-animated-movies': 'DC Animated Films',
  'dc-animated-series': 'DC Animated Universe',
  'classic-dc-tv':    'Classic DC TV',
  'arrowverse':       'Arrowverse',
  'in-development':   'Coming Soon',
}

// ── Watch Next Recommendation ─────────────────────────────────────────────────
export function getDCWatchNextRecommendation(watched, villainRatings, allTitles) {
  if (!watched || !allTitles?.length) return null
  const unwatched = allTitles.filter(t => !watched.has(t.id) && !t.comingSoon)
  if (!unwatched.length) return null

  // Strategy 1: Continue an active franchise chain
  for (const chain of DC_FRANCHISE_CHAINS) {
    const inChain = chain.ids.filter(id => allTitles.some(t => t.id === id))
    const watchedInChain = inChain.filter(id => watched.has(id))
    const nextId = inChain.find(id => !watched.has(id) && allTitles.some(t => t.id === id && !t.comingSoon))
    if (watchedInChain.length > 0 && nextId) {
      const title = allTitles.find(t => t.id === nextId)
      const prevId = watchedInChain[watchedInChain.length - 1]
      const prevTitle = allTitles.find(t => t.id === prevId)
      if (title) {
        const reason = prevTitle
          ? `Because you watched ${prevTitle.title.replace(/ \(\d{4}\)$/, '')}`
          : `Next in the ${chain.name} saga`
        return { title, reason }
      }
    }
  }

  // Strategy 2: Batman fan → suggest more Batman
  const watchedBatman = BATMAN_IDS.filter(id => watched.has(id))
  if (watchedBatman.length >= 2) {
    const nextBatman = BATMAN_IDS.find(id => !watched.has(id) && allTitles.some(t => t.id === id && !t.comingSoon))
    if (nextBatman) {
      const title = allTitles.find(t => t.id === nextBatman)
      if (title) return { title, reason: 'Because you love Batman content' }
    }
  }

  // Strategy 3: Superman fan → suggest more Kryptonian content
  const watchedSuperman = SUPERMAN_IDS.filter(id => watched.has(id))
  if (watchedSuperman.length >= 2) {
    const nextSuperman = SUPERMAN_IDS.find(id => !watched.has(id) && allTitles.some(t => t.id === id && !t.comingSoon))
    if (nextSuperman) {
      const title = allTitles.find(t => t.id === nextSuperman)
      if (title) return { title, reason: 'More Kryptonian action you\'ll love' }
    }
  }

  // Strategy 4: Era progression — find in-progress era
  for (const era of DC_ERAS) {
    const eraIds = era.ids.filter(id => allTitles.some(t => t.id === id))
    const watchedHere = eraIds.filter(id => watched.has(id))
    const nextId = eraIds.find(id => !watched.has(id) && allTitles.some(t => t.id === id && !t.comingSoon))
    if (watchedHere.length > 0 && watchedHere.length < eraIds.length && nextId) {
      const title = allTitles.find(t => t.id === nextId)
      if (title) return { title, reason: `Next in the ${ERA_LABELS[era.key] ?? era.label}` }
    }
  }

  // Strategy 5: Highly rated era → suggest something from that era
  const ratedWatched = Object.entries(villainRatings ?? {})
    .filter(([id]) => watched.has(Number(id)))
    .map(([id, r]) => ({ id: Number(id), rating: r }))

  if (ratedWatched.length > 0) {
    const eraScores = {}
    for (const { id, rating } of ratedWatched) {
      const era = DC_ERA_FOR_ID[id]
      if (era) eraScores[era] = (eraScores[era] ?? 0) + rating
    }
    const topEra = Object.entries(eraScores).sort((a, b) => b[1] - a[1])[0]?.[0]
    if (topEra) {
      const candidate = unwatched.find(t => DC_ERA_FOR_ID[t.id] === topEra)
      if (candidate) {
        return { title: candidate, reason: `Because you enjoy the ${ERA_LABELS[topEra] ?? topEra}` }
      }
    }
  }

  // Fallback: Superman (1978) as the canonical starting point
  const superman78 = allTitles.find(t => t.id === 1001)
  if (superman78 && !watched.has(1001)) {
    return { title: superman78, reason: 'The perfect starting point — where DC cinema began' }
  }
  // Or The Dark Knight
  const tdk = allTitles.find(t => t.id === 1008)
  if (tdk && !watched.has(1008)) {
    return { title: tdk, reason: 'The greatest DC film ever made' }
  }
  return { title: unwatched[0], reason: 'Up next in your DC queue' }
}

// ── Base popularity weights per title ─────────────────────────────────────────
const DC_BASE_WEIGHTS = {
  1001: 78, // Superman (1978)
  1002: 68, // Superman II
  1003: 82, // Batman (1989)
  1004: 72, // Batman Returns
  1005: 58, // Batman Forever
  1006: 45, // Batman & Robin
  1007: 88, // Batman Begins
  1008: 100,// The Dark Knight
  1009: 85, // Dark Knight Rises
  1010: 80, // Man of Steel
  1011: 72, // Batman v Superman
  1012: 65, // Suicide Squad (2016)
  1013: 86, // Wonder Woman
  1014: 70, // Justice League
  1015: 84, // Aquaman
  1016: 82, // Shazam!
  1017: 63, // Birds of Prey
  1018: 60, // Wonder Woman 1984
  1019: 83, // Zack Snyder's Justice League
  1020: 80, // The Suicide Squad
  1021: 85, // Peacemaker S1
  1022: 64, // Black Adam
  1023: 58, // Shazam! Fury of the Gods
  1024: 66, // The Flash
  1025: 72, // Blue Beetle
  1026: 65, // Aquaman and the Lost Kingdom
  1027: 78, // Creature Commandos
  1028: 82, // Superman (2025)
  1033: 90, // The Batman
  1034: 88, // Batman: Mask of the Phantasm
  1046: 82, // Batman: Under the Red Hood
  1048: 78, // All-Star Superman
  1050: 76, // Batman: Year One
  1053: 84, // Dark Knight Returns Pt 1
  1054: 83, // Dark Knight Returns Pt 2
  1056: 80, // Flashpoint Paradox
  1057: 78, // Batman: Assault on Arkham
  1064: 74, // Batman: The Killing Joke
  1069: 76, // Death of Superman
  1076: 80, // Long Halloween Pt 1
  1077: 79, // Long Halloween Pt 2
}

// ── Trending This Week ─────────────────────────────────────────────────────────
export function getDCTrendingTitles(allTitles, count = 5) {
  const weekSeed  = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  const month     = new Date().getMonth() + 1
  const isSummer  = month >= 5 && month <= 8
  const isHoliday = month === 11 || month === 12

  const candidates = allTitles.filter(t => !t.comingSoon)

  const scored = candidates.map(t => {
    const base = DC_BASE_WEIGHTS[t.id] ?? 50
    // Deterministic weekly variation ±15
    const hash = (weekSeed * 1664525 + t.id * 22695477 + 1013904223) >>> 0
    const weekBoost = (hash % 31) - 15
    // Seasonal boosts
    const seasonBoost = (isSummer && base >= 80) ? 10
      : (isHoliday && [1008, 1003, 1001].includes(t.id)) ? 12
      : 0
    return { title: t, score: base + weekBoost + seasonBoost }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, count).map((item, i) => ({ rank: i + 1, title: item.title }))
}
