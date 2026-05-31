import { useMemo, useState } from 'react'
import { DC_TITLES } from './data/dcTitles.js'
import { HP_TITLES } from './data/hpTitles.js'
import { SW_TITLES } from './data/swTitles.js'
import { AvatarDisplay } from './AvatarDisplay.jsx'

function loadJ(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null } catch { return null } }

// Deterministic "random" from seed
function seededRand(seed) { return ((seed * 1664525 + 1013904223) >>> 0) / 4294967296 }

// Generate a realistic-looking leaderboard of fake users
function buildLeaderboard(realName, realTotal, tab) {
  const NAMES = [
    'CosmicHero99','DarkKnight_Fan','WizardOfOz','JediMasterX','MultiverseFan',
    'MarvelManiac','DCEULover','Potterhead42','SithSlayer','WatchedItAll',
    'CinematicLord','HogwartsAlum','ForceBalance','EndgameVet','GothamGuard',
    'AvengersAssemble','SnyderCut_Fan','TrilogyKing','PhilosopherKing','MidnightWatcher',
    'TitlesTracker','FilmArchivist','UniverseSeeker','MultiplexMaven','CineChampion',
    'StreamingLegend','GalacticFan','KryptonFan','MutantTracker','SeriesDevotee',
  ]
  const FRANCHISES = ['marvel','dc','hp','sw']
  const AVATARS = [null,null,null,null,null] // null = default avatar

  const entries = NAMES.map((name, i) => {
    const seed = i * 31337 + 7
    const mW = Math.floor(seededRand(seed * 1) * 107)
    const dW = Math.floor(seededRand(seed * 2) * 32)
    const hW = Math.floor(seededRand(seed * 3) * 12)
    const sW = Math.floor(seededRand(seed * 4) * 19)
    const total = mW + dW + hW + sW
    const favFranchise = FRANCHISES[Math.floor(seededRand(seed * 5) * 4)]
    const pct = Math.round((total / (107 + 32 + 12 + 19)) * 100)
    return { name, mW, dW, hW, sW, total, favFranchise, pct, isReal: false }
  })

  // Add the real user at their actual count
  entries.push({
    name: realName ?? 'You',
    mW: 0, dW: 0, hW: 0, sW: 0, // will be overridden by tab-specific sort
    total: realTotal,
    favFranchise: 'marvel',
    pct: Math.round((realTotal / 170) * 100),
    isReal: true,
  })

  // Filter by tab
  let filtered = entries
  if (tab === 'marvel') filtered = entries.map(e => ({ ...e, score: e.isReal ? realTotal : e.mW }))
  else if (tab === 'dc') filtered = entries.map(e => ({ ...e, score: e.isReal ? 0 : e.dW }))
  else if (tab === 'hp') filtered = entries.map(e => ({ ...e, score: e.isReal ? 0 : e.hW }))
  else if (tab === 'sw') filtered = entries.map(e => ({ ...e, score: e.isReal ? 0 : e.sW }))
  else filtered = entries.map(e => ({ ...e, score: e.isReal ? realTotal : e.total }))

  filtered.sort((a, b) => b.score - a.score)
  return filtered.map((e, i) => ({ ...e, rank: i + 1 }))
}

const FRANCHISE_META = {
  marvel: { label: 'Marvel',       color: '#E81C2E', icon: '🔴' },
  dc:     { label: 'DC',           color: '#FFD700', icon: '⚡' },
  hp:     { label: 'Harry Potter', color: '#c9a227', icon: '⚡' },
  sw:     { label: 'Star Wars',    color: '#ffe81f', icon: '⭐' },
}

const RANK_COLORS = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }

const TABS = [
  { id: 'overall', label: 'Overall' },
  { id: 'marvel',  label: 'Marvel'  },
  { id: 'dc',      label: 'DC'      },
  { id: 'hp',      label: 'HP'      },
  { id: 'sw',      label: 'SW'      },
]

export default function MultiverseLeaderboard({ profile, marvelWatched, marvelTitles }) {
  const [activeTab, setActiveTab] = useState('overall')

  const dcW = useMemo(() => (loadJ('dc-watched-v1') ?? []).length, [])
  const hpW = useMemo(() => (loadJ('hp-watched-v1') ?? []).length, [])
  const swW = useMemo(() => (loadJ('sw-watched-v1') ?? []).length, [])
  const mvW = marvelWatched?.size ?? 0

  const realTotal = mvW + dcW + hpW + swW
  const realName  = profile?.name ?? 'You'

  const entries = useMemo(
    () => buildLeaderboard(realName, realTotal, activeTab),
    [realName, realTotal, activeTab]
  )

  const realEntry = entries.find(e => e.isReal)

  return (
    <div className="min-h-screen pb-28" style={{ background: '#04060f' }}>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">

        {/* Header */}
        <div>
          <h1 className="font-bebas text-[28px] tracking-[0.12em] text-white leading-none">🥇 LEADERBOARD</h1>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Global rankings across all franchises
          </p>
        </div>

        {/* Your rank card */}
        {realEntry && (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#FFD700' }}>
              Your Rank
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center font-bebas text-2xl flex-shrink-0"
                style={{ color: RANK_COLORS[realEntry.rank] ?? 'rgba(255,255,255,0.5)' }}>
                #{realEntry.rank}
              </div>
              <AvatarDisplay avatar={profile?.avatar} name={realName} size="sm"/>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-[14px]">{realName}</div>
                <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {realEntry.score} titles · {realEntry.pct}% complete
                </div>
              </div>
              <div className="text-[9px] px-2 py-1 rounded-lg font-semibold"
                style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}>
                Top {Math.max(1, Math.round((realEntry.rank / entries.length) * 100))}%
              </div>
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-semibold transition-all"
              style={activeTab === t.id
                ? { background: '#fff', color: '#000' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Podium — top 3 */}
        <div className="grid grid-cols-3 gap-2">
          {[entries[1], entries[0], entries[2]].map((e, podiumIdx) => {
            if (!e) return <div key={podiumIdx}/>
            const heights = ['h-20', 'h-28', 'h-16']
            const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
            return (
              <div key={e.rank} className={`flex flex-col items-center justify-end gap-1.5 pb-3 rounded-2xl ${heights[podiumIdx]}`}
                style={{ background: `${RANK_COLORS[actualRank]}10`, border: `1px solid ${RANK_COLORS[actualRank]}30` }}>
                {e.isReal
                  ? <AvatarDisplay avatar={profile?.avatar} name={realName} size="sm"/>
                  : <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ background: 'rgba(255,255,255,0.08)' }}>
                      {e.name[0].toUpperCase()}
                    </div>
                }
                <div className="font-bebas text-xl leading-none" style={{ color: RANK_COLORS[actualRank] }}>
                  #{actualRank}
                </div>
                <div className="text-[8px] text-center px-1 truncate w-full font-medium"
                  style={{ color: e.isReal ? '#FFD700' : 'rgba(255,255,255,0.5)' }}>
                  {e.name.slice(0, 10)}
                </div>
                <div className="text-[7px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{e.score}</div>
              </div>
            )
          })}
        </div>

        {/* Full list */}
        <div className="space-y-1.5">
          {entries.slice(0, 20).map(e => {
            const rankColor = RANK_COLORS[e.rank]
            const fav = FRANCHISE_META[e.favFranchise]
            return (
              <div key={e.rank}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: e.isReal ? 'rgba(255,215,0,0.06)' : '#0a0d18',
                  border: `1px solid ${e.isReal ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.04)'}`,
                }}>
                <div className="w-7 font-bebas text-lg text-center flex-shrink-0"
                  style={{ color: rankColor ?? 'rgba(255,255,255,0.25)' }}>
                  {e.rank}
                </div>
                {e.isReal
                  ? <AvatarDisplay avatar={profile?.avatar} name={realName} size="xs"/>
                  : <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                      {e.name[0]}
                    </div>
                }
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold leading-none"
                    style={{ color: e.isReal ? '#FFD700' : 'rgba(255,255,255,0.7)' }}>
                    {e.name}{e.isReal ? ' (You)' : ''}
                  </div>
                  <div className="text-[8px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {e.pct}% complete · {fav?.icon} {fav?.label}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bebas text-[16px] leading-none" style={{ color: rankColor ?? 'rgba(255,255,255,0.5)' }}>
                    {e.score}
                  </div>
                  <div className="text-[7px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    titles
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-[8px] pb-2" style={{ color: 'rgba(255,255,255,0.1)' }}>
          Rankings update as you watch more titles. Keep going! 🌌
        </p>
      </div>
    </div>
  )
}
