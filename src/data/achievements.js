import {
  TITLES,
  IDS_XMEN_ERA, IDS_DEFENDERS_SAGA, IDS_INFINITY_SAGA,
  IDS_MULTIVERSE_SAGA, IDS_SPIDERMAN, IDS_BLACK_PANTHER, IDS_THOR,
  IDS_CAP_AMERICA, IDS_DOCTOR_STRANGE, IDS_GUARDIANS, IDS_ANT_MAN,
  IDS_IRON_MAN, IDS_HULK, IDS_AVENGERS,
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

  // ── Hero-Specific Completions ────────────────────────────────────────────
  {
    id: 'hero-asgardian',
    name: 'Asgardian',
    desc: 'Watch all four Thor movies',
    icon: '⚡',
    category: 'hero',
    check: ({ watched }) => allWatched(IDS_THOR, watched),
  },
  {
    id: 'hero-spider',
    name: 'Friendly Neighborhood',
    desc: 'Watch all MCU Spider-Man movies',
    icon: '🕷',
    category: 'hero',
    check: ({ watched }) => [43,56,57].every(id => watched.has(id)),
  },
  {
    id: 'hero-wakanda',
    name: 'Wakanda Forever',
    desc: 'Watch all Black Panther movies',
    icon: '🖐',
    category: 'hero',
    check: ({ watched }) => allWatched(IDS_BLACK_PANTHER, watched),
  },
  {
    id: 'hero-sorcerer',
    name: 'Sorcerer Supreme',
    desc: 'Watch all Doctor Strange movies',
    icon: '🔮',
    category: 'hero',
    check: ({ watched }) => allWatched(IDS_DOCTOR_STRANGE, watched),
  },
  {
    id: 'hero-guardians',
    name: 'Guardians Assemble',
    desc: 'Watch all Guardians of the Galaxy movies',
    icon: '🌌',
    category: 'hero',
    check: ({ watched }) => allWatched(IDS_GUARDIANS, watched),
  },
  {
    id: 'hero-antman',
    name: 'Ant-Sized',
    desc: 'Watch all Ant-Man movies',
    icon: '🐜',
    category: 'hero',
    check: ({ watched }) => allWatched(IDS_ANT_MAN, watched),
  },
  {
    id: 'hero-captain',
    name: 'Super Soldier',
    desc: 'Watch all Captain America movies',
    icon: '🛡',
    category: 'hero',
    check: ({ watched }) => allWatched(IDS_CAP_AMERICA, watched),
  },
  {
    id: 'hero-ironman',
    name: 'Genius Billionaire',
    desc: 'Watch all Iron Man movies',
    icon: '🤖',
    category: 'hero',
    check: ({ watched }) => allWatched(IDS_IRON_MAN, watched),
  },
  {
    id: 'hero-hulk',
    name: 'Strongest Avenger',
    desc: 'Watch The Incredible Hulk',
    icon: '💚',
    category: 'hero',
    check: ({ watched }) => allWatched(IDS_HULK, watched),
  },
  {
    id: 'hero-avengers',
    name: "Earth's Mightiest",
    desc: 'Watch all four Avengers movies',
    icon: '🦸',
    category: 'hero',
    check: ({ watched }) => allWatched(IDS_AVENGERS, watched),
  },

  // ── Rating Achievements ──────────────────────────────────────────────────
  {
    id: 'rating-harsh',
    name: 'Harsh Critic',
    desc: 'Rate 5 titles just 1 star',
    icon: '⭐',
    category: 'rating',
    check: ({ ratings = {} }) => Object.values(ratings).filter(r => r === 1).length >= 5,
  },
  {
    id: 'rating-fan',
    name: 'True Fan',
    desc: 'Rate 25 titles',
    icon: '🌟',
    category: 'rating',
    check: ({ ratings = {} }) => Object.values(ratings).length >= 25,
  },
  {
    id: 'rating-movies',
    name: 'Movie Buff',
    desc: 'Rate every movie on your list',
    icon: '🎬',
    category: 'rating',
    check: ({ ratings = {}, watched }) => {
      const movies = TITLES.filter(t => t.type === 'movie' && watched.has(t.id))
      return movies.length > 0 && movies.every(t => ratings[t.id] != null)
    },
  },
  {
    id: 'rating-expert',
    name: 'Certified Marvel Expert',
    desc: 'Rate every single title you have watched',
    icon: '🏅',
    category: 'rating',
    check: ({ ratings = {}, watched }) =>
      watched.size > 0 && [...watched].every(id => ratings[id] != null),
  },

  // ── Character Achievements ───────────────────────────────────────────────
  {
    id: 'char-stan',
    name: 'Stan Lee Fan',
    desc: 'Find all Stan Lee cameos',
    icon: '👴',
    category: 'character',
    secret: true,
    check: () => false, // manually triggered
  },
  {
    id: 'char-postcredits',
    name: 'Post Credits Addict',
    desc: 'Watch all post-credit scenes',
    icon: '📽',
    category: 'character',
    secret: true,
    check: () => false, // manually triggered
  },
  {
    id: 'char-snap',
    name: 'Snap Survivor',
    desc: 'Track all snap survivors',
    icon: '🫰',
    category: 'character',
    secret: true,
    check: () => false, // manually triggered
  },
  {
    id: 'char-stones',
    name: 'Stone Collector',
    desc: 'Mark all 6 Infinity Stones as seen',
    icon: '💎',
    category: 'character',
    secret: true,
    check: () => false, // manually triggered
  },

  // ── Social Achievements ──────────────────────────────────────────────────
  {
    id: 'social-watchparty',
    name: 'Watch Party Host',
    desc: 'Host your first watch party',
    icon: '🍿',
    category: 'social',
    check: () => false, // requires social feature
  },
  {
    id: 'social-squad',
    name: 'Squad Goals',
    desc: 'Have 5 friends on the app',
    icon: '👥',
    category: 'social',
    check: () => false, // requires social feature
  },
  {
    id: 'social-debate',
    name: 'Debate Champion',
    desc: 'Win 10 daily debates',
    icon: '🗣',
    category: 'social',
    check: () => false, // requires social feature
  },

  // ── Special Achievements ─────────────────────────────────────────────────
  {
    id: 'special-nightowl',
    name: 'Night Owl',
    desc: 'Mark a title as watched after midnight',
    icon: '🦉',
    category: 'special',
    // checked in App on watch toggle
    check: () => false,
  },
  {
    id: 'special-weekend',
    name: 'Weekend Warrior',
    desc: 'Watch 10 titles across a single weekend',
    icon: '🛋',
    category: 'special',
    check: ({ watchHistory }) => {
      for (const [dateStr, ids] of Object.entries(watchHistory)) {
        const d = new Date(dateStr)
        if (d.getDay() === 6) { // Saturday
          const sunStr = new Date(d.getTime() + 86400000).toISOString().slice(0, 10)
          if ((ids?.length ?? 0) + (watchHistory[sunStr]?.length ?? 0) >= 10) return true
        }
      }
      return false
    },
  },
  {
    id: 'special-phasemaster',
    name: 'Phase Master',
    desc: 'Complete every MCU phase — watch the full Infinity and Multiverse sagas',
    icon: '🌀',
    category: 'special',
    check: ({ watched }) =>
      allWatched(IDS_INFINITY_SAGA, watched) && allWatched(IDS_MULTIVERSE_SAGA, watched),
  },
  {
    id: 'special-completionist',
    name: 'True Completionist',
    desc: 'Unlock every other achievement',
    icon: '🏆',
    category: 'special',
    check: ({ achievements = {} }) =>
      ACHIEVEMENTS.filter(a => a.id !== 'special-completionist').every(a => achievements[a.id]?.unlocked),
  },
  {
    id: 'special-multiverse',
    name: 'Multiverse Explorer',
    desc: 'Switch between the Marvel and DC tracker 10 times',
    icon: '🌐',
    category: 'special',
    check: () => false, // checked in App on universe switch
  },
  {
    id: 'special-ogfan',
    name: 'OG Fan',
    desc: 'Log in on 100 different days total',
    icon: '📆',
    category: 'special',
    check: ({ loginDates }) => new Set(loginDates).size >= 100,
  },
  {
    id: 'special-legendary',
    name: 'Legendary',
    desc: 'Reach the highest S.H.I.E.L.D. rank — Iron Man Level',
    icon: '🦾',
    category: 'special',
    check: ({ xp = 0 }) => xp >= 15000,
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
  hero:      '🦸 Hero-Specific',
  rating:    '⭐ Rating Achievements',
  character: '🎭 Character Achievements',
  social:    '👥 Social Achievements',
  special:   '✨ Special Achievements',
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
