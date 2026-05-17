// All possible mission templates
const MISSION_POOL = [
  { id: 'watch1',    label: 'Watch 1 title today',         icon: '🎬', type: 'watch',   target: 1,   xp: 30 },
  { id: 'watch2',    label: 'Watch 2 titles today',         icon: '🎬', type: 'watch',   target: 2,   xp: 60 },
  { id: 'rate3',     label: 'Rate 3 titles',                icon: '⭐', type: 'rate',    target: 3,   xp: 25 },
  { id: 'note1',     label: 'Add a note to any title',      icon: '✏️', type: 'note',    target: 1,   xp: 20 },
  { id: 'trivia',    label: 'Answer today\'s trivia',       icon: '🧠', type: 'trivia',  target: 1,   xp: 20 },
  { id: 'streak',    label: 'Maintain your watch streak',   icon: '🔥', type: 'streak',  target: 1,   xp: 25 },
  { id: 'era1',      label: 'Watch a title from any era',   icon: '📅', type: 'watch',   target: 1,   xp: 20 },
  { id: 'login',     label: 'Log in today',                 icon: '✅', type: 'login',   target: 1,   xp: 10 },
  { id: 'rate1',     label: 'Rate any title',               icon: '⭐', type: 'rate',    target: 1,   xp: 15 },
  { id: 'post1',     label: 'Make a community post',        icon: '💬', type: 'post',    target: 1,   xp: 20 },
  { id: 'comment1',  label: 'Comment on a post',            icon: '💬', type: 'comment', target: 1,   xp: 15 },
  { id: 'watch3',    label: 'Watch 3 titles today',         icon: '🎬', type: 'watch',   target: 3,   xp: 90 },
]

// Simple seeded random (deterministic by date)
function seededRand(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function dateToSeed(dateStr) {
  return dateStr.split('-').reduce((acc, n) => acc * 100 + parseInt(n), 0)
}

/** Returns 3 missions for the given date string YYYY-MM-DD */
export function getDailyMissions(dateStr) {
  const rand = seededRand(dateToSeed(dateStr))
  const pool = [...MISSION_POOL]
  const chosen = []
  while (chosen.length < 3 && pool.length > 0) {
    const idx = Math.floor(rand() * pool.length)
    chosen.push(pool.splice(idx, 1)[0])
  }
  return chosen
}

/** Check progress for each mission based on today's activity */
export function getMissionProgress(missions, activity) {
  // activity: { watchedToday, ratedToday, notedToday, triviaAnswered, loggedIn, posted, commented, currentStreak }
  return missions.map(m => {
    let current = 0
    switch (m.type) {
      case 'watch':   current = activity.watchedToday ?? 0; break
      case 'rate':    current = activity.ratedToday ?? 0; break
      case 'note':    current = activity.notedToday ?? 0; break
      case 'trivia':  current = activity.triviaAnswered ? 1 : 0; break
      case 'streak':  current = (activity.currentStreak ?? 0) > 0 ? 1 : 0; break
      case 'login':   current = activity.loggedIn ? 1 : 0; break
      case 'post':    current = activity.posted ?? 0; break
      case 'comment': current = activity.commented ?? 0; break
    }
    return { ...m, current: Math.min(current, m.target), completed: current >= m.target }
  })
}

export const MISSIONS_BONUS_XP = 50  // for completing all 3
