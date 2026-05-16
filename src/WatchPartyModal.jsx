import { useState, useMemo } from 'react'

/** Format "2025-06-14" + "19:30" → "Sat, Jun 14 at 7:30 PM" */
function formatPartyDateTime(dateStr, timeStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  const datePart = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  if (!timeStr) return datePart
  const [hRaw, min] = timeStr.split(':').map(Number)
  const ampm = hRaw >= 12 ? 'PM' : 'AM'
  const h = hRaw % 12 || 12
  return `${datePart} at ${h}:${String(min).padStart(2, '0')} ${ampm}`
}

/** Trash icon SVG */
function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

/**
 * WatchPartyModal — Full-screen modal to view and create watch parties.
 *
 * Props:
 *   titles:        Array — all titles
 *   friends:       Array — [{ id, name, avatar }]
 *   parties:       Array — [{ id, titleId, date, time, friendIds, createdAt }]
 *   watched:       Set<number>
 *   onCreateParty: (party) => void
 *   onDeleteParty: (partyId) => void
 *   onClose:       () => void
 */
export default function WatchPartyModal({
  titles,
  friends,
  parties,
  watched,
  onCreateParty,
  onDeleteParty,
  onClose,
}) {
  const [showForm,      setShowForm]      = useState(false)
  const [titleSearch,   setTitleSearch]   = useState('')
  const [selectedTitle, setSelectedTitle] = useState(null)
  const [titleDropOpen, setTitleDropOpen] = useState(false)
  const [date,          setDate]          = useState('')
  const [time,          setTime]          = useState('')
  const [friendIds,     setFriendIds]     = useState([])
  const [confirmDelete, setConfirmDelete] = useState(null) // partyId pending delete

  // Sort parties by date ascending
  const sortedParties = useMemo(() => {
    return [...parties].sort((a, b) => {
      const da = new Date(`${a.date}T${a.time || '00:00'}`)
      const db = new Date(`${b.date}T${b.time || '00:00'}`)
      return da - db
    })
  }, [parties])

  // Filter titles for search
  const filteredTitles = useMemo(() => {
    if (!titleSearch.trim()) return titles.slice(0, 40)
    const q = titleSearch.toLowerCase()
    return titles.filter(t => t.title.toLowerCase().includes(q)).slice(0, 40)
  }, [titles, titleSearch])

  function toggleFriend(id) {
    setFriendIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleCreate() {
    if (!selectedTitle || !date) return
    onCreateParty({
      id: Date.now(),
      titleId: selectedTitle.id,
      date,
      time,
      friendIds: [...friendIds],
      createdAt: new Date().toISOString(),
    })
    // Reset form
    setShowForm(false)
    setSelectedTitle(null)
    setTitleSearch('')
    setDate('')
    setTime('')
    setFriendIds([])
  }

  function handleDeleteConfirm(partyId) {
    onDeleteParty(partyId)
    setConfirmDelete(null)
  }

  function getTitleById(id) {
    return titles.find(t => t.id === id)
  }

  function getFriendNames(fIds) {
    if (!fIds || fIds.length === 0) return 'Just you'
    return fIds.map(id => friends.find(f => f.id === id)?.name).filter(Boolean).join(', ')
  }

  function typeLabel(type) {
    if (type === 'movie') return '🎬 Movie'
    if (type === 'tv') return '📺 Show'
    if (type === 'animated') return '🎨 Animated'
    return type
  }

  return (
    <div
      className="fixed inset-0 bg-[#0a0a0a] flex flex-col"
      style={{ zIndex: 10000 }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-[#1a1a1a] flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%)' }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-[#888] hover:text-white transition-colors text-sm py-1 pr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <h1 className="font-bebas text-2xl tracking-widest text-white flex-1 text-center">
          WATCH PARTY
        </h1>

        <button
          onClick={() => { setShowForm(true); setTitleDropOpen(false) }}
          className="w-9 h-9 rounded-xl bg-[#E81C2E] hover:bg-[#c0161f] flex items-center justify-center transition-colors text-white font-bold text-xl leading-none"
        >
          +
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* ── Upcoming parties ── */}
        {sortedParties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🎬</div>
            <p className="font-bebas text-2xl tracking-widest text-[#444] mb-2">NO WATCH PARTIES YET</p>
            <p className="text-[#555] text-sm">Create one to watch with friends!</p>
          </div>
        ) : (
          <>
            <p className="text-[#555] text-xs uppercase tracking-wider mb-2">
              Upcoming — {sortedParties.length} {sortedParties.length === 1 ? 'party' : 'parties'}
            </p>
            {sortedParties.map(party => {
              const titleObj = getTitleById(party.titleId)
              return (
                <div
                  key={party.id}
                  className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-4 relative"
                  style={{ animation: 'wpSlideIn 0.25s ease both' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm leading-tight truncate">
                        {titleObj?.title ?? 'Unknown Title'}
                      </p>
                      <p className="text-[#555] text-xs mt-0.5">{typeLabel(titleObj?.type)}</p>
                    </div>
                    <button
                      onClick={() => setConfirmDelete(party.id)}
                      className="text-[#444] hover:text-[#E81C2E] transition-colors p-1 flex-shrink-0"
                      title="Delete party"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {/* Date/time chip */}
                    <div className="flex items-center gap-1.5 bg-[#141414] border border-[#222] rounded-lg px-2.5 py-1">
                      <span className="text-[#E81C2E] text-xs">📅</span>
                      <span className="text-[#bbb] text-xs">{formatPartyDateTime(party.date, party.time)}</span>
                    </div>
                    {/* Friends chip */}
                    <div className="flex items-center gap-1.5 bg-[#141414] border border-[#222] rounded-lg px-2.5 py-1">
                      <span className="text-xs">👥</span>
                      <span className="text-[#bbb] text-xs">{getFriendNames(party.friendIds)}</span>
                    </div>
                  </div>

                  {/* Delete confirm overlay */}
                  {confirmDelete === party.id && (
                    <div className="absolute inset-0 bg-[#0a0a0a]/95 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                      <p className="text-white text-sm font-medium">Delete this watch party?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-4 py-2 text-xs rounded-lg border border-[#222] text-[#888] hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(party.id)}
                          className="px-4 py-2 text-xs rounded-lg bg-[#E81C2E] text-white font-bold hover:bg-[#c0161f] transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* ── Create party slide-up panel ── */}
      {showForm && (
        <div
          className="fixed inset-0 flex flex-col justify-end"
          style={{ zIndex: 10001, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-[#0f0f0f] border-t border-[#1e1e1e] rounded-t-3xl px-4 pb-safe pb-6 max-h-[90vh] overflow-y-auto"
            style={{ animation: 'wpSlideUp 0.3s ease both' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 rounded-full bg-[#333]" />
            </div>

            <h3 className="font-bebas text-2xl tracking-widest text-white mb-5">CREATE WATCH PARTY</h3>

            {/* Title picker */}
            <div className="mb-4">
              <label className="text-[#555] text-xs uppercase tracking-wider block mb-2">Title</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search titles…"
                  value={titleSearch}
                  onChange={e => { setTitleSearch(e.target.value); setTitleDropOpen(true) }}
                  onFocus={() => setTitleDropOpen(true)}
                  className="w-full bg-[#141414] border border-[#222] rounded-xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#E81C2E]/50"
                />
                {selectedTitle && !titleDropOpen && (
                  <div className="absolute inset-0 bg-[#141414] border border-[#E81C2E]/40 rounded-xl px-4 flex items-center justify-between pointer-events-none">
                    <span className="text-white text-sm truncate">{selectedTitle.title}</span>
                    <button
                      className="pointer-events-auto text-[#555] hover:text-white text-lg leading-none"
                      onClick={() => { setSelectedTitle(null); setTitleSearch(''); setTitleDropOpen(false) }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {titleDropOpen && (
                <div className="mt-1 bg-[#141414] border border-[#222] rounded-xl max-h-44 overflow-y-auto">
                  {filteredTitles.length === 0 ? (
                    <p className="text-[#555] text-sm px-4 py-3">No titles found</p>
                  ) : (
                    filteredTitles.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setSelectedTitle(t); setTitleSearch(''); setTitleDropOpen(false) }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm text-white hover:bg-[#1e1e1e] transition-colors border-b border-[#1a1a1a] last:border-0"
                      >
                        <span className="truncate">{t.title}</span>
                        <span className="text-[#555] text-xs flex-shrink-0 ml-2">{typeLabel(t.type)}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Date + Time row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-[#555] text-xs uppercase tracking-wider block mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#141414] border border-[#222] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E81C2E]/50"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label className="text-[#555] text-xs uppercase tracking-wider block mb-2">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-[#141414] border border-[#222] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E81C2E]/50"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Friends */}
            <div className="mb-6">
              <label className="text-[#555] text-xs uppercase tracking-wider block mb-2">Invite Friends</label>
              {friends.length === 0 ? (
                <p className="text-[#555] text-sm bg-[#141414] border border-[#1e1e1e] rounded-xl px-4 py-3">
                  Add friends first to invite them.
                </p>
              ) : (
                <div className="space-y-2">
                  {friends.map(f => (
                    <label
                      key={f.id}
                      className="flex items-center gap-3 bg-[#141414] border border-[#1e1e1e] rounded-xl px-4 py-3 cursor-pointer hover:border-[#E81C2E]/30 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={friendIds.includes(f.id)}
                        onChange={() => toggleFriend(f.id)}
                        className="accent-[#E81C2E] w-4 h-4 flex-shrink-0"
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {f.avatar ? (
                          <img src={f.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#E81C2E]/20 border border-[#E81C2E]/30 flex items-center justify-center text-xs text-[#E81C2E] font-bold flex-shrink-0">
                            {f.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                        )}
                        <span className="text-white text-sm truncate">{f.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleCreate}
              disabled={!selectedTitle || !date}
              className={`w-full py-4 rounded-xl font-bebas text-xl tracking-widest transition-all ${
                selectedTitle && date
                  ? 'bg-[#E81C2E] hover:bg-[#c0161f] text-white'
                  : 'bg-[#1a1a1a] text-[#444] cursor-not-allowed'
              }`}
            >
              SCHEDULE PARTY
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wpSlideUp {
          from { opacity: 0; transform: translateY(100%) }
          to   { opacity: 1; transform: translateY(0)     }
        }
        @keyframes wpSlideIn {
          from { opacity: 0; transform: translateY(8px) }
          to   { opacity: 1; transform: translateY(0)   }
        }
      `}</style>
    </div>
  )
}
