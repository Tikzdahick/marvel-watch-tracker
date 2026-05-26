/**
 * DC Universe title definitions.
 * IDs are in the 1000-range to avoid collisions with Marvel titles.
 * tier 1 = movies only
 * tier 2 = + TV shows
 */
export const DC_TITLES = [
  // ── Classic DC (Donner / Burton / Nolan era) ──────────────────────────────
  { id: 1001, title: 'Superman (1978)',                    type: 'movie', tier: 1 },
  { id: 1002, title: 'Superman II (1980)',                 type: 'movie', tier: 1 },
  { id: 1003, title: 'Batman (1989)',                      type: 'movie', tier: 1 },
  { id: 1004, title: 'Batman Returns (1992)',              type: 'movie', tier: 1 },
  { id: 1005, title: 'Batman Forever (1995)',              type: 'movie', tier: 1 },
  { id: 1006, title: 'Batman & Robin (1997)',              type: 'movie', tier: 1 },
  { id: 1007, title: 'Batman Begins (2005)',               type: 'movie', tier: 1 },
  { id: 1008, title: 'The Dark Knight (2008)',             type: 'movie', tier: 1 },
  { id: 1009, title: 'The Dark Knight Rises (2012)',       type: 'movie', tier: 1 },

  // ── DCEU 2013–2023 ────────────────────────────────────────────────────────
  { id: 1010, title: 'Man of Steel (2013)',                          type: 'movie', tier: 1 },
  { id: 1011, title: 'Batman v Superman: Dawn of Justice (2016)',    type: 'movie', tier: 1 },
  { id: 1012, title: 'Suicide Squad (2016)',                         type: 'movie', tier: 1 },
  { id: 1013, title: 'Wonder Woman (2017)',                          type: 'movie', tier: 1 },
  { id: 1014, title: 'Justice League (2017)',                        type: 'movie', tier: 1 },
  { id: 1015, title: 'Aquaman (2018)',                               type: 'movie', tier: 1 },
  { id: 1016, title: 'Shazam! (2019)',                               type: 'movie', tier: 1 },
  { id: 1017, title: 'Birds of Prey (2020)',                         type: 'movie', tier: 1 },
  { id: 1018, title: 'Wonder Woman 1984 (2020)',                     type: 'movie', tier: 1 },
  { id: 1019, title: "Zack Snyder's Justice League (2021)",          type: 'movie', tier: 1 },
  { id: 1020, title: 'The Suicide Squad (2021)',                     type: 'movie', tier: 1 },
  { id: 1021, title: 'Peacemaker S1 (2022)',                         type: 'tv',    tier: 2 },
  { id: 1022, title: 'Black Adam (2022)',                            type: 'movie', tier: 1 },
  { id: 1023, title: 'Shazam! Fury of the Gods (2023)',              type: 'movie', tier: 1 },
  { id: 1024, title: 'The Flash (2023)',                             type: 'movie', tier: 1 },
  { id: 1025, title: 'Blue Beetle (2023)',                           type: 'movie', tier: 1 },
  { id: 1026, title: 'Aquaman and the Lost Kingdom (2023)',          type: 'movie', tier: 1 },

  // ── New DCU 2024+ ─────────────────────────────────────────────────────────
  { id: 1027, title: 'Creature Commandos (2024)',              type: 'tv',    tier: 2 },
  { id: 1028, title: 'Superman (2025)',                        type: 'movie', tier: 1 },
  { id: 1029, title: 'Supergirl: Woman of Tomorrow',          type: 'movie', tier: 1, comingSoon: true },
  { id: 1030, title: 'The Authority',                         type: 'movie', tier: 1, comingSoon: true },
  { id: 1031, title: 'Lanterns',                              type: 'tv',    tier: 2, comingSoon: true },
  { id: 1032, title: 'Batman: The Brave and the Bold',        type: 'movie', tier: 1, comingSoon: true },
]

export const DC_TIER_COUNTS = {
  tier1: DC_TITLES.filter(t => t.tier === 1 && !t.comingSoon).length,
  tier2: DC_TITLES.filter(t => t.tier <= 2 && !t.comingSoon).length,
}
