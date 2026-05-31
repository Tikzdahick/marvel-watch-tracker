const SW_RANKS = [
  { minWatched: 0,  label: 'Civilian',            icon: '👤', color: '#7f8c8d', desc: 'No connection to the Force detected.' },
  { minWatched: 2,  label: 'Padawan',              icon: '🔵', color: '#4a9eff', desc: 'Your training has begun, young one.' },
  { minWatched: 5,  label: 'Jedi Knight',          icon: '⚔️', color: '#27ae60', desc: 'Knighted by the Council. The Force is strong with you.' },
  { minWatched: 8,  label: 'Jedi Master',          icon: '🟢', color: '#2ecc71', desc: 'Master of the Force and its many forms.' },
  { minWatched: 11, label: 'Jedi Council Member',  icon: '💜', color: '#9b59b6', desc: 'A seat on the Jedi High Council awaits.' },
  { minWatched: 14, label: 'Jedi Grand Master',    icon: '⭐', color: '#ffe81f', desc: 'The wisest of all Masters.' },
  { minWatched: 18, label: 'Force Ghost',          icon: '👻', color: '#60a5fa', desc: 'Beyond the physical — one with the Force.' },
  { minWatched: 19, label: 'One with the Force',   icon: '🌌', color: '#fff', desc: 'The Force and you are one. Always.' },
]

export function getSWRank(watched) {
  let rank = SW_RANKS[0]
  for (const r of SW_RANKS) { if (watched >= r.minWatched) rank = r }
  return rank
}

export function getNextSWRank(watched) {
  return SW_RANKS.find(r => r.minWatched > watched) ?? null
}
