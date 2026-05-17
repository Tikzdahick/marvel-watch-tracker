import { getDailyMissions, getMissionProgress } from './data/missions.js'

/**
 * DailyMissionsWidget
 * Props:
 *   dateStr: string YYYY-MM-DD
 *   activity: { watchedToday, ratedToday, notedToday, triviaAnswered, loggedIn, posted, commented, currentStreak }
 *   onNavigate: (tabId) => void
 */
export default function DailyMissionsWidget({ dateStr, activity = {}, onNavigate }) {
  const missions = getDailyMissions(dateStr)
  const withProgress = getMissionProgress(missions, activity)
  const completedCount = withProgress.filter(m => m.completed).length
  const allDone = completedCount === 3

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid #141414' }}
      >
        <div>
          <div className="font-bebas text-lg tracking-widest text-white leading-none">DAILY MISSIONS</div>
          <div className="text-[10px] text-[#444] mt-0.5">Resets at midnight</div>
        </div>
        <div className="flex items-center gap-1.5">
          {allDone ? (
            <div
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: '#4ade8022', border: '1px solid #4ade8044', color: '#4ade80' }}
            >
              ✓ +50 XP
            </div>
          ) : (
            <div
              className="text-xs rounded-full px-3 py-1"
              style={{ background: '#1a1a1a', color: '#555' }}
            >
              {completedCount}/3
            </div>
          )}
        </div>
      </div>

      {/* Missions */}
      <div className="p-3 space-y-2">
        {withProgress.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
            style={{
              background: m.completed ? '#0a1a0a' : '#0a0a0a',
              border: `1px solid ${m.completed ? '#4ade8030' : '#1a1a1a'}`,
            }}
          >
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
              style={{
                background: m.completed ? '#4ade8022' : '#1a1a1a',
              }}
            >
              {m.completed ? '✓' : m.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div
                className="text-xs font-medium truncate"
                style={{ color: m.completed ? '#4ade80' : '#ccc' }}
              >
                {m.label}
              </div>
              {m.target > 1 && (
                <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (m.current / m.target) * 100)}%`,
                      background: m.completed ? '#4ade80' : '#E81C2E',
                    }}
                  />
                </div>
              )}
            </div>

            {/* XP */}
            <div className="text-right flex-shrink-0">
              <div
                className="text-[10px] font-bold"
                style={{ color: m.completed ? '#4ade80' : '#F5C518' }}
              >
                +{m.xp} XP
              </div>
              {m.target > 1 && (
                <div className="text-[9px] text-[#444]">{m.current}/{m.target}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bonus */}
      <div
        className="mx-3 mb-3 rounded-xl px-3 py-2 flex items-center justify-between"
        style={{ background: '#0a0a0a', border: '1px solid #141414' }}
      >
        <span className="text-[10px] text-[#555]">Complete all 3 → Bonus</span>
        <span className="text-[10px] font-bold" style={{ color: '#F5C518' }}>+50 XP</span>
      </div>
    </div>
  )
}
