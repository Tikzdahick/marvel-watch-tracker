// triviaRanks.js — Rank system data and utilities for Marvel Trivia

// 7 Trivia Ranks
export const RANKS = [
  {
    key: 'civilian', label: 'Civilian', icon: '👤',
    min: 0, max: 99,
    color: '#888', bg: 'rgba(136,136,136,0.1)', border: 'rgba(136,136,136,0.3)',
    glow: 'none',
  },
  {
    key: 'shield-agent', label: 'S.H.I.E.L.D. Agent', icon: '🛡️',
    min: 100, max: 249,
    color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)',
    glow: '0 0 8px rgba(96,165,250,0.4)',
  },
  {
    key: 'hero-training', label: 'Hero in Training', icon: '🦸',
    min: 250, max: 499,
    color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)',
    glow: '0 0 8px rgba(74,222,128,0.4)',
  },
  {
    key: 'avenger', label: 'Avenger', icon: '⚡',
    min: 500, max: 999,
    color: '#F5C518', bg: 'rgba(245,197,24,0.1)', border: 'rgba(245,197,24,0.3)',
    glow: '0 0 12px rgba(245,197,24,0.5)',
  },
  {
    key: 'elite-avenger', label: 'Elite Avenger', icon: '🌟',
    min: 1000, max: 1999,
    color: '#E81C2E', bg: 'rgba(232,28,46,0.1)', border: 'rgba(232,28,46,0.35)',
    glow: '0 0 14px rgba(232,28,46,0.5)',
  },
  {
    key: 'infinity-guardian', label: 'Infinity Guardian', icon: '💎',
    min: 2000, max: 4999,
    color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.35)',
    glow: '0 0 16px rgba(167,139,250,0.5)',
    gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
  },
  {
    key: 'nexus-being', label: 'Nexus Being', icon: '🌌',
    min: 5000, max: Infinity,
    color: '#F5C518', bg: 'rgba(245,197,24,0.08)', border: 'rgba(245,197,24,0.4)',
    glow: '0 0 20px rgba(245,197,24,0.6), 0 0 40px rgba(232,28,46,0.3)',
    gradient: 'linear-gradient(135deg, #F5C518 0%, #E81C2E 50%, #a78bfa 100%)',
  },
]

export const RANK_MAP = Object.fromEntries(RANKS.map(r => [r.key, r]))

/** Get the rank object for a given total points value */
export function getRank(points = 0) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].min) return RANKS[i]
  }
  return RANKS[0]
}

/** Get the next rank object (null if already max) */
export function getNextRank(points = 0) {
  const current = getRank(points)
  const idx = RANKS.indexOf(current)
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null
}

/** Points until next rank (0 if at max) */
export function getPointsToNext(points = 0) {
  const next = getNextRank(points)
  if (!next) return 0
  return next.min - points
}

/** Progress 0→1 within current rank tier */
export function getRankProgress(points = 0) {
  const current = getRank(points)
  if (current.max === Infinity) return 1
  const range = current.max - current.min + 1
  const within = points - current.min
  return Math.min(1, within / range)
}

/** Week start (Monday) for a given YYYY-MM-DD string */
export function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  const diff = (day === 0 ? 6 : day - 1) // Monday = 0
  d.setDate(d.getDate() - diff)
  return d.toISOString().split('T')[0]
}

/**
 * Calculate points earned for a single answer.
 * Pass the triviaState BEFORE this answer.
 */
export function calcPointsEarned(correct, prevState = {}, today = '') {
  if (!correct) return 0
  const currentStreak = prevState.currentStreak ?? 0
  const newStreak = currentStreak + 1

  let pts = 10 // base correct
  if (newStreak >= 5) pts += 10  // 5-in-a-row bonus (stacks with 3-bonus)
  else if (newStreak >= 3) pts += 5  // 3-in-a-row bonus

  // Daily completion bonus — first correct answer today
  const answeredToday = prevState.answers?.[today]
  if (answeredToday === undefined) pts += 5

  // Perfect week bonus — 7 consecutive days all correct
  if (today) {
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today + 'T00:00:00')
      d.setDate(d.getDate() - i - 1)
      return d.toISOString().split('T')[0]
    })
    const allPrevCorrect = weekDays.every(d => prevState.answers?.[d] === true)
    if (allPrevCorrect) pts += 50
  }

  return pts
}
