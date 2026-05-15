import {
  TITLES,
  IDS_XMEN_ERA, IDS_DEFENDERS_SAGA, IDS_INFINITY_SAGA,
  IDS_MULTIVERSE_SAGA, IDS_SPIDERMAN, IDS_BLACK_PANTHER, IDS_THOR,
} from './titles.js'

// ── Streak utilities ──────────────────────────────────────────────────────────
export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

/** Given a sorted array of date strings, returns the current streak ending today (or yesterday) */
export function calcStreak(sortedDates) {
  if (!sortedDates.length) return 0
  const today = todayStr()
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const unique = [...new Set(sortedDates)].sort().reverse()
  const start = unique[0]
  if (start !== today && start !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1])
    const curr = new Date(unique[i])
    const diff = (prev - curr) / 86400000
    if (Math.round(diff) === 1) streak++
    else break
  }
  return streak
}

/** Max streak from any contiguous run in sorted date array */
export function calcLongestStreak(sortedDates) {
  if (!sortedDates.length) return 0
  const unique = [...new Set(sortedDates)].sort()
  let max = 1, cur = 1
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1])
    const curr = new Date(unique[i])
    if (Math.round((curr - prev) / 86400000) === 1) { cur++; max = Math.max(max, cur) }
    else cur = 1
  }
  return max
}

function allWatched(idSet, watched) {
  return [...idSet].every(id => watched.has(id))
}

// ── Achievement definitions ───────────────────────────────────────────────────
// check(ctx) → boolean. ctx = { watched, watchHistory, loginDates, listSize }
// secret:true = show as "???" when locked
export const ACHIEVEMENTS = [
  // ── Watch Streaks ────────────────────────────────────────────────────────
  {
    id: 'streak-3',
    name: 'Relentless',
    desc: 'Watch something 3 days in a row',
    icon: '🔥',
    category: 'streak',
    check: ({ watchHistory }) =>
      calcStreak(Object.keys(watchHistory)) >= 3,
  },
  {
    id: 'streak-7',
    name: 'On a Roll',
    desc: 'Watch something 7 days in a row',
    icon: '🔥',
    category: 'streak',
    check: ({ watchHistory }) =>
      calcStreak(Object.keys(watchHistory)) >= 7,
  },
  {
    id: 'streak-30',
    name: 'Infinity Stone',
    desc: 'Watch something 30 days in a row',
    icon: '💜',
    category: 'streak',
    check: ({ watchHistory }) =>
      calcStreak(Object.keys(watchHistory)) >= 30,
  },

  // ── Login Streaks ────────────────────────────────────────────────────────
  {
    id: 'login-3',
    name: 'Daily Check-In',
    desc: 'Log in to the tracker 3 days in a row',
    icon: '📅',
    category: 'login',
    check: ({ loginDates }) => calcStreak(loginDates) >= 3,
  },
  {
    id: 'login-7',
    name: 'Loyal Agent',
    desc: 'Log in 7 days in a row',
    icon: '📅',
    category: 'login',
    check: ({ loginDates }) => calcStreak(loginDates) >= 7,
  },
  {
    id: 'login-30',
    name: 'Director Fury',
    desc: 'Log in 30 days in a row',
    icon: '🕶',
    category: 'login',
    check: ({ loginDates }) => calcStreak(loginDates) >= 30,
  },

  // ── Milestone ────────────────────────────────────────────────────────────
  {
    id: 'first-watch',
    name: 'Suit Up',
    desc: 'Mark your first title as watched',
    icon: '🦺',
    category: 'milestone',
    check: ({ watched }) => watched.size >= 1,
  },
  {
    id: 'milestone-10',
    name: 'Rookie Hero',
    desc: 'Reach 10% of the full list',
    icon: '🥉',
    category: 'milestone',
    check: ({ watched }) => (watched.size / TITLES.length) >= 0.10,
  },
  {
    id: 'milestone-25',
    name: 'On Your Left',
    desc: 'Reach 25% of the full list',
    icon: '🥈',
    category: 'milestone',
    check: ({ watched }) => (watched.size / TITLES.length) >= 0.25,
  },
  {
    id: 'milestone-50',
    name: 'Half the Universe',
    desc: 'Reach 50% of the full list',
    icon: '🌓',
    category: 'milestone',
    check: ({ watched }) => (watched.size / TITLES.length) >= 0.50,
  },
  {
    id: 'milestone-75',
    name: 'Almost There',
    desc: 'Reach 75% of the full list',
    icon: '🥇',
    category: 'milestone',
    check: ({ watched }) => (watched.size / TITLES.length) >= 0.75,
  },
  {
    id: 'milestone-100',
    name: 'The Final Battle',
    desc: 'Watch every single title — 100% complete!',
    icon: '🏆',
    category: 'milestone',
    check: ({ watched }) => watched.size >= TITLES.length,
  },

  // ── Era / Saga Completions ───────────────────────────────────────────────
  {
    id: 'xmen-era',
    name: 'Mutant Nation',
    desc: 'Complete the X-Men, Deadpool & Logan saga',
    icon: '⚡',
    category: 'saga',
    check: ({ watched }) => allWatched(IDS_XMEN_ERA, watched),
  },
  {
    id: 'defenders-saga',
    name: "Hell's Kitchen Heroes",
    desc: 'Complete the full Defenders Saga (Netflix)',
    icon: '🕸',
    category: 'saga',
    check: ({ watched }) => allWatched(IDS_DEFENDERS_SAGA, watched),
  },
  {
    id: 'infinity-saga',
    name: 'Infinity Saga Complete',
    desc: 'Watch every MCU Infinity Saga film through Endgame',
    icon: '💫',
    category: 'saga',
    check: ({ watched }) => allWatched(IDS_INFINITY_SAGA, watched),
  },
  {
    id: 'multiverse-saga',
    name: 'Multiverse Saga Complete',
    desc: 'Watch everything from WandaVision through Secret Wars',
    icon: '🌌',
    category: 'saga',
    check: ({ watched }) => allWatched(IDS_MULTIVERSE_SAGA, watched),
  },

  // ── Type Completions ─────────────────────────────────────────────────────
  {
    id: 'all-movies',
    name: 'Box Office Champion',
    desc: 'Watch every movie on the full list',
    icon: '🎬',
    category: 'type',
    check: ({ watched }) =>
      TITLES.filter(t => t.type === 'movie').every(t => watched.has(t.id)),
  },
  {
    id: 'all-tv',
    name: 'Streaming Overload',
    desc: 'Watch every TV show on the full list',
    icon: '📺',
    category: 'type',
    check: ({ watched }) =>
      TITLES.filter(t => t.type === 'tv').every(t => watched.has(t.id)),
  },

  // ── Speed / Binge ────────────────────────────────────────────────────────
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    desc: 'Mark 5 or more titles as watched in a single day',
    icon: '⚡',
    category: 'speed',
    check: ({ watchHistory }) =>
      Object.values(watchHistory).some(ids => ids.length >= 5),
  },
  {
    id: 'binge-king',
    name: 'Binge King',
    desc: 'Mark a full TV series/season as watched in one day',
    icon: '👑',
    category: 'speed',
    check: ({ watchHistory }) =>
      Object.values(watchHistory).some(ids =>
        ids.some(id => TITLES.find(t => t.id === id)?.type === 'tv')
      ),
  },
  {
    id: 'spider-sense',
    name: 'With Great Power',
    desc: 'Watch all three MCU Spider-Man films',
    icon: '🕷',
    category: 'speed',
    check: ({ watched }) => allWatched(IDS_SPIDERMAN, watched),
  },

  // ── Secret Achievements ──────────────────────────────────────────────────
  {
    id: 'secret-iron-man',
    name: 'I Am Iron Man',
    desc: 'Iron Man was the very first thing you ever watched',
    icon: '🤖',
    category: 'secret',
    secret: true,
    // checked manually in toggle handler, not via generic check
    check: () => false,
  },
  {
    id: 'secret-endgame',
    name: 'Whatever It Takes',
    desc: 'You marked Avengers: Endgame as watched',
    icon: '🧤',
    category: 'secret',
    secret: true,
    check: ({ watched }) => watched.has(48),
  },
  {
    id: 'secret-wakanda',
    name: 'Wakanda Forever',
    desc: 'Watch both Black Panther films back to back',
    icon: '🖐',
    category: 'secret',
    secret: true,
    check: ({ watched }) => allWatched(IDS_BLACK_PANTHER, watched),
  },
  {
    id: 'secret-worthy',
    name: 'Whosoever Is Worthy',
    desc: 'Watch every Thor film',
    icon: '⚡',
    category: 'secret',
    secret: true,
    check: ({ watched }) => allWatched(IDS_THOR, watched),
  },
  {
    id: 'secret-language',
    name: 'Language!',
    desc: 'You have exactly 5 titles remaining',
    icon: '😤',
    category: 'secret',
    secret: true,
    check: ({ watched }) => (TITLES.length - watched.size) === 5,
  },
  {
    id: 'secret-midnight',
    name: 'Night Owl',
    desc: 'Open the tracker between midnight and 3 AM',
    icon: '🌙',
    category: 'secret',
    secret: true,
    // checked in App on login
    check: () => false,
  },
]

export const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]))

export const CATEGORY_LABELS = {
  streak:    '🔥 Watch Streaks',
  login:     '📅 Login Streaks',
  milestone: '🏅 Milestones',
  saga:      '⚡ Saga Completions',
  type:      '🎭 Type Completions',
  speed:     '🚀 Speed & Binge',
  secret:    '🔮 Secret Achievements',
}

/**
 * Returns array of newly-unlocked achievement IDs.
 * prev = { [id]: { unlocked, unlockedAt } }
 */
export function checkAchievements(prev, ctx) {
  const newIds = []
  for (const def of ACHIEVEMENTS) {
    if (prev[def.id]?.unlocked) continue
    if (def.check(ctx)) newIds.push(def.id)
  }
  return newIds
}
