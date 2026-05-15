/**
 * Static metadata for all 85 Marvel titles.
 * Used by TitleDetailModal to show streaming service, IMDb rating,
 * runtime, and a short description.
 *
 * service: streaming platform where it's currently available
 * imdb:    IMDb score out of 10 (string)
 * runtime: human-readable runtime string
 * desc:    short 1–2 sentence description
 */
export const TITLE_META = {
  // ── Blade trilogy ──────────────────────────────────────────────────────────
  1: {
    service: 'Disney+',
    imdb: '7.1',
    runtime: '120 min',
    desc: 'Dhampir vampire hunter Blade wages a one-man war against the vampire underworld with his mentor Abraham Whistler.',
  },
  2: {
    service: 'Disney+',
    imdb: '6.8',
    runtime: '117 min',
    desc: 'Blade reluctantly teams with a clan of vampires to battle the Reapers — a new super-strain threatening both humans and vampires.',
  },
  3: {
    service: 'Disney+',
    imdb: '5.8',
    runtime: '113 min',
    desc: 'Blade joins the Nightstalkers to take down Dracula, the original vampire, who has been resurrected by a group of evil vampires.',
  },

  // ── Animated ───────────────────────────────────────────────────────────────
  4: {
    service: 'Disney+',
    imdb: '7.2',
    runtime: '4 episodes · ~30 min each',
    desc: 'An animated anthology exploring the rich history of Wakanda\'s elite spy force, the Eyes of Wakanda.',
  },

  // ── X-Men saga ─────────────────────────────────────────────────────────────
  5: {
    service: 'Disney+',
    imdb: '7.7',
    runtime: '132 min',
    desc: 'In 1962, Charles Xavier and Erik Lehnsherr work together with the CIA to stop the Hellfire Club from triggering World War III.',
  },
  6: {
    service: 'Disney+',
    imdb: '6.7',
    runtime: '107 min',
    desc: 'Wolverine\'s past is revealed as he undergoes the Weapon X program that gives him his adamantium skeleton and claws.',
  },
  7: {
    service: 'Disney+',
    imdb: '7.4',
    runtime: '104 min',
    desc: 'Professor Xavier\'s team of mutants faces off against Magneto\'s Brotherhood to decide the fate of mutant-kind.',
  },
  8: {
    service: 'Disney+',
    imdb: '7.5',
    runtime: '134 min',
    desc: 'Mutants must band together to stop the sinister Stryker, who has captured Professor Xavier and is using him against his own kind.',
  },
  9: {
    service: 'Disney+',
    imdb: '6.7',
    runtime: '104 min',
    desc: 'A cure for mutation is developed, forcing mutants to choose sides in a war that will decide their fate — and the fate of humanity.',
  },
  10: {
    service: 'Disney+',
    imdb: '7.3',
    runtime: '126 min',
    desc: 'Wolverine travels to Japan, where he faces his ultimate nemesis in a battle that will change him forever.',
  },
  11: {
    service: 'Disney+',
    imdb: '8.0',
    runtime: '132 min',
    desc: 'Wolverine and the X-Men travel back to 1973 to prevent a war between humans and mutants that threatens both species.',
  },
  12: {
    service: 'Disney+',
    imdb: '6.9',
    runtime: '143 min',
    desc: 'The X-Men face Apocalypse, the world\'s first mutant, who awakens after thousands of years to cleanse mankind and reshape civilization.',
  },
  13: {
    service: 'Disney+',
    imdb: '5.7',
    runtime: '114 min',
    desc: 'Jean Grey\'s powers amplify out of control as she develops the unstable Phoenix persona, threatening to tear the X-Men apart.',
  },
  14: {
    service: 'Disney+',
    imdb: '8.0',
    runtime: '108 min',
    desc: 'Wade Wilson undergoes a rogue experiment that leaves him with accelerated healing powers and becomes the wisecracking mercenary Deadpool.',
  },
  15: {
    service: 'Disney+',
    imdb: '7.7',
    runtime: '119 min',
    desc: 'Deadpool forms an unlikely alliance with Cable and creates the X-Force to protect a young mutant from becoming a weapon.',
  },
  16: {
    service: 'Disney+',
    imdb: '8.1',
    runtime: '137 min',
    desc: 'In a near future where mutants are nearly extinct, an aging Wolverine cares for an ailing Professor X on a dark, emotional final journey.',
  },

  // ── MCU: Infinity Saga ──────────────────────────────────────────────────────
  17: {
    service: 'Disney+',
    imdb: '6.9',
    runtime: '124 min',
    desc: 'Steve Rogers transforms from a scrawny reject into the world\'s first Super-Soldier to fight HYDRA and the Red Skull in WWII.',
  },
  18: {
    service: 'Disney+',
    imdb: '7.9',
    runtime: '8 episodes · 45 min each',
    desc: 'Peggy Carter fights for her place in a world full of men who underestimate her, proving she is just as capable as any man.',
  },
  19: {
    service: 'Disney+',
    imdb: '7.9',
    runtime: '10 episodes · 45 min each',
    desc: 'Agent Peggy Carter and Howard Stark tackle a new threat in 1940s Los Angeles, uncovering a dark secret about the past.',
  },
  20: {
    service: 'Disney+',
    imdb: '6.8',
    runtime: '124 min',
    desc: 'Carol Danvers discovers her past as a Kree warrior and returns to Earth in the 1990s to join the fight against a Skrull invasion.',
  },
  21: {
    service: 'Disney+',
    imdb: '7.9',
    runtime: '126 min',
    desc: 'Billionaire inventor Tony Stark builds a suit of armor to escape captivity, then decides to use it to protect the world as Iron Man.',
  },
  22: {
    service: 'Disney+',
    imdb: '7.0',
    runtime: '124 min',
    desc: 'Tony Stark faces pressure from the government to share his Iron Man technology while battling a new enemy and his own failing health.',
  },
  23: {
    service: 'Disney+',
    imdb: '6.7',
    runtime: '112 min',
    desc: 'Bruce Banner, on the run from the government, races to find a cure for his condition as the Abomination emerges as a new threat.',
  },
  24: {
    service: 'Disney+',
    imdb: '7.0',
    runtime: '115 min',
    desc: 'The arrogant prince Thor is banished to Earth, where he must prove himself worthy of his powers while his brother Loki schemes.',
  },
  25: {
    service: 'Disney+',
    imdb: '8.0',
    runtime: '143 min',
    desc: 'Earth\'s Mightiest Heroes unite for the first time to stop Loki from using the Tesseract to enslave the human race.',
  },
  26: {
    service: 'Disney+',
    imdb: '7.1',
    runtime: '130 min',
    desc: 'Tony Stark encounters a teenager who claims to be his son, battles the Mandarin, and must work without his suit to save himself and Pepper.',
  },
  27: {
    service: 'Disney+',
    imdb: '6.8',
    runtime: '112 min',
    desc: 'Thor and Loki must stop the Dark Elves from using the Aether to plunge the universe into darkness during a rare cosmic convergence.',
  },
  28: {
    service: 'Disney+',
    imdb: '7.7',
    runtime: '136 min',
    desc: 'Steve Rogers uncovers a conspiracy within S.H.I.E.L.D. while being hunted by a deadly assassin known as the Winter Soldier.',
  },
  29: {
    service: 'Disney+',
    imdb: '7.5',
    runtime: '136 episodes · 45 min each',
    desc: 'Agent Coulson leads a team of S.H.I.E.L.D. agents on dangerous missions across 7 seasons, deeply tied to MCU events.',
  },
  30: {
    service: 'Disney+',
    imdb: '8.0',
    runtime: '121 min',
    desc: 'A gang of intergalactic misfits — including a talking raccoon and a sentient tree — must band together to save the galaxy.',
  },
  31: {
    service: 'Disney+',
    imdb: '7.7',
    runtime: '136 min',
    desc: 'Peter Quill and his fellow Guardians fight to protect a mysterious orb sought by the powerful villain Ego — who turns out to be Peter\'s father.',
  },
  32: {
    service: 'Disney+',
    imdb: '7.3',
    runtime: '141 min',
    desc: 'The Avengers must dismantle A.I.M.\'s secret development of a world-ending weapon while dealing with the rogue A.I. Ultron.',
  },
  33: {
    service: 'Disney+',
    imdb: '7.3',
    runtime: '117 min',
    desc: 'Petty thief Scott Lang must embrace his inner hero and help Hank Pym protect the Ant-Man suit from a deadly new threat.',
  },

  // ── Defenders / Netflix saga ───────────────────────────────────────────────
  34: {
    service: 'Disney+',
    imdb: '8.6',
    runtime: '39 episodes · 50 min each',
    desc: 'Blind attorney Matt Murdock fights crime by day in the courtroom and by night as the vigilante Daredevil in Hell\'s Kitchen.',
  },
  35: {
    service: 'Disney+',
    imdb: '7.9',
    runtime: '39 episodes · 55 min each',
    desc: 'Superpowered private investigator Jessica Jones tries to rebuild her life while confronting a terrifying villain from her past.',
  },
  36: {
    service: 'Disney+',
    imdb: '7.3',
    runtime: '26 episodes · 50 min each',
    desc: 'Luke Cage, a man with unbreakable skin and superhuman strength, becomes a hero on the streets of Harlem.',
  },
  37: {
    service: 'Disney+',
    imdb: '6.5',
    runtime: '23 episodes · 50 min each',
    desc: 'Danny Rand, heir to a billion-dollar corporation, returns after years of training as the Iron Fist to protect his city.',
  },
  38: {
    service: 'Disney+',
    imdb: '7.1',
    runtime: '8 episodes · 50 min each',
    desc: 'Daredevil, Jessica Jones, Luke Cage, and Iron Fist team up to fight a common enemy threatening New York City.',
  },
  39: {
    service: 'Disney+',
    imdb: '8.5',
    runtime: '26 episodes · 50 min each',
    desc: 'Frank Castle, a former Marine haunted by the murder of his family, wages a one-man war on crime as the ruthless Punisher.',
  },

  // ── MCU: Infinity Saga continued ───────────────────────────────────────────
  40: {
    service: 'Disney+',
    imdb: '7.8',
    runtime: '147 min',
    desc: 'Political friction divides the Avengers when the UN demands they sign the Sokovia Accords, forcing a catastrophic conflict between Iron Man and Cap.',
  },
  41: {
    service: 'Disney+',
    imdb: '6.7',
    runtime: '134 min',
    desc: 'Natasha Romanoff confronts her dark past as a spy and the Red Room program she was trained in as a girl.',
  },
  42: {
    service: 'Disney+',
    imdb: '7.3',
    runtime: '134 min',
    desc: 'T\'Challa returns home to Wakanda and must battle a powerful enemy — Erik Killmonger — who challenges him for the throne.',
  },
  43: {
    service: 'Disney+',
    imdb: '7.4',
    runtime: '133 min',
    desc: 'Peter Parker begins his journey as Spider-Man while under Tony Stark\'s mentorship, facing the tech-powered Vulture.',
  },
  44: {
    service: 'Disney+',
    imdb: '7.5',
    runtime: '115 min',
    desc: 'Brilliant neurosurgeon Doctor Stephen Strange discovers the hidden world of magic and alternate dimensions after a car accident.',
  },
  45: {
    service: 'Disney+',
    imdb: '7.9',
    runtime: '130 min',
    desc: 'Thor must escape the planet Sakaar and stop his newly-discovered sister Hela from destroying Asgard during Ragnarok.',
  },
  46: {
    service: 'Disney+',
    imdb: '7.1',
    runtime: '118 min',
    desc: 'Scott Lang and Hope van Dyne must work together to pull off a heist to recover Hank Pym\'s original Ant-Man suit.',
  },
  47: {
    service: 'Disney+',
    imdb: '8.4',
    runtime: '149 min',
    desc: 'The Mad Titan Thanos begins his quest to collect all six Infinity Stones, threatening the very existence of the universe.',
  },
  48: {
    service: 'Disney+',
    imdb: '8.4',
    runtime: '181 min',
    desc: 'The Avengers assemble one final time to reverse Thanos\'s devastating snap and restore the universe — at any cost.',
  },

  // ── MCU: Multiverse Saga ───────────────────────────────────────────────────
  49: {
    service: 'Disney+',
    imdb: '8.2',
    runtime: '12 episodes · 55 min each',
    desc: 'The trickster god Loki finds himself in a time-bending adventure after stealing the Tesseract, threatening the sacred timeline.',
  },
  50: {
    service: 'Disney+',
    imdb: '7.9',
    runtime: '9 episodes · 30 min each',
    desc: 'Wanda Maximoff and Vision live an idyllic suburban life — but the perfect reality hides a darker truth within the Hex.',
  },
  51: {
    service: 'Disney+',
    imdb: '7.2',
    runtime: '6 episodes · 50 min each',
    desc: 'Sam Wilson and Bucky Barnes team up to confront a super-soldier threat as Sam grapples with whether to take up Captain America\'s shield.',
  },
  52: {
    service: 'Disney+',
    imdb: '7.5',
    runtime: '6 episodes · 45 min each',
    desc: 'Clint Barton is drawn into an unexpected mission to confront his past as the Ronin with the help of his biggest fan, Kate Bishop.',
  },
  53: {
    service: 'Disney+',
    imdb: '6.8',
    runtime: '5 episodes · 40 min each',
    desc: 'Maya Lopez returns to her Oklahoma hometown and must confront her heritage and the darkness of the Kingpin\'s criminal empire.',
  },
  54: {
    service: 'Disney+',
    imdb: '7.4',
    runtime: '132 min',
    desc: 'Martial arts master Shang-Chi is drawn into the world of the mystical Ten Rings organization and must confront his father\'s legacy.',
  },
  55: {
    service: 'Disney+',
    imdb: '6.3',
    runtime: '157 min',
    desc: 'The Eternals — ancient aliens who have secretly lived on Earth for thousands of years — reunite to protect humanity from a new threat.',
  },
  56: {
    service: 'Disney+',
    imdb: '7.5',
    runtime: '129 min',
    desc: 'Peter Parker and his classmates travel to Europe for a summer trip, but Nick Fury calls on Peter to help defeat Mysterio.',
  },
  57: {
    service: 'Disney+',
    imdb: '8.3',
    runtime: '148 min',
    desc: 'Peter Parker asks Doctor Strange for help after his identity is revealed, inadvertently pulling multiverse villains into their universe.',
  },
  58: {
    service: 'Disney+',
    imdb: '6.9',
    runtime: '126 min',
    desc: 'Doctor Strange teams with America Chavez to navigate the multiverse while being hunted by a corrupted Scarlet Witch.',
  },
  59: {
    service: 'Disney+',
    imdb: '7.4',
    runtime: '6 episodes · 50 min each',
    desc: 'Marc Spector — a mercenary with dissociative identity disorder — becomes the conduit for the Egyptian moon god Khonshu.',
  },
  60: {
    service: 'Disney+',
    imdb: '7.3',
    runtime: '6 episodes · 40 min each',
    desc: 'Kamala Khan is a huge Captain Marvel fan who discovers she has unique powers when she puts on an ancient bangle from her past.',
  },
  61: {
    service: 'Disney+',
    imdb: '7.1',
    runtime: '9 episodes · 35 min each',
    desc: 'Jennifer Walters navigates life as a 6-foot-7 green superhero attorney — while trying to keep her professional and personal life intact.',
  },
  62: {
    service: 'Disney+',
    imdb: '6.7',
    runtime: '119 min',
    desc: 'Thor enlists the help of old ally Valkyrie and ex-girlfriend Jane Foster — now wielding Mjolnir as the Mighty Thor — to battle Gorr.',
  },
  63: {
    service: 'Disney+',
    imdb: '7.3',
    runtime: '161 min',
    desc: 'T\'Challa\'s death sends Wakanda into turmoil as Queen Ramonda, Shuri, and their allies unite to defend their nation from a new enemy.',
  },
  64: {
    service: 'Disney+',
    imdb: '7.3',
    runtime: '54 min',
    desc: 'A mysterious hunter pursues a terrifying werewolf through the Marvel universe in this black-and-white Halloween special.',
  },
  65: {
    service: 'Disney+',
    imdb: '7.3',
    runtime: '44 min',
    desc: 'The Guardians of the Galaxy celebrate their first Christmas by going on an unexpected quest to bring home a special gift for Peter Quill.',
  },
  66: {
    service: 'Disney+',
    imdb: '6.1',
    runtime: '125 min',
    desc: 'Scott Lang and Hope Van Dyne venture into the Quantum Realm, where they encounter Kang the Conqueror — a threat to the multiverse.',
  },
  67: {
    service: 'Disney+',
    imdb: '7.9',
    runtime: '150 min',
    desc: 'The Guardians must fight to keep their family together and uncover the tragic secret of Rocket\'s mysterious past.',
  },
  68: {
    service: 'Disney+',
    imdb: '6.0',
    runtime: '6 episodes · 45 min each',
    desc: 'Nick Fury returns to active duty and uncovers a dangerous conspiracy involving the shape-shifting Skrulls.',
  },
  69: {
    service: 'Disney+',
    imdb: '6.0',
    runtime: '105 min',
    desc: 'Carol Danvers, Monica Rambeau, and Kamala Khan must work together when their powers mysteriously entangle and they begin swapping places.',
  },
  70: {
    service: 'Disney+',
    imdb: '7.8',
    runtime: '127 min',
    desc: 'Wade Wilson and Logan — the Merc with a Mouth and the grumpy Wolverine — are pulled into the MCU timeline on a hilarious and emotional adventure.',
  },
  71: {
    service: 'Disney+',
    imdb: '7.6',
    runtime: '9 episodes · 45 min each',
    desc: 'Agnes of Westview reveals herself as the centuries-old witch Agatha Harkness and assembles a coven in this witchy sequel to WandaVision.',
  },
  72: {
    service: 'Disney+',
    imdb: '7.0',
    runtime: '6 episodes · 30 min each',
    desc: 'In a world overrun by zombies, a small group of surviving heroes fights for their lives in this animated horror anthology.',
  },
  73: {
    service: 'Disney+',
    imdb: '6.7',
    runtime: '112 min',
    desc: 'Journalist Eddie Brock bonds with an alien symbiote that gives him superhuman strength and a hunger for living brains.',
  },
  74: {
    service: 'Disney+',
    imdb: '6.4',
    runtime: '97 min',
    desc: 'Venom faces Carnage when Eddie Brock\'s prison pal Cletus Kasady bonds with his own monstrous symbiote.',
  },
  75: {
    service: 'Disney+',
    imdb: '6.7',
    runtime: '6 episodes · 45 min each',
    desc: 'Riri Williams, a genius MIT student, builds a mechanized suit and takes on the mantle of Ironheart while navigating the streets of Chicago.',
  },
  76: {
    service: 'Disney+',
    imdb: '7.9',
    runtime: '10 episodes · 25 min each',
    desc: 'Peter Parker balances high school life and his duties as Spider-Man, navigating a world where the Avengers no longer exist.',
  },
  77: {
    service: 'Disney+',
    imdb: '6.3',
    runtime: '118 min',
    desc: 'Sam Wilson — the new Captain America — faces a global threat involving a super soldier serum and the Red Hulk.',
  },
  78: {
    service: 'Disney+',
    imdb: '8.4',
    runtime: '18 episodes · 50 min each',
    desc: 'Matt Murdock returns as Daredevil in New York City\'s Hell\'s Kitchen, fighting crime and taking on the Kingpin\'s criminal empire once again.',
  },
  79: {
    service: 'Disney+',
    imdb: '7.2',
    runtime: '6 episodes · 40 min each',
    desc: 'Simon Williams — Hollywood stuntman and actor — tries to navigate fame and superheroes in this comic buddy series.',
  },
  80: {
    service: 'Disney+',
    imdb: '7.5',
    runtime: '127 min',
    desc: 'A team of government-sanctioned supervillains — Yelena Belova, Red Guardian, Ghost, and others — are forced to work together.',
  },
  81: {
    service: 'Disney+',
    imdb: '7.4',
    runtime: '130 min',
    desc: 'Marvel\'s First Family — Reed Richards, Sue Storm, Johnny Storm, and Ben Grimm — steps into a 1960s-inspired retro MCU adventure.',
  },

  // ── Coming soon ────────────────────────────────────────────────────────────
  82: {
    service: 'Disney+',
    imdb: 'TBA',
    runtime: '6 episodes (est.)',
    desc: 'The Vision returns in a new series that explores what happens when the synthezoid attempts to redefine what it means to be human.',
  },
  83: {
    service: 'Disney+',
    imdb: 'TBA',
    runtime: '10 episodes (est.)',
    desc: 'An all-new animated Spider-Man series following a fresh chapter in the life of Peter Parker and his brand new day.',
  },
  84: {
    service: 'Theaters',
    imdb: 'TBA',
    runtime: 'TBA',
    desc: 'The Avengers reassemble for a universe-threatening conflict in the next major MCU crossover event.',
  },
  85: {
    service: 'Theaters',
    imdb: 'TBA',
    runtime: 'TBA',
    desc: 'The ultimate clash of the multiverse unfolds in the grand conclusion to the Multiverse Saga.',
  },
}

/** Returns metadata for a title id, with safe fallback defaults */
export function getTitleMeta(id) {
  return TITLE_META[id] ?? {
    service: 'Disney+',
    imdb: 'N/A',
    runtime: 'N/A',
    desc: 'No description available.',
  }
}
