// XP earned per action
export const XP_EVENTS = {
  WATCH:          50,   // mark a title watched
  RATE:           10,   // rate a title
  NOTE:           15,   // add a note
  POST:           15,   // community post
  COMMENT:         5,   // comment on post
  DAILY_LOGIN:    20,   // daily login
  STREAK_BONUS:  100,   // 7-day streak
  ERA_COMPLETE:  200,   // finish an era
  MISSION_ALL:    50,   // complete all 3 daily missions
  WEEKLY_DONE:   150,   // complete weekly challenge
  SEASON_TASK:    30,   // complete a season pass task
  TRIVIA_CORRECT: 10,   // correct trivia (mirrors trivia points)
  PREDICTION_ACE:  25,  // prediction within 1 star of actual
  BADGE_EARNED:   20,   // unlock a badge
}

// SHIELD Rank definitions — Marvel-exclusive rank system
export const LEVELS = [
  { key: 'recruit',   label: 'S.H.I.E.L.D. Recruit',   minXP: 0,     maxXP: 499,   color: '#888',    icon: '🪖',  gradient: null,                                              sub: 'Your mission has begun.' },
  { key: 'agent',     label: 'S.H.I.E.L.D. Agent',     minXP: 500,   maxXP: 1499,  color: '#60a5fa', icon: '🛡️',  gradient: null,                                              sub: 'Cleared for field operations.' },
  { key: 'senior',    label: 'Senior Agent',            minXP: 1500,  maxXP: 2999,  color: '#4ade80', icon: '🔵',  gradient: null,                                              sub: 'Trusted operative of S.H.I.E.L.D.' },
  { key: 'commander', label: 'S.H.I.E.L.D. Commander', minXP: 3000,  maxXP: 5999,  color: '#F5C518', icon: '⭐',  gradient: 'linear-gradient(135deg,#F5C518,#d4a017)',         sub: 'Command-level clearance granted.' },
  { key: 'director',  label: 'Director of S.H.I.E.L.D.',minXP: 6000, maxXP: 9999,  color: '#E81C2E', icon: '🎖️',  gradient: 'linear-gradient(135deg,#E81C2E,#a0001a)',         sub: 'The highest rank in the organisation.' },
  { key: 'avenger',   label: 'Avenger',                 minXP: 10000, maxXP: 14999, color: '#a78bfa', icon: '⚡',  gradient: 'linear-gradient(135deg,#a78bfa,#E81C2E)',         sub: 'Earth\'s Mightiest Hero.' },
  { key: 'iron_man',  label: 'Iron Man Level',          minXP: 15000, maxXP: Infinity, color: '#F5C518', icon: '🦾', gradient: 'linear-gradient(135deg,#F5C518,#E81C2E,#a78bfa)', sub: 'I am Iron Man.' },
]

export function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getNextLevel(xp) {
  const cur = getLevel(xp)
  const idx = LEVELS.findIndex(l => l.key === cur.key)
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null
}

export function getLevelProgress(xp) {
  const cur = getLevel(xp)
  if (cur.maxXP === Infinity) return 100
  const range = cur.maxXP - cur.minXP + 1
  return Math.min(100, Math.round(((xp - cur.minXP) / range) * 100))
}

export function getXPToNext(xp) {
  const next = getNextLevel(xp)
  if (!next) return 0
  return next.minXP - xp
}
