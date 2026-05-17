const WEEKLY_POOL = [
  { id: 'w_watch5',    label: 'Watch 5 titles this week',          icon: '🎬', target: 5,  type: 'watch', xp: 150, badge: null },
  { id: 'w_binge',     label: 'Watch 3 titles in a single day',    icon: '🍿', target: 3,  type: 'binge', xp: 200, badge: 'binge_king' },
  { id: 'w_streak7',   label: 'Maintain a 7-day streak',           icon: '🔥', target: 7,  type: 'streak', xp: 200, badge: 'streak_7' },
  { id: 'w_rate10',    label: 'Rate 10 titles this week',          icon: '⭐', target: 10, type: 'rate',  xp: 100, badge: null },
  { id: 'w_era',       label: 'Watch titles from 3 different eras',icon: '📅', target: 3,  type: 'era',   xp: 150, badge: null },
  { id: 'w_trivia7',   label: 'Answer trivia 5 days this week',    icon: '🧠', target: 5,  type: 'trivia_days', xp: 150, badge: null },
  { id: 'w_social',    label: 'Make 3 community posts',            icon: '💬', target: 3,  type: 'post',  xp: 100, badge: null },
  { id: 'w_tier',      label: 'Tier-rank 5 titles',                icon: '🏆', target: 5,  type: 'tier',  xp: 125, badge: null },
]

function seededRand(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

/** Get ISO week number for a date string */
export function getWeekNumber(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const jan4 = new Date(d.getFullYear(), 0, 4)
  const startOfWeek1 = new Date(jan4.getTime() - jan4.getDay() * 86400000)
  return Math.floor((d - startOfWeek1) / (7 * 86400000)) + 1
}

/** Get Monday of the week containing dateStr */
export function getWeekMonday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay() // 0=Sun
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d.getTime() + diff * 86400000)
  return monday.toISOString().slice(0, 10)
}

/** Get this week's challenge */
export function getWeeklyChallenge(dateStr) {
  const weekNum = getWeekNumber(dateStr)
  const year = new Date(dateStr + 'T00:00:00').getFullYear()
  const seed = year * 1000 + weekNum
  const rand = seededRand(seed)
  const idx = Math.floor(rand() * WEEKLY_POOL.length)
  return { ...WEEKLY_POOL[idx], weekStart: getWeekMonday(dateStr), weekNum }
}

/** Next Monday from today */
export function getNextMonday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  const next = new Date(d.getTime() + daysUntilMonday * 86400000)
  return next.toISOString().slice(0, 10)
}
