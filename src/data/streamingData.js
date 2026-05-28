/**
 * streamingData.js — Where to Watch data for every Marvel title.
 * Maps titleId → array of platform objects.
 */

export const PLATFORMS = {
  DISNEY_PLUS:   { name: 'Disney+',      color: '#0063E5', bg: 'rgba(0,99,229,0.12)',  border: 'rgba(0,99,229,0.35)',  emoji: '🏰' },
  NETFLIX:       { name: 'Netflix',       color: '#E50914', bg: 'rgba(229,9,20,0.12)',  border: 'rgba(229,9,20,0.35)',  emoji: '🔴' },
  PEACOCK:       { name: 'Peacock',       color: '#a0a0a0', bg: 'rgba(160,160,160,0.1)', border: 'rgba(160,160,160,0.3)', emoji: '🦚' },
  AMAZON_PRIME:  { name: 'Prime Video',   color: '#00A8E0', bg: 'rgba(0,168,224,0.12)', border: 'rgba(0,168,224,0.35)', emoji: '📦' },
  HULU:          { name: 'Hulu',          color: '#1CE783', bg: 'rgba(28,231,131,0.12)', border: 'rgba(28,231,131,0.35)', emoji: '🟢' },
  ESPN_PLUS:     { name: 'ESPN+',         color: '#4B8FE2', bg: 'rgba(75,143,226,0.12)', border: 'rgba(75,143,226,0.35)', emoji: '📺' },
  THEATERS:      { name: 'In Theaters',   color: '#F5C518', bg: 'rgba(245,197,24,0.12)', border: 'rgba(245,197,24,0.35)', emoji: '🎬' },
  STARZ:         { name: 'Starz',         color: '#b388ff', bg: 'rgba(179,136,255,0.12)', border: 'rgba(179,136,255,0.35)', emoji: '⭐' },
  TUBI:          { name: 'Tubi',          color: '#FF3300', bg: 'rgba(255,51,0,0.12)',  border: 'rgba(255,51,0,0.35)', emoji: '📺' },
  DIGITAL:       { name: 'Digital Rental', color: '#aaa',  bg: 'rgba(170,170,170,0.1)', border: 'rgba(170,170,170,0.25)', emoji: '💾' },
}

const D = PLATFORMS.DISNEY_PLUS
const N = PLATFORMS.NETFLIX
const P = PLATFORMS.PEACOCK
const A = PLATFORMS.AMAZON_PRIME
const H = PLATFORMS.HULU
const T = PLATFORMS.THEATERS
const S = PLATFORMS.STARZ
const TU = PLATFORMS.TUBI
const DG = PLATFORMS.DIGITAL

// titleId → platform[]
export const STREAMING_DATA = {
  // Blade trilogy
  1:  [S, DG],
  2:  [S, DG],
  3:  [S, DG],

  // Animated
  4:  [D],

  // Fox X-Men
  5:  [D, P],
  6:  [D, P],
  7:  [D, P],
  8:  [D, P],
  9:  [D, P],
  10: [D, P],
  11: [D, P],
  12: [D, P],
  13: [D, P],
  14: [D, P],
  15: [D, P],
  16: [D, P],

  // MCU Phase 1–3 (all Disney+)
  17: [D],  // Captain America: The First Avenger
  18: [D],  // Agent Carter S1
  19: [D],  // Agent Carter S2
  20: [D],  // Captain Marvel
  21: [D],  // Iron Man
  22: [D],  // Iron Man 2
  23: [D],  // The Incredible Hulk
  24: [D],  // Thor
  25: [D],  // The Avengers
  26: [D],  // Iron Man 3
  27: [D],  // Thor: The Dark World
  28: [D],  // Captain America: The Winter Soldier
  29: [D],  // Agents of S.H.I.E.L.D.
  30: [D],  // Guardians of the Galaxy
  31: [D],  // Guardians Vol. 2
  32: [D],  // Avengers: Age of Ultron
  33: [D],  // Ant-Man
  34: [N],  // Daredevil S1-S3
  35: [N],  // Jessica Jones
  36: [N],  // Luke Cage
  37: [N],  // Iron Fist
  38: [N],  // The Defenders
  39: [N],  // The Punisher
  40: [D],  // Captain America: Civil War
  41: [D],  // Black Widow
  42: [D],  // Black Panther
  43: [D],  // Spider-Man: Homecoming
  44: [D],  // Doctor Strange
  45: [D],  // Thor: Ragnarok
  46: [D],  // Ant-Man and the Wasp
  47: [D],  // Avengers: Infinity War
  48: [D],  // Avengers: Endgame

  // MCU Disney+ shows
  49: [D],  // Loki
  50: [D],  // WandaVision
  51: [D],  // The Falcon and the Winter Soldier
  52: [D],  // Hawkeye
  53: [D],  // Echo

  // MCU Phase 4-5
  54: [D],  // Shang-Chi
  55: [D],  // Eternals
  56: [D],  // Spider-Man: Far From Home
  57: [D],  // Spider-Man: No Way Home
  58: [D],  // Doctor Strange in the MoM
  59: [D],  // Moon Knight
  60: [D],  // Ms. Marvel
  61: [D],  // She-Hulk
  62: [D],  // Thor: Love and Thunder
  63: [D],  // Black Panther: Wakanda Forever
  64: [D],  // Werewolf by Night
  65: [D],  // Guardians Holiday Special
  66: [D],  // Ant-Man and the Wasp: Quantumania
  67: [D],  // Guardians Vol. 3
  68: [D],  // Secret Invasion
  69: [D],  // The Marvels
  70: [D],  // Deadpool & Wolverine
  71: [D],  // Agatha All Along
  72: [D],  // Marvel Zombies
  73: [TU, P, DG], // Venom
  74: [TU, P, DG], // Venom: Let There Be Carnage
  75: [D],  // Ironheart
  76: [D],  // Your Friendly Neighborhood Spider-Man
  77: [D],  // Captain America: Brave New World
  78: [D],  // Daredevil: Born Again
  79: [D],  // Wonder Man
  80: [D],  // Thunderbolts*
}

export function getStreamingPlatforms(titleId) {
  return STREAMING_DATA[titleId] ?? [D]
}
