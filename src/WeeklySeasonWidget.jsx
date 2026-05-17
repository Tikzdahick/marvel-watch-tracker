import { getWeeklyChallenge, getNextMonday } from './data/weeklyChallenge.js'
import { getCurrentSeason, getSeasonProgress } from './data/seasonPass.js'

/**
 * WeeklySeasonWidget
 * Props:
 *   dateStr: string YYYY-MM-DD
 *   weeklyState: { [weekStart]: { progress: number, completed: boolean } }
 *   seasonState: { [monthKey]: { completedTasks: string[], watchCount, ... } }
 *   onNavigate: (tabId) => void
 */
export default function WeeklySeasonWidget({ dateStr, weeklyState = {}, seasonState = {}, onNavigate }) {
  const challenge = getWeeklyChallenge(dateStr)
  const season    = getCurrentSeason(dateStr)
  const seasonTasks = getSeasonProgress(season, seasonState)

  const weekProgress = weeklyState?.[challenge.weekStart]?.progress ?? 0
  const weekCompleted = weeklyState?.[challenge.weekStart]?.completed ?? false
  const weekPct = Math.min(100, Math.round((weekProgress / challenge.target) * 100))

  const seasonDone = seasonTasks.filter(t => t.done).length
  const seasonPct = Math.round((seasonDone / season.tasks.length) * 100)

  // Days until next Monday
  const nextMon = getNextMonday(dateStr)
  const daysLeft = Math.max(0, Math.round((new Date(nextMon + 'T00:00:00') - new Date(dateStr + 'T00:00:00')) / 86400000))

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Weekly Challenge */}
      <div
        className="rounded-2xl p-4"
        style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm">{challenge.icon}</span>
          <span className="font-bebas text-[11px] tracking-widest text-[#E81C2E]">WEEKLY</span>
        </div>
        <div
          className="text-[11px] font-medium leading-snug mb-3"
          style={{ color: weekCompleted ? '#4ade80' : '#ccc' }}
        >
          {challenge.label}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: '#1a1a1a' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${weekPct}%`,
              background: weekCompleted ? '#4ade80' : '#E81C2E',
            }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[9px] text-[#444]">{weekProgress}/{challenge.target}</span>
          <span className="text-[9px] font-bold" style={{ color: '#F5C518' }}>+{challenge.xp} XP</span>
        </div>
        <div className="text-[9px] text-[#333] mt-1">Resets in {daysLeft}d</div>
      </div>

      {/* Season Pass */}
      <div
        className="rounded-2xl p-4"
        style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm">{season.icon}</span>
          <span className="font-bebas text-[11px] tracking-widest" style={{ color: season.color }}>SEASON</span>
        </div>
        <div className="text-[11px] font-medium leading-snug mb-3 text-white truncate">
          {season.name}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: '#1a1a1a' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${seasonPct}%`,
              background: season.color,
            }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[9px] text-[#444]">{seasonDone}/{season.tasks.length} tasks</span>
          <span className="text-[9px] font-bold" style={{ color: '#F5C518' }}>+XP</span>
        </div>
        <div className="text-[9px] text-[#333] mt-1">{season.daysLeft}d left</div>
      </div>
    </div>
  )
}
