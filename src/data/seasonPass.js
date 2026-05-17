// Each month has a theme and 10 tasks
const SEASON_THEMES = [
  { month: 1,  name: 'New Year, New Hero',    color: '#60a5fa', icon: '🦸', frame: 'blue-star' },
  { month: 2,  name: 'Hearts of Vibranium',   color: '#E81C2E', icon: '❤️', frame: 'red-pulse' },
  { month: 3,  name: 'Spring Awakening',      color: '#4ade80', icon: '🌿', frame: 'green-vine' },
  { month: 4,  name: 'Age of Heroes',         color: '#F5C518', icon: '⚡', frame: 'gold-bolt' },
  { month: 5,  name: 'Infinity Gauntlet',     color: '#a78bfa', icon: '💎', frame: 'infinity-gem' },
  { month: 6,  name: 'Summer Saga',           color: '#f97316', icon: '☀️', frame: 'solar-flare' },
  { month: 7,  name: 'Asgardian Thunder',     color: '#3b82f6', icon: '⚡', frame: 'lightning' },
  { month: 8,  name: 'Wakanda Rises',         color: '#7C3AED', icon: '🐾', frame: 'vibranium' },
  { month: 9,  name: 'Multiverse Madness',    color: '#ec4899', icon: '🌀', frame: 'multiverse' },
  { month: 10, name: 'Halloween Horror',      color: '#f97316', icon: '🎃', frame: 'pumpkin' },
  { month: 11, name: 'Assembling Forces',     color: '#E81C2E', icon: '🛡️', frame: 'shield' },
  { month: 12, name: 'Doomsday Countdown',    color: '#E81C2E', icon: '💣', frame: 'countdown' },
]

const TASK_TEMPLATES = [
  { label: 'Watch any 1 title',        target: 1,  type: 'watch',  xp: 20 },
  { label: 'Rate 3 titles',            target: 3,  type: 'rate',   xp: 25 },
  { label: 'Answer 3 trivia questions',target: 3,  type: 'trivia', xp: 25 },
  { label: 'Watch 5 titles',           target: 5,  type: 'watch',  xp: 50 },
  { label: 'Complete a daily mission', target: 1,  type: 'mission',xp: 20 },
  { label: 'Post in the community',    target: 1,  type: 'post',   xp: 20 },
  { label: 'Watch 10 titles',          target: 10, type: 'watch',  xp: 100 },
  { label: 'Get a 3-day streak',       target: 3,  type: 'streak', xp: 50 },
  { label: 'Rate 10 titles',           target: 10, type: 'rate',   xp: 75 },
  { label: 'Watch 15 titles this month',target:15, type: 'watch',  xp: 150 },
]

/** Get current season (month) info */
export function getCurrentSeason(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const month = d.getMonth() + 1
  const theme = SEASON_THEMES.find(t => t.month === month) ?? SEASON_THEMES[0]
  return {
    ...theme,
    tasks: TASK_TEMPLATES.map((t, i) => ({ ...t, id: `task_${i}` })),
    monthKey: `${d.getFullYear()}-${String(month).padStart(2,'0')}`,
    // Days left in month
    daysLeft: new Date(d.getFullYear(), month, 0).getDate() - d.getDate(),
  }
}

/** Get how many season tasks are completed based on state */
export function getSeasonProgress(season, seasonState) {
  // seasonState: { [monthKey]: { completedTasks: string[], watchCount, rateCount, triviaCount, ... } }
  const state = seasonState?.[season.monthKey] ?? {}
  const completed = state.completedTasks ?? []
  return season.tasks.map((task, i) => ({
    ...task,
    done: completed.includes(task.id),
    locked: i > 0 && !completed.includes(season.tasks[i - 1]?.id), // unlock sequentially
  }))
}

export { SEASON_THEMES }
