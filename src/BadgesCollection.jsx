import { BADGES, BADGE_CATEGORIES, BADGE_MAP } from './data/badges.js'
import { useState } from 'react'

/**
 * BadgesCollection — full-screen overlay showing all badges
 * Props:
 *   earnedBadges: { [id]: { unlocked: boolean, unlockedAt: string } }
 *   onClose: () => void
 */
export default function BadgesCollection({ earnedBadges = {}, onClose }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = ['all', ...Object.keys(BADGE_CATEGORIES)]
  const filtered = activeCategory === 'all'
    ? BADGES
    : BADGES.filter(b => b.cat === activeCategory)

  const earnedCount = BADGES.filter(b => earnedBadges[b.id]?.unlocked).length

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 10001, background: '#0a0a0a', animation: 'fadeIn 0.25s ease both' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-safe-top pt-4 pb-4"
        style={{ borderBottom: '1px solid #1e1e1e', background: '#0f0f0f' }}
      >
        <div>
          <h1 className="font-bebas text-3xl tracking-widest text-white leading-none">BADGE COLLECTION</h1>
          <p className="text-[10px] text-[#555] mt-0.5">{earnedCount} / {BADGES.length} unlocked</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-[#555] hover:text-white hover:bg-[#1a1a1a] transition-all text-lg">✕</button>
      </div>

      {/* Category tabs */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto" style={{ borderBottom: '1px solid #141414' }}>
        {categories.map(cat => {
          const info = cat === 'all' ? { label: 'All', icon: '🏆', color: '#F5C518' } : { ...BADGE_CATEGORIES[cat], color: BADGE_CATEGORIES[cat].color }
          const isActive = cat === activeCategory
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
              style={{
                background: isActive ? info.color + '22' : '#1a1a1a',
                border: `1px solid ${isActive ? info.color + '66' : '#2a2a2a'}`,
                color: isActive ? info.color : '#666',
              }}
            >
              <span>{info.icon}</span>
              <span>{info.label}</span>
            </button>
          )
        })}
      </div>

      {/* Badges grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {filtered.map(badge => {
            const earned = earnedBadges[badge.id]?.unlocked ?? false
            const catColor = BADGE_CATEGORIES[badge.cat]?.color ?? '#888'
            return (
              <div
                key={badge.id}
                className="rounded-2xl p-3 flex flex-col items-center text-center transition-all"
                style={{
                  background: earned ? catColor + '11' : '#0f0f0f',
                  border: `1px solid ${earned ? catColor + '44' : '#1a1a1a'}`,
                  opacity: earned ? 1 : 0.4,
                }}
              >
                <div
                  className="text-2xl mb-1.5"
                  style={{
                    filter: earned ? 'none' : 'grayscale(100%)',
                    animation: (earned && badge.rare) ? 'badgeGlow 2s ease-in-out infinite' : 'none',
                  }}
                >
                  {badge.icon}
                </div>
                <div
                  className="text-[10px] font-bold leading-snug"
                  style={{ color: earned ? catColor : '#444' }}
                >
                  {badge.label}
                </div>
                <div className="text-[8px] text-[#333] mt-0.5 leading-snug">
                  {badge.desc}
                </div>
                {earned && (
                  <div className="text-[9px] text-[#555] mt-1">+{badge.xp} XP</div>
                )}
                {!earned && badge.rare && (
                  <div className="text-[8px] mt-1" style={{ color: '#F5C518' }}>✦ RARE</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes badgeGlow {
          0%,100% { filter: drop-shadow(0 0 4px currentColor) }
          50%      { filter: drop-shadow(0 0 12px currentColor) }
        }
      `}</style>
    </div>
  )
}
