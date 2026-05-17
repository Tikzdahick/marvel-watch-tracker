export const PERSONALITY_TYPES = [
  {
    key: 'iron_man',
    name: 'Iron Man',
    subtitle: 'The Genius Perfectionist',
    icon: '🤖',
    color: '#E81C2E',
    gradient: 'linear-gradient(135deg, #E81C2E 0%, #F5C518 100%)',
    desc: 'You love the cinematic quality and production value. You rate action-heavy blockbusters highest and aren\'t afraid to have strong opinions.',
    traits: ['Action-lover', 'High standards', 'Tech enthusiast', 'Bold opinions'],
  },
  {
    key: 'loki',
    name: 'Loki',
    subtitle: 'The Complex Thinker',
    icon: '🐍',
    color: '#4ade80',
    gradient: 'linear-gradient(135deg, #1B5E20 0%, #4ade80 100%)',
    desc: 'You appreciate moral ambiguity, complex villains, and stories with layers. You rate character-driven narratives above big spectacle.',
    traits: ['Character-driven', 'Morally curious', 'Contrarian', 'Loves villains'],
  },
  {
    key: 'doctor_strange',
    name: 'Doctor Strange',
    subtitle: 'The Multiverse Scholar',
    icon: '🪄',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)',
    desc: 'You love lore, world-building, and interconnected storytelling. You track how everything connects across the MCU.',
    traits: ['Lore obsessed', 'Detail-oriented', 'Theorist', 'Big picture thinker'],
  },
  {
    key: 'black_panther',
    name: 'Black Panther',
    subtitle: 'The Cultural Champion',
    icon: '🐾',
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #60a5fa 100%)',
    desc: 'You value representation, cultural depth, and stories with real-world weight. You appreciate when Marvel transcends entertainment.',
    traits: ['Culturally aware', 'Story depth', 'Legacy-minded', 'Meaningful media'],
  },
  {
    key: 'deadpool',
    name: 'Deadpool',
    subtitle: 'The Chaotic Fan',
    icon: '💥',
    color: '#E81C2E',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #E81C2E 100%)',
    desc: 'You love humor, self-awareness, and subversions of expectations. Your ratings are unpredictable and proudly all over the place.',
    traits: ['Comedy first', 'Meta-humor', 'Unpredictable', 'Anti-pretentious'],
  },
  {
    key: 'thor',
    name: 'Thor',
    subtitle: 'The Epic Adventure Seeker',
    icon: '⚡',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)',
    desc: 'You\'re here for the spectacle, the mythology, and the grand scale. You love ensemble casts and universe-spanning stories.',
    traits: ['Epic scope', 'Ensemble lover', 'Mythology fan', 'Spectacle seeker'],
  },
]

/**
 * Determine personality type from user's ratings.
 * ratings: { [titleId]: 1-5 }
 * Returns one of the PERSONALITY_TYPES
 */
export function calcPersonalityType(ratings, titles) {
  const vals = Object.values(ratings ?? {})
  if (vals.length < 5) return null  // need at least 5 ratings

  const avg = vals.reduce((s, v) => s + v, 0) / vals.length
  const highRated = vals.filter(v => v >= 4).length
  const lowRated  = vals.filter(v => v <= 2).length
  const variance  = vals.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / vals.length
  const spread    = Math.sqrt(variance)

  // Simple scoring rules:
  if (spread > 1.4) return PERSONALITY_TYPES.find(p => p.key === 'deadpool')      // chaotic/spread
  if (avg >= 4.2)   return PERSONALITY_TYPES.find(p => p.key === 'thor')          // loves everything
  if (highRated / vals.length > 0.6 && avg >= 3.8) {
    return PERSONALITY_TYPES.find(p => p.key === 'iron_man')                       // high standards, loves action
  }
  if (lowRated / vals.length > 0.3) return PERSONALITY_TYPES.find(p => p.key === 'loki') // critical
  if (avg >= 3.5 && avg < 4.2) return PERSONALITY_TYPES.find(p => p.key === 'doctor_strange') // balanced scholar
  return PERSONALITY_TYPES.find(p => p.key === 'black_panther')                   // default: cultural
}

export const PERSONALITY_MAP = Object.fromEntries(PERSONALITY_TYPES.map(p => [p.key, p]))
