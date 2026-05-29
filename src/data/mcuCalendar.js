/**
 * mcuCalendar.js — "Today in MCU" data.
 * Keys are "MM-DD" (zero-padded). Each value is an object:
 *   { type: 'release'|'birthday'|'comic'|'bts'|'event', icon, text }
 */

export const MCU_CALENDAR = {
  // ── JANUARY ──────────────────────────────────────────────────────────────
  '01-01': { type: 'event',    icon: '🎉', text: 'Happy New Year from the MCU! In 2012, The Avengers began principal photography on this day in Cleveland, Ohio.' },
  '01-03': { type: 'birthday', icon: '🎂', text: 'Florence Pugh (Yelena Belova / Black Widow) was born on this day in 1996.' },
  '01-05': { type: 'birthday', icon: '🎂', text: 'Bradley Cooper, voice of Rocket Raccoon, was born on this day in 1975.' },
  '01-07': { type: 'birthday', icon: '🎂', text: 'Jeremy Renner (Hawkeye / Clint Barton) was born on this day in 1971.' },
  '01-08': { type: 'bts',      icon: '🎬', text: 'Avengers: Endgame was secretly filmed under the codename "Mary Lou." Only a handful of cast members knew the full plot.' },
  '01-10': { type: 'comic',    icon: '📖', text: 'The MCU\'s Falcon, Sam Wilson, first appeared in Captain America Comics #117 in September 1969 — one of the first Black superheroes in mainstream comics.' },
  '01-14': { type: 'bts',      icon: '🎬', text: 'Chris Evans initially turned down the role of Captain America three times before finally accepting in 2010.' },
  '01-15': { type: 'release',  icon: '📺', text: 'WandaVision Episode 1 premiered on Disney+ on this day in 2021, launching the MCU\'s first streaming original series.' },
  '01-18': { type: 'birthday', icon: '🎂', text: 'Dave Bautista (Drax the Destroyer) was born on this day in 1969. He was a WWE champion before joining the MCU.' },
  '01-20': { type: 'bts',      icon: '🎬', text: 'The original Avengers lineup almost included Ant-Man. In early drafts, Hank Pym was one of the founding members alongside Iron Man and Thor.' },
  '01-22': { type: 'comic',    icon: '📖', text: 'Moon Knight first appeared in Werewolf by Night #32 in August 1975 — created as a mercenary villain who later became a hero.' },
  '01-25': { type: 'bts',      icon: '🎬', text: 'Tom Hiddleston prepared for the role of Loki by researching Norse mythology and mischief archetypes for months before Thor began filming.' },
  '01-28': { type: 'event',    icon: '⭐', text: 'Avengers: Endgame crossed $1 billion worldwide in its first five days — the fastest any film had ever achieved that milestone.' },

  // ── FEBRUARY ─────────────────────────────────────────────────────────────
  '02-01': { type: 'bts',      icon: '🎬', text: 'The "I am Iron Man" line at the end of Iron Man (2008) was entirely improvised by Robert Downey Jr. — and director Jon Favreau kept it.' },
  '02-06': { type: 'birthday', icon: '🎂', text: 'Jack Kirby, co-creator of Captain America, Avengers, X-Men, Thor, and dozens of MCU characters, passed away on this day in 1994.' },
  '02-07': { type: 'bts',      icon: '🎬', text: 'Black Panther (2018) became the first superhero film nominated for Best Picture at the Academy Awards.' },
  '02-12': { type: 'comic',    icon: '📖', text: 'Thanos first appeared in The Invincible Iron Man #55 in February 1973 — created by Jim Starlin, who included himself as a background character in the same issue.' },
  '02-14': { type: 'birthday', icon: '🎂', text: 'Danai Gurira (Okoye) was born on this day in 1978 in Iowa, to parents who had emigrated from Zimbabwe.' },
  '02-16': { type: 'release',  icon: '🎬', text: 'Black Panther released in US theaters on this day in 2018, going on to earn over $1.3 billion worldwide.' },
  '02-16': { type: 'birthday', icon: '🎂', text: 'Elizabeth Olsen (Scarlet Witch / Wanda Maximoff) was born on this day in 1989.' },
  '02-17': { type: 'release',  icon: '🎬', text: 'Ant-Man and the Wasp: Quantumania opened in theaters on this day in 2023, introducing the Quantum Realm as a full setting.' },
  '02-22': { type: 'bts',      icon: '🎬', text: 'Gwyneth Paltrow famously forgot she was in Spider-Man: Homecoming until a podcast conversation with Jon Favreau jogged her memory years later.' },
  '02-25': { type: 'event',    icon: '🏆', text: 'Black Panther won three Academy Awards in 2019 (Costume Design, Production Design, Original Score) — the first superhero film to win Oscars in major categories.' },

  // ── MARCH ────────────────────────────────────────────────────────────────
  '03-04': { type: 'release',  icon: '📺', text: 'Daredevil: Born Again premiered on Disney+ on this day in 2025, reviving the Man Without Fear for the MCU proper.' },
  '03-08': { type: 'release',  icon: '🎬', text: 'Captain Marvel released in theaters on this day in 2019, becoming the first MCU film with a female lead.' },
  '03-10': { type: 'bts',      icon: '🎬', text: 'The Tesseract / Space Stone was the first Infinity Stone introduced in the MCU — it appears as a prop in Thor\'s scene in Odin\'s vault in the 2011 film.' },
  '03-15': { type: 'comic',    icon: '📖', text: 'Iron Man (Tony Stark) first appeared in Tales of Suspense #39 in March 1963. Stan Lee created him partly as a challenge: could he make readers like a billionaire weapons manufacturer?' },
  '03-22': { type: 'bts',      icon: '🎬', text: 'The Avengers (2012) was the first film in MCU history to use the full team logo and font that became the franchise\'s signature identity.' },
  '03-28': { type: 'birthday', icon: '🎂', text: 'Matt Damon, who made a cameo as a fake "Asgardian actor" in Thor: Ragnarok and Thor: Love and Thunder, was born on this day in 1970.' },
  '03-30': { type: 'release',  icon: '📺', text: 'Moon Knight Episode 1 premiered on Disney+ on this day in 2022, introducing Marc Spector and his dissociative identity disorder.' },

  // ── APRIL ────────────────────────────────────────────────────────────────
  '04-04': { type: 'birthday', icon: '🎂', text: 'Robert Downey Jr. (Tony Stark / Iron Man), the man who started the MCU, was born on this day in 1965.' },
  '04-04': { type: 'release',  icon: '🎬', text: 'Captain America: The Winter Soldier opened in US theaters on this day in 2014, redefining the MCU with a political thriller tone.' },
  '04-10': { type: 'comic',    icon: '📖', text: 'Captain America first appeared in Captain America Comics #1 in March 1941, punching Hitler on the cover — four months before the US entered World War II.' },
  '04-14': { type: 'bts',      icon: '🎬', text: 'Avengers: Infinity War and Endgame were filmed back-to-back in a single 9-month shoot — the longest continuous principal photography in MCU history.' },
  '04-22': { type: 'bts',      icon: '🎬', text: 'The famous "snap" sound effect in Avengers: Infinity War required 33 takes to get right. The sound team also added Thanos\'s gauntlet reverberating in space.' },
  '04-26': { type: 'release',  icon: '🎬', text: 'Avengers: Endgame opened in theaters on this day in 2019, breaking every box office record and completing the 22-film Infinity Saga.' },
  '04-27': { type: 'release',  icon: '🎬', text: 'Avengers: Infinity War opened in theaters on this day in 2018, shocking audiences worldwide with its ending — half of all life in the universe erased.' },

  // ── MAY ──────────────────────────────────────────────────────────────────
  '05-01': { type: 'release',  icon: '🎬', text: 'Avengers: Age of Ultron opened in theaters on this day in 2015, introducing Scarlet Witch, Quicksilver, and Vision to the MCU.' },
  '05-02': { type: 'release',  icon: '🎬', text: 'Iron Man (2008) opened in theaters on this day — the film that launched the entire Marvel Cinematic Universe. "I am Iron Man." The rest is history.' },
  '05-03': { type: 'birthday', icon: '🎂', text: 'Pom Klementieff (Mantis of the Guardians of the Galaxy) was born on this day in 1986.' },
  '05-03': { type: 'release',  icon: '🎬', text: 'Iron Man 3 released in US theaters on this day in 2013, grossing over $1.2 billion worldwide and becoming the 5th-highest grossing film of that year.' },
  '05-04': { type: 'event',    icon: '🌟', text: 'May 4th is celebrated as "Star Wars Day" — but for Marvel fans, it\'s the anniversary of The Avengers\'s release in 2012. Marvel vs. Star Wars bragging rights every year.' },
  '05-05': { type: 'release',  icon: '🎬', text: 'Guardians of the Galaxy Vol. 2 released on this day in 2017, and Guardians Vol. 3 released on this day in 2023 — exactly 6 years apart.' },
  '05-06': { type: 'release',  icon: '🎬', text: 'Thor (2011) and Captain America: Civil War (2016) both opened in US theaters on May 6th in their respective years.' },
  '05-07': { type: 'release',  icon: '🎬', text: 'Iron Man 2 released in US theaters on this day in 2010, introducing Black Widow (Scarlett Johansson) and War Machine to the MCU.' },
  '05-15': { type: 'bts',      icon: '🎬', text: 'The Russos secretly filmed Chris Evans\'s "Hail HYDRA" elevator scene in Captain America: Civil War without telling the crew what was happening, keeping the twist a complete surprise.' },
  '05-20': { type: 'comic',    icon: '📖', text: 'The Guardians of the Galaxy first appeared as a team in Marvel Super Heroes #18 in January 1969 — though the original lineup was completely different from the film version.' },
  '05-22': { type: 'bts',      icon: '🎬', text: 'Chris Pratt lost 60 pounds in 6 months to prepare for the role of Star-Lord, transforming from his Parks & Rec physique into the Guardians hero.' },
  '05-27': { type: 'birthday', icon: '🎂', text: 'Paul Bettany (Vision / J.A.R.V.I.S.) was born on this day in 1971. He nearly turned down the role of Vision, thinking it was a "small part."' },

  // ── JUNE ─────────────────────────────────────────────────────────────────
  '06-01': { type: 'birthday', icon: '🎂', text: 'Tom Holland (Spider-Man / Peter Parker) was born on this day in 1996. He was just 19 when cast as the MCU\'s Spider-Man.' },
  '06-08': { type: 'release',  icon: '📺', text: 'Ms. Marvel Episode 1 premiered on Disney+ on this day in 2022, introducing Kamala Khan as the first Muslim-American MCU superhero.' },
  '06-09': { type: 'release',  icon: '📺', text: 'Loki Season 1 premiered on Disney+ on this day in 2021, introducing the TVA and the concept of branching timelines to the MCU.' },
  '06-13': { type: 'birthday', icon: '🎂', text: 'Chris Evans (Captain America / Steve Rogers) was born on this day in 1981 in Boston, Massachusetts.' },
  '06-13': { type: 'release',  icon: '🎬', text: 'The Incredible Hulk (2008) opened in theaters on this day — just 5 weeks after Iron Man launched the MCU.' },
  '06-19': { type: 'birthday', icon: '🎂', text: 'Zoe Saldaña (Gamora) was born on this day in 1978. She holds a unique record: starring in three of the top 5 highest-grossing films of all time (Avatar, Avengers: Infinity War, Endgame).' },
  '06-21': { type: 'release',  icon: '📺', text: 'Secret Invasion Episode 1 premiered on Disney+ on this day in 2023, featuring Nick Fury\'s most personal battle against shape-shifting Skrulls.' },
  '06-25': { type: 'bts',      icon: '🎬', text: 'The original idea for The Avengers had Bruce Banner transforming into the Hulk in the first act — but Joss Whedon deliberately held it back until the climactic battle for maximum impact.' },

  // ── JULY ─────────────────────────────────────────────────────────────────
  '07-02': { type: 'release',  icon: '🎬', text: 'Spider-Man: Far From Home released on this day in 2019, serving as the official epilogue to the Infinity Saga.' },
  '07-06': { type: 'release',  icon: '🎬', text: 'Ant-Man and the Wasp opened in theaters on this day in 2018 — just 2 months after Infinity War, providing a tonal contrast and setting up the Quantum Realm.' },
  '07-07': { type: 'release',  icon: '🎬', text: 'Spider-Man: Homecoming opened in US theaters on this day in 2017 — the first Spider-Man film fully integrated into the MCU.' },
  '07-08': { type: 'release',  icon: '🎬', text: 'Thor: Love and Thunder opened in theaters on this day in 2022, making Natalie Portman the first woman to wield Mjolnir in MCU canon.' },
  '07-09': { type: 'release',  icon: '🎬', text: 'Black Widow released on Disney+ and in theaters on this day in 2021, finally giving Natasha Romanoff her solo MCU origin film.' },
  '07-17': { type: 'release',  icon: '🎬', text: 'Ant-Man (2015) opened in theaters on this day — the film that proved the MCU could make ANY superhero work on screen, no matter how obscure.' },
  '07-18': { type: 'birthday', icon: '🎂', text: 'Vin Diesel, the voice and motion-capture performer of Groot, was born on this day in 1967. He reportedly records "I am Groot" in multiple languages for international releases.' },
  '07-19': { type: 'birthday', icon: '🎂', text: 'Benedict Cumberbatch (Doctor Strange) was born on this day in 1976. He appeared in the most Marvel films of any solo actor, crossing over into Spider-Man, Avengers and more.' },
  '07-22': { type: 'release',  icon: '🎬', text: 'Captain America: The First Avenger opened in theaters on this day in 2011, taking the MCU back to WWII and introducing the Tesseract (Space Stone).' },
  '07-26': { type: 'release',  icon: '🎬', text: 'Deadpool & Wolverine opened in theaters on this day in 2024, breaking box office records as the highest-grossing R-rated film ever.' },

  // ── AUGUST ───────────────────────────────────────────────────────────────
  '08-01': { type: 'release',  icon: '🎬', text: 'Guardians of the Galaxy opened in theaters on this day in 2014. Few expected it to succeed — it became one of the MCU\'s most beloved films.' },
  '08-05': { type: 'birthday', icon: '🎂', text: 'James Gunn (director of Guardians of the Galaxy Vol. 1, 2 & 3) was born on this day in 1966.' },
  '08-11': { type: 'birthday', icon: '🎂', text: 'Chris Hemsworth (Thor) was born on this day in 1983 in Melbourne, Australia. His brother Liam Hemsworth also auditioned for Thor.' },
  '08-13': { type: 'birthday', icon: '🎂', text: 'Sebastian Stan (Bucky Barnes / Winter Soldier) was born on this day in 1982 in Constanța, Romania.' },
  '08-18': { type: 'release',  icon: '📺', text: 'She-Hulk: Attorney at Law Episode 1 premiered on Disney+ on this day in 2022, bringing Jennifer Walters\'s fourth-wall breaking comedy to the MCU.' },
  '08-28': { type: 'birthday', icon: '🎂', text: 'Jack Kirby, co-creator of Captain America, Thor, Iron Man, X-Men, Black Panther, and Fantastic Four, was born on this day in 1917. No single person shaped more of the MCU.' },
  '08-31': { type: 'event',    icon: '📰', text: 'On this day in 2009, Disney announced it would acquire Marvel Entertainment for $4 billion — the deal that would transform superhero cinema forever.' },

  // ── SEPTEMBER ────────────────────────────────────────────────────────────
  '09-01': { type: 'bts',      icon: '🎬', text: 'The Infinity Gauntlet comic limited series (1991) by Jim Starlin directly inspired the plot of Avengers: Infinity War and Endgame. It sold out immediately on announcement of the films.' },
  '09-03': { type: 'release',  icon: '🎬', text: 'Shang-Chi and the Legend of the Ten Rings opened in theaters on this day in 2021, becoming the MCU\'s first film with a predominantly Asian cast.' },
  '09-18': { type: 'release',  icon: '📺', text: 'Agatha All Along premiered on Disney+ on this day in 2024, spinning off from WandaVision with Kathryn Hahn reprising her beloved role.' },
  '09-23': { type: 'birthday', icon: '🎂', text: 'Anthony Mackie (Sam Wilson / Falcon / Captain America) was born on this day in 1978 in New Orleans, Louisiana.' },
  '09-27': { type: 'birthday', icon: '🎂', text: 'Gwyneth Paltrow (Pepper Potts) was born on this day in 1972. She famously forgot she had appeared in Spider-Man: Homecoming.' },

  // ── OCTOBER ──────────────────────────────────────────────────────────────
  '10-01': { type: 'birthday', icon: '🎂', text: 'Brie Larson (Captain Marvel / Carol Danvers) was born on this day in 1989. She is a trained martial artist and learned military protocols from real Air Force pilots for the role.' },
  '10-03': { type: 'birthday', icon: '🎂', text: 'Tessa Thompson (Valkyrie) was born on this day in 1983. She became the first openly LGBT+ Avenger in the MCU.' },
  '10-05': { type: 'release',  icon: '📺', text: 'Loki Season 2 premiered on Disney+ on this day in 2023, featuring Loki\'s time-slipping powers and culminating in one of the MCU\'s most celebrated finales.' },
  '10-12': { type: 'birthday', icon: '🎂', text: 'Hugh Jackman (Wolverine / Logan) was born on this day in 1968. He has played Wolverine for over 25 years — the longest an actor has played a superhero role.' },
  '10-19': { type: 'birthday', icon: '🎂', text: 'Jon Favreau (Iron Man director / Happy Hogan) was born on this day in 1966. He turned down a salary increase to ensure Iron Man had creative freedom.' },
  '10-22': { type: 'birthday', icon: '🎂', text: 'Jeff Goldblum (The Grandmaster in Thor: Ragnarok) was born on this day in 1952. Most of his performance was improvised with director Taika Waititi\'s encouragement.' },
  '10-23': { type: 'birthday', icon: '🎂', text: 'Ryan Reynolds (Deadpool / Wade Wilson) was born on this day in 1976. He spent 11 years fighting to get a proper Deadpool movie made after X-Men Origins: Wolverine.' },
  '10-31': { type: 'birthday', icon: '🎂', text: 'Letitia Wright (Shuri) was born on Halloween, October 31, 1993. Her brother T\'Challa called her the smartest person in Wakanda.' },

  // ── NOVEMBER ─────────────────────────────────────────────────────────────
  '11-03': { type: 'release',  icon: '🎬', text: 'Thor: Ragnarok opened in theaters on this day in 2017, with Taika Waititi\'s comedic reinvention of Thor making it one of the MCU\'s most beloved films.' },
  '11-04': { type: 'release',  icon: '🎬', text: 'Doctor Strange opened in US theaters on this day in 2016, introducing the Multiverse, the Time Stone, and the mystic arts to the MCU.' },
  '11-05': { type: 'release',  icon: '🎬', text: 'Eternals opened in theaters on this day in 2021, the most visually distinctive MCU film directed by Oscar-winner Chloé Zhao.' },
  '11-08': { type: 'release',  icon: '🎬', text: 'Thor: The Dark World opened in US theaters on this day in 2013, introducing the Reality Stone (Aether) and set primarily in Asgard.' },
  '11-10': { type: 'release',  icon: '🎬', text: 'The Marvels opened in theaters on this day in 2023, featuring three female heroes swapping places whenever they use their powers.' },
  '11-11': { type: 'release',  icon: '🎬', text: 'Black Panther: Wakanda Forever opened in theaters on this day in 2022, honoring the memory of Chadwick Boseman while introducing Namor and Ironheart.' },
  '11-12': { type: 'event',    icon: '🌟', text: 'Stan Lee, the co-creator of most MCU characters and beloved comic book icon, passed away on this day in 2018 at age 95. His legacy spans 60+ years of Marvel history.' },
  '11-22': { type: 'birthday', icon: '🎂', text: 'Mark Ruffalo (Bruce Banner / Hulk) and Scarlett Johansson (Black Widow) share November 22 as their birthday — in 1967 and 1984 respectively.' },
  '11-24': { type: 'release',  icon: '📺', text: 'Hawkeye Episode 1 premiered on Disney+ on this day in 2021, set at Christmas time and introducing Kate Bishop to the MCU.' },
  '11-29': { type: 'birthday', icon: '🎂', text: 'Chadwick Boseman (T\'Challa / Black Panther) was born on this day in 1977. He passed away in 2020 while continuing to work on Marvel films through his illness, unknown to the public.' },
  '11-29': { type: 'birthday', icon: '🎂', text: 'Don Cheadle (James Rhodes / War Machine) was also born on this day in 1964, sharing a birthday with his onscreen Avengers ally Chadwick Boseman.' },

  // ── DECEMBER ─────────────────────────────────────────────────────────────
  '12-12': { type: 'bts',      icon: '🎬', text: 'The MCU\'s post-credits scene tradition started with Iron Man (2008) — Nick Fury appears to tell Tony Stark about the "Avengers Initiative." No one in the theater knew what that meant yet.' },
  '12-17': { type: 'release',  icon: '🎬', text: 'Spider-Man: No Way Home opened in theaters on this day in 2021, breaking pandemic-era records with a $600M+ opening weekend worldwide.' },
  '12-21': { type: 'birthday', icon: '🎂', text: 'Samuel L. Jackson (Nick Fury) was born on this day in 1948. He appears in more MCU films than any other actor — 11 films and counting.' },
  '12-22': { type: 'bts',      icon: '🎬', text: 'The iconic "snap" in Avengers: Infinity War was in the script for 18 months before filming. The Russo brothers kept it secret from the cast until shooting — many actors didn\'t know who survived.' },
  '12-28': { type: 'birthday', icon: '🎂', text: 'Stan Lee, co-creator of Spider-Man, Thor, Iron Man, X-Men, Hulk, Black Widow, and dozens of MCU characters, was born on this day in 1922.' },
}

// ── Fallback general facts pool (for dates without specific entries) ──────────
export const MCU_GENERAL_FACTS = [
  { icon: '🎬', text: 'The MCU has grossed over $30 billion at the worldwide box office, making it the highest-grossing film franchise in history.' },
  { icon: '🤖', text: 'Iron Man\'s iconic red and gold suit went through 85 different designs before the final look was approved for Iron Man (2008).' },
  { icon: '🔨', text: 'The inscription on Mjolnir reads: "Whosoever holds this hammer, if he be worthy, shall possess the power of Thor." Chris Hemsworth can recite it from memory.' },
  { icon: '🕷️', text: 'Spider-Man\'s web-shooter sound effect in the MCU films was created by recording a mix of a toilet plunger and a whip crack.' },
  { icon: '🌌', text: 'Thanos was originally supposed to have a much smaller role — it was the positive fan reaction to his brief cameo in The Avengers that led to expanding him into the main villain.' },
  { icon: '🛡️', text: 'Captain America\'s shield is made of vibranium — the most durable fictional metal in Marvel. Real materials scientists say it would need to absorb and redirect kinetic energy, which no known material can do.' },
  { icon: '🧪', text: 'Bruce Banner\'s gamma radiation accident was inspired by a real-life nuclear accident story Stan Lee read about. The original Hulk was grey, not green — a printing error in the first issue led to the iconic green color.' },
  { icon: '🦸', text: 'Kevin Feige, the architect of the MCU, owns more Marvel baseball caps than any other person on Earth — he wears a different one to every public appearance.' },
  { icon: '⚡', text: 'Thor\'s lightning effects in the MCU were created using a combination of practical electrical rigs on set and VFX — Chris Hemsworth actually reacted to real (safer) electrical effects in some scenes.' },
  { icon: '🌿', text: 'Wakanda\'s vibranium is inspired by real-world African mineral resources. Director Ryan Coogler researched African architecture, culture, and history extensively for Black Panther.' },
  { icon: '🎭', text: 'Actors playing Avengers must legally maintain their physical appearance between contracts. Gaining or losing significant weight requires Marvel\'s approval.' },
  { icon: '🔬', text: 'The Ant-Man suit\'s Pym Particles are theoretical — real quantum physics does involve bizarre scaling effects, but nothing close to what\'s shown in the films (sadly).' },
  { icon: '🎵', text: 'Guardians of the Galaxy\'s "Awesome Mix" soundtrack was selected by James Gunn before any filming began — the music drove the entire emotional arc of the film.' },
  { icon: '🏰', text: 'Disney+ was launched specifically with MCU shows in mind. WandaVision\'s idea predated Disney+ by several years, waiting for the right platform.' },
  { icon: '👁️', text: 'The Mind Stone in Vision\'s forehead was designed to match the shape of a human iris — a deliberate choice to make Vision seem more human and emotionally accessible.' },
  { icon: '🐦', text: 'Falcon\'s wings in the MCU were inspired by the jetpacks used by real-world military special forces programs. The design team consulted with DARPA engineers.' },
  { icon: '🕶️', text: 'Nick Fury\'s eyepatch swaps sides in Avengers: Age of Ultron — a famous continuity error that made it into the final cut of the $280M film.' },
  { icon: '💜', text: 'The Soul Stone\'s location on Vormir was kept secret from most of the cast during Infinity War filming. Josh Brolin didn\'t know where the stone was when shooting the sacrifice scene.' },
  { icon: '🌀', text: 'Doctor Strange\'s magic portal effects were created by filming sparks from real angle grinders and then digitally compositing the footage over VFX backgrounds.' },
  { icon: '🤺', text: 'Black Widow\'s fighting style — "Red Room" combat — is based on a real Soviet-era program. Scarlett Johansson trained for 6+ hours daily for 6 months before filming.' },
  { icon: '🎯', text: 'Hawkeye never misses in the comics. In the MCU films, every single one of his arrows hits — a quiet continuity maintained across all 11 years of the character\'s appearances.' },
  { icon: '🌊', text: 'The Battle of New York in The Avengers was filmed entirely on studio sets in Cleveland, Ohio. The iconic streets are recreated 1:1 replicas of Manhattan blocks.' },
  { icon: '🦾', text: 'Tony Stark\'s Nanotech armor in Infinity War and Endgame was physically impossible to build on set — every single appearance of the Mark 50 is CGI, including close-up hand shots.' },
  { icon: '🌙', text: 'Moon Knight\'s costume design was kept deliberately ambiguous about whether Marc is actually a superhero or a man with DID experiencing delusions — intentional by director Mohamed Diab.' },
  { icon: '🐉', text: 'The Ten Rings in Shang-Chi were deliberately made to look ancient and worn — production design spent months creating a patina that conveyed 1,000+ years of use.' },
  { icon: '🌍', text: 'The MCU has been filmed on six continents. Antarctica is the only continent without an MCU filming location (though Asgard counts if you include space as a location).' },
  { icon: '⚙️', text: 'The Quinjet design in the MCU was inspired by SR-71 Blackbird reconnaissance aircraft. Tony Stark would have built it to be faster than any real aircraft.' },
  { icon: '🎪', text: 'Stan Lee filmed all his cameos for multiple films in a single day. His cameo in Avengers: Infinity War was one of the last he ever filmed.' },
  { icon: '🌠', text: 'The Cosmic Awareness in the MCU — the ability to sense events across the universe — is based on the comics concept of the "Living Tribunal," a character yet to be fully explored in film.' },
  { icon: '🏋️', text: 'Training to become an Avenger in real life: Chris Hemsworth maintains a workout routine of 2+ hours daily and consumes over 4,000 calories per day while filming Thor.' },
  { icon: '📱', text: 'Tony Stark\'s StarkPhone in Iron Man 2 predicted the modern smartphone era — the fictional phone interface has since been used as a design reference for real tech products.' },
]

/**
 * Get a "Today in MCU" entry for a given date string (YYYY-MM-DD).
 * Returns a specific calendar entry if one exists, or a deterministic
 * general fact based on the day of the year.
 */
export function getTodayInMCU(dateStr) {
  const [, mm, dd] = dateStr.split('-')
  const key = `${mm}-${dd}`
  if (MCU_CALENDAR[key]) return { ...MCU_CALENDAR[key], isSpecific: true, dateKey: key }

  // Deterministic fallback: hash the full date to pick from general pool
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0
  }
  const fact = MCU_GENERAL_FACTS[hash % MCU_GENERAL_FACTS.length]
  return { ...fact, isSpecific: false, dateKey: key }
}
