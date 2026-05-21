/**
 * WatchDatePickerModal — shown when a user marks a title as watched.
 *
 * Props:
 *   titleName    — string, shown in the header
 *   existingDate — 'YYYY-MM-DD' | null  (null = new watch, string = editing)
 *   onConfirm    — (dateStr: string) => void
 *   onCancel     — () => void
 */
import { useState } from 'react'

function todayStr()     { return new Date().toISOString().slice(0, 10) }
function yesterdayStr() { return new Date(Date.now() - 86400000).toISOString().slice(0, 10) }

function formatFull(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function WatchDatePickerModal({ titleName, existingDate, onConfirm, onCancel }) {
  const today     = todayStr()
  const yesterday = yesterdayStr()
  const isEditing = !!existingDate

  const initMode = () => {
    if (!existingDate || existingDate === today)     return 'today'
    if (existingDate === yesterday)                  return 'yesterday'
    return 'custom'
  }

  const [mode,       setMode]       = useState(initMode)
  const [customDate, setCustomDate] = useState(existingDate ?? today)

  function getDateStr() {
    if (mode === 'today')     return today
    if (mode === 'yesterday') return yesterday
    return customDate
  }

  const OPTIONS = [
    { id: 'today',     label: 'Today',     sub: formatFull(today) },
    { id: 'yesterday', label: 'Yesterday', sub: formatFull(yesterday) },
    {
      id:    'custom',
      label: 'Pick a date',
      sub:   mode === 'custom' ? formatFull(customDate) : 'Choose from calendar',
    },
  ]

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-[#0f0f0f] border border-[#222] rounded-t-3xl sm:rounded-2xl p-5 pb-8 sm:pb-5"
        style={{ animation: 'slideUp 0.25s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0 pr-3">
            <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1">
              {isEditing ? 'Edit Watch Date' : 'When did you watch it?'}
            </div>
            <h3 className="font-bebas text-xl tracking-widest text-white leading-tight line-clamp-2">
              {titleName}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-[#333] hover:text-[#888] transition-colors flex-shrink-0 mt-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Date options */}
        <div className="space-y-2 mb-4">
          {OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                mode === opt.id
                  ? 'bg-[#E81C2E]/10 border-[#E81C2E]/40 text-white'
                  : 'bg-[#111] border-[#1e1e1e] text-[#666] hover:border-[#2a2a2a] hover:text-[#888]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  mode === opt.id ? 'border-[#E81C2E]' : 'border-[#333]'
                }`}>
                  {mode === opt.id && (
                    <div className="w-2 h-2 rounded-full bg-[#E81C2E]"/>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="text-[10px] text-[#555] mt-0.5 truncate">{opt.sub}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Calendar input (custom mode) */}
        {mode === 'custom' && (
          <div className="mb-4">
            <input
              type="date"
              value={customDate}
              max={today}
              onChange={e => setCustomDate(e.target.value)}
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E81C2E]/40 transition-colors"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        )}

        {/* Confirm button */}
        <button
          onClick={() => onConfirm(getDateStr())}
          disabled={mode === 'custom' && !customDate}
          className="w-full py-3 rounded-xl font-bebas text-xl tracking-widest bg-[#E81C2E] text-white hover:shadow-[0_0_12px_rgba(232,28,46,0.4)] transition-all disabled:opacity-30"
        >
          {isEditing ? '✓ UPDATE DATE' : '✓ MARK AS WATCHED'}
        </button>

        {isEditing && (
          <button
            onClick={() => onConfirm(null)}
            className="w-full mt-2 py-2 rounded-xl text-[11px] text-[#444] hover:text-[#888] transition-colors"
          >
            Clear watch date
          </button>
        )}
      </div>
    </div>
  )
}
