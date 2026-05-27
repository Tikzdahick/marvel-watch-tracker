/**
 * DC Lantern Corps rank system — based on DC watched count.
 * Separate from Marvel's SHIELD/XP system.
 */

export const DC_LANTERN_RANKS = [
  {
    key: 'yellow',
    label: 'Yellow Lantern',
    corps: 'Sinestro Corps',
    emotion: 'Fear',
    color: '#eab308',
    ring: '#FFD700',
    icon: '💛',
    minWatched: 0,
    maxWatched: 2,
    desc: 'Fear is a beginning. Your DC journey starts here.',
    oath: 'In blackest day, in brightest night, beware your fears made into light…',
  },
  {
    key: 'green',
    label: 'Green Lantern',
    corps: 'Green Lantern Corps',
    emotion: 'Will',
    color: '#22c55e',
    ring: '#22c55e',
    icon: '💚',
    minWatched: 3,
    maxWatched: 7,
    desc: 'The ring chose you for your willpower. Keep watching.',
    oath: 'In brightest day, in blackest night, no evil shall escape my sight…',
  },
  {
    key: 'red',
    label: 'Red Lantern',
    corps: 'Red Lantern Corps',
    emotion: 'Rage',
    color: '#ef4444',
    ring: '#dc2626',
    icon: '❤️',
    minWatched: 8,
    maxWatched: 12,
    desc: 'Burning with passion for the DC Universe.',
    oath: 'With blood and rage of crimson red, ripped from a corpse so freshly dead…',
  },
  {
    key: 'blue',
    label: 'Blue Lantern',
    corps: 'Blue Lantern Corps',
    emotion: 'Hope',
    color: '#3b82f6',
    ring: '#60a5fa',
    icon: '💙',
    minWatched: 13,
    maxWatched: 17,
    desc: 'Hope fuels your journey through the DC Multiverse.',
    oath: 'In fearful day, in raging night, with strong hearts full our souls ignite…',
  },
  {
    key: 'star_sapphire',
    label: 'Star Sapphire',
    corps: 'Star Sapphire Corps',
    emotion: 'Love',
    color: '#d946ef',
    ring: '#e879f9',
    icon: '💜',
    minWatched: 18,
    maxWatched: 22,
    desc: 'Your love for DC is undeniable. The violet ring chose well.',
    oath: 'For hearts long lost and full of fright, for those alone in blackest night…',
  },
  {
    key: 'white',
    label: 'White Lantern',
    corps: 'White Lantern Corps',
    emotion: 'Life',
    color: '#f1f5f9',
    ring: '#ffffff',
    icon: '🤍',
    minWatched: 23,
    maxWatched: 27,
    desc: 'The White Lantern channels all emotions — near-complete mastery.',
    oath: 'In love and life, in death and pain, the White Light burns through every chain.',
  },
  {
    key: 'black',
    label: 'Black Lantern',
    corps: 'Black Lantern Corps',
    emotion: 'Death / Completion',
    color: '#6b7280',
    ring: '#374151',
    icon: '🖤',
    minWatched: 28,
    maxWatched: Infinity,
    desc: 'The void claimed you. You\'ve watched everything — World\'s Finest.',
    oath: 'The Blackest Night falls from the skies, the darkness grows as all light dies…',
  },
]

export function getDCRank(watchedCount) {
  for (let i = DC_LANTERN_RANKS.length - 1; i >= 0; i--) {
    if (watchedCount >= DC_LANTERN_RANKS[i].minWatched) return DC_LANTERN_RANKS[i]
  }
  return DC_LANTERN_RANKS[0]
}

export function getNextDCRank(watchedCount) {
  const cur = getDCRank(watchedCount)
  const idx = DC_LANTERN_RANKS.findIndex(r => r.key === cur.key)
  return idx < DC_LANTERN_RANKS.length - 1 ? DC_LANTERN_RANKS[idx + 1] : null
}
