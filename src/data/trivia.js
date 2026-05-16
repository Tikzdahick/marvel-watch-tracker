// trivia.js — Marvel trivia questions

/**
 * @typedef {{ id: number, question: string, options: string[], correctIndex: 0|1|2|3, titleId: number|null }} TriviaQuestion
 */

/** @type {TriviaQuestion[]} */
export const TRIVIA_QUESTIONS = [
  // Iron Man / Tony Stark
  {
    id: 1,
    question: "What element does Tony Stark initially use to power his arc reactor?",
    options: ["Vibranium", "Palladium", "Cesium", "Plutonium"],
    correctIndex: 1,
    titleId: 21,
  },
  {
    id: 2,
    question: "What is Tony Stark's famous last line in 'Iron Man' (2008)?",
    options: [
      "Avengers, assemble.",
      "I am Iron Man.",
      "Genius, billionaire, playboy, philanthropist.",
      "We have a Hulk.",
    ],
    correctIndex: 1,
    titleId: 21,
  },
  {
    id: 3,
    question: "In 'Iron Man 3,' what is the name of the extremis virus program?",
    options: ["Project Insight", "Extremis", "Centipede", "Heliogen"],
    correctIndex: 1,
    titleId: 26,
  },
  {
    id: 4,
    question: "What number suit does Tony wear in the final battle of 'Iron Man 3'?",
    options: ["Mark XLII", "Mark XLIII", "Mark L", "Mark XLVII"],
    correctIndex: 0,
    titleId: 26,
  },

  // Captain America
  {
    id: 5,
    question: "What is the name of the Nazi science division in 'Captain America: The First Avenger'?",
    options: ["HYDRA", "SHIELD", "Leviathan", "AIM"],
    correctIndex: 0,
    titleId: 17,
  },
  {
    id: 6,
    question: "Which Infinity Stone is hidden in the Tesseract?",
    options: ["Mind Stone", "Reality Stone", "Time Stone", "Space Stone"],
    correctIndex: 3,
    titleId: 17,
  },
  {
    id: 7,
    question: "In 'The Winter Soldier,' what is Project Insight?",
    options: [
      "A HYDRA plan to mind-control world leaders",
      "Three Helicarriers designed to eliminate threats pre-emptively",
      "A surveillance network built into Stark phones",
      "A HYDRA super-soldier program",
    ],
    correctIndex: 1,
    titleId: 28,
  },
  {
    id: 8,
    question: "Who says 'On your left' to Sam Wilson in 'The Winter Soldier'?",
    options: ["Bucky Barnes", "Nick Fury", "Steve Rogers", "Tony Stark"],
    correctIndex: 2,
    titleId: 28,
  },

  // Thor
  {
    id: 9,
    question: "What is the name of Thor's enchanted hammer?",
    options: ["Gungnir", "Stormbreaker", "Mjolnir", "Hofund"],
    correctIndex: 2,
    titleId: 24,
  },
  {
    id: 10,
    question: "In 'Thor: Ragnarok,' what is the name of the planet run by the Grandmaster?",
    options: ["Svartalfheim", "Sakaar", "Nidavellir", "Xandar"],
    correctIndex: 1,
    titleId: 45,
  },
  {
    id: 11,
    question: "What weapon does Thor forge to fight Thanos in 'Infinity War'?",
    options: ["Gungnir", "Mjolnir", "Stormbreaker", "Jarnbjorn"],
    correctIndex: 2,
    titleId: 47,
  },
  {
    id: 12,
    question: "In 'Thor: Love and Thunder,' who wields Mjolnir?",
    options: ["Valkyrie", "Odin", "Jane Foster", "Sif"],
    correctIndex: 2,
    titleId: 62,
  },

  // The Avengers
  {
    id: 13,
    question: "What year is 'The Avengers' (2012) set in within the MCU timeline?",
    options: ["2010", "2011", "2012", "2013"],
    correctIndex: 2,
    titleId: 25,
  },
  {
    id: 14,
    question: "Which Infinity Stone is in Loki's scepter in 'The Avengers'?",
    options: ["Power Stone", "Mind Stone", "Soul Stone", "Reality Stone"],
    correctIndex: 1,
    titleId: 25,
  },
  {
    id: 15,
    question: "What food does Tony Stark suggest the team eat after the Battle of New York?",
    options: ["Pizza", "Gyros", "Shawarma", "Hot dogs"],
    correctIndex: 2,
    titleId: 25,
  },

  // Guardians of the Galaxy
  {
    id: 16,
    question: "What is Star-Lord's real name?",
    options: ["James Quill", "Peter Quill", "Jason Quill", "Patrick Quill"],
    correctIndex: 1,
    titleId: 30,
  },
  {
    id: 17,
    question: "Which Infinity Stone does Ronan use as a weapon in 'Guardians of the Galaxy'?",
    options: ["Mind Stone", "Reality Stone", "Power Stone", "Time Stone"],
    correctIndex: 2,
    titleId: 30,
  },
  {
    id: 18,
    question: "What song does Baby Groot dance to at the start of 'Guardians Vol. 2'?",
    options: ["Mr. Blue Sky", "Come and Get Your Love", "Brandy", "The Chain"],
    correctIndex: 0,
    titleId: 31,
  },
  {
    id: 19,
    question: "Who is Peter Quill's biological father in 'Guardians Vol. 2'?",
    options: ["Yondu", "Thanos", "Ego", "J'son"],
    correctIndex: 2,
    titleId: 31,
  },

  // Infinity War / Endgame
  {
    id: 20,
    question: "In 'Avengers: Endgame,' what year do the Avengers travel to during the 'Battle of New York' portion of the Time Heist?",
    options: ["2010", "2011", "2012", "2013"],
    correctIndex: 2,
    titleId: 48,
  },
  {
    id: 21,
    question: "How many years pass between the Snap and the start of the 'Endgame' main story?",
    options: ["2 years", "3 years", "5 years", "10 years"],
    correctIndex: 2,
    titleId: 48,
  },
  {
    id: 22,
    question: "Who is the first Avenger to attempt wielding the completed Infinity Gauntlet in 'Endgame'?",
    options: ["Thor", "Steve Rogers", "Bruce Banner/Hulk", "Tony Stark"],
    correctIndex: 2,
    titleId: 48,
  },
  {
    id: 23,
    question: "Where is the Soul Stone hidden in 'Avengers: Infinity War'?",
    options: ["Vormir", "Nidavellir", "Knowhere", "Titan"],
    correctIndex: 0,
    titleId: 47,
  },
  {
    id: 24,
    question: "What does Thanos sacrifice to obtain the Soul Stone in 'Infinity War'?",
    options: ["Nebula", "Gamora", "Proxima Midnight", "Corvus Glaive"],
    correctIndex: 1,
    titleId: 47,
  },
  {
    id: 25,
    question: "What is the name of the planet where much of 'Avengers: Infinity War' climaxes?",
    options: ["Xandar", "Sakaar", "Titan", "Knowhere"],
    correctIndex: 2,
    titleId: 47,
  },

  // Black Panther
  {
    id: 26,
    question: "What fictional metal is found only in Wakanda?",
    options: ["Adamantium", "Vibranium", "Unobtanium", "Carbonadium"],
    correctIndex: 1,
    titleId: 42,
  },
  {
    id: 27,
    question: "What is the name of T'Challa's all-female royal guard?",
    options: ["Hatut Zeraze", "Dora Milaje", "Jabari", "Border Tribe"],
    correctIndex: 1,
    titleId: 42,
  },

  // Spider-Man
  {
    id: 28,
    question: "In 'Spider-Man: No Way Home,' which villain is NOT from a previous Spider-Man film series?",
    options: ["Green Goblin", "Doctor Octopus", "Electro", "The Scorpion"],
    correctIndex: 3,
    titleId: 57,
  },
  {
    id: 29,
    question: "What high school does Peter Parker attend in 'Spider-Man: Homecoming'?",
    options: ["Midtown High", "Forest Hills High", "Midtown School of Science and Technology", "Xavier's School"],
    correctIndex: 2,
    titleId: 43,
  },
  {
    id: 30,
    question: "In 'Spider-Man: Far From Home,' where is the class trip set?",
    options: ["Asia", "South America", "Europe", "Africa"],
    correctIndex: 2,
    titleId: 56,
  },

  // Doctor Strange
  {
    id: 31,
    question: "What is the name of the powerful relic that drapes itself around Doctor Strange's shoulders?",
    options: ["Cloak of Invisibility", "Cloak of Levitation", "Sorcerer's Shroud", "Cape of Agamotto"],
    correctIndex: 1,
    titleId: 44,
  },
  {
    id: 32,
    question: "In 'Doctor Strange in the Multiverse of Madness,' which hero is America Chavez searching for?",
    options: ["Doctor Strange", "Wanda Maximoff", "The Illuminati", "The Sorcerer Supreme"],
    correctIndex: 0,
    titleId: 58,
  },

  // Ant-Man
  {
    id: 33,
    question: "What is the name of the subatomic realm Scott Lang explores?",
    options: ["The Microverse", "The Quantum Realm", "The Negative Zone", "The Mirror Dimension"],
    correctIndex: 1,
    titleId: 33,
  },
  {
    id: 34,
    question: "In 'Ant-Man and the Wasp: Quantumania,' who is the primary villain?",
    options: ["Ghost", "MODOK", "Kang the Conqueror", "Yellowjacket"],
    correctIndex: 2,
    titleId: 66,
  },

  // Civil War
  {
    id: 35,
    question: "In 'Captain America: Civil War,' what is the Sokovia Accords?",
    options: [
      "A peace treaty between Wakanda and the UN",
      "A document requiring the Avengers to operate under government oversight",
      "A HYDRA manifesto discovered in a SHIELD vault",
      "A Stark-funded technology sharing agreement",
    ],
    correctIndex: 1,
    titleId: 40,
  },
  {
    id: 36,
    question: "Who kills Tony Stark's parents in the revealed footage in 'Civil War'?",
    options: ["Alexander Pierce", "Helmut Zemo", "Bucky Barnes/Winter Soldier", "HYDRA operatives"],
    correctIndex: 2,
    titleId: 40,
  },

  // WandaVision
  {
    id: 37,
    question: "What town does Wanda mentally control in 'WandaVision'?",
    options: ["Salem", "Westview", "Eastview", "Sokovia"],
    correctIndex: 1,
    titleId: 50,
  },
  {
    id: 38,
    question: "Which Scarlet Witch spell is called the Darkhold's most powerful?",
    options: ["Chaos Magic", "Dreamwalking", "The Scarlet Witch Rune", "The Nexus Spell"],
    correctIndex: 1,
    titleId: 58,
  },

  // Loki
  {
    id: 39,
    question: "What does TVA stand for in the 'Loki' series?",
    options: [
      "Temporal Variance Agency",
      "Time Variance Authority",
      "Temporal Vigilance Administration",
      "Timeline Verification Assembly",
    ],
    correctIndex: 1,
    titleId: 49,
  },
  {
    id: 40,
    question: "What is the variant of Loki that the TVA is hunting at the start of the 'Loki' series?",
    options: ["Sylvie", "President Loki", "Classic Loki", "Kid Loki"],
    correctIndex: 0,
    titleId: 49,
  },

  // Hawkeye
  {
    id: 41,
    question: "What is Clint Barton's alter ego when he operated as a vigilante after the Snap?",
    options: ["Mockingbird", "Swordsman", "Ronin", "Deadeye"],
    correctIndex: 2,
    titleId: 52,
  },
  {
    id: 42,
    question: "Who is the Kingpin in the MCU's 'Hawkeye' series?",
    options: ["Wilson Fisk", "Ivan Vanko", "Justin Hammer", "Aldrich Killian"],
    correctIndex: 0,
    titleId: 52,
  },

  // Black Widow
  {
    id: 43,
    question: "What is the name of the Red Room program that controls Black Widow operatives?",
    options: ["Winter Soldier Protocol", "Dreykov's Ledger", "Widow Bite", "Widow's Veil"],
    correctIndex: 1,
    titleId: 41,
  },
  {
    id: 44,
    question: "Who plays the Red Guardian in 'Black Widow'?",
    options: ["David Harbour", "Sebastian Stan", "Chris Evans", "Oscar Isaac"],
    correctIndex: 0,
    titleId: 41,
  },

  // Shang-Chi
  {
    id: 45,
    question: "What are the mystical rings in 'Shang-Chi' actually called?",
    options: ["The Ten Rings", "The Dragon Rings", "The Mandarin's Rings", "The Jade Rings"],
    correctIndex: 0,
    titleId: 54,
  },
  {
    id: 46,
    question: "What is the name of the hidden mystical village in 'Shang-Chi'?",
    options: ["K'un-Lun", "Ta Lo", "Kamar-Taj", "Attilan"],
    correctIndex: 1,
    titleId: 54,
  },

  // Ms. Marvel / Moon Knight
  {
    id: 47,
    question: "What power does Kamala Khan's bangle give her in 'Ms. Marvel'?",
    options: [
      "She can turn invisible",
      "She can create crystalline hard-light constructs",
      "She can stretch her limbs",
      "She can fly",
    ],
    correctIndex: 1,
    titleId: 60,
  },
  {
    id: 48,
    question: "Which Egyptian moon god does Marc Spector serve in 'Moon Knight'?",
    options: ["Ra", "Osiris", "Khonshu", "Anubis"],
    correctIndex: 2,
    titleId: 59,
  },

  // Deadpool
  {
    id: 49,
    question: "What is Deadpool's real name?",
    options: ["Wade Wilson", "Jack Hammer", "Francis Freeman", "Victor Creed"],
    correctIndex: 0,
    titleId: 14,
  },
  {
    id: 50,
    question: "What disease does Wade Wilson learn he has before undergoing the Weapon X experiment?",
    options: ["Leukemia", "Cancer (multiple organ)", "ALS", "Lupus"],
    correctIndex: 1,
    titleId: 14,
  },

  // Logan
  {
    id: 51,
    question: "In 'Logan,' what year is the film set?",
    options: ["2024", "2027", "2029", "2035"],
    correctIndex: 2,
    titleId: 16,
  },
  {
    id: 52,
    question: "What is the name of the new mutant children Logan must protect in 'Logan'?",
    options: ["X-Force", "New Mutants", "X-23 and the Eden kids", "Generation X"],
    correctIndex: 2,
    titleId: 16,
  },

  // Eternals / Captain Marvel
  {
    id: 53,
    question: "In 'Eternals,' what celestial event must the Eternals prevent?",
    options: ["The Bifrost collapse", "The Emergence", "The Celestial Awakening", "The Great Divergence"],
    correctIndex: 1,
    titleId: 55,
  },
  {
    id: 54,
    question: "What is Captain Marvel's original alien race called?",
    options: ["Skrull", "Kree", "Badoon", "Shi'ar"],
    correctIndex: 1,
    titleId: 20,
  },

  // GotG Vol. 3 / Deadpool & Wolverine
  {
    id: 55,
    question: "In 'Guardians of the Galaxy Vol. 3,' who is revealed to have created Rocket?",
    options: ["Thanos", "The Collector", "High Evolutionary", "MODOK"],
    correctIndex: 2,
    titleId: 67,
  },
  {
    id: 56,
    question: "In 'Deadpool & Wolverine,' what organization recruited Deadpool?",
    options: ["SHIELD", "TVA", "AIM", "HYDRA"],
    correctIndex: 1,
    titleId: 70,
  },

  // General MCU
  {
    id: 57,
    question: "What phrase activates the Winter Soldier's programming in 'Civil War'?",
    options: [
      "A series of random words including 'longing' and 'rusted'",
      "Red Room Protocol Seven",
      "Winter is coming",
      "Hail HYDRA",
    ],
    correctIndex: 0,
    titleId: 40,
  },
  {
    id: 58,
    question: "Which Avenger snapped the Infinity Gauntlet to reverse the Blip?",
    options: ["Thor", "Steve Rogers", "Bruce Banner/Hulk", "Nebula"],
    correctIndex: 2,
    titleId: 48,
  },
  {
    id: 59,
    question: "What is the name of Nick Fury's flying aircraft carrier base?",
    options: ["The Raft", "The Helicarrier", "Satellite Base Bravo", "The Zephyr"],
    correctIndex: 1,
    titleId: null,
  },
  {
    id: 60,
    question: "Which character says 'I can do this all day' as a recurring line?",
    options: ["Iron Man", "Captain America", "Thor", "Hawkeye"],
    correctIndex: 1,
    titleId: null,
  },
  {
    id: 61,
    question: "What is the name of the mind-controlling crown used by Loki in 'The Avengers'?",
    options: ["The Scepter", "The Mind Gem", "The Tesseract Rod", "The Chitauri Staff"],
    correctIndex: 0,
    titleId: 25,
  },
  {
    id: 62,
    question: "What satellite does Nick Fury page at the end of 'Avengers: Infinity War'?",
    options: [
      "A modified phone with no name",
      "A special pager showing Captain Marvel's symbol",
      "An intergalactic communicator",
      "A SHIELD emergency beacon",
    ],
    correctIndex: 1,
    titleId: 47,
  },
  {
    id: 63,
    question: "What does HYDRA's motto translate to in English?",
    options: [
      "Cut off one head, two more shall take its place",
      "Power through science",
      "The strong survive",
      "Order above all",
    ],
    correctIndex: 0,
    titleId: null,
  },
  {
    id: 64,
    question: "Which Infinity Stone is inside Vision's forehead?",
    options: ["Power Stone", "Space Stone", "Mind Stone", "Soul Stone"],
    correctIndex: 2,
    titleId: 32,
  },
  {
    id: 65,
    question: "In the MCU, who created Ultron?",
    options: ["Tony Stark and Bruce Banner", "HYDRA", "Tony Stark alone", "Nick Fury"],
    correctIndex: 0,
    titleId: 32,
  },
];

/**
 * Returns a deterministic daily trivia question based on a date string.
 * @param {string} dateStr — YYYY-MM-DD
 * @returns {TriviaQuestion}
 */
export function getDailyQuestion(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return TRIVIA_QUESTIONS[hash % TRIVIA_QUESTIONS.length];
}
