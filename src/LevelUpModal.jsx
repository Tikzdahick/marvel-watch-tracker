import { useEffect } from 'react'

/**
 * LevelUpModal — animated level-up screen
 * Props:
 *   newLevel: { key, label, icon, color, gradient }
 *   xp: number
 *   onDone: () => void
 */
export default function LevelUpModal({ newLevel, xp, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 10002, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease both' }}
      onClick={onDone}
    >
      <div className="text-center px-8" style={{ animation: 'lvlSlideUp 0.4s ease both' }}>
        {/* Glow ring */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: newLevel.gradient ?? `${newLevel.color}33`,
              filter: 'blur(24px)',
              transform: 'scale(1.5)',
              animation: 'lvlPulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center text-5xl"
            style={{
              background: newLevel.gradient ?? newLevel.color + '22',
              border: `3px solid ${newLevel.color}`,
              boxShadow: `0 0 40px ${newLevel.color}66`,
            }}
          >
            {newLevel.icon}
          </div>
        </div>

        <div className="text-[#555] text-xs uppercase tracking-[0.3em] mb-2">Level Up!</div>
        <div className="font-bebas text-5xl tracking-widest mb-1" style={{ color: newLevel.color }}>
          {newLevel.label}
        </div>
        <div className="text-white text-sm mb-6 opacity-70">You've unlocked a new rank</div>

        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
          style={{ background: newLevel.color + '22', border: `1px solid ${newLevel.color}44` }}
        >
          <span className="text-sm">{newLevel.icon}</span>
          <span className="text-white text-sm font-semibold">{xp.toLocaleString()} XP</span>
        </div>

        <div>
          <button
            onClick={onDone}
            className="text-[#555] text-xs hover:text-white transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes lvlSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
        @keyframes lvlPulse {
          0%, 100% { opacity: 0.5; transform: scale(1.5) }
          50%       { opacity: 1; transform: scale(1.8) }
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
      `}</style>
    </div>
  )
}
