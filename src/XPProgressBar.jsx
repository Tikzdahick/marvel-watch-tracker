import { getLevel, getNextLevel, getLevelProgress, getXPToNext } from './data/xpSystem.js'

/**
 * XPProgressBar — shows current level + XP bar
 * Props:
 *   xp: number
 *   compact: boolean (smaller version for nav/cards)
 */
export default function XPProgressBar({ xp = 0, compact = false }) {
  const level = getLevel(xp)
  const next = getNextLevel(xp)
  const progress = getLevelProgress(xp)
  const toNext = getXPToNext(xp)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-base">{level.icon}</span>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-bebas text-[11px] tracking-widest" style={{ color: level.color }}>{level.label}</span>
            {next && <span className="text-[9px] text-[#444]">{toNext} XP to {next.label}</span>}
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: level.gradient ?? level.color,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: (level.gradient ? level.gradient : level.color + '22'), border: `1px solid ${level.color}44` }}
        >
          {level.icon}
        </div>
        <div className="flex-1">
          <div className="font-bebas text-xl tracking-widest" style={{ color: level.color }}>{level.label}</div>
          <div className="text-[10px] text-[#555]">{xp.toLocaleString()} total XP</div>
        </div>
        <div className="text-right">
          <div className="font-bebas text-2xl text-white">{progress}%</div>
          <div className="text-[9px] text-[#444]">to next level</div>
        </div>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${progress}%`,
            background: level.gradient ?? level.color,
            boxShadow: `0 0 8px ${level.color}66`,
          }}
        />
      </div>
      {next && (
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-[#333]">{level.label}</span>
          <span className="text-[9px] text-[#555]">{toNext} XP to {next.label}</span>
          <span className="text-[9px] text-[#333]">{next.label}</span>
        </div>
      )}
    </div>
  )
}
