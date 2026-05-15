import { useState } from 'react'
import { getTitleMeta } from './data/titleMeta.js'
import { getPrimaryLock, LOCK_TIERS } from './data/locks.js'

/**
 * TitleDetailModal — full title detail bottom sheet.
 *
 * Props:
 *   title:      TITLES entry object (id, title, type, tier, ...)
 *   isWatched:  boolean
 *   rating:     number 1–5 | undefined
 *   note:       string | undefined
 *   isLocked:   boolean — whether the title is currently content-locked
 *   onToggle:   (id) → void — mark watched/unwatched
 *   onRate:     (id, stars) → void
 *   onSaveNote: (id, text) → void
 *   onClose:    () → void
 *   onUnlockRequest: (tierKey) → void — called when user taps "Unlock" on a locked title
 */
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

  const TYPE_COLORS = {
    movie:    { label: 'MOVIE',    cls: 'bg-red-950 text-[#E81C2E] border-[#E81C2E]/25' },
    tv:       { label: 'TV',       cls: 'bg-blue-950 text-blue-400 border-blue-400/25' },
    animated: { label: 'ANIMATED', cls: 'bg-purple-950 text-purple-400 border-purple-400/25' },
  }
  const typeInfo = TYPE_COLORS[title.type] ?? TYPE_COLORS.movie

  // Service icon mapping
  const SERVICE_ICONS = {
    'Disney+':  '🏰',
    'Netflix':  '🔴',
    'Theaters': '🎬',
    'Hulu':     '🟢',
  }
  const serviceIcon = SERVICE_ICONS[meta.service] ?? '📺'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0d0d0d] border border-[#1e1e1e] rounded-t-3xl overflow-hidden"
        style={{ animation: 'slideUp 0.3s ease both', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="sticky top-0 bg-[#0d0d0d] z-10 pt-3 pb-2 px-6">
          <div className="w-10 h-1 bg-[#333] rounded-full mx-auto"/>
        </div>

        <div className="px-6 pb-10 pt-1">
          {/* ── Header row ── */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className={`inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest ${typeInfo.cls}`}>
                  {typeInfo.label}
                </span>
                {isLocked && lockTier && (
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest ${lockTier.bgColor} ${lockTier.borderColor}`}
                    style={{ color: lockTier.color }}
                  >
                    {lockTier.emoji} {lockTier.rating}
                  </span>
                )}
                {title.comingSoon && (
                  <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border bg-yellow-950 text-[#F5C518] border-[#F5C518]/40 font-bold tracking-widest">
                    COMING SOON
                  </span>
                )}
              </div>
              <h2 className="text-white font-semibold text-lg leading-snug">{title.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:text-white border border-[#1e1e1e] flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* ── Metadata pills ── */}
          <div className="flex flex-wrap gap-2 mb-4">
            <MetaPill icon={serviceIcon} label={meta.service}/>
            <MetaPill icon="⭐" label={`IMDb ${meta.imdb}`}/>
            <MetaPill icon="⏱" label={meta.runtime}/>
            <MetaPill icon="📋" label={`#${String(title.id).padStart(2, '0')}`}/>
          </div>

          {/* ── Description ── */}
          <p className="text-[#888] text-sm leading-relaxed mb-5">{meta.desc}</p>

          {/* ── Locked overlay notice ── */}
          {isLocked && lockTier && (
            <div
              className={`rounded-xl p-4 mb-5 border ${lockTier.bgColor} ${lockTier.borderColor} text-center`}
            >
              <div className="text-2xl mb-1">{lockTier.emoji}</div>
              <div className="text-sm font-semibold mb-1" style={{ color: lockTier.color }}>
                {lockTier.label} Content
              </div>
              <div className="text-xs text-[#555] mb-3">{lockTier.description}</div>
              <button
                onClick={() => { onClose(); onUnlockRequest?.(primaryLock) }}
                className="px-4 py-2 rounded-lg text-xs font-bold tracking-widest border transition-all"
                style={{
                  color: lockTier.color,
                  borderColor: lockTier.color + '50',
                  background: lockTier.color + '15',
                }}
              >
                ENTER PIN TO UNLOCK
              </button>
            </div>
          )}

          {/* ── Watch toggle ── */}
          {!title.comingSoon && !isLocked && (
            <button
              onClick={() => { onToggle(title.id); onClose() }}
              className={`w-full py-3.5 rounded-xl font-bebas text-xl tracking-widest transition-all mb-4 ${
                isWatched
                  ? 'bg-[#1a1a1a] text-[#555] border border-[#222] hover:text-white'
                  : 'bg-[#E81C2E] text-white hover:shadow-[0_0_16px_rgba(232,28,46,0.4)]'
              }`}
            >
              {isWatched ? '✓ MARK UNWATCHED' : '▶ MARK AS WATCHED'}
            </button>
          )}

          {/* ── Star rating ── */}
          {!isLocked && (
            <div className="mb-5">
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2">Your Rating</div>
              <div className="flex gap-3 items-center">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onMouseEnter={() => setHoverStar(n)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => handleRatingSave(localRating === n ? 0 : n)}
                    className="text-3xl transition-transform hover:scale-125 active:scale-110"
                  >
                    <span style={{ color: n <= (hoverStar || localRating) ? '#F5C518' : '#2a2a2a' }}>★</span>
                  </button>
                ))}
                {localRating > 0 && (
                  <span className="text-[#555] text-xs ml-1">{localRating}/5</span>
                )}
              </div>
            </div>
          )}

          {/* ── Personal note ── */}
          {!isLocked && (
            <div>
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2">📝 Personal Note</div>
              <textarea
                value={editNote}
                onChange={e => { setEditNote(e.target.value); setNoteChanged(true) }}
                placeholder="Add a review or thoughts…"
                rows={3}
                className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl px-3 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#E81C2E]/50 resize-none mb-2"
              />
              {noteChanged && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditNote(note ?? ''); setNoteChanged(false) }}
                    className="flex-1 py-2 text-xs text-[#555] border border-[#222] rounded-lg hover:text-white transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleNoteSave}
                    className="flex-1 py-2 text-xs font-semibold bg-[#E81C2E] text-white rounded-lg hover:shadow-[0_0_8px_rgba(232,28,46,0.4)] transition-all"
                  >
                    Save Note
                  </button>
                </div>
              )}
              {!noteChanged && editNote && (
                <button
                  onClick={() => { onSaveNote(title.id, ''); setEditNote(''); setNoteChanged(false) }}
                  className="text-[10px] text-[#444] hover:text-[#E81C2E] transition-colors"
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

function MetaPill({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#151515] border border-[#1e1e1e] rounded-lg px-2.5 py-1">
      <span className="text-[11px]">{icon}</span>
      <span className="text-[11px] text-[#888]">{label}</span>
    </div>
  )
}
