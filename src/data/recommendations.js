// recommendations.js — mood tags, similar titles, and recommendation logic

/**
 * Mood tags per title ID.
 * Valid tags: 'action' | 'drama' | 'comedy' | 'scifi' | 'magic' | 'space' | 'emotional' | 'funny' | 'hype' | 'chill' | 'epic'
 */
export const MOOD_TAGS = {
  // Blade trilogy
  1:  ['action', 'drama'],
  2:  ['action', 'drama'],
  3:  ['action', 'comedy'],

  // Fox — Deadpool / Logan
  14: ['action', 'funny', 'comedy'],
  15: ['action', 'funny', 'comedy', 'scifi'],
  16: ['action', 'drama', 'emotional'],

  // MCU Phase 1
  17: ['action', 'drama', 'hype', 'epic'],
  20: ['action', 'scifi', 'funny', 'hype'],
  21: ['action', 'funny', 'hype'],
  22: ['action', 'funny', 'drama'],
  23: ['action', 'drama', 'scifi'],
  24: ['action', 'funny', 'magic', 'drama'],
  25: ['action', 'hype', 'epic', 'funny'],

  // MCU Phase 2
  26: ['action', 'funny', 'drama'],
  27: ['action', 'magic', 'drama'],
  28: ['action', 'drama', 'hype', 'epic'],
  30: ['action', 'funny', 'space', 'comedy', 'hype'],
  31: ['action', 'funny', 'space', 'comedy', 'emotional'],
  32: ['action', 'hype', 'epic', 'drama'],
  33: ['action', 'funny', 'comedy', 'hype'],

  // MCU Phase 3
  40: ['action', 'drama', 'epic', 'hype'],
  41: ['action', 'drama', 'scifi'],
  42: ['action', 'drama', 'hype', 'epic'],
  43: ['action', 'funny', 'comedy', 'hype'],
  44: ['action', 'magic', 'scifi', 'hype'],
  45: ['action', 'funny', 'comedy', 'epic'],
  46: ['action', 'funny', 'scifi', 'drama'],
  47: ['action', 'epic', 'hype', 'drama', 'emotional'],
  48: ['action', 'epic', 'hype', 'emotional', 'drama'],

  // Phase 4 — Disney+
  49: ['drama', 'scifi', 'funny', 'action'],
  50: ['drama', 'magic', 'emotional', 'chill'],
  51: ['action', 'drama', 'hype'],
  52: ['action', 'funny', 'comedy', 'drama', 'chill'],

  // Phase 4 — films
  54: ['action', 'hype', 'funny', 'drama'],
  55: ['action', 'scifi', 'drama', 'epic'],
  56: ['action', 'funny', 'scifi', 'drama'],
  57: ['action', 'epic', 'hype', 'emotional', 'drama'],
  58: ['action', 'magic', 'drama', 'hype'],
  59: ['action', 'drama', 'mystery'],
  60: ['action', 'funny', 'comedy', 'drama', 'chill'],
  62: ['action', 'funny', 'comedy', 'emotional'],
  63: ['action', 'drama', 'emotional', 'epic'],

  // Phase 5
  66: ['action', 'funny', 'scifi', 'hype'],
  67: ['action', 'funny', 'space', 'emotional', 'comedy'],
  70: ['action', 'funny', 'comedy', 'hype', 'epic'],
  71: ['drama', 'magic', 'funny', 'chill'],
  77: ['action', 'drama', 'hype'],
  80: ['action', 'drama', 'hype'],
  81: ['action', 'scifi', 'funny', 'epic', 'hype'],
};

/**
 * Similar title suggestions per title ID.
 * Each entry lists 2–4 title IDs that share themes, tone, or characters.
 */
export const SIMILAR_TITLES = {
  // Blade trilogy
  1:  [2, 3, 14],
  2:  [1, 3, 14],
  3:  [1, 2, 14],

  // Fox — Deadpool / Logan
  14: [15, 70, 3],
  15: [14, 70, 45],
  16: [14, 15, 40],

  // MCU Phase 1
  17: [28, 40, 48],
  20: [25, 47, 48],
  21: [22, 26, 32],
  22: [21, 26, 25],
  23: [32, 47, 25],
  24: [27, 45, 62],
  25: [32, 47, 48],

  // MCU Phase 2
  26: [21, 22, 40],
  27: [24, 45, 62],
  28: [17, 40, 51],
  30: [31, 67, 25],
  31: [30, 67, 62],
  32: [25, 47, 48],
  33: [46, 66, 43],

  // MCU Phase 3
  40: [28, 47, 48],
  41: [28, 51, 52],
  42: [63, 40, 47],
  43: [57, 56, 40],
  44: [58, 25, 44],
  45: [24, 27, 62],
  46: [33, 66, 48],
  47: [48, 32, 25],
  48: [47, 32, 25],

  // Phase 4 — Disney+
  49: [50, 71, 27],
  50: [49, 71, 58],
  51: [28, 41, 77],
  52: [41, 60, 63],

  // Phase 4 — films
  54: [42, 63, 33],
  55: [44, 20, 30],
  56: [43, 57, 40],
  57: [43, 56, 40],
  58: [44, 49, 50],
  59: [41, 50, 49],
  60: [52, 43, 71],
  62: [45, 24, 31],
  63: [42, 40, 63],

  // Phase 5
  66: [33, 46, 48],
  67: [30, 31, 45],
  70: [14, 15, 16],
  71: [50, 49, 58],
  77: [17, 51, 28],
  80: [41, 51, 40],
  81: [25, 32, 47],
};

/**
 * Available mood filter options shown in the UI.
 */
export const MOODS = [
  { id: 'action',    label: 'Action',    emoji: '💥', color: '#E81C2E' },
  { id: 'funny',     label: 'Funny',     emoji: '😂', color: '#F5C518' },
  { id: 'epic',      label: 'Epic',      emoji: '⚡', color: '#a855f7' },
  { id: 'emotional', label: 'Emotional', emoji: '💙', color: '#60a5fa' },
  { id: 'chill',     label: 'Chill',     emoji: '😌', color: '#22c55e' },
  { id: 'space',     label: 'Space',     emoji: '🚀', color: '#818cf8' },
];

/**
 * Returns up to 5 unwatched title IDs ranked by relevance.
 *
 * Scoring logic:
 *  - +3 points if the title appears in SIMILAR_TITLES for any watched title
 *  - +2 points if the title shares a mood tag with any watched title (when mood provided)
 *  - +1 point if the title matches the requested mood tag
 *
 * @param {Set<number>} watchedIds — Set of title IDs the user has watched
 * @param {string|null}  mood       — Optional mood tag to filter/boost by
 * @returns {number[]}              — Up to 5 unwatched title IDs
 */
export function getRecommendations(watchedIds, mood = null) {
  const scores = {};

  // Collect all mood tags from watched titles
  const watchedMoods = new Set();
  for (const id of watchedIds) {
    const tags = MOOD_TAGS[id] || [];
    for (const tag of tags) watchedMoods.add(tag);
  }

  // Score every title we have data for
  for (const titleIdStr of Object.keys(MOOD_TAGS)) {
    const titleId = Number(titleIdStr);
    if (watchedIds.has(titleId)) continue; // skip already watched

    let score = 0;
    const titleTags = MOOD_TAGS[titleId] || [];

    // Mood filter: if a mood is requested, skip titles that don't have it
    if (mood && !titleTags.includes(mood)) continue;

    // Boost for direct similarity to watched titles
    for (const watchedId of watchedIds) {
      const similars = SIMILAR_TITLES[watchedId] || [];
      if (similars.includes(titleId)) {
        score += 3;
        break; // only count once per watched title
      }
    }

    // Boost for shared mood tags with watched titles
    for (const tag of titleTags) {
      if (watchedMoods.has(tag)) {
        score += 2;
        break; // count shared-mood bonus once
      }
    }

    // Small boost for matching the requested mood
    if (mood && titleTags.includes(mood)) {
      score += 1;
    }

    scores[titleId] = score;
  }

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => Number(id));
}
