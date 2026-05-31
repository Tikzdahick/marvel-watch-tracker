// ── Hogwarts Houses ───────────────────────────────────────────────────────────
export const HP_HOUSES = [
  { key: 'gryffindor', label: 'Gryffindor', emoji: '🦁', color: '#c9a227', bg: 'rgba(201,162,39,0.12)',  traits: 'Brave, daring, chivalrous',           animal: 'Lion',    element: 'Fire' },
  { key: 'slytherin',  label: 'Slytherin',  emoji: '🐍', color: '#27ae60', bg: 'rgba(39,174,96,0.12)',   traits: 'Ambitious, cunning, resourceful',       animal: 'Serpent', element: 'Water' },
  { key: 'hufflepuff', label: 'Hufflepuff', emoji: '🦡', color: '#f39c12', bg: 'rgba(243,156,18,0.12)',  traits: 'Kind, loyal, hardworking, patient',     animal: 'Badger',  element: 'Earth' },
  { key: 'ravenclaw',  label: 'Ravenclaw',  emoji: '🦅', color: '#3498db', bg: 'rgba(52,152,219,0.12)',  traits: 'Wise, witty, creative, learning-driven', animal: 'Eagle',   element: 'Air' },
]

// ── Sorting Hat Quiz ──────────────────────────────────────────────────────────
export const SORTING_QUIZ = [
  {
    q: 'A friend is being bullied in front of you. What do you do?',
    options: [
      { text: 'Step in immediately, regardless of the risk',       scores: { gryffindor: 3, hufflepuff: 1 } },
      { text: 'Find a smart way to de-escalate without conflict',  scores: { ravenclaw: 3, slytherin: 1 } },
      { text: 'Stand by your friend and comfort them',             scores: { hufflepuff: 3, gryffindor: 1 } },
      { text: 'Report it to someone in authority',                 scores: { slytherin: 2, ravenclaw: 2 } },
    ],
  },
  {
    q: 'Which subject would you most enjoy at Hogwarts?',
    options: [
      { text: 'Defence Against the Dark Arts — learning to fight dark magic', scores: { gryffindor: 3 } },
      { text: 'Potions — precision, chemistry, and subtle power',              scores: { slytherin: 3, ravenclaw: 1 } },
      { text: 'Herbology — caring for magical plants and creatures',           scores: { hufflepuff: 3 } },
      { text: 'Ancient Runes — decoding forgotten knowledge',                  scores: { ravenclaw: 3 } },
    ],
  },
  {
    q: 'What do you value most in a friend?',
    options: [
      { text: 'Unwavering loyalty, no matter what',   scores: { gryffindor: 2, hufflepuff: 2 } },
      { text: 'Intelligence and wit',                  scores: { ravenclaw: 3 } },
      { text: 'Ambition and drive to succeed',         scores: { slytherin: 3 } },
      { text: 'Kindness and warmth',                   scores: { hufflepuff: 3 } },
    ],
  },
  {
    q: 'You find a wallet with a lot of money inside. What do you do?',
    options: [
      { text: 'Hand it in — it\'s the right thing to do',       scores: { hufflepuff: 3, gryffindor: 1 } },
      { text: 'Keep it — finder\'s keepers, logically speaking', scores: { slytherin: 3 } },
      { text: 'Try to return it to the owner yourself',          scores: { gryffindor: 3 } },
      { text: 'Research the best course of action first',        scores: { ravenclaw: 3 } },
    ],
  },
  {
    q: 'What is your greatest fear?',
    options: [
      { text: 'Being forgotten — leaving no legacy',      scores: { slytherin: 3, ravenclaw: 1 } },
      { text: 'Losing the people I love',                 scores: { hufflepuff: 3, gryffindor: 1 } },
      { text: 'Failing when it truly matters',            scores: { gryffindor: 3 } },
      { text: 'Being seen as stupid or unintelligent',    scores: { ravenclaw: 3 } },
    ],
  },
]

export function getSortingResult(answers) {
  const scores = { gryffindor: 0, slytherin: 0, hufflepuff: 0, ravenclaw: 0 }
  answers.forEach((answerIdx, qIdx) => {
    const option = SORTING_QUIZ[qIdx]?.options?.[answerIdx]
    if (option?.scores) {
      Object.entries(option.scores).forEach(([h, s]) => { scores[h] = (scores[h] ?? 0) + s })
    }
  })
  const topHouse = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  return HP_HOUSES.find(h => h.key === topHouse) ?? HP_HOUSES[0]
}

// ── Horcruxes ─────────────────────────────────────────────────────────────────
export const HP_HORCRUXES = [
  { id: 'diary',   name: "Tom Riddle's Diary",        emoji: '📔', film: 2002, titleId: 2002, destroyer: 'Harry Potter', how: 'Stabbed with a Basilisk fang' },
  { id: 'ring',    name: "Marvolo Gaunt's Ring",       emoji: '💍', film: 2006, titleId: 2006, destroyer: 'Dumbledore',   how: 'Destroyed with the Sword of Gryffindor' },
  { id: 'locket',  name: "Slytherin's Locket",         emoji: '🔮', film: 2010, titleId: 2007, destroyer: 'Ron Weasley',  how: 'Stabbed with the Sword of Gryffindor' },
  { id: 'cup',     name: "Hufflepuff's Cup",            emoji: '🏆', film: 2011, titleId: 2008, destroyer: 'Hermione',    how: 'Stabbed with a Basilisk fang' },
  { id: 'diadem',  name: "Ravenclaw's Diadem",          emoji: '👑', film: 2011, titleId: 2008, destroyer: 'Fiendfyre',   how: 'Destroyed in the Room of Requirement fire' },
  { id: 'nagini',  name: 'Nagini',                      emoji: '🐍', film: 2011, titleId: 2008, destroyer: 'Neville',     how: 'Beheaded with the Sword of Gryffindor' },
  { id: 'harry',   name: 'Harry Potter (unintentional)', emoji: '⚡', film: 2011, titleId: 2008, destroyer: 'Voldemort',  how: 'Killing Curse in the Forbidden Forest' },
]

// ── Spells by movie ───────────────────────────────────────────────────────────
export const HP_SPELLS = {
  2001: ['Wingardium Leviosa', 'Alohomora', 'Lumos', 'Nox', 'Reparo', 'Incendio'],
  2002: ['Expelliarmus', 'Avada Kedavra', 'Obliviate', 'Serpensortia', 'Rennervate', 'Lumos Maxima'],
  2003: ['Expecto Patronum', 'Riddikulus', 'Finite Incantatem', 'Muffliato', 'Nox'],
  2004: ['Accio', 'Impedimenta', 'Stupefy', 'Reducto', 'Diffindo', 'Crucio'],
  2005: ['Levicorpus', 'Liberacorpus', 'Protego', 'Sectumsempra (first use)', 'Umbrakinesis'],
  2006: ['Sectumsempra', 'Petrificus Totalus', 'Felix Felicis', 'Aguamenti', 'Confringo'],
  2007: ['Obliviate', 'Bombarda', 'Episkey', 'Duro', 'Protego Totalum', 'Salvio Hexia'],
  2008: ['Fiendfyre', 'Aberto', 'Prior Incantato', 'Avada Kedavra', 'Expelliarmus (final duel)'],
}

// ── Character groups ──────────────────────────────────────────────────────────
export const HP_GROUPS = [
  { key: 'gryffindor',   label: 'Gryffindor',            emoji: '🦁', color: '#c9a227', charIds: ['harry','hermione','ron','ginny','neville','sirius','lupin','james','lily','molly','arthur','fred','george','moody','mcgonagall','pettigrew','dumbledore'] },
  { key: 'slytherin',    label: 'Slytherin',              emoji: '🐍', color: '#27ae60', charIds: ['voldemort','draco','snape','bellatrix','lucius','narcissa','grindelwald'] },
  { key: 'hufflepuff',   label: 'Hufflepuff',             emoji: '🦡', color: '#f39c12', charIds: ['cedric','newt','theseus'] },
  { key: 'ravenclaw',    label: 'Ravenclaw',              emoji: '🦅', color: '#3498db', charIds: ['luna','cho'] },
  { key: 'order',        label: 'Order of the Phoenix',  emoji: '🔥', color: '#e74c3c', charIds: ['harry','hermione','ron','dumbledore','sirius','lupin','molly','arthur','ginny','mcgonagall','moody'] },
  { key: 'death-eaters', label: 'Death Eaters',           emoji: '☠️', color: '#2c3e50', charIds: ['voldemort','draco','bellatrix','lucius','pettigrew'] },
  { key: 'da',           label: "Dumbledore's Army",      emoji: '⚡', color: '#9b59b6', charIds: ['harry','hermione','ron','neville','luna','ginny','cho'] },
  { key: 'ministry',     label: 'Ministry of Magic',      emoji: '🏛️', color: '#c9a227', charIds: ['arthur','umbridge','moody'] },
  { key: 'aurors',       label: 'Aurors',                 emoji: '🔮', color: '#8e44ad', charIds: ['moody','tina','theseus'] },
  { key: 'magizoology',  label: 'Magizoologists',         emoji: '🦄', color: '#27ae60', charIds: ['newt','flamel'] },
]
