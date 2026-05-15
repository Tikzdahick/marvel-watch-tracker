import { useMemo } from 'react'
import {
  ACHIEVEMENTS, ACHIEVEMENT_MAP, CATEGORY_LABELS,
  calcStreak, calcLongestStreak,
} from './data/achievements.js'
import { TITLES } from './data/titles.js'

function AchievementCard({ def, state }) {
  const isUnlocked = state?.unlocked ?? false
  const isSecret = def.secret && !isUnlocked

  return (
    <div className={[
      'flex items-center gap-3 p-3 rounded-xl border transition-all',
      isUnlocked
        ? 'bg-[#110800] border-[#F5C518]/30 shadow-[0_0_12px_rgba(245,197,24,0.08)]'
        : 'bg-[#0d0d0d] border-[#181818]',
    ].join(' ')}>
      {/* Icon */}
      <div className={[
        'w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
        isUnlocked ? 'bg-[#F5C518]/15' : 'bg-[#151515]',
      ].join(' ')}>
        {isSecret ? '🔮' : isUnlocked ? def.icon : <span className="opacity-30">{def.icon}</span>}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold leading-tight ${
          isUnlocked ? 'text-[#F5C518]' : isSecret ? 'text-[#333]' : 'text-[#3a3a3a]'
        }`}>
          {isSecret ? '???' : def.name}
        </div>
        <div className={`text-[11px] leading-snug mt-0.5 ${
          isUnlocked ? 'text-[#888]' : 'text-[#2a2a2a]'
        }`}>
          {isSecret ? 'Unlock to reveal this secret...' : def.desc}
        </div>
        {isUnlocked && state.unlockedAt && (
          <div className="text-[10px] text-[#F5C518]/50 mt-1">
            Unlocked {new Date(state.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>

      {/* Badge */}
      <div className={[
        'w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center',
        isUnlocked ? 'bg-[#F5C518] shadow-[0_0_8px_rgba(245,197,24,0.4)]' : 'bg-[#151515] border border-[#222]',
      ].join(' ')}>
        {isUnlocked ? (
          <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-[#2a2a2a]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
        )}
      </div>
    </div>
  )
}

export default function Achievements({ achievements, watchHistory, loginDates, watched, onTabChange }) {
  const unlockedCount = useMemo(
    () => Object.values(achievements).filter(a => a.unlocked).length,
    [achievements]
  )
  const totalCount = ACHIEVEMENTS.length

  const watchStreak = useMemo(() => calcStreak(Object.keys(watchHistory)), [watchHistory])
  const watchLongest = useMemo(() => calcLongestStreak(Object.keys(watchHistory)), [watchHistory])
  const loginStreak = useMemo(() => calcStreak(loginDates), [loginDates])
  const loginLongest = useMemo(() => calcLongestStreak(loginDates), [loginDates])

  // Group achievements by category
  const grouped = useMemo(() => {
    const cats = {}
    for (const def of ACHIEVEMENTS) {
      if (!cats[def.category]) cats[def.category] = []
      cats[def.category].push(def)
    }
    return cats
  }, [])

  const pct = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/96 backdrop-blur-md border-b border-[#161616]">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex flex-col gap-1">
              <div className="w-1 h-3 bg-[#F5C518] rounded-full" />
              <div className="w-1 h-3 bg-[#E81C2E] rounded-full" />
            </div>
            <h1 className="font-bebas text-[28px] tracking-[0.12em] text-white leading-none">
              ACHIEVEMENTS
            </h1>
            <div className="ml-auto text-right">
              <div className="font-bebas text-2xl text-[#F5C518] leading-none">{unlockedCount}/{totalCount}</div>
              <div className="text-[10px] text-[#444] uppercase tracking-widest">Unlocked</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-[#181818] rounded-full mb-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #F5C518 0%, #ffdd44 100%)',
              }}
            />
          </div>

          {/* Streaks */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0f0f0f] rounded-xl p-2.5 border border-[#181818]">
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-1">Watch Streak</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bebas text-2xl text-[#E81C2E]">{watchStreak}</span>
                <span className="text-[11px] text-[#444]">day{watchStreak !== 1 ? 's' : ''} now</span>
              </div>
              <div className="text-[11px] text-[#333] mt-0.5">Best: <span className="text-[#555]">{watchLongest} days</span></div>
            </div>
            <div className="bg-[#0f0f0f] rounded-xl p-2.5 border border-[#181818]">
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-1">Login Streak</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bebas text-2xl text-[#F5C518]">{loginStreak}</span>
                <span className="text-[11px] text-[#444]">day{loginStreak !== 1 ? 's' : ''} now</span>
              </div>
              <div className="text-[11px] text-[#333] mt-0.5">Best: <span className="text-[#555]">{loginLongest} days</span></div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Achievement Categories ── */}
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {Object.entries(grouped).map(([cat, defs]) => {
          const catUnlocked = defs.filter(d => achievements[d.id]?.unlocked).length
          return (
            <section key={cat}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold text-[#555] uppercase tracking-widest">
                  {CATEGORY_LABELS[cat] ?? cat}
                </h2>
                <span className="text-[11px] text-[#444]">{catUnlocked}/{defs.length}</span>
              </div>
              <div className="space-y-2">
                {defs.map(def => (
                  <AchievementCard
                    key={def.id}
                    def={def}
                    state={achievements[def.id]}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
