/**
 * tier 1 = Rookie  → movies only
 * tier 2 = Hero    → movies + Disney+ shows (incl. Agent Carter)
 * tier 3 = Avenger → + Netflix / ABC shows (SHIELD, Defenders saga)
 * tier 4 = Infinity → + animated
 */
export const TITLES = [
  // ── Blade trilogy ──
  { id: 1,  title: 'Blade',                                         type: 'movie',    tier: 1 },
  { id: 2,  title: 'Blade II',                                      type: 'movie',    tier: 1 },
  { id: 3,  title: 'Blade: Trinity',                                type: 'movie',    tier: 1 },
  // ── Animated ──
  { id: 4,  title: 'Eyes of Wakanda',                               type: 'animated', tier: 4 },
  // ── X-Men saga ──
  { id: 5,  title: 'X-Men: First Class',                            type: 'movie',    tier: 1 },
  { id: 6,  title: 'X-Men Origins: Wolverine',                      type: 'movie',    tier: 1 },
  { id: 7,  title: 'X-Men',                                         type: 'movie',    tier: 1 },
  { id: 8,  title: 'X2: X-Men United',                              type: 'movie',    tier: 1 },
  { id: 9,  title: 'X-Men: The Last Stand',                         type: 'movie',    tier: 1 },
  { id: 10, title: 'The Wolverine',                                  type: 'movie',    tier: 1 },
  { id: 11, title: 'X-Men: Days of Future Past',                    type: 'movie',    tier: 1 },
  { id: 12, title: 'X-Men: Apocalypse',                             type: 'movie',    tier: 1 },
  { id: 13, title: 'X-Men: Dark Phoenix',                           type: 'movie',    tier: 1 },
  { id: 14, title: 'Deadpool',                                       type: 'movie',    tier: 1 },
  { id: 15, title: 'Deadpool 2',                                     type: 'movie',    tier: 1 },
  { id: 16, title: 'Logan',                                          type: 'movie',    tier: 1 },
  // ── MCU: Infinity Saga ──
  { id: 17, title: 'Captain America: The First Avenger',            type: 'movie',    tier: 1 },
  { id: 18, title: 'Agent Carter S1',                               type: 'tv',       tier: 2 },
  { id: 19, title: 'Agent Carter S2',                               type: 'tv',       tier: 2 },
  { id: 20, title: 'Captain Marvel',                                 type: 'movie',    tier: 1 },
  { id: 21, title: 'Iron Man',                                       type: 'movie',    tier: 1 },
  { id: 22, title: 'Iron Man 2',                                     type: 'movie',    tier: 1 },
  { id: 23, title: 'The Incredible Hulk',                           type: 'movie',    tier: 1 },
  { id: 24, title: 'Thor',                                           type: 'movie',    tier: 1 },
  { id: 25, title: 'The Avengers',                                   type: 'movie',    tier: 1 },
  { id: 26, title: 'Iron Man 3',                                     type: 'movie',    tier: 1 },
  { id: 27, title: 'Thor: The Dark World',                          type: 'movie',    tier: 1 },
  { id: 28, title: 'Captain America: The Winter Soldier',           type: 'movie',    tier: 1 },
  { id: 29, title: 'Agents of S.H.I.E.L.D. S1–S7',               type: 'tv',       tier: 3 },
  { id: 30, title: 'Guardians of the Galaxy',                       type: 'movie',    tier: 1 },
  { id: 31, title: 'Guardians of the Galaxy Vol. 2',               type: 'movie',    tier: 1 },
  { id: 32, title: 'Avengers: Age of Ultron',                       type: 'movie',    tier: 1 },
  { id: 33, title: 'Ant-Man',                                        type: 'movie',    tier: 1 },
  // ── Defenders / Netflix saga ──
  { id: 34, title: 'Daredevil S1–S3',                              type: 'tv',       tier: 3 },
  { id: 35, title: 'Jessica Jones S1–S3',                          type: 'tv',       tier: 3 },
  { id: 36, title: 'Luke Cage S1–S2',                              type: 'tv',       tier: 3 },
  { id: 37, title: 'Iron Fist S1–S2',                              type: 'tv',       tier: 3 },
  { id: 38, title: 'The Defenders',                                  type: 'tv',       tier: 3 },
  { id: 39, title: 'The Punisher S1–S2',                           type: 'tv',       tier: 3 },
  // ── MCU: Infinity Saga continued ──
  { id: 40, title: 'Captain America: Civil War',                    type: 'movie',    tier: 1 },
  { id: 41, title: 'Black Widow',                                    type: 'movie',    tier: 1 },
  { id: 42, title: 'Black Panther',                                  type: 'movie',    tier: 1 },
  { id: 43, title: 'Spider-Man: Homecoming',                        type: 'movie',    tier: 1 },
  { id: 44, title: 'Doctor Strange',                                 type: 'movie',    tier: 1 },
  { id: 45, title: 'Thor: Ragnarok',                                 type: 'movie',    tier: 1 },
  { id: 46, title: 'Ant-Man and the Wasp',                          type: 'movie',    tier: 1 },
  { id: 47, title: 'Avengers: Infinity War',                        type: 'movie',    tier: 1 },
  { id: 48, title: 'Avengers: Endgame',                             type: 'movie',    tier: 1 },
  // ── MCU: Multiverse Saga ──
  { id: 49, title: 'Loki S1–S2',                                   type: 'tv',       tier: 2 },
  { id: 50, title: 'WandaVision',                                    type: 'tv',       tier: 2 },
  { id: 51, title: 'The Falcon and the Winter Soldier',             type: 'tv',       tier: 2 },
  { id: 52, title: 'Hawkeye',                                        type: 'tv',       tier: 2 },
  { id: 53, title: 'Echo',                                           type: 'tv',       tier: 2 },
  { id: 54, title: 'Shang-Chi and the Legend of the Ten Rings',    type: 'movie',    tier: 1 },
  { id: 55, title: 'Eternals',                                       type: 'movie',    tier: 1 },
  { id: 56, title: 'Spider-Man: Far From Home',                     type: 'movie',    tier: 1 },
  { id: 57, title: 'Spider-Man: No Way Home',                       type: 'movie',    tier: 1 },
  { id: 58, title: 'Doctor Strange in the Multiverse of Madness',  type: 'movie',    tier: 1 },
  { id: 59, title: 'Moon Knight',                                    type: 'tv',       tier: 2 },
  { id: 60, title: 'Ms. Marvel',                                     type: 'tv',       tier: 2 },
  { id: 61, title: 'She-Hulk: Attorney at Law',                     type: 'tv',       tier: 2 },
  { id: 62, title: 'Thor: Love and Thunder',                        type: 'movie',    tier: 1 },
  { id: 63, title: 'Black Panther: Wakanda Forever',               type: 'movie',    tier: 1 },
  { id: 64, title: 'Werewolf by Night',                             type: 'movie',    tier: 1 },
  { id: 65, title: 'The Guardians of the Galaxy Holiday Special',   type: 'movie',    tier: 1 },
  { id: 66, title: 'Ant-Man and the Wasp: Quantumania',            type: 'movie',    tier: 1 },
  { id: 67, title: 'Guardians of the Galaxy Vol. 3',               type: 'movie',    tier: 1 },
  { id: 68, title: 'Secret Invasion',                               type: 'tv',       tier: 2 },
  { id: 69, title: 'The Marvels',                                    type: 'movie',    tier: 1 },
  { id: 70, title: 'Deadpool & Wolverine',                          type: 'movie',    tier: 1, locked: true },
  { id: 71, title: 'Agatha All Along',                              type: 'tv',       tier: 2 },
  { id: 72, title: 'Marvel Zombies',                                 type: 'animated', tier: 4 },
  { id: 73, title: 'Venom',                                          type: 'movie',    tier: 1 },
  { id: 74, title: 'Venom: Let There Be Carnage',                   type: 'movie',    tier: 1 },
  { id: 75, title: 'Ironheart',                                      type: 'tv',       tier: 2 },
  { id: 76, title: 'Your Friendly Neighborhood Spider-Man',         type: 'animated', tier: 4 },
  { id: 77, title: 'Captain America: Brave New World',              type: 'movie',    tier: 1 },
  { id: 78, title: 'Daredevil: Born Again S1–S2',                  type: 'tv',       tier: 2 },
  { id: 79, title: 'Wonder Man',                                     type: 'tv',       tier: 2 },
  { id: 80, title: 'Thunderbolts*',                                  type: 'movie',    tier: 1 },
  { id: 81, title: 'The Fantastic Four: First Steps',               type: 'movie',    tier: 1 },
  { id: 82, title: 'VisionQuest',                                    type: 'tv',       tier: 2, comingSoon: true },
  { id: 83, title: 'Spider-Man: Brand New Day',                     type: 'animated', tier: 4, comingSoon: true },
  { id: 84, title: 'Avengers: Doomsday',                            type: 'movie',    tier: 1, comingSoon: true },
  { id: 85, title: 'Avengers: Secret Wars',                         type: 'movie',    tier: 1, comingSoon: true },

  // ── Sony Spider-Verse ──
  { id: 86,  title: 'Spider-Man (2002)',                             type: 'movie',    tier: 1 },
  { id: 87,  title: 'Spider-Man 2',                                  type: 'movie',    tier: 1 },
  { id: 88,  title: 'Spider-Man 3',                                  type: 'movie',    tier: 1 },
  { id: 106, title: 'The Amazing Spider-Man (2012)',                 type: 'movie',    tier: 1 },
  { id: 107, title: 'The Amazing Spider-Man 2 (2014)',               type: 'movie',    tier: 1 },
  { id: 89,  title: 'Morbius',                                       type: 'movie',    tier: 1 },
  { id: 90,  title: 'Kraven the Hunter',                             type: 'movie',    tier: 1 },
  { id: 91,  title: 'Venom: The Last Dance',                         type: 'movie',    tier: 1 },
  { id: 92,  title: 'Madame Web',                                    type: 'movie',    tier: 1 },
  { id: 93,  title: 'Spider-Man: Into the Spider-Verse',             type: 'animated', tier: 4 },
  { id: 94,  title: 'Spider-Man: Across the Spider-Verse',           type: 'animated', tier: 4 },
  { id: 95,  title: 'Spider-Man: Beyond the Spider-Verse',           type: 'animated', tier: 4, comingSoon: true },

  // ── Classic / Legacy Marvel ──
  { id: 96,  title: 'Howard the Duck',                               type: 'movie',    tier: 1 },
  { id: 97,  title: 'The Punisher (1989)',                           type: 'movie',    tier: 1 },
  { id: 98,  title: 'Captain America (1990)',                        type: 'movie',    tier: 1 },
  { id: 99,  title: 'Daredevil (2003)',                              type: 'movie',    tier: 1 },
  { id: 100, title: 'Hulk (2003)',                                   type: 'movie',    tier: 1 },
  { id: 101, title: 'Elektra',                                       type: 'movie',    tier: 1 },
  { id: 102, title: 'Fantastic Four (2005)',                         type: 'movie',    tier: 1 },
  { id: 103, title: 'Fantastic Four: Rise of the Silver Surfer',     type: 'movie',    tier: 1 },
  { id: 104, title: 'Ghost Rider',                                   type: 'movie',    tier: 1 },
  { id: 105, title: 'Ghost Rider: Spirit of Vengeance',             type: 'movie',    tier: 1 },
]

/** IDs watched by default based on user's history */
export const DEFAULT_WATCHED = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35,
  45, 46, 47, 48, 49, 50, 51,
  54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
  65, 66, 67, 68,
])

export const TIER_MAP = { rookie: 1, hero: 2, avenger: 3, infinity: 4 }

export function getTitlesForListSize(listSize) {
  const maxTier = TIER_MAP[listSize] ?? 4
  return TITLES.filter(t => t.tier <= maxTier)
}

// ── Episode counts for runtime calculation ────────────────────────────────────
const EPISODE_COUNTS = {
  18: 8,   // Agent Carter S1
  19: 10,  // Agent Carter S2
  29: 136, // Agents of S.H.I.E.L.D. S1–S7
  34: 39,  // Daredevil S1–S3
  35: 39,  // Jessica Jones S1–S3
  36: 26,  // Luke Cage S1–S2
  37: 23,  // Iron Fist S1–S2
  38: 8,   // The Defenders
  39: 26,  // The Punisher S1–S2
  49: 12,  // Loki S1–S2
  50: 9,   // WandaVision
  51: 6,   // The Falcon and the Winter Soldier
  52: 6,   // Hawkeye
  53: 5,   // Echo
  59: 6,   // Moon Knight
  60: 6,   // Ms. Marvel
  61: 9,   // She-Hulk: Attorney at Law
  68: 6,   // Secret Invasion
  71: 9,   // Agatha All Along
  75: 6,   // Ironheart
  78: 18,  // Daredevil: Born Again S1–S2
  79: 6,   // Wonder Man
  82: 6,   // VisionQuest
  // Animated series
  4:  4,   // Eyes of Wakanda
  72: 6,   // Marvel Zombies
  76: 10,  // Your Friendly Neighborhood Spider-Man
  83: 10,  // Spider-Man: Brand New Day
}

/** Approximate runtime in minutes (movies=120min, TV/animated=45min×episodes) */
export function getRuntimeMinutes(title) {
  if (title.type === 'movie') return 120
  return (EPISODE_COUNTS[title.id] ?? 6) * 45
}

// ── Achievement helper sets ───────────────────────────────────────────────────
export const IDS_BLADE           = new Set([1, 2, 3])
export const IDS_XMEN_ERA        = new Set([5,6,7,8,9,10,11,12,13,14,15,16])
export const IDS_DEFENDERS_SAGA  = new Set([34,35,36,37,38,39])
export const IDS_INFINITY_SAGA   = new Set([17,20,21,22,23,24,25,26,27,28,30,31,32,33,40,41,42,43,44,45,46,47,48])
export const IDS_MULTIVERSE_SAGA = new Set([49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85])
export const IDS_SPIDERMAN       = new Set([43,56,57,86,87,88,93,94,95])
export const IDS_SONY_SPIDERVERSE = new Set([73,74,86,87,88,89,90,91,92,93,94,95,106,107])
export const IDS_CLASSIC_MARVEL   = new Set([96,97,98,99,100,101,102,103,104,105])
export const IDS_BLACK_PANTHER   = new Set([42,63])
export const IDS_THOR            = new Set([24,27,45,62])
export const IDS_CAP_AMERICA     = new Set([17,28,40,77])
export const IDS_DOCTOR_STRANGE  = new Set([44,58])
export const IDS_GUARDIANS       = new Set([30,31,65,67])
export const IDS_ANT_MAN         = new Set([33,46,66])
export const IDS_IRON_MAN        = new Set([21,22,26])
export const IDS_HULK            = new Set([23])
export const IDS_AVENGERS        = new Set([25,32,47,48])
