import { useState } from 'react'
import { calcPersonalityType, PERSONALITY_TYPES } from './data/marvelPersonality.js'

/**
 * MarvelPersonalityCard
 * Props:
 *   ratings: { [titleId]: 1-5 }
 *   savedType: string | null
 *   onClose: () => void
 *   onSave: (typeKey: string) => void
 */
export default function MarvelPersonalityCard({ ratings = {}, savedType = null, onClose, onSave }) {
  const [revealed, setRevealed] = useState(!!savedType)
  const [animating, setAnimating] = useState(false)

  const type = savedType
    ? PERSONALITY_TYPES.find(p => p.key === savedType)
    : calcPersonalityType(ratings)

  const ratingCount = Object.keys(ratings).length

  function handleReveal() {
    setAnimating(true)
    setTimeout(() => {
      setRevealed(true)
      setAnimating(false)
      if (type) onSave(type.key)
    }, 1200)
  }

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 10001, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl overflow-hidden pb-10"
        style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', animation: 'mpSlideUp 0.35s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <div>
            <h2 className="font-bebas text-2xl tracking-widest text-white">MARVEL PERSONALITY</h2>
            <p className="text-[10px] text-[#555]">Based on your {ratingCount} ratings</p>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white text-lg transition-colors">✕</button>
        </div>

        <div className="px-5 py-6">
          {ratingCount < 5 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🎭</div>
              <div className="font-bebas text-xl text-white tracking-widest mb-2">RATE MORE TITLES</div>
              <p className="text-[#666] text-sm">Rate at least 5 titles to discover your Marvel personality type.</p>
              <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(ratingCount / 5) * 100}%`, background: '#E81C2E' }} />
              </div>
              <p className="text-[#444] text-xs mt-1">{ratingCount}/5 ratings</p>
            </div>
          ) : !revealed ? (
            <div className="text-center py-6">
              <div className="text-6xl mb-4" style={{ animation: animating ? 'mpSpin 1.2s ease-in-out' : 'none' }}>
                {animating ? '🌀' : '🎭'}
              </div>
              <div className="font-bebas text-xl text-white tracking-widest mb-2">
                {animating ? 'ANALYZING...' : 'YOUR TYPE AWAITS'}
              </div>
              <p className="text-[#666] text-sm mb-6">
                {animating
                  ? 'Scanning your ratings across the multiverse...'
                  : 'Discover which Marvel hero matches your watch personality'}
              </p>
              {!animating && (
                <button
                  onClick={handleReveal}
                  className="font-bebas tracking-widest text-lg px-8 py-3 rounded-2xl text-white transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #E81C2E, #ff4d5e)', boxShadow: '0 0 20px rgba(232,28,46,0.4)' }}
                >
                  REVEAL MY TYPE
                </button>
              )}
            </div>
          ) : type ? (
            <div className="text-center" style={{ animation: 'mpFadeUp 0.5s ease both' }}>
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-4xl mb-4"
                style={{
                  background: type.gradient ?? type.color + '22',
                  border: `2px solid ${type.color}66`,
                  boxShadow: `0 0 30px ${type.color}44`,
                }}
              >
                {type.icon}
              </div>
              <div className="font-bebas text-3xl tracking-widest mb-1" style={{ color: type.color }}>
                {type.name}
              </div>
              <div className="text-[#888] text-sm mb-4 italic">{type.subtitle}</div>
              <p className="text-[#aaa] text-sm leading-relaxed mb-5">{type.desc}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {type.traits.map(trait => (
                  <span
                    key={trait}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: type.color + '18', border: `1px solid ${type.color}33`, color: type.color }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
              <button onClick={onClose} className="text-[#555] text-xs hover:text-white transition-colors">
                Close
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes mpSlideUp { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes mpFadeUp  { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes mpSpin    { 0% { transform:rotate(0deg) scale(1) } 50% { transform:rotate(180deg) scale(1.2) } 100% { transform:rotate(360deg) scale(1) } }
      `}</style>
    </div>
  )
}
