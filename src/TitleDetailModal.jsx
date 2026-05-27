/**
 * TitleDetailModal — full-screen title detail view.
 * Covers entire screen (z-index above nav). Slides up from bottom.
 *
 * Props:
 *   title            TITLES entry
 *   isWatched        boolean
 *   inProgress       { season: number, episode: number } | null
 *   rating           1–5 | undefined
 *   note             string | undefined
 *   rewatchDates     string[] (ISO date strings)
 *   isLocked         boolean
 *   spoilerFree      boolean
 *   friends          [{ id, name, avatar }]
 *   taggedFriends    string[] (friend IDs tagged for this title)
 *   onToggle         (id) → void
 *   onSetInProgress  (id, progress | null) → void
 *   onRate           (id, stars) → void
 *   onSaveNote       (id, text) → void
 *   onRewatch        (id) → void
 *   onTagFriend      (id, friendId) → void
 *   onClose          () → void
 *   onUnlockRequest  (tierKey) → void
 *   onOpenDetail     (titleId) → void  ← for similar-title navigation
 */

import { useState, useEffect } from 'react'
import { getTitleMeta } from './data/titleMeta.js'
import { getPrimaryLock, LOCK_TIERS } from './data/locks.js'
import { TITLES } from './data/titles.js'
import { AvatarDisplay } from './AvatarDisplay.jsx'
import { FACTS }           from './data/facts.js'
import { CHARACTERS }      from './data/characters.js'
import { SIMILAR_TITLES }  from './data/recommendations.js'
import { SNAP_DATA, STAN_LEE_CAMEOS, POST_CREDITS } from './data/marvelExtras.js'

const PC_KEY = 'mvt-post-credits-watched'
function loadPC() { try { return JSON.parse(localStorage.getItem(PC_KEY) ?? '{}') } catch { return {} } }
function savePC(v) { try { localStorage.setItem(PC_KEY, JSON.stringify(v)) } catch {} }

const FACTS_DATA  = FACTS          ?? {}
const CHARS_DATA  = CHARACTERS     ?? {}
const SIMILAR_DATA = SIMILAR_TITLES ?? {}

// ── helpers ───────────────────────────────────────────────────────────────────
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

// ── sub-components ────────────────────────────────────────────────────────────
function MetaPill({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#252525] rounded-lg px-2.5 py-1.5">
      <span className="text-sm leading-none">{icon}</span>
      <span className="text-[12px] text-[#aaa]">{label}</span>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-semibold">
      {children}
    </div>
  )
}

function SpoilerVeil({ children, revealed, onReveal }) {
  if (revealed) return children
  return (
    <div className="relative select-none">
      <div className="blur-sm pointer-events-none">{children}</div>
      <button
        onClick={onReveal}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          className="text-[11px] font-semibold px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(232,28,46,0.15)', color: '#E81C2E', border: '1px solid rgba(232,28,46,0.3)' }}
        >
          👁 Tap to reveal (spoilers)
        </span>
      </button>
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────
export default function TitleDetailModal({
  title,
  isWatched,
  inProgress,
  rating,
  note,
  rewatchDates = [],
  isLocked,
  spoilerFree = false,
  friends = [],
  taggedFriends = [],
  watchDate,          // 'YYYY-MM-DD' | undefined — when the user watched this title
  onToggle,
  onSetInProgress,
  onRate,
  onSaveNote,
  onRewatch,
  onTagFriend,
  onClose,
  onUnlockRequest,
  onOpenDetail,
  onEditWatchDate,    // () => void — open the date picker to edit the watch date
  onOpenCharacter,    // (charName) => void — navigate to character page
}) {
  const meta        = getTitleMeta(title.id)
  const primaryLock = getPrimaryLock(title.id)
  const lockTier    = primaryLock ? LOCK_TIERS[primaryLock] : null
  const typeInfo    = TYPE_INFO[title.type] ?? TYPE_INFO.movie
  const serviceIcon = SERVICE_ICONS[meta.service] ?? '📺'
  const isTV        = title.type === 'tv'

  // own state
  const [editNote,       setEditNote]       = useState(note ?? '')
  const [noteChanged,    setNoteChanged]    = useState(false)
  const [hoverStar,      setHoverStar]      = useState(0)
  const [localRating,    setLocalRating]    = useState(rating ?? 0)
  const [synopsisShown,  setSynopsisShown]  = useState(isWatched || !spoilerFree)
  const [factsShown,     setFactsShown]     = useState(isWatched || !spoilerFree)
  const [showTagFriends, setShowTagFriends] = useState(false)
  // In-Progress editor
  const [editingSeason,  setEditingSeason]  = useState(inProgress?.season ?? 1)
  const [editingEp,      setEditingEp]      = useState(inProgress?.episode ?? 1)
  const [showIPEditor,   setShowIPEditor]   = useState(false)
  // Post-credits watched state
  const [pcWatched, setPcWatched] = useState(() => loadPC()[title.id] ?? [])

  // Data slices
  const titleFacts  = FACTS_DATA[title.id]   ?? []
  const titleChars  = CHARS_DATA[title.id]   ?? []
  const similarIds  = SIMILAR_DATA[title.id] ?? []

  // Marvel extras
  const snapData    = SNAP_DATA[title.id]       ?? null
  const cameoData   = STAN_LEE_CAMEOS[title.id] ?? null
  const pcData      = POST_CREDITS[title.id]    ?? null

  function togglePcScene(idx) {
    setPcWatched(prev => {
      const next = prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      const all = loadPC()
      all[title.id] = next
      savePC(all)
      return next
    })
  }

  function handleRatingSave(stars) {
    setLocalRating(stars)
    onRate(title.id, stars)
  }

  function handleNoteSave() {
    onSaveNote(title.id, editNote.trim())
    setNoteChanged(false)
  }

  function handleMarkWatched() {
    onToggle(title.id)
    onClose()
  }

  function handleMarkInProgress() {
    onSetInProgress?.(title.id, { season: editingSeason, episode: editingEp })
    setShowIPEditor(false)
  }

  function handleClearInProgress() {
    onSetInProgress?.(title.id, null)
  }

  function handleRewatch() {
    onRewatch?.(title.id)
  }

  const rewatchCount = rewatchDates.length

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        zIndex: 10000,
        background: 'rgba(0,0,0,0.97)',
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

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <span className={`text-[9px] px-2 py-[3px] rounded-md border font-bold tracking-widest ${typeInfo.cls}`}>
            {typeInfo.label}
          </span>
          {isWatched && (
            <span className="text-[9px] px-2 py-[3px] rounded-md border font-bold tracking-widest bg-[#E81C2E]/10 text-[#E81C2E] border-[#E81C2E]/30">
              ✓ WATCHED
            </span>
          )}
          {inProgress && !isWatched && (
            <span className="text-[9px] px-2 py-[3px] rounded-md border font-bold tracking-widest bg-blue-950 text-blue-400 border-blue-400/30">
              ▶ S{inProgress.season}E{inProgress.episode}
            </span>
          )}
          {rewatchCount > 0 && (
            <span className="text-[9px] px-2 py-[3px] rounded-md border font-bold tracking-widest bg-[#F5C518]/10 text-[#F5C518] border-[#F5C518]/30">
              🔄 ×{rewatchCount + 1}
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
        <div className="max-w-lg mx-auto px-5 pt-6 pb-12">

          {/* Title */}
          <h1 className="text-white font-bold text-2xl leading-tight mb-4">{title.title}</h1>

          {/* Watch date */}
          {isWatched && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 bg-[#E81C2E]/8 border border-[#E81C2E]/20 rounded-xl px-3 py-2 flex-1">
                <svg className="w-3.5 h-3.5 text-[#E81C2E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
                </svg>
                <span className="text-[11px] text-[#E81C2E]/80 uppercase tracking-widest font-semibold">
                  Watched:
                </span>
                <span className="text-[12px] text-white font-medium">
                  {watchDate
                    ? new Date(watchDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Date not recorded'}
                </span>
              </div>
              {onEditWatchDate && (
                <button
                  onClick={onEditWatchDate}
                  className="px-3 py-2 rounded-xl text-[11px] text-[#555] border border-[#1e1e1e] hover:text-white hover:border-[#333] transition-colors flex-shrink-0"
                >
                  Edit
                </button>
              )}
            </div>
          )}

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            <MetaPill icon={serviceIcon} label={meta.service}/>
            {meta.imdb && meta.imdb !== 'N/A' && <MetaPill icon="⭐" label={`IMDb ${meta.imdb}`}/>}
            {meta.runtime && meta.runtime !== 'N/A' && <MetaPill icon="⏱" label={meta.runtime}/>}
            <MetaPill icon="📋" label={`#${String(title.id).padStart(2, '0')}`}/>
          </div>

          {/* ── Synopsis ── */}
          {meta.desc && meta.desc !== 'No description available.' ? (
            <div className="mb-6">
              <SectionLabel>Synopsis</SectionLabel>
              <SpoilerVeil revealed={synopsisShown} onReveal={() => setSynopsisShown(true)}>
                <p className="text-[#bbb] text-[14px] leading-[1.7]">{meta.desc}</p>
              </SpoilerVeil>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-[#444] text-[13px] italic">No description available.</p>
            </div>
          )}

          {/* ── Characters ── */}
          {titleChars.length > 0 && (
            <div className="mb-6">
              <SectionLabel>
                Characters
                {onOpenCharacter && (
                  <span className="ml-1 text-[#444] normal-case font-normal text-[9px]">· tap to view profile</span>
                )}
              </SectionLabel>
              <SpoilerVeil revealed={factsShown} onReveal={() => setFactsShown(true)}>
                <div className="flex flex-wrap gap-1.5">
                  {titleChars.map(char => (
                    onOpenCharacter ? (
                      <button
                        key={char}
                        onClick={() => { onClose(); onOpenCharacter(char) }}
                        className="text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors hover:border-[#E81C2E]/40 hover:text-white active:scale-95"
                        style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #252525' }}
                      >
                        {char}
                      </button>
                    ) : (
                      <span
                        key={char}
                        className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
                        style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #252525' }}
                      >
                        {char}
                      </span>
                    )
                  ))}
                </div>
              </SpoilerVeil>
            </div>
          )}

          {/* ── Fun Facts ── */}
          {titleFacts.length > 0 && (
            <div className="mb-6">
              <SectionLabel>🎬 Behind the Scenes</SectionLabel>
              <SpoilerVeil revealed={factsShown} onReveal={() => setFactsShown(true)}>
                <div className="space-y-2.5">
                  {titleFacts.map((fact, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-xl px-3.5 py-3"
                      style={{ background: '#111', border: '1px solid #1e1e1e' }}
                    >
                      <span className="text-[#F5C518] text-sm mt-0.5 flex-shrink-0">💡</span>
                      <p className="text-[#999] text-[12.5px] leading-[1.65]">{fact}</p>
                    </div>
                  ))}
                </div>
              </SpoilerVeil>
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
                style={{ color: lockTier.color, borderColor: lockTier.color + '60', background: lockTier.color + '18' }}
              >
                🔓 ENTER PIN TO UNLOCK
              </button>
            </div>
          )}

          {/* ── In Progress tracker (TV shows) ── */}
          {!isLocked && !title.comingSoon && isTV && !isWatched && (
            <div className="mb-5">
              {inProgress ? (
                <div
                  className="rounded-2xl p-4 mb-0"
                  style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-blue-400 text-[11px] font-semibold uppercase tracking-widest mb-0.5">In Progress</div>
                      <div className="text-white font-bold text-lg">Season {inProgress.season}, Episode {inProgress.episode}</div>
                    </div>
                    <button
                      onClick={() => setShowIPEditor(v => !v)}
                      className="text-[11px] text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-xl hover:bg-blue-400/10 transition-colors"
                    >
                      {showIPEditor ? 'Cancel' : 'Update'}
                    </button>
                  </div>

                  {showIPEditor && (
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Season</div>
                        <input type="number" min="1" max="20" value={editingSeason}
                          onChange={e => setEditingSeason(Number(e.target.value))}
                          className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl px-3 py-2 text-white text-center text-base focus:outline-none focus:border-blue-400/40"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Episode</div>
                        <input type="number" min="1" max="99" value={editingEp}
                          onChange={e => setEditingEp(Number(e.target.value))}
                          className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl px-3 py-2 text-white text-center text-base focus:outline-none focus:border-blue-400/40"
                        />
                      </div>
                      <button
                        onClick={handleMarkInProgress}
                        className="px-4 py-2 rounded-xl text-[12px] font-bold text-white"
                        style={{ background: '#2563eb' }}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleClearInProgress}
                    className="mt-3 text-[11px] text-[#444] hover:text-[#888] transition-colors"
                  >
                    Clear progress
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowIPEditor(true); setShowTagFriends(false) }}
                  className="w-full py-3 rounded-2xl font-semibold text-sm text-blue-400 border border-blue-400/25 bg-blue-400/5 hover:bg-blue-400/10 transition-all mb-0"
                >
                  ▶ Mark as In Progress
                </button>
              )}

              {/* In-progress season/ep editor (when no inProgress yet) */}
              {showIPEditor && !inProgress && (
                <div
                  className="rounded-2xl p-4 mt-2"
                  style={{ background: '#111', border: '1px solid #1e1e1e' }}
                >
                  <div className="text-[10px] text-[#555] uppercase tracking-widest mb-3">Where are you?</div>
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Season</div>
                      <input type="number" min="1" max="20" value={editingSeason}
                        onChange={e => setEditingSeason(Number(e.target.value))}
                        className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl px-3 py-2 text-white text-center text-base focus:outline-none focus:border-blue-400/40"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Episode</div>
                      <input type="number" min="1" max="99" value={editingEp}
                        onChange={e => setEditingEp(Number(e.target.value))}
                        className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl px-3 py-2 text-white text-center text-base focus:outline-none focus:border-blue-400/40"
                      />
                    </div>
                    <button
                      onClick={handleMarkInProgress}
                      className="px-4 py-2 rounded-xl text-[12px] font-bold text-white"
                      style={{ background: '#2563eb' }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Watch toggle ── */}
          {!title.comingSoon && !isLocked && (
            <button
              onClick={handleMarkWatched}
              className={`w-full py-4 rounded-2xl font-bebas text-xl tracking-[0.12em] transition-all mb-4 ${
                isWatched
                  ? 'bg-[#1a1a1a] text-[#555] border border-[#252525] hover:text-white hover:border-[#333]'
                  : 'bg-[#E81C2E] text-white hover:shadow-[0_0_24px_rgba(232,28,46,0.5)] active:scale-[0.99]'
              }`}
            >
              {isWatched ? '✓ MARK AS UNWATCHED' : '▶ MARK AS WATCHED'}
            </button>
          )}

          {/* ── Watch With Someone ── */}
          {!isLocked && friends.length > 0 && (
            <div className="mb-5">
              <button
                onClick={() => setShowTagFriends(v => !v)}
                className="flex items-center gap-2 text-[11px] text-[#555] hover:text-[#888] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
                {taggedFriends.length > 0
                  ? `Watched with ${taggedFriends.length} friend${taggedFriends.length > 1 ? 's' : ''}`
                  : 'Tag who you watched with'}
              </button>

              {showTagFriends && (
                <div
                  className="mt-2 rounded-xl p-3"
                  style={{ background: '#111', border: '1px solid #1e1e1e' }}
                >
                  <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2">Who'd you watch with?</div>
                  <div className="flex flex-wrap gap-2">
                    {friends.map(f => {
                      const tagged = taggedFriends.includes(f.id)
                      return (
                        <button
                          key={f.id}
                          onClick={() => onTagFriend?.(title.id, f.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] transition-all"
                          style={{
                            background: tagged ? 'rgba(232,28,46,0.12)' : '#1a1a1a',
                            border: tagged ? '1px solid rgba(232,28,46,0.4)' : '1px solid #252525',
                            color: tagged ? '#E81C2E' : '#666',
                          }}
                        >
                          <AvatarDisplay avatar={f.avatar} name={f.name} size="sm"/>
                          <span className="ml-1">{f.name}</span>
                          {tagged && <span>✓</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Rewatch ── */}
          {!isLocked && isWatched && (
            <div className="mb-5 flex items-center justify-between">
              <button
                onClick={handleRewatch}
                className="flex items-center gap-2 text-[12px] font-semibold text-[#F5C518] hover:text-white transition-colors px-3 py-2 rounded-xl border border-[#F5C518]/20 hover:border-[#F5C518]/40 bg-[#F5C518]/5 hover:bg-[#F5C518]/10"
              >
                🔄 Log a Rewatch
              </button>
              {rewatchCount > 0 && (
                <div className="text-[10px] text-[#555]">
                  Rewatched <span className="text-[#F5C518]">{rewatchCount}×</span>
                </div>
              )}
            </div>
          )}

          {/* ── Star rating ── */}
          {!isLocked && (
            <div className="mb-6">
              <SectionLabel>Your Rating</SectionLabel>
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

          {/* ── Similar titles ── */}
          {similarIds.length > 0 && isWatched && (
            <div className="mb-6">
              <SectionLabel>If You Liked This…</SectionLabel>
              <div className="space-y-1.5">
                {similarIds.slice(0, 3).map(sid => {
                  const st = TITLES.find(t => t.id === sid)
                  if (!st) return null
                  return (
                    <button
                      key={sid}
                      onClick={() => { onClose(); onOpenDetail?.(sid) }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all hover:border-[#333] group"
                      style={{ background: '#111', border: '1px solid #1e1e1e' }}
                    >
                      <span className="text-[#bbb] text-[13px] group-hover:text-white transition-colors">
                        {st.title}
                      </span>
                      <svg className="w-3.5 h-3.5 text-[#333] group-hover:text-[#E81C2E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Snap Tracker (Infinity War / Endgame / Ant-Man & the Wasp) ── */}
          {snapData && (
            <div className="mb-6">
              <SectionLabel>🌌 Snap Tracker</SectionLabel>
              {snapData.note && (
                <p className="text-[11px] italic mb-3" style={{ color: '#666' }}>{snapData.note}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {snapData.snapped?.length > 0 && (
                  <div className="rounded-xl p-3" style={{ background: '#1a0a00', border: '1px solid rgba(232,28,46,0.25)' }}>
                    <div className="text-[9px] text-[#E81C2E] uppercase tracking-widest font-bold mb-2">💀 Snapped</div>
                    <div className="space-y-1">
                      {snapData.snapped.map(name => (
                        <div key={name} className="text-[11px]" style={{ color: '#999' }}>{name}</div>
                      ))}
                    </div>
                  </div>
                )}
                {snapData.survived?.length > 0 && (
                  <div className="rounded-xl p-3" style={{ background: '#001a0a', border: '1px solid rgba(34,197,94,0.25)' }}>
                    <div className="text-[9px] text-green-400 uppercase tracking-widest font-bold mb-2">✅ Survived</div>
                    <div className="space-y-1">
                      {snapData.survived.map(name => (
                        <div key={name} className="text-[11px]" style={{ color: '#999' }}>{name}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Stan Lee Cameo ── */}
          {cameoData && (
            <div className="mb-6">
              <SectionLabel>👴 Stan Lee Cameo</SectionLabel>
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{
                  background: cameoData.hasCameo ? 'rgba(245,197,24,0.06)' : '#111',
                  border: `1px solid ${cameoData.hasCameo ? 'rgba(245,197,24,0.25)' : '#1e1e1e'}`,
                }}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{cameoData.hasCameo ? '✅' : '❌'}</span>
                <div>
                  <div className="text-[12px] font-semibold mb-0.5" style={{ color: cameoData.hasCameo ? '#F5C518' : '#555' }}>
                    {cameoData.hasCameo ? 'Stan Lee appears!' : 'No Stan Lee cameo'}
                  </div>
                  {cameoData.desc && (
                    <p className="text-[11px] leading-snug" style={{ color: '#777' }}>{cameoData.desc}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Post/Mid-Credits Tracker ── */}
          {pcData && (
            <div className="mb-6">
              <SectionLabel>
                🎬 Post-Credits Scenes
                <span className="ml-2 normal-case font-normal text-[#555]">
                  {pcData.count === 0 ? 'None' : `${pcData.count} scene${pcData.count !== 1 ? 's' : ''}`}
                  {pcData.count > 0 && ` · ${pcWatched.length}/${pcData.count} watched`}
                </span>
              </SectionLabel>
              {pcData.count === 0 ? (
                <p className="text-[11px] italic" style={{ color: '#555' }}>This film has no post-credits scenes.</p>
              ) : (
                <div className="space-y-2">
                  {pcData.scenes.map((scene, idx) => {
                    const watched = pcWatched.includes(idx)
                    return (
                      <button
                        key={idx}
                        onClick={() => togglePcScene(idx)}
                        className="w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all"
                        style={{
                          background: watched ? 'rgba(245,197,24,0.06)' : '#111',
                          border: `1px solid ${watched ? 'rgba(245,197,24,0.3)' : '#1e1e1e'}`,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: watched ? '#F5C518' : 'transparent',
                            border: `2px solid ${watched ? '#F5C518' : '#333'}`,
                          }}
                        >
                          {watched && (
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-[9px] uppercase tracking-widest mb-1 font-semibold" style={{ color: watched ? '#F5C518' : '#444' }}>
                            Scene {idx + 1}{idx === 0 && pcData.count > 1 ? ' (Mid-credits)' : idx === 1 ? ' (Post-credits)' : ''}
                          </div>
                          <p className="text-[11px] leading-snug" style={{ color: watched ? '#bbb' : '#666' }}>{scene}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Personal notes ── */}
          {!isLocked && (
            <div>
              <SectionLabel>📝 Notes</SectionLabel>
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
