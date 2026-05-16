/**
 * TitleDetailModal — full-screen title detail view.
 *
 * Covers the entire screen (z-index above the nav bar) so nothing
 * gets clipped. Slides up from the bottom.
 *
 * Props:
 *   title:           TITLES entry
 *   isWatched:       boolean
 *   rating:          1–5 | undefined
 *   note:            string | undefined
 *   isLocked:        boolean
 *   onToggle:        (id) → void
 *   onRate:          (id, stars) → void
 *   onSaveNote:      (id, text) → void
 *   onClose:         () → void
 *   onUnlockRequest: (tierKey) → void
 */

import { useState } from 'react'
import { getTitleMeta } from './data/titleMeta.js'
import { getPrimaryLock, LOCK_TIERS } from './data/locks.js'

function MetaPill({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#252525] rounded-lg px-2.5 py-1.5">
      <span className="text-sm leading-none">{icon}</span>
      <span className="text-[12px] text-[#aaa]">{label}</span>
    </div>
  )
}

const TYPE_INFO = {
  movie:    { label: 'MOVIE',    cls: 'bg-red-950 text-[#E81C2E] border-[#E81C2E]/30' },
  tv:       { label: 'TV SHOW',  cls: 'bg-blue-950 text-blue-400 border-blue-400/30' },
  animated: { label: 'ANIMATED', cls: 'bg-purple-950 text-purple-400 border-purple-400/30' },
}

const SERVICE_ICONS = {
  'Disney+':  '🏰',
  'Netflix':  '🔴',
  'Theaters': '🎬',
  'Hulu':     '🟢',
  'ABC':      '📺',
  'Freeform': '📺',
}

export default function TitleDetailModal({
  title,
  isWatched,
  rating,
  note,
  isLocked,
  onToggle,
  onRate,
  onSaveNote,
  onClose,
  onUnlockRequest,
}) {
  const meta       = getTitleMeta(title.id)
  const primaryLock = getPrimaryLock(title.id)
  const lockTier   = primaryLock ? LOCK_TIERS[primaryLock] : null
  const typeInfo   = TYPE_INFO[title.type] ?? TYPE_INFO.movie
  const serviceIcon = SERVICE_ICONS[meta.service] ?? '📺'

  const [editNote,    setEditNote]    = useState(note ?? '')
  const [noteChanged, setNoteChanged] = useState(false)
  const [hoverStar,   setHoverStar]   = useState(0)
  const [localRating, setLocalRating] = useState(rating ?? 0)

  function handleRatingSave(stars) {
    setLocalRating(stars)
    onRate(title.id, stars)
  }

  function handleNoteSave() {
    onSaveNote(title.id, editNote.trim())
    setNoteChanged(false)
  }

  return (
    /* Full-screen overlay — z-index above nav bar (z-9999) */
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        zIndex: 10000,
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(12px)',
        animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1) both',
      }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]"
        style={{ background: '#0d0d0d' }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#666] hover:text-white transition-colors py-1 pr-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`text-[9px] px-2 py-[3px] rounded-md border font-bold tracking-widest ${typeInfo.cls}`}>
            {typeInfo.label}
          </span>
          {isWatched && (
            <span className="text-[9px] px-2 py-[3px] rounded-md border font-bold tracking-widest bg-[#E81C2E]/10 text-[#E81C2E] border-[#E81C2E]/30">
              ✓ WATCHED
            </span>
          )}
          {title.comingSoon && (
            <span className="text-[9px] px-2 py-[3px] rounded-md border font-bold tracking-widest bg-yellow-950 text-[#F5C518] border-[#F5C518]/30">
              COMING SOON
            </span>
          )}
          {isLocked && lockTier && (
            <span
              className={`text-[9px] px-2 py-[3px] rounded-md border font-bold tracking-widest ${lockTier.bgColor} ${lockTier.borderColor}`}
              style={{ color: lockTier.color }}
            >
              {lockTier.emoji} {lockTier.rating}
            </span>
          )}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#0d0d0d' }}>
        <div className="max-w-lg mx-auto px-5 pt-6 pb-10">

          {/* Title */}
          <h1 className="text-white font-bold text-2xl leading-tight mb-4">{title.title}</h1>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            <MetaPill icon={serviceIcon} label={meta.service}/>
            {meta.imdb && meta.imdb !== 'N/A' && (
              <MetaPill icon="⭐" label={`IMDb ${meta.imdb}`}/>
            )}
            {meta.runtime && meta.runtime !== 'N/A' && (
              <MetaPill icon="⏱" label={meta.runtime}/>
            )}
            <MetaPill icon="📋" label={`#${String(title.id).padStart(2, '0')}`}/>
          </div>

          {/* ── Description ── */}
          {meta.desc && meta.desc !== 'No description available.' ? (
            <div className="mb-6">
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-semibold">Synopsis</div>
              <p className="text-[#bbb] text-[14px] leading-[1.7]">{meta.desc}</p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-[#444] text-[13px] italic">No description available.</p>
            </div>
          )}

          {/* ── Content lock notice ── */}
          {isLocked && lockTier && (
            <div className={`rounded-2xl p-5 mb-6 border ${lockTier.bgColor} ${lockTier.borderColor} text-center`}>
              <div className="text-3xl mb-2">{lockTier.emoji}</div>
              <div className="text-base font-bold mb-1" style={{ color: lockTier.color }}>
                {lockTier.rating} Content
              </div>
              <div className="text-[12px] text-[#666] mb-4">{lockTier.description}</div>
              <button
                onClick={() => { onClose(); onUnlockRequest?.(primaryLock) }}
                className="px-5 py-2.5 rounded-xl text-[12px] font-bold tracking-widest border transition-all"
                style={{
                  color: lockTier.color,
                  borderColor: lockTier.color + '60',
                  background: lockTier.color + '18',
                }}
              >
                🔓 ENTER PIN TO UNLOCK
              </button>
            </div>
          )}

          {/* ── Watch toggle ── */}
          {!title.comingSoon && !isLocked && (
            <button
              onClick={() => { onToggle(title.id); onClose() }}
              className={`w-full py-4 rounded-2xl font-bebas text-xl tracking-[0.12em] transition-all mb-6 ${
                isWatched
                  ? 'bg-[#1a1a1a] text-[#555] border border-[#252525] hover:text-white hover:border-[#333]'
                  : 'bg-[#E81C2E] text-white hover:shadow-[0_0_24px_rgba(232,28,46,0.5)] active:scale-[0.99]'
              }`}
            >
              {isWatched ? '✓ MARK AS UNWATCHED' : '▶ MARK AS WATCHED'}
            </button>
          )}

          {/* ── Star rating ── */}
          {!isLocked && (
            <div className="mb-6">
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-3 font-semibold">Your Rating</div>
              <div className="flex items-center gap-3">
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    onMouseEnter={() => setHoverStar(n)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => handleRatingSave(localRating === n ? 0 : n)}
                    className="text-4xl transition-all hover:scale-125 active:scale-110"
                  >
                    <span style={{ color: n <= (hoverStar || localRating) ? '#F5C518' : '#252525' }}>★</span>
                  </button>
                ))}
                {localRating > 0 && (
                  <span className="text-[#555] text-sm ml-1 tabular-nums">{localRating}/5</span>
                )}
              </div>
            </div>
          )}

          {/* ── Personal notes ── */}
          {!isLocked && (
            <div>
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-semibold">📝 Notes</div>
              <textarea
                value={editNote}
                onChange={e => { setEditNote(e.target.value); setNoteChanged(true) }}
                placeholder="Add your thoughts, review, or a reminder…"
                rows={4}
                className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3 text-white text-[13px] placeholder-[#333] focus:outline-none focus:border-[#E81C2E]/40 resize-none transition-colors mb-2"
              />
              {noteChanged && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditNote(note ?? ''); setNoteChanged(false) }}
                    className="flex-1 py-2.5 text-[12px] text-[#555] border border-[#1e1e1e] rounded-xl hover:text-white transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleNoteSave}
                    className="flex-1 py-2.5 text-[12px] font-semibold bg-[#E81C2E] text-white rounded-xl hover:shadow-[0_0_10px_rgba(232,28,46,0.4)] transition-all"
                  >
                    Save Note
                  </button>
                </div>
              )}
              {!noteChanged && editNote && (
                <button
                  onClick={() => { onSaveNote(title.id, ''); setEditNote(''); setNoteChanged(false) }}
                  className="text-[11px] text-[#333] hover:text-[#E81C2E] transition-colors"
                >
                  Clear note
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
