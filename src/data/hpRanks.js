const HP_RANKS = [
  { minWatched: 0,  label: 'Muggle',                     icon: '👤', color: '#7f8c8d', desc: 'No magical ability detected. Yet.' },
  { minWatched: 1,  label: 'Squib',                      icon: '🕯️', color: '#95a5a6', desc: 'A trace of magic... barely.' },
  { minWatched: 3,  label: 'First Year',                  icon: '🎓', color: '#c9a227', desc: 'Welcome to Hogwarts, student.' },
  { minWatched: 5,  label: 'Prefect',                     icon: '📛', color: '#3498db', desc: 'Trusted with responsibility.' },
  { minWatched: 7,  label: 'Head Boy / Head Girl',        icon: '⭐', color: '#9b59b6', desc: 'The finest student Hogwarts has seen.' },
  { minWatched: 9,  label: 'Auror',                       icon: '🔮', color: '#e74c3c', desc: 'Dark wizard catcher, elite class.' },
  { minWatched: 11, label: 'Order of the Phoenix Member', icon: '🔥', color: '#e67e22', desc: 'Fighting darkness from the shadows.' },
  { minWatched: 12, label: 'Dumbledore Level',            icon: '✨', color: '#f1c40f', desc: 'The greatest wizard who ever lived.' },
]

export function getHPRank(watched) {
  let rank = HP_RANKS[0]
  for (const r of HP_RANKS) { if (watched >= r.minWatched) rank = r }
  return rank
}

export function getNextHPRank(watched) {
  return HP_RANKS.find(r => r.minWatched > watched) ?? null
}
