import { useEffect, useRef } from 'react'

/**
 * MoodPickerModal — Bottom-sheet mood selector with recommendation.
 *
 * Props:
 *   moods:          Array — [{ id, label, emoji, color }]
 *   currentMood:    string|null — active mood ID
 *   recommendation: Object|null — { title: object, reason: string }
 *   onSelectMood:   (moodId) => void
 *   onClearMood:    () => void
 *   onViewTitle:    (titleId) => void
 *   onClose:        () => void
 */
export default function MoodPickerModal({
  moods,
  currentMood,
  recommendation,
  onSelectMood,
  onClearMood,
  onViewTitle,
  onClose,
}) {
  const sheetRef = useRef(null)

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on swipe-down gesture (simplified: track touchstart/touchend)
  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return
    let startY = 0

    function onTouchStart(e) { startY = e.touches[0].clientY }
    function onTouchEnd(e) {
      const delta = e.changedTouches[0].clientY - startY
      if (delta > 80) onClose()
    }

    sheet.addEventListener('touchstart', onTouchStart, { passive: true })
    sheet.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      sheet.removeEventListener('touchstart', onTouchStart)
      sheet.removeEventListener('touchend', onTouchEnd)
    }
  }, [onClose])

  function typeLabel(type) {
    if (type === 'movie') return '🎬 Movie'
    if (type === 'tv') return '📺 Show'
    if (type === 'animated') return '🎨 Animated'
    return type ?? ''
  }

  return (
    <div
      className="fixed inset-0 flex flex-col justify-end"
      style={{ zIndex: 10000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={handleBackdrop}
    >
      <div
        ref={sheetRef}
        className="bg-[#0f0f0f] border-t border-[#1e1e1e] rounded-t-3xl overflow-hidden flex flex-col"
        style={{
          maxHeight: '70vh',
          animation: 'moodSlideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#2a2a2a]" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bebas text-3xl tracking-widest text-white">PICK A MOOD</h2>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-[#888] text-2xl leading-none transition-colors w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {/* 2×3 mood grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {moods.map(mood => {
              const isSelected = currentMood === mood.id
              return (
                <button
                  key={mood.id}
                  onClick={() => onSelectMood(mood.id)}
                  className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 aspect-square transition-all duration-200 overflow-hidden"
                  style={{
                    background: isSelected
                      ? `${mood.color}22`
                      : '#141414',
                    border: isSelected
                      ? `2px solid ${mood.color}`
                      : '2px solid #1e1e1e',
                    boxShadow: isSelected
                      ? `0 0 16px ${mood.color}55, 0 0 4px ${mood.color}33 inset`
                      : 'none',
                    transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  <span className="text-3xl leading-none">{mood.emoji}</span>
                  <span
                    className="text-xs font-bold uppercase tracking-wider leading-tight text-center"
                    style={{ color: isSelected ? mood.color : '#888' }}
                  >
                    {mood.label}
                  </span>

                  {/* Selected ring pulse */}
                  {isSelected && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        border: `2px solid ${mood.color}`,
                        animation: 'moodPulse 2s ease infinite',
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Recommendation section */}
          {currentMood && recommendation && (
            <div
              className="rounded-2xl border border-[#1e1e1e] overflow-hidden"
              style={{ animation: 'moodRecoFade 0.3s ease both' }}
            >
              {/* Reco header */}
              <div className="px-4 py-3 border-b border-[#1e1e1e] bg-[#141414]">
                <p className="text-[#888] text-xs uppercase tracking-wider">Perfect for your mood:</p>
              </div>

              {/* Reco card */}
              <div className="px-4 py-4" style={{ background: '#111' }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base leading-tight truncate">
                      {recommendation.title?.title ?? 'Unknown'}
                    </p>
                    <p className="text-[#555] text-xs mt-0.5">
                      {typeLabel(recommendation.title?.type)}
                    </p>
                  </div>
                  {/* Mood accent dot */}
                  {currentMood && (() => {
                    const m = moods.find(x => x.id === currentMood)
                    return m ? (
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg"
                        style={{ background: `${m.color}22`, border: `1.5px solid ${m.color}55` }}
                      >
                        {m.emoji}
                      </div>
                    ) : null
                  })()}
                </div>

                {/* Reason */}
                <p className="text-[#777] text-sm leading-snug mb-4">
                  {recommendation.reason}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onViewTitle(recommendation.title?.id)}
                    className="flex-1 py-3 rounded-xl bg-[#E81C2E] hover:bg-[#c0161f] text-white font-bebas text-lg tracking-widest transition-colors"
                  >
                    WATCH THIS
                  </button>
                  <button
                    onClick={onClearMood}
                    className="text-[#555] hover:text-[#888] text-sm transition-colors py-3 px-2"
                  >
                    Clear mood
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No recommendation state (mood selected but no rec) */}
          {currentMood && !recommendation && (
            <div className="text-center py-4">
              <p className="text-[#444] text-sm">No recommendation available for this mood yet.</p>
              <button
                onClick={onClearMood}
                className="mt-3 text-[#555] hover:text-[#888] text-sm transition-colors"
              >
                Clear mood
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes moodSlideUp {
          from { opacity: 0; transform: translateY(100%) }
          to   { opacity: 1; transform: translateY(0)     }
        }
        @keyframes moodPulse {
          0%,100% { opacity: 0.6 }
          50%      { opacity: 0.15 }
        }
        @keyframes moodRecoFade {
          from { opacity: 0; transform: translateY(8px) }
          to   { opacity: 1; transform: translateY(0)   }
        }
      `}</style>
    </div>
  )
}
