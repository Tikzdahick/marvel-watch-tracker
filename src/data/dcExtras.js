/**
 * dcExtras.js — data for DC-exclusive features:
 *  - DC_MULTIVERSE: per-title universe tags
 *  - DC_VILLAINS: main villain per title
 *  - DC_CITIES: primary setting cities per title
 *  - DC_BATMAN_ACTORS: all Batman actors with films
 *  - DC_SNYDER_COMPARISON: JL 2017 vs ZSJL 2021 side-by-side
 *  - JL_TEAM: Justice League members + team movies
 */

// ── Multiverse Tags ───────────────────────────────────────────────────────────
export const DC_MULTIVERSE = {
  // Classic DC
  1001: { universe: 'Donnerverse', color: '#3b82f6', desc: 'Christopher Reeve\'s Superman — the original film universe.' },
  1002: { universe: 'Donnerverse', color: '#3b82f6', desc: 'The same optimistic Reeve-era universe.' },
  1003: { universe: 'Burtonverse', color: '#a855f7', desc: 'Tim Burton\'s gothic Gotham City.' },
  1004: { universe: 'Burtonverse', color: '#a855f7', desc: 'Tim Burton\'s darkly stylised sequel.' },
  1005: { universe: 'Schumacherverse', color: '#ec4899', desc: 'Joel Schumacher\'s neon-lit, campy Gotham.' },
  1006: { universe: 'Schumacherverse', color: '#ec4899', desc: '"Ice to meet you." Camp taken to its logical extreme.' },
  1007: { universe: 'Nolanverse', color: '#6b7280', desc: 'Christopher Nolan\'s grounded, realistic Gotham.' },
  1008: { universe: 'Nolanverse', color: '#6b7280', desc: 'Widely considered the greatest superhero film ever made.' },
  1009: { universe: 'Nolanverse', color: '#6b7280', desc: 'The epic conclusion to Nolan\'s trilogy.' },
  // DCEU / Snyderverse
  1010: { universe: 'Snyderverse', color: '#FFD700', desc: 'Zack Snyder\'s darker, grittier take on Superman.' },
  1011: { universe: 'Snyderverse', color: '#FFD700', desc: 'The Dawn of Justice — heroes collide.' },
  1012: { universe: 'DCEU', color: '#60a5fa', desc: 'The villains of Belle Reve assembled.' },
  1013: { universe: 'DCEU', color: '#60a5fa', desc: 'Patty Jenkins\' Wonder Woman origin story.' },
  1014: { universe: 'DCEU', color: '#60a5fa', desc: 'The Theatrical Justice League — shorter, lighter tone.' },
  1015: { universe: 'DCEU', color: '#60a5fa', desc: 'Aquaman embraces its oceanic mythology.' },
  1016: { universe: 'DCEU', color: '#60a5fa', desc: 'A fun, family-friendly superhero story.' },
  1017: { universe: 'DCEU', color: '#60a5fa', desc: 'Harley Quinn goes solo in a Birds of Prey story.' },
  1018: { universe: 'DCEU', color: '#60a5fa', desc: 'Wonder Woman faces Cold War-era threats.' },
  1019: { universe: 'Snyderverse', color: '#FFD700', desc: 'Zack Snyder\'s full 4-hour vision — the director\'s cut.' },
  1020: { universe: 'DCEU', color: '#60a5fa', desc: 'James Gunn\'s anarchic Task Force X reboot.' },
  1021: { universe: 'DCEU', color: '#60a5fa', desc: 'HBO Max series set in the DCEU.' },
  1022: { universe: 'DCEU', color: '#60a5fa', desc: 'Dwayne Johnson\'s anti-hero stands alone.' },
  1023: { universe: 'DCEU', color: '#60a5fa', desc: 'Billy Batson faces the Gods of Rage.' },
  1024: { universe: 'DCEU / Multiverse', color: '#a855f7', desc: 'Barry Allen\'s multiverse-hopping adventure touches the Flashpoint.' },
  1025: { universe: 'DCEU', color: '#60a5fa', desc: 'A teenager chosen by an alien scarab — Blue Beetle.' },
  1026: { universe: 'DCEU', color: '#60a5fa', desc: 'The Last Kingdom of Atlantis threatened once more.' },
  // New DCU
  1027: { universe: 'New DCU', color: '#22c55e', desc: 'Chapter 1 of James Gunn\'s rebooted DCU.' },
  1028: { universe: 'New DCU', color: '#22c55e', desc: 'David Corenswet\'s Superman — the DCU begins.' },
  1029: { universe: 'New DCU', color: '#22c55e', desc: 'Supergirl: Woman of Tomorrow — coming DCU chapter.' },
  1030: { universe: 'Reevesverse', color: '#94a3b8', desc: 'Matt Reeves\' noir Batman universe.' },
  1031: { universe: 'New DCU', color: '#22c55e', desc: 'Hal Jordan and John Stewart as Lanterns.' },
  1032: { universe: 'New DCU', color: '#22c55e', desc: 'Batman: The Brave and the Bold — in the New DCU.' },
}

// ── Villain Tracker ───────────────────────────────────────────────────────────
export const DC_VILLAINS = {
  1001: { name: 'Lex Luthor',       actor: 'Gene Hackman',       emoji: '💼', desc: 'Billionaire genius plotting to destroy California with nuclear missiles.' },
  1002: { name: 'General Zod',      actor: 'Terence Stamp',      emoji: '💀', desc: '"Kneel before Zod." Kryptonian military commander seeking world domination.' },
  1003: { name: 'The Joker',        actor: 'Jack Nicholson',      emoji: '🃏', desc: 'The Clown Prince of Crime terrorises Gotham with a twisted art obsession.' },
  1004: { name: 'The Penguin',      actor: 'Danny DeVito',        emoji: '🐧', desc: 'The monstrous Oswald Cobblepot and Catwoman conspire against Batman.' },
  1005: { name: 'Two-Face & Riddler', actor: 'Tommy Lee Jones & Jim Carrey', emoji: '🎭', desc: 'Riddles and revenge in Gotham — two villains, one circus of chaos.' },
  1006: { name: 'Mr. Freeze',       actor: 'Arnold Schwarzenegger', emoji: '❄️', desc: '"Ice to meet you." Mr. Freeze and Poison Ivy freeze Gotham in chaos.' },
  1007: { name: 'Ra\'s al Ghul',   actor: 'Liam Neeson',         emoji: '🐉', desc: 'Leader of the League of Shadows — plans to destroy Gotham to save humanity.' },
  1008: { name: 'The Joker',        actor: 'Heath Ledger',        emoji: '🃏', desc: 'An agent of chaos with no plan — just a desire to watch Gotham burn.' },
  1009: { name: 'Bane',             actor: 'Tom Hardy',           emoji: '💣', desc: '"You merely adopted the dark. I was born in it." — Bane takes Gotham hostage.' },
  1010: { name: 'General Zod',      actor: 'Michael Shannon',     emoji: '💀', desc: 'Kryptonian general who followed Kal-El to Earth to rebuild Krypton.' },
  1011: { name: 'Lex Luthor',       actor: 'Jesse Eisenberg',     emoji: '💼', desc: 'A younger, unhinged Lex manipulates Batman and Superman into war.' },
  1012: { name: 'Enchantress',      actor: 'Cara Delevingne',     emoji: '🔮', desc: 'An ancient witch possesses June Moone and threatens humanity.' },
  1013: { name: 'Ares',             actor: 'David Thewlis',       emoji: '⚔️', desc: 'God of War manipulating humanity — revealed as a British diplomat.' },
  1014: { name: 'Steppenwolf',      actor: 'Ciarán Hinds',        emoji: '👁️', desc: 'Darkseid\'s general collecting the Mother Boxes for his uncle.' },
  1015: { name: 'Ocean Master & Black Manta', actor: 'Patrick Wilson & Yahya Abdul-Mateen II', emoji: '🌊', desc: 'Arthur\'s half-brother fights for Atlantis; Black Manta seeks revenge.' },
  1016: { name: 'Dr. Sivana',       actor: 'Mark Strong',         emoji: '🧪', desc: 'Rejected as a Champion, Sivana channels the Seven Deadly Sins.' },
  1017: { name: 'Black Mask',       actor: 'Ewan McGregor',       emoji: '🎭', desc: 'Gotham\'s flamboyantly violent crime lord who wants Harley dead.' },
  1018: { name: 'Cheetah & Maxwell Lord', actor: 'Kristen Wiig & Pedro Pascal', emoji: '🐆', desc: 'A wish-granting stone transforms Barbara and Lord into dangerous threats.' },
  1019: { name: 'Steppenwolf & Darkseid', actor: 'Ciarán Hinds & Ray Porter', emoji: '👁️', desc: 'Steppenwolf seeks redemption; Darkseid himself arrives with his Parademon army.' },
  1020: { name: 'Starro the Conqueror', actor: 'Voice: N/A',     emoji: '⭐', desc: 'A giant alien starfish with mind-control spores — the most absurd threat imaginable.' },
  1021: { name: 'The Butterflies',  actor: 'Various',             emoji: '🦋', desc: 'An alien species taking human hosts with a sinister agenda for Earth.' },
  1022: { name: 'Ishmael / Sabbac', actor: 'Marwan Kenzari',     emoji: '🔥', desc: 'A centuries-old villain who channels the power of six demons as Sabbac.' },
  1023: { name: 'Dr. Sivana & Mister Mind', actor: 'Mark Strong & Voice: Neil Patrick Harris', emoji: '🪲', desc: 'The duo escape their prison, with Mister Mind having an ulterior scheme.' },
  1024: { name: 'Dark Flash & General Zod', actor: 'Ezra Miller & Michael Shannon', emoji: '⚡', desc: 'An alternate corrupted Barry Allen and the returning Zod threaten the timeline.' },
  1025: { name: 'Victoria Kord',    actor: 'Susan Sarandon',      emoji: '💡', desc: 'Tech mogul who wants to harness the Blue Beetle scarab as a weapon.' },
  1026: { name: 'Black Manta',      actor: 'Yahya Abdul-Mateen II', emoji: '🔱', desc: 'Black Manta returns with the Trident of Kordax to destroy Aquaman.' },
  1027: { name: 'The Thinker',      actor: 'Voiced cast',         emoji: '🧠', desc: 'The big-brained villain behind Amanda Waller\'s schemes in the Commandos.' },
  1028: { name: 'Lex Luthor',       actor: 'Nicholas Hoult',      emoji: '💼', desc: 'A new, scheming Lex Luthor in the rebooted DCU.' },
}

// ── City Tags ─────────────────────────────────────────────────────────────────
export const DC_CITIES = {
  1001: ['Metropolis', 'Smallville'],
  1002: ['Metropolis', 'Niagara Falls'],
  1003: ['Gotham City'],
  1004: ['Gotham City'],
  1005: ['Gotham City'],
  1006: ['Gotham City'],
  1007: ['Gotham City'],
  1008: ['Gotham City'],
  1009: ['Gotham City'],
  1010: ['Metropolis', 'Smallville'],
  1011: ['Metropolis', 'Gotham City'],
  1012: ['Midway City'],
  1013: ['Themyscira', 'London', 'Western Front'],
  1014: ['Gotham City', 'Metropolis', 'Themyscira'],
  1015: ['Atlantis', 'Sicily', 'Sahara'],
  1016: ['Philadelphia'],
  1017: ['Gotham City'],
  1018: ['Washington D.C.', 'Egypt', 'Themyscira'],
  1019: ['Metropolis', 'Themyscira', 'Apokolips'],
  1020: ['Corto Maltese'],
  1021: ['Evergreen', 'Washington D.C.'],
  1022: ['Kahndaq'],
  1023: ['Philadelphia', 'Themyscira'],
  1024: ['Central City', 'Gotham City', 'Multiverse'],
  1025: ['Palmera City', 'Kord Industries'],
  1026: ['Atlantis', 'The Trench'],
  1027: ['Washington D.C.', 'Multiverse'],
  1028: ['Metropolis'],
  1029: ['Multiverse'],
  1030: ['Gotham City'],
  1031: ['Multiverse'],
  1032: ['Gotham City'],
}

// ── Batman Actors ─────────────────────────────────────────────────────────────
export const DC_BATMAN_ACTORS = [
  {
    key: 'adam_west',
    actor: 'Adam West',
    era: '1966',
    emoji: '📺',
    desc: 'The campy, colourful Caped Crusader of the 1960s TV series and film. POW! ZAPP!',
    filmIds: [],  // 1966 TV film not in the tracker
    note: '1966 TV series & film',
    color: '#F5C518',
  },
  {
    key: 'michael_keaton',
    actor: 'Michael Keaton',
    era: '1989–1992',
    emoji: '🦇',
    desc: 'Dark, brooding, and iconic — Tim Burton\'s gothic Dark Knight.',
    filmIds: [1003, 1004, 1024],
    note: 'Batman (1989), Batman Returns (1992), The Flash (2023)',
    color: '#a855f7',
  },
  {
    key: 'val_kilmer',
    actor: 'Val Kilmer',
    era: '1995',
    emoji: '🎭',
    desc: 'Fought Two-Face and the Riddler in Joel Schumacher\'s flamboyant Gotham.',
    filmIds: [1005],
    note: 'Batman Forever (1995)',
    color: '#ec4899',
  },
  {
    key: 'george_clooney',
    actor: 'George Clooney',
    era: '1997',
    emoji: '❄️',
    desc: 'The Bat-credit-card Batman. Clooney himself has apologised for this one.',
    filmIds: [1006],
    note: 'Batman & Robin (1997)',
    color: '#60a5fa',
  },
  {
    key: 'christian_bale',
    actor: 'Christian Bale',
    era: '2005–2012',
    emoji: '🌑',
    desc: 'The definitive realistic Batman. Nolan\'s grounded Dark Knight trilogy.',
    filmIds: [1007, 1008, 1009],
    note: 'The Dark Knight Trilogy (2005–2012)',
    color: '#6b7280',
  },
  {
    key: 'ben_affleck',
    actor: 'Ben Affleck',
    era: '2016–2023',
    emoji: '⚔️',
    desc: 'A weathered, battle-scarred Batman from the DCEU. Known for the Batfleck warehouse fight.',
    filmIds: [1011, 1012, 1014, 1019, 1024],
    note: 'BvS, Suicide Squad, Justice League, ZSJL, The Flash',
    color: '#FFD700',
  },
  {
    key: 'robert_pattinson',
    actor: 'Robert Pattinson',
    era: '2022',
    emoji: '🦇',
    desc: 'The Batman. A noir detective story — Year Two of an obsessed, grieving Bruce Wayne.',
    filmIds: [1030],
    note: 'The Batman (2022) — Reevesverse',
    color: '#94a3b8',
  },
]

// ── Snyder Cut Comparison ──────────────────────────────────────────────────────
// Justice League (1014) vs Zack Snyder's Justice League (1019)
export const SNYDER_COMPARISON = {
  theatrical: { titleId: 1014, title: 'Justice League (2017)', runtime: '2h 0m', director: 'Zack Snyder / Joss Whedon' },
  snyderCut:  { titleId: 1019, title: 'Zack Snyder\'s Justice League', runtime: '4h 2m', director: 'Zack Snyder' },
  comparisons: [
    { category: 'Runtime',           theatrical: '2 hours',                  snyderCut: '4 hours 2 minutes' },
    { category: 'Aspect Ratio',      theatrical: '2.39:1 (widescreen)',       snyderCut: '1.33:1 (IMAX square)' },
    { category: 'Colour Grade',      theatrical: 'Bright, warm, saturated',   snyderCut: 'Desaturated, cooler, epic' },
    { category: 'Cyborg\'s Arc',     theatrical: 'Minimal — almost a cameo',  snyderCut: 'Full emotional origin story' },
    { category: 'Steppenwolf',       theatrical: 'Standard CGI villain',      snyderCut: 'Completely redesigned, armoured' },
    { category: 'Darkseid',          theatrical: 'Never appears',             snyderCut: 'Arrives on Earth; seeks the Anti-Life Equation' },
    { category: 'The Knightmare',    theatrical: 'Absent',                    snyderCut: 'Extended epilogue — Bruce\'s apocalyptic vision' },
    { category: 'The Joker',         theatrical: 'Not present',               snyderCut: 'Appears in the Knightmare epilogue' },
    { category: 'Iris West',         theatrical: 'Absent',                    snyderCut: 'Full slow-motion rescue scene by Barry' },
    { category: 'Ryan Choi',         theatrical: 'Not present',               snyderCut: 'Named and featured as future The Atom' },
    { category: 'Score',             theatrical: 'Danny Elfman — reused cues', snyderCut: 'Junkie XL — new, epic, original score' },
    { category: 'Wonder Woman theme', theatrical: 'Simplified',               snyderCut: 'Full iconic "Is She With You?" motif' },
    { category: 'Superman\'s suit',  theatrical: 'Black suit removed',        snyderCut: 'Black suit restored' },
    { category: 'Victor\'s backstory', theatrical: '1 brief scene',           snyderCut: '30 minutes of backstory & emotional depth' },
  ],
}

// ── Justice League Team Tracker ───────────────────────────────────────────────
export const JL_TEAM = {
  teamMovies: [1014, 1019],  // Justice League (2017), Zack Snyder's Justice League
  members: [
    { key: 'batman',       name: 'Batman',       realName: 'Bruce Wayne',    emoji: '🦇', titleIds: [1003,1004,1005,1006,1007,1008,1009,1011,1014,1019,1024] },
    { key: 'superman',     name: 'Superman',     realName: 'Clark Kent',     emoji: '🦸', titleIds: [1001,1002,1010,1011,1014,1019,1028] },
    { key: 'wonder_woman', name: 'Wonder Woman', realName: 'Diana Prince',   emoji: '⚔️', titleIds: [1011,1013,1014,1018,1019] },
    { key: 'aquaman',      name: 'Aquaman',      realName: 'Arthur Curry',   emoji: '🌊', titleIds: [1014,1015,1019,1026] },
    { key: 'flash',        name: 'The Flash',    realName: 'Barry Allen',    emoji: '⚡', titleIds: [1014,1019,1024] },
    { key: 'cyborg',       name: 'Cyborg',       realName: 'Victor Stone',   emoji: '🤖', titleIds: [1014,1019] },
    { key: 'green_lantern',name: 'Green Lantern',realName: 'Hal Jordan',     emoji: '💚', titleIds: [] },
  ],
}
