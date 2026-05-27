/**
 * marvelExtras.js — data for Marvel-exclusive features:
 *  - SNAP_DATA: characters snapped/survived in Infinity War & Endgame
 *  - STAN_LEE_CAMEOS: per-film cameo descriptions
 *  - POST_CREDITS: per-film post/mid-credit scene info
 *  - INFINITY_STONES: all 6 stones with appearances
 *  - MCU_PHASES: Phase 1–6 title IDs
 *  - MCU_CHRONO_ORDER: IDs in story-chronological order
 *  - AVENGERS_TEAM: members + team movies
 */

// ── Snap Data ─────────────────────────────────────────────────────────────────
// Only films where the Snap is directly relevant
export const SNAP_DATA = {
  // Avengers: Infinity War (47) — Thanos snaps
  47: {
    snapped: [
      'Bucky Barnes', 'T\'Challa / Black Panther', 'Groot', 'Scarlet Witch',
      'Sam Wilson / Falcon', 'Mantis', 'Drax', 'Star-Lord',
      'Doctor Strange', 'Spider-Man', 'Nick Fury', 'Maria Hill',
    ],
    survived: [
      'Thor', 'Steve Rogers / Captain America', 'Tony Stark / Iron Man',
      'Natasha Romanoff / Black Widow', 'Bruce Banner / Hulk',
      'James Rhodes / War Machine', 'Nebula', 'Rocket Raccoon',
      'Okoye', 'M\'Baku', 'Pepper Potts', 'Wong',
    ],
  },
  // Avengers: Endgame (48) — Banner's snap + Tony's snap
  48: {
    snapped: [
      'Thanos (2014 timeline)', 'Thanos\'s entire army',
      'Ebony Maw', 'Cull Obsidian', 'Proxima Midnight', 'Corvus Glaive',
    ],
    survived: [
      'All snapped heroes returned via Banner\'s snap',
      'Tony Stark (sacrificed himself)', 'Steve Rogers (retired to past)',
      'Natasha Romanoff (sacrificed on Vormir)',
    ],
    note: 'Bruce/Hulk used the rebuilt Infinity Gauntlet to bring back the 50% lost in Infinity War.',
  },
  // Ant-Man and the Wasp (46) — end-credits snap scene
  46: {
    snapped: ['Janet van Dyne', 'Hank Pym', 'Hope van Dyne'],
    survived: ['Scott Lang / Ant-Man (trapped in Quantum Realm)'],
    note: 'The Snap happens off-screen during the mid-credits scene.',
  },
}

// ── Stan Lee Cameos ───────────────────────────────────────────────────────────
export const STAN_LEE_CAMEOS = {
  // MCU Films
  21: { hasCameo: true,  desc: 'Appears at a party mistaken for Hugh Hefner' },
  22: { hasCameo: true,  desc: 'Mistaken for Larry King at Stark\'s Expo' },
  23: { hasCameo: true,  desc: 'Man who accidentally drinks a Hulk-infected smoothie' },
  24: { hasCameo: true,  desc: 'Tries to pull Mjolnir with his pickup truck: "Did it work?"' },
  17: { hasCameo: true,  desc: 'Army General at the Stark Expo presentation' },
  25: { hasCameo: true,  desc: 'Chess player in the park in New York' },
  26: { hasCameo: true,  desc: 'Beauty pageant judge who gives Tony a thumbs up' },
  27: { hasCameo: true,  desc: 'Nursing home patient whose shoe is stolen as part of the experiment' },
  28: { hasCameo: true,  desc: 'Smithsonian security guard whose uniform Cap steals' },
  30: { hasCameo: true,  desc: 'Chatting with a woman on the streets of Xandar' },
  31: { hasCameo: true,  desc: 'Appears in the "Watchers" montage scene' },
  32: { hasCameo: true,  desc: 'WWII veteran in Oslo at Tony Stark\'s "I am Iron Man" party' },
  33: { hasCameo: true,  desc: 'Bartender at a restaurant who hears about Scott Lang\'s heroics' },
  40: { hasCameo: true,  desc: 'FedEx delivery man who delivers Cap\'s shield to Tony\'s compound' },
  44: { hasCameo: true,  desc: 'Bus passenger reading a book — "Doors of Perception" by Aldous Huxley' },
  42: { hasCameo: true,  desc: 'Casino patron in South Korea who complains his chips were stolen' },
  43: { hasCameo: true,  desc: 'Cranky neighbor shouting "Traitor!" as Spidey climbs buildings' },
  45: { hasCameo: true,  desc: 'Cuts Thor\'s hair before the gladiator fight — "Hell yeah!"' },
  47: { hasCameo: true,  desc: 'School bus driver who sees Spider-Man swinging by in New York' },
  46: { hasCameo: true,  desc: 'Man on the street as Hank Pym\'s car shrinks with Scott inside' },
  20: { hasCameo: true,  desc: 'Reading a movie script on a train. Carol smiles at him.' },
  48: { hasCameo: true,  desc: 'Driver of a vintage car who honks and says "Hey, man, make love, not war!"' },
  56: { hasCameo: true,  desc: 'Tourist with a "Blip" shirt in Europe. Final theatrical Stan Lee cameo.' },
  41: { hasCameo: true,  desc: 'Man on a boat in the harbour, gazing at Black Widow' },
  54: { hasCameo: true,  desc: 'Club bouncer who mistakes Shang-Chi for someone named "Morris"' },
  55: { hasCameo: false, desc: null },
  57: { hasCameo: false, desc: 'No Stan Lee cameo — he passed away in November 2018' },
  58: { hasCameo: false, desc: null },
  62: { hasCameo: false, desc: null },
  63: { hasCameo: false, desc: null },
  66: { hasCameo: false, desc: null },
  67: { hasCameo: false, desc: null },
  69: { hasCameo: false, desc: null },
  70: { hasCameo: false, desc: null },
  77: { hasCameo: false, desc: null },
  80: { hasCameo: false, desc: null },
  81: { hasCameo: false, desc: null },
  // X-Men films
  7:  { hasCameo: true,  desc: 'Hotdog vendor on the beach during the Cuban Missile Crisis prologue' },
  8:  { hasCameo: true,  desc: 'Man watching a news report on TV' },
  9:  { hasCameo: true,  desc: 'Man hosing down his lawn next to a news van' },
  5:  { hasCameo: true,  desc: 'Appears briefly at a CIA building — blink and you\'ll miss it' },
  11: { hasCameo: true,  desc: 'A crowd member who shouts "Charles!"' },
  12: { hasCameo: true,  desc: 'Watching an apocalyptic news broadcast with his wife' },
  14: { hasCameo: true,  desc: 'DJ at a strip club; very in-character for Deadpool' },
  15: { hasCameo: true,  desc: 'Face on a mural painted on a building wall' },
  16: { hasCameo: false, desc: 'Logan has no Stan Lee cameo' },
}

// ── Post-Credits Scenes ───────────────────────────────────────────────────────
export const POST_CREDITS = {
  21: { count: 1, scenes: ['Nick Fury visits Tony: "You think you\'re the only superhero in the world? Mr. Stark, you\'ve become part of a bigger universe. You just don\'t know it yet." — Avengers Initiative.'] },
  22: { count: 1, scenes: ['Thor\'s hammer (Mjolnir) is discovered in a crater in New Mexico.'] },
  23: { count: 1, scenes: ['Tony Stark visits General Ross in a bar: "We\'re putting a team together."'] },
  24: { count: 1, scenes: ['Nick Fury shows Dr. Selvig the Tesseract; Loki watches from behind.'] },
  17: { count: 1, scenes: ['Preview of The Avengers — Nick Fury shows Steve Rogers the Tesseract.'] },
  25: { count: 2, scenes: ['Thanos receives a report on the Avengers — his response: a smile.', 'The Avengers eat shawarma in exhausted silence.'] },
  26: { count: 1, scenes: ['Bruce Banner listens to Tony\'s confession... as his therapist. He fell asleep.'] },
  27: { count: 2, scenes: ['The Collector receives the Aether: "One down, five to go."', 'Thor and Jane share a kiss; a frost beast sneaks in from Asgard.'] },
  28: { count: 2, scenes: ['Wanda and Pietro are held in Hydra cells — Strucker calls them "miracles."', 'Bucky visits the Captain America Smithsonian exhibit.'] },
  30: { count: 1, scenes: ['Howard the Duck shares a drink with The Collector in his ruined museum.'] },
  31: { count: 5, scenes: ['Kraglin practices with Yondu\'s arrow and accidentally impales Drax.', 'Adam Warlock\'s birth is teased by the Sovereign queen.', 'Stan Lee talks with the Watchers; appears as a Watcher informant.', 'Teenage Groot is absorbed in his game and ignores Peter.', 'The original Guardians — Sylvester Stallone\'s team — reunite.'] },
  32: { count: 1, scenes: ['Thanos takes the Infinity Gauntlet: "Fine. I\'ll do it myself."'] },
  33: { count: 2, scenes: ['Hope van Dyne is revealed to become The Wasp.', 'Cap and Bucky have found each other; Bucky\'s arm is stuck.'] },
  40: { count: 2, scenes: ['T\'Challa offers Bucky sanctuary in Wakanda.', 'Peter Parker\'s web-shooters light up — and Aunt May is shocked.'] },
  42: { count: 2, scenes: ['Bucky is seen recovering in Wakanda, calling Shuri "Your Highness."', 'The Wakanda children\'s choir sings "Wakanda Forever."'] },
  43: { count: 2, scenes: ['Vulture and Scorpion (Mac Gargan) in prison discuss going after Spider-Man\'s identity.', 'Cap delivers a PSA on patience — which Peter just had to sit through.'] },
  44: { count: 2, scenes: ['Thor invites Doctor Strange for a drink; Strange agrees… to help find Odin.', 'Mordo confronts Jonathan Pangborn and strips him of magic: "The world is too full of sorcerers."'] },
  45: { count: 2, scenes: ['Thor and Loki\'s ship is ambushed by the massive Sanctuary II (Thanos\'s ship).', 'The Grandmaster tries to spin his loss to the crowd as a tie.'] },
  47: { count: 1, scenes: ['Nick Fury pages Captain Marvel before dissolving — her logo appears on the pager.'] },
  46: { count: 2, scenes: ['Janet, Hank, and Hope dissolve in the Snap while Scott is in the Quantum Realm.', 'Scott is trapped in the Quantum Realm with no way out.'] },
  20: { count: 2, scenes: ['The Avengers in the present day receive a signal from Captain Marvel\'s pager.', 'Goose the Flerken coughs up the Tesseract onto Fury\'s desk.'] },
  48: { count: 0, scenes: ['No post-credits scene — just the sound of Tony Stark hammering in 2008.'] },
  56: { count: 2, scenes: ['Mysterio\'s video outs Spider-Man\'s identity as Peter Parker to the world.', 'Nick Fury reveals he\'s been a Skrull (Talos) the whole time; the real Fury is on a Skrull ship.'] },
  41: { count: 1, scenes: ['Yelena visits Natasha\'s grave, urged by Val to target "the man responsible" — Clint Barton.'] },
  54: { count: 2, scenes: ['Wong, Carol, and Bruce analyse the Ten Rings — and they\'re sending a signal.', 'Xu Wenwu\'s brother appears, offering to find out who sent the signal.'] },
  55: { count: 2, scenes: ['Dane Whitman is about to pick up the Ebony Blade — Blade\'s voice is heard off-screen.', 'Arishem takes the Eternals; Pip the Troll introduces Starfox (Eros).'] },
  57: { count: 2, scenes: ['A Venom symbiote is left behind in the MCU after Tom Hardy\'s Eddie Brock is snapped back.', 'Doctor Strange in the Multiverse of Madness teaser trailer.'] },
  58: { count: 2, scenes: ['Clea (Charlize Theron) appears to recruit Strange into the Dark Dimension.', 'Bruce Campbell breaks the fourth wall, slapping himself free of the hex.'] },
  62: { count: 2, scenes: ['Zeus (still alive) sends his son Hercules to kill Thor.', 'Jane Foster arrives at the gates of Valhalla, welcomed by Heimdall.'] },
  63: { count: 1, scenes: ['Nakia raises T\'Challa and Shuri\'s son Toussaint — the future Black Panther.'] },
  64: { count: 0, scenes: [] },
  65: { count: 0, scenes: [] },
  66: { count: 2, scenes: ['A new Council of Kangs confronts their own variants — Kang is dead.', 'Loki and Mobius track a variant of Kang in the 1800s.'] },
  67: { count: 2, scenes: ['Star-Lord returns to Earth to find his grandfather.', 'The new Guardians are shown: Rocket, Groot, Mantis, Nebula, Kraglin, Phyla.'] },
  69: { count: 1, scenes: ['Monica Rambeau is pulled into a parallel universe and meets an alternate Binary (Layla Miller).'] },
  70: { count: 1, scenes: ['Ryan Reynolds and Hugh Jackman break character and joke about the credits.'] },
  77: { count: 1, scenes: ['Red Hulk (Thaddeus Ross) is teased in a final scene.'] },
  80: { count: 1, scenes: ['The Thunderbolts team rebrands — now calling themselves The New Avengers.'] },
  81: { count: 2, scenes: ['A post-credits tease for the future of the Multiverse Saga.', 'A light-hearted bonus scene with the Fantastic Four.'] },
}

// ── Infinity Stones ───────────────────────────────────────────────────────────
export const INFINITY_STONES = [
  {
    id: 'space',
    name: 'Space Stone',
    alias: 'The Tesseract',
    color: '#3b82f6',
    emoji: '🔵',
    power: 'Grants unlimited power to teleport anywhere in the universe.',
    firstAppearance: 17,
    appearances: [
      { titleId: 17, desc: 'Hidden in Red Skull\'s possession; goes to Asgard after the war.' },
      { titleId: 24, desc: 'Selvig studies it for Nick Fury\'s energy project.' },
      { titleId: 25, desc: 'Loki uses it to open a portal for the Chitauri invasion.' },
      { titleId: 27, desc: 'Referenced as being in Asgard\'s vault.' },
      { titleId: 20, desc: 'The Supreme Intelligence/Kree used it in Mar-Vell\'s lightspeed research.' },
      { titleId: 47, desc: 'Thanos takes it from Loki and adds it to the Gauntlet.' },
      { titleId: 48, desc: 'Used in the Time Heist; alternate-2012 Loki escapes with it.' },
    ],
  },
  {
    id: 'mind',
    name: 'Mind Stone',
    alias: 'The Scepter / Vision\'s Forehead',
    color: '#eab308',
    emoji: '🟡',
    power: 'Grants mind control, mental projection, and incredible energy blasts.',
    firstAppearance: 25,
    appearances: [
      { titleId: 25, desc: 'Loki\'s Scepter contains the Mind Stone; used to control Selvig and Clint.' },
      { titleId: 32, desc: 'Hydra experiments on Wanda and Pietro with the Scepter. Used to create Vision.' },
      { titleId: 40, desc: 'Wanda\'s scepter-enhanced powers are first revealed.' },
      { titleId: 47, desc: 'Vision wears the Mind Stone in his forehead. Thanos extracts and adds it last.' },
      { titleId: 48, desc: 'White Vision is created without the Stone; the original stone is destroyed.' },
    ],
  },
  {
    id: 'reality',
    name: 'Reality Stone',
    alias: 'The Aether',
    color: '#ef4444',
    emoji: '🔴',
    power: 'Can reshape matter and reality itself — converts anything into dark matter.',
    firstAppearance: 27,
    appearances: [
      { titleId: 27, desc: 'Jane Foster becomes infected by the Aether; Malekith attempts to wield it.' },
      { titleId: 31, desc: 'The Collector (Taneleer Tivan) holds the Aether — one of six Infinity Stones.' },
      { titleId: 47, desc: 'Thanos takes it from the Collector on Knowhere to fill the Gauntlet.' },
    ],
  },
  {
    id: 'power',
    name: 'Power Stone',
    alias: 'The Orb',
    color: '#a855f7',
    emoji: '🟣',
    power: 'Amplifies energy to devastating levels — can destroy entire planets.',
    firstAppearance: 30,
    appearances: [
      { titleId: 30, desc: 'Star-Lord retrieves the Orb from Morag; the Guardians prevent Ronan from using it.' },
      { titleId: 47, desc: 'Thanos destroys Xandar off-screen and takes the Power Stone first.' },
    ],
  },
  {
    id: 'time',
    name: 'Time Stone',
    alias: 'The Eye of Agamotto',
    color: '#22c55e',
    emoji: '🟢',
    power: 'Controls the flow of time — reverse, fast-forward, or create time loops.',
    firstAppearance: 44,
    appearances: [
      { titleId: 44, desc: 'Doctor Strange uses the Eye to trap Dormammu in a time loop.' },
      { titleId: 47, desc: 'Strange surrenders the Stone to save Tony\'s life: "It was the only way."' },
      { titleId: 48, desc: 'Used in the Time Heist; Strange later wields all six Stones briefly.' },
    ],
  },
  {
    id: 'soul',
    name: 'Soul Stone',
    alias: 'Hidden on Vormir',
    color: '#f97316',
    emoji: '🟠',
    power: 'Captures, controls, and alters souls — can trap half the universe\'s life force.',
    firstAppearance: 47,
    appearances: [
      { titleId: 47, desc: 'Thanos sacrifices Gamora on Vormir to claim the Soul Stone.' },
      { titleId: 48, desc: 'Clint sacrifices Natasha on Vormir to claim it for the Time Heist.' },
    ],
  },
]

// ── MCU Phases ────────────────────────────────────────────────────────────────
export const MCU_PHASES = [
  {
    key: 'phase1',
    label: 'Phase 1',
    sub: 'Infinity Saga: Assembly',
    color: '#E81C2E',
    emoji: '🛡️',
    ids: [17, 20, 21, 22, 23, 24, 25],
    note: 'The Avengers assemble for the first time.',
  },
  {
    key: 'phase2',
    label: 'Phase 2',
    sub: 'Infinity Saga: Expansion',
    color: '#F5C518',
    emoji: '⚡',
    ids: [26, 27, 28, 30, 31, 32, 33],
    note: 'The universe expands; Hydra is exposed; Thanos lurks.',
  },
  {
    key: 'phase3',
    label: 'Phase 3',
    sub: 'Infinity Saga: Endgame',
    color: '#a78bfa',
    emoji: '♾️',
    ids: [40, 41, 42, 43, 44, 45, 46, 47, 48, 56],
    note: 'The Infinity War, the Snap, and the Endgame.',
  },
  {
    key: 'phase4',
    label: 'Phase 4',
    sub: 'Multiverse Saga: Outbreak',
    color: '#60a5fa',
    emoji: '🌀',
    ids: [50, 51, 49, 52, 54, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 53],
    note: 'The Multiverse fractures; new heroes emerge.',
  },
  {
    key: 'phase5',
    label: 'Phase 5',
    sub: 'Multiverse Saga: The Kang Dynasty',
    color: '#4ade80',
    emoji: '👑',
    ids: [66, 67, 68, 69, 70, 71, 75, 77, 78, 79],
    note: 'Kang the Conqueror rises across the Multiverse.',
  },
  {
    key: 'phase6',
    label: 'Phase 6',
    sub: 'Multiverse Saga: Secret Wars',
    color: '#f97316',
    emoji: '💥',
    ids: [80, 81, 82, 83, 84, 85],
    note: 'The ultimate battle across all of reality.',
  },
]

// ── MCU Chronological Order ───────────────────────────────────────────────────
// IDs in story-chronological order (MCU titles only; non-MCU stay in release order)
export const MCU_CHRONO_ORDER = [
  17,  // Captain America: The First Avenger (WWII)
  18,  // Agent Carter S1
  19,  // Agent Carter S2
  20,  // Captain Marvel (1990s)
  21,  // Iron Man (2008)
  22,  // Iron Man 2
  24,  // Thor
  23,  // The Incredible Hulk
  25,  // The Avengers
  26,  // Iron Man 3
  27,  // Thor: The Dark World
  30,  // Guardians of the Galaxy
  31,  // Guardians of the Galaxy Vol. 2
  28,  // Captain America: The Winter Soldier
  29,  // Agents of S.H.I.E.L.D. S1–S7
  32,  // Avengers: Age of Ultron
  33,  // Ant-Man
  40,  // Captain America: Civil War
  42,  // Black Panther
  43,  // Spider-Man: Homecoming
  44,  // Doctor Strange
  41,  // Black Widow (set ~2016 with present-day bookends)
  45,  // Thor: Ragnarok
  47,  // Avengers: Infinity War
  46,  // Ant-Man and the Wasp (overlaps Infinity War)
  48,  // Avengers: Endgame
  49,  // Loki S1–S2 (branches timeline)
  50,  // WandaVision
  51,  // The Falcon and the Winter Soldier
  54,  // Shang-Chi and the Legend of the Ten Rings
  52,  // Hawkeye
  59,  // Moon Knight
  55,  // Eternals (vast timeline, modern resolution)
  58,  // Doctor Strange in the Multiverse of Madness
  60,  // Ms. Marvel
  61,  // She-Hulk: Attorney at Law
  62,  // Thor: Love and Thunder
  64,  // Werewolf by Night
  65,  // The Guardians of the Galaxy Holiday Special
  63,  // Black Panther: Wakanda Forever
  53,  // Echo
  68,  // Secret Invasion
  66,  // Ant-Man and the Wasp: Quantumania
  71,  // Agatha All Along
  67,  // Guardians of the Galaxy Vol. 3
  69,  // The Marvels
  56,  // Spider-Man: Far From Home
  57,  // Spider-Man: No Way Home
  70,  // Deadpool & Wolverine
  75,  // Ironheart
  77,  // Captain America: Brave New World
  79,  // Wonder Man
  78,  // Daredevil: Born Again S1–S2
  80,  // Thunderbolts*
  81,  // The Fantastic Four: First Steps
  82,  // VisionQuest
  83,  // Spider-Man: Brand New Day
  84,  // Avengers: Doomsday
  85,  // Avengers: Secret Wars
]

// ── Avengers Team Tracker ────────────────────────────────────────────────────
export const AVENGERS_TEAM = {
  teamMovies: [25, 32, 40, 47, 48, 80],  // Avengers, AoU, Civil War, IW, Endgame, Thunderbolts*
  members: [
    { key: 'iron_man',       name: 'Iron Man',       realName: 'Tony Stark',        emoji: '🦾', titleIds: [21, 22, 25, 26, 32, 40, 41, 47, 48] },
    { key: 'captain_america',name: 'Captain America', realName: 'Steve Rogers',      emoji: '🛡️', titleIds: [17, 25, 28, 32, 40, 47, 48] },
    { key: 'thor',           name: 'Thor',            realName: 'Thor Odinson',      emoji: '⚡', titleIds: [24, 25, 27, 32, 40, 45, 47, 48, 62] },
    { key: 'hulk',           name: 'Hulk',            realName: 'Bruce Banner',      emoji: '💚', titleIds: [23, 25, 32, 40, 45, 47, 48] },
    { key: 'black_widow',    name: 'Black Widow',     realName: 'Natasha Romanoff',  emoji: '🕷️', titleIds: [22, 25, 28, 32, 40, 41, 47, 48] },
    { key: 'hawkeye',        name: 'Hawkeye',         realName: 'Clint Barton',      emoji: '🏹', titleIds: [24, 25, 32, 40, 47, 48, 52] },
    { key: 'war_machine',    name: 'War Machine',     realName: 'James Rhodes',      emoji: '🤖', titleIds: [22, 25, 32, 40, 47, 48] },
    { key: 'scarlet_witch',  name: 'Scarlet Witch',   realName: 'Wanda Maximoff',    emoji: '🔮', titleIds: [32, 40, 47, 48, 50, 58] },
    { key: 'vision',         name: 'Vision',          realName: 'Vision',            emoji: '💜', titleIds: [32, 40, 47, 50] },
    { key: 'spider_man',     name: 'Spider-Man',      realName: 'Peter Parker',      emoji: '🕸️', titleIds: [40, 43, 47, 48, 56, 57] },
    { key: 'black_panther',  name: 'Black Panther',   realName: 'T\'Challa',         emoji: '🐾', titleIds: [40, 42, 47, 48] },
    { key: 'doctor_strange', name: 'Doctor Strange',  realName: 'Stephen Strange',   emoji: '🌀', titleIds: [44, 47, 48, 57, 58] },
    { key: 'captain_marvel', name: 'Captain Marvel',  realName: 'Carol Danvers',     emoji: '⭐', titleIds: [20, 48, 69] },
    { key: 'ant_man',        name: 'Ant-Man',         realName: 'Scott Lang',        emoji: '🐜', titleIds: [33, 40, 46, 47, 48, 66] },
    { key: 'falcon',         name: 'Falcon/Cap',      realName: 'Sam Wilson',        emoji: '🦅', titleIds: [28, 32, 40, 47, 48, 51, 77] },
    { key: 'winter_soldier', name: 'Winter Soldier',  realName: 'Bucky Barnes',      emoji: '🦾', titleIds: [17, 28, 40, 47, 48, 51] },
    { key: 'nebula',         name: 'Nebula',          realName: 'Nebula',            emoji: '🔵', titleIds: [30, 31, 40, 47, 48, 67] },
    { key: 'rocket',         name: 'Rocket',          realName: 'Rocket Raccoon',    emoji: '🦝', titleIds: [30, 31, 40, 47, 48, 67] },
    { key: 'thor_stormbreaker', name: 'Valkyrie',     realName: 'Brunnhilde',        emoji: '⚔️', titleIds: [45, 48, 62] },
    { key: 'shang_chi',      name: 'Shang-Chi',       realName: 'Shang-Chi',         emoji: '👊', titleIds: [54] },
  ],
}
