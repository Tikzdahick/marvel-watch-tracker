import { useState } from 'react'

export const BANNERS = [
  { id: 'none',     label: 'None',              style: { background: '#111' },                                                                                    emoji: '⬛' },
  { id: 'wakanda',  label: 'Wakanda',            style: { background: 'linear-gradient(135deg, #1a0030 0%, #7C3AED 50%, #4ade80 100%)' },                        emoji: '🐾' },
  { id: 'asgard',   label: 'Asgard',             style: { background: 'linear-gradient(135deg, #0a0520 0%, #3b82f6 50%, #FFD700 100%)' },                        emoji: '⚡' },
  { id: 'sanctum',  label: 'Sanctum Sanctorum',  style: { background: 'linear-gradient(135deg, #0a0010 0%, #a78bfa 50%, #E81C2E 100%)' },                        emoji: '🪄' },
  { id: 'quantum',  label: 'Quantum Realm',      style: { background: 'linear-gradient(135deg, #000510 0%, #60a5fa 40%, #4ade80 80%, #F5C518 100%)' },          emoji: '🌀' },
  { id: 'space',    label: 'Deep Space',         style: { background: 'linear-gradient(135deg, #000000 0%, #0a0020 50%, #1a0040 100%)' },                        emoji: '🌌' },
  { id: 'nyc',      label: 'New York City',      style: { background: 'linear-gradient(135deg, #0a0010 0%, #E81C2E 40%, #F5C518 100%)' },                        emoji: '🏙️' },
  { id: 'shield',   label: 'S.H.I.E.L.D.',       style: { background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 50%, #333 100%)' },                          emoji: '🛡️' },
]

export const BANNER_MAP = Object.fromEntries(BANNERS.map(b => [b.id, b]))

/**
 * ProfileBannerPicker — bottom-sheet banner selector
 * Props:
 *   currentBanner: string (banner id)
 *   onSelect: (bannerId: string) => void
 *   onClose: () => void
 */
export default function ProfileBannerPicker({ currentBanner = 'none', onSelect, onClose }) {
  const [preview, setPreview] = useState(currentBanner)
  const previewBanner = BANNER_MAP[preview] ?? BANNERS[0]

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 10001, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl overflow-hidden pb-10"
        style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', animation: 'bpSlideUp 0.3s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Preview strip */}
        <div
          className="w-full h-24 flex items-center justify-center transition-all duration-500"
          style={previewBanner.style}
        >
          <span className="text-4xl opacity-60">{previewBanner.emoji}</span>
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <div>
            <h2 className="font-bebas text-xl tracking-widest text-white">PROFILE BANNER</h2>
            <p className="text-[10px] text-[#555]">{previewBanner.label}</p>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white text-lg transition-colors">✕</button>
        </div>

        {/* Grid */}
        <div className="p-4 grid grid-cols-4 gap-2.5">
          {BANNERS.map(b => (
            <button
              key={b.id}
              onClick={() => setPreview(b.id)}
              className="rounded-xl overflow-hidden flex items-center justify-center transition-all active:scale-95"
              style={{
                height: '48px',
                border: `2px solid ${preview === b.id ? '#E81C2E' : '#1e1e1e'}`,
                ...b.style,
              }}
            >
              <span className="text-lg">{b.emoji}</span>
            </button>
          ))}
        </div>

        {/* Apply */}
        <div className="px-4 mt-1">
          <button
            onClick={() => { onSelect(preview); onClose() }}
            className="w-full py-4 rounded-2xl font-bebas tracking-widest text-white text-lg transition-all active:scale-[0.98]"
            style={{ background: '#E81C2E' }}
          >
            APPLY BANNER
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bpSlideUp { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      `}</style>
    </div>
  )
}
