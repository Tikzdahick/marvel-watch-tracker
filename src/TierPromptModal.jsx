import { useState } from 'react'

const TIERS = [
  {
    key: 'S',
    label: 'Legendary',
    color: '#F5C518',
    gradientFrom: '#F5C518',
    gradientTo: '#c9a010',
    textColor: '#000',
    glowColor: 'rgba(245,197,24,0.6)',
    borderColor: '#F5C518',
  },
  {
    key: 'A',
    label: 'Great',
    color: '#22c55e',
    gradientFrom: '#22c55e',
    gradientTo: '#16a34a',
    textColor: '#fff',
    glowColor: 'rgba(34,197,94,0.5)',
    borderColor: '#22c55e',
  },
  {
    key: 'B',
    label: 'Good',
    color: '#60a5fa',
    gradientFrom: '#60a5fa',
    gradientTo: '#3b82f6',
    textColor: '#fff',
    glowColor: 'rgba(96,165,250,0.5)',
    borderColor: '#60a5fa',
  },
  {
    key: 'C',
    label: 'Okay',
    color: '#f97316',
    gradientFrom: '#f97316',
    gradientTo: '#ea6800',
    textColor: '#fff',
    glowColor: 'rgba(249,115,22,0.5)',
    borderColor: '#f97316',
  },
  {
    key: 'D',
    label: 'Weak',
    color: '#E81C2E',
    gradientFrom: '#E81C2E',
    gradientTo: '#b01020',
    textColor: '#fff',
    glowColor: 'rgba(232,28,46,0.55)',
    borderColor: '#E81C2E',
  },
]

export default function TierPromptModal({ titleName, currentTier, onSelect, onSkip }) {
  const [selected, setSelected] = useState(currentTier ?? null)
  const [hovered, setHovered] = useState(null)

  function handleSelect(tierKey) {
    setSelected(tierKey)
    // Slight delay so user sees the selection flash before closing
    setTimeout(() => onSelect(tierKey), 180)
  }

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center px-4 pb-8 sm:pb-0"
      style={{
        zIndex: 10000,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onSkip}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-white/10 p-6 pb-7 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #141414 0%, #0a0a0a 100%)',
          boxShadow: '0 0 60px rgba(232,28,46,0.15), 0 32px 64px rgba(0,0,0,0.7)',
          animation: 'pickBounce 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Background accent */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            background: 'radial-gradient(ellipse at 50% -20%, rgba(245,197,24,0.06) 0%, transparent 65%)',
          }}
        />

        <div className="relative">
          {/* Drag pill */}
          <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-5"/>

          {/* Header */}
          <div className="text-center mb-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#555] font-semibold mb-1">
              How would you rate it?
            </p>
            <p
              className="font-bebas text-xl tracking-widest text-white leading-tight line-clamp-2"
              title={titleName}
            >
              {titleName}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 my-4"/>

          {/* Tier buttons */}
          <div className="flex gap-2 justify-center mb-5">
            {TIERS.map(tier => {
              const isSelected = selected === tier.key
              const isHovered  = hovered  === tier.key

              return (
                <button
                  key={tier.key}
                  onMouseEnter={() => setHovered(tier.key)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleSelect(tier.key)}
                  className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all duration-150 select-none outline-none focus:outline-none"
                  style={{
                    background: isSelected || isHovered
                      ? `linear-gradient(160deg, ${tier.gradientFrom} 0%, ${tier.gradientTo} 100%)`
                      : 'rgba(255,255,255,0.04)',
                    borderColor: isSelected
                      ? tier.borderColor
                      : isHovered
                        ? `${tier.borderColor}88`
                        : 'rgba(255,255,255,0.07)',
                    boxShadow: isSelected
                      ? `0 0 20px ${tier.glowColor}, 0 0 40px ${tier.glowColor.replace('0.', '0.2')}`
                      : isHovered
                        ? `0 0 12px ${tier.glowColor.replace('0.', '0.3')}`
                        : 'none',
                    transform: isSelected ? 'scale(1.07)' : isHovered ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  <span
                    className="font-bebas text-3xl leading-none"
                    style={{ color: isSelected || isHovered ? tier.textColor : tier.color }}
                  >
                    {tier.key}
                  </span>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-wider leading-none"
                    style={{
                      color: isSelected || isHovered
                        ? (tier.textColor === '#000' ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.7)')
                        : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {tier.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Skip */}
          <div className="text-center">
            <button
              onClick={onSkip}
              className="text-[11px] text-[#444] hover:text-[#777] transition-colors underline underline-offset-2"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
