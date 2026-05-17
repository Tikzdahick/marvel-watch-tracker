export const BADGE_CATEGORIES = {
  watcher:  { label: 'Watcher',   color: '#E81C2E', icon: '🎬' },
  streak:   { label: 'Streak',    color: '#F5C518', icon: '🔥' },
  social:   { label: 'Social',    color: '#60a5fa', icon: '👥' },
  trivia:   { label: 'Trivia',    color: '#a78bfa', icon: '🧠' },
  special:  { label: 'Special',   color: '#4ade80', icon: '✨' },
}

export const BADGES = [
  // ── Watcher ──────────────────────────────────────
  { id: 'first_watch',   cat: 'watcher', label: 'First Blood',      desc: 'Watch your first title',           icon: '🎬', rare: false, xp: 20  },
  { id: 'watch_10',      cat: 'watcher', label: 'Avengers Assemble',desc: 'Watch 10 titles',                  icon: '📺', rare: false, xp: 30  },
  { id: 'watch_25',      cat: 'watcher', label: 'Phase One',         desc: 'Watch 25 titles',                  icon: '🌟', rare: false, xp: 50  },
  { id: 'watch_50',      cat: 'watcher', label: 'Half-Blood Hero',   desc: 'Watch 50 titles',                  icon: '⚡', rare: false, xp: 75  },
  { id: 'watch_100',     cat: 'watcher', label: 'Centurion',         desc: 'Watch 100 titles',                 icon: '💯', rare: true,  xp: 150 },
  { id: 'watch_all',     cat: 'watcher', label: 'Nexus Archivist',   desc: 'Watch every title',                icon: '🌌', rare: true,  xp: 500 },
  { id: 'binge_3',       cat: 'watcher', label: 'Binge Mode',        desc: 'Watch 3 titles in one day',        icon: '🍿', rare: false, xp: 40  },
  { id: 'binge_5',       cat: 'watcher', label: 'Couch Avenger',     desc: 'Watch 5 titles in one day',        icon: '🛋️', rare: true,  xp: 100 },
  { id: 'era_blade',     cat: 'watcher', label: 'Daywalker',         desc: 'Complete the Blade Era',           icon: '🧛', rare: false, xp: 50  },
  { id: 'era_infinity',  cat: 'watcher', label: 'Infinity Master',   desc: 'Complete the Infinity Saga',       icon: '💎', rare: true,  xp: 100 },
  { id: 'tier_s',        cat: 'watcher', label: 'S-Tier Taste',      desc: 'Give 5 titles S-tier ratings',     icon: '👑', rare: false, xp: 40  },
  { id: 'all_5star',     cat: 'watcher', label: 'Perfectionist',     desc: 'Rate 10 titles 5 stars',           icon: '⭐', rare: false, xp: 50  },

  // ── Streak ───────────────────────────────────────
  { id: 'streak_3',      cat: 'streak',  label: 'On a Roll',         desc: '3-day watch streak',               icon: '🔥', rare: false, xp: 30  },
  { id: 'streak_7',      cat: 'streak',  label: 'Week Warrior',      desc: '7-day watch streak',               icon: '🔥', rare: false, xp: 75  },
  { id: 'streak_30',     cat: 'streak',  label: 'Monthly Marvel',    desc: '30-day streak',                    icon: '🔥', rare: true,  xp: 200 },
  { id: 'streak_100',    cat: 'streak',  label: 'Eternal Flame',     desc: '100-day streak',                   icon: '♾️', rare: true,  xp: 500 },
  { id: 'trivia_streak5',cat: 'streak',  label: 'Brain Trust',       desc: '5-day trivia streak',              icon: '🧠', rare: false, xp: 50  },
  { id: 'trivia_streak14',cat:'streak',  label: 'Omniscient',        desc: '14-day trivia streak',             icon: '🌟', rare: true,  xp: 150 },

  // ── Social ───────────────────────────────────────
  { id: 'first_friend',  cat: 'social',  label: 'Assemble',          desc: 'Add your first friend',            icon: '🤝', rare: false, xp: 20  },
  { id: 'friends_5',     cat: 'social',  label: 'Team Builder',      desc: 'Have 5 friends',                   icon: '👥', rare: false, xp: 50  },
  { id: 'first_post',    cat: 'social',  label: 'Voice of the People',desc: 'Make your first community post',  icon: '📢', rare: false, xp: 20  },
  { id: 'posts_10',      cat: 'social',  label: 'Community Hero',    desc: 'Make 10 community posts',          icon: '💬', rare: false, xp: 75  },
  { id: 'debate_win',    cat: 'social',  label: 'Debate Champion',   desc: 'Vote on 10 daily debates',         icon: '⚔️', rare: false, xp: 50  },

  // ── Trivia ───────────────────────────────────────
  { id: 'trivia_first',  cat: 'trivia',  label: 'Test Subject',      desc: 'Answer your first trivia',         icon: '🧩', rare: false, xp: 20  },
  { id: 'trivia_10',     cat: 'trivia',  label: 'Scholar',           desc: 'Answer 10 trivia questions',       icon: '📚', rare: false, xp: 40  },
  { id: 'trivia_50',     cat: 'trivia',  label: 'Professor X',       desc: 'Answer 50 trivia questions',       icon: '🎓', rare: true,  xp: 100 },
  { id: 'trivia_perfect_week', cat:'trivia', label:'Perfect Week',   desc: 'Get all 7 daily trivias correct',  icon: '🏆', rare: true,  xp: 150 },
  { id: 'rank_avenger',  cat: 'trivia',  label: 'Earth\'s Mightiest',desc: 'Reach Avenger trivia rank',        icon: '⚡', rare: false, xp: 75  },
  { id: 'rank_nexus',    cat: 'trivia',  label: 'Beyond the Veil',   desc: 'Reach Nexus Being trivia rank',    icon: '🌌', rare: true,  xp: 300 },

  // ── Special ──────────────────────────────────────
  { id: 'early_adopter', cat: 'special', label: 'Early Adopter',     desc: 'One of the first heroes',          icon: '🚀', rare: true,  xp: 100 },
  { id: 'season_complete',cat:'special', label: 'Season Champion',   desc: 'Complete a season pass',           icon: '🏅', rare: true,  xp: 200 },
  { id: 'level_nexus',   cat: 'special', label: 'Ascended',          desc: 'Reach Nexus Being XP level',       icon: '✨', rare: true,  xp: 300 },
  { id: 'all_missions',  cat: 'special', label: 'Mission Master',    desc: 'Complete 30 daily missions',       icon: '🎯', rare: true,  xp: 200 },
  { id: 'personality_reveal', cat:'special', label:'Know Thyself',   desc: 'Discover your Marvel personality', icon: '🪞', rare: false, xp: 25  },
]

/** Check which badges should be awarded given current state */
export function checkBadges(state, prevBadges = {}) {
  const earned = {}
  // state: { watchedCount, watchHistory, ratings, triviaState, achievements, posts, friends, tiers, streak }
  const checks = {
    first_watch:   (state.watchedCount ?? 0) >= 1,
    watch_10:      (state.watchedCount ?? 0) >= 10,
    watch_25:      (state.watchedCount ?? 0) >= 25,
    watch_50:      (state.watchedCount ?? 0) >= 50,
    watch_100:     (state.watchedCount ?? 0) >= 100,
    watch_all:     (state.watchedCount ?? 0) >= (state.totalTitles ?? 999),
    binge_3:       Object.values(state.watchHistory ?? {}).some(n => n >= 3),
    binge_5:       Object.values(state.watchHistory ?? {}).some(n => n >= 5),
    streak_3:      (state.streak ?? 0) >= 3,
    streak_7:      (state.streak ?? 0) >= 7,
    streak_30:     (state.streak ?? 0) >= 30,
    streak_100:    (state.streak ?? 0) >= 100,
    trivia_streak5:  (state.triviaState?.streak ?? 0) >= 5,
    trivia_streak14: (state.triviaState?.streak ?? 0) >= 14,
    trivia_first:  (state.triviaState?.totalAnswered ?? 0) >= 1,
    trivia_10:     (state.triviaState?.totalAnswered ?? 0) >= 10,
    trivia_50:     (state.triviaState?.totalAnswered ?? 0) >= 50,
    trivia_perfect_week: !!(state.triviaState?.perfectWeek),
    rank_avenger:  (state.triviaState?.points ?? 0) >= 500,
    rank_nexus:    (state.triviaState?.points ?? 0) >= 5000,
    first_friend:  (state.friendCount ?? 0) >= 1,
    friends_5:     (state.friendCount ?? 0) >= 5,
    first_post:    (state.postCount ?? 0) >= 1,
    posts_10:      (state.postCount ?? 0) >= 10,
    debate_win:    (state.debateVotes ?? 0) >= 10,
    all_5star:     Object.values(state.ratings ?? {}).filter(r => r === 5).length >= 10,
    tier_s:        Object.values(state.tiers ?? {}).filter(t => t === 'S').length >= 5,
    early_adopter: true, // always earned on first check
    personality_reveal: !!(state.personalityType),
    level_nexus:   (state.xp ?? 0) >= 10000,
    all_missions:  (state.missionsCompleted ?? 0) >= 30,
    season_complete: !!(state.seasonCompleted),
    era_blade:     !!(state.eraComplete?.blade),
    era_infinity:  !!(state.eraComplete?.infinity),
  }
  for (const [id, condition] of Object.entries(checks)) {
    if (condition && !prevBadges[id]?.unlocked) {
      earned[id] = { unlocked: true, unlockedAt: new Date().toISOString() }
    }
  }
  return earned
}

export const BADGE_MAP = Object.fromEntries(BADGES.map(b => [b.id, b]))
