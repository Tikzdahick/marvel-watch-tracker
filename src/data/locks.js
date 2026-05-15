/**
 * 4-tier content lock system
 *
 * Each tier has a rating, emoji, label, description, and the set of title IDs
 * that belong to it. A title can belong to multiple tiers.
 *
 * To unlock a tier the user must enter that tier's 4-digit PIN.
 * If a title belongs to multiple tiers, unlocking ANY one of those tiers
 * grants access to that title.
 *
 * PIN storage key: `mvt-lock-pins` → { pg13: '####', tv14: '####', tvma: '####', r: '####' }
 * A null/absent PIN means the tier is not locked (lock is disabled for that tier).
 */

export const LOCK_TIERS = {
  pg13: {
    key:    'pg13',
    rating: 'PG-13',
    emoji:  '🔒',
    label:  'PG-13',
    color:  '#facc15', // yellow
    textColor: '#854d0e',
    bgColor: 'bg-yellow-950',
    borderColor: 'border-yellow-600/30',
    description: 'Moderate action, mild language',
    ids: new Set([40, 47, 48, 58, 62, 63, 66, 67, 69, 70]),
  },
  tv14: {
    key:    'tv14',
    rating: 'TV-14',
    emoji:  '📺',
    label:  'TV-14',
    color:  '#60a5fa', // blue
    textColor: '#1e3a5f',
    bgColor: 'bg-blue-950',
    borderColor: 'border-blue-500/30',
    description: 'Intense themes, some violence',
    ids: new Set([18, 19, 29, 49, 50, 51, 52, 53, 59, 60, 61, 68, 71]),
  },
  tvma: {
    key:    'tvma',
    rating: 'TV-MA',
    emoji:  '📵',
    label:  'TV-MA',
    color:  '#f97316', // orange
    textColor: '#7c2d12',
    bgColor: 'bg-orange-950',
    borderColor: 'border-orange-500/30',
    description: 'Mature content, graphic violence',
    ids: new Set([34, 35, 36, 37, 38, 39, 72, 73, 74, 78]),
  },
  r: {
    key:    'r',
    rating: 'R',
    emoji:  '🔞',
    label:  'R-Rated',
    color:  '#f43f5e', // rose
    textColor: '#881337',
    bgColor: 'bg-rose-950',
    borderColor: 'border-rose-500/30',
    description: 'Strong language, adult content',
    ids: new Set([1, 2, 3, 14, 15, 16, 70]),
  },
}

export const LOCK_TIER_ORDER = ['pg13', 'tv14', 'tvma', 'r']

/** Returns an array of tier keys that apply to a given title id */
export function getLocksForTitle(titleId) {
  return LOCK_TIER_ORDER.filter(key => LOCK_TIERS[key].ids.has(titleId))
}

/**
 * Returns the "primary" (most restrictive) lock tier key for a title,
 * or null if the title has no lock tiers.
 */
export function getPrimaryLock(titleId) {
  // Check from most to least restrictive
  const order = ['r', 'tvma', 'tv14', 'pg13']
  return order.find(key => LOCK_TIERS[key].ids.has(titleId)) ?? null
}

/**
 * Given a title id, the enabled lock pins (object), and the set of
 * currently unlocked tier keys (Set), returns true if the title is
 * currently locked (i.e., requires a PIN to access).
 *
 * @param {number} titleId
 * @param {Object} pins  - { pg13: '1234'|null, tv14: '...'|null, ... }
 * @param {Set<string>} unlockedTiers - tiers the user has entered the PIN for this session
 */
export function isTitleLocked(titleId, pins, unlockedTiers) {
  const applicableTiers = getLocksForTitle(titleId)
  if (applicableTiers.length === 0) return false

  // Title is locked if ALL applicable tiers are either:
  //   a) have a PIN set AND have not been unlocked this session
  // Title is accessible if ANY applicable tier either:
  //   a) has no PIN set (tier disabled), OR
  //   b) has been unlocked this session
  for (const tierKey of applicableTiers) {
    const pin = pins?.[tierKey]
    if (!pin) return false           // tier has no PIN → not locked
    if (unlockedTiers.has(tierKey)) return false  // user unlocked this tier
  }

  // All applicable tiers are active & locked
  return true
}

/** Storage key for PIN data */
export const SK_LOCK_PINS = 'mvt-lock-pins'

/** Storage key for which tiers have lock enabled (separate from having a PIN) */
export const SK_LOCK_ENABLED = 'mvt-lock-enabled'
