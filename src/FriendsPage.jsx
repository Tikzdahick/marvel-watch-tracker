import { useState, useEffect, useCallback } from 'react'
import { SUPABASE_ENABLED } from './hooks/useAuth.js'
import {
  searchUsers, fetchFriendships, sendFriendRequest,
  acceptFriendRequest, declineFriendRequest, removeFriendship, fetchFriendProfile,
  blockUser, unblockUser, muteUser, unmuteUser, fetchBlocked, fetchMuted, reportUser,
} from './lib/supabaseHelpers.js'
import { getTitlesForListSize, getRuntimeMinutes } from './data/titles.js'

/**
 * FriendsPage — full-screen overlay for the friends system.
 *
 * Props:
 *   userId   — current user's Supabase auth uid
 *   onClose  — () → void
 */
export default function FriendsPage({ userId, onClose }) {
  const [tab,          setTab]          = useState('friends')  // 'friends' | 'requests' | 'search'
  const [friendships,  setFriendships]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [viewFriend,   setViewFriend]   = useState(null)   // friend profile object or null

  const loadFriendships = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await fetchFriendships(userId)
    setFriendships(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { loadFriendships() }, [loadFriendships])

  if (!SUPABASE_ENABLED) {
    return <SupabaseRequired onClose={onClose} feature="Friends"/>
  }

  // Classify friendships
  const accepted = friendships.filter(f => f.status === 'accepted')
  const incoming = friendships.filter(f => f.status === 'pending' && f.addressee?.id === userId)
  const outgoing = friendships.filter(f => f.status === 'pending' && f.requester?.id === userId)

  function friendOf(f) {
    return f.requester?.id === userId ? f.addressee : f.requester
  }

  // ── Friend profile view ──
  if (viewFriend) {
    return (
      <FriendProfileView
        friend={viewFriend}
        selfId={userId}
        onBack={() => setViewFriend(null)}
        onRemove={async (fshipId) => {
          await removeFriendship(fshipId)
          setViewFriend(null)
          loadFriendships()
        }}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col" style={{ animation: 'fadeIn 0.2s ease both' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-[#161616] flex-shrink-0">
        <button onClick={onClose}
          className="w-9 h-9 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-[#555] hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="font-bebas text-2xl tracking-[0.15em] text-white flex-1">FRIENDS</h1>
        {incoming.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#E81C2E] text-white text-[10px] font-black flex items-center justify-center">
            {incoming.length}
          </span>
        )}
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-[#161616] flex-shrink-0">
        {[
          { id: 'friends', label: `Friends${accepted.length ? ` (${accepted.length})` : ''}` },
          { id: 'requests', label: `Requests${incoming.length ? ` (${incoming.length})` : ''}` },
          { id: 'search', label: 'Find People' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-xs font-semibold tracking-widest uppercase transition-all border-b-2 ${
              tab === t.id ? 'text-white border-[#E81C2E]' : 'text-[#555] border-transparent hover:text-[#888]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-[#333] text-sm">Loading…</div>
        ) : tab === 'friends' ? (
          <FriendsList
            friends={accepted}
            friendOf={friendOf}
            userId={userId}
            onView={(f, fship) => setViewFriend({ ...friendOf(fship), friendshipId: fship.id })}
            onRemove={async (fshipId) => { await removeFriendship(fshipId); loadFriendships() }}
          />
        ) : tab === 'requests' ? (
          <RequestsList
            incoming={incoming}
            outgoing={outgoing}
            userId={userId}
            friendOf={friendOf}
            onAccept={async (id) => { await acceptFriendRequest(id); loadFriendships() }}
            onDecline={async (id) => { await declineFriendRequest(id); loadFriendships() }}
            onCancel={async (id) => { await removeFriendship(id); loadFriendships() }}
          />
        ) : (
          <SearchTab userId={userId} friendships={friendships} onRequestSent={loadFriendships}/>
        )}
      </div>
    </div>
  )
}

// ── Friends list ──────────────────────────────────────────────────────────────
function FriendsList({ friends, friendOf, userId, onView, onRemove }) {
  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center gap-4">
        <div className="text-5xl mb-2">🦸‍♂️🦸‍♀️⚡</div>
        <h3 className="font-bebas text-2xl tracking-[0.15em] text-white">ASSEMBLE YOUR TEAM</h3>
        <p className="text-sm text-[#555] leading-relaxed max-w-xs">
          Every Avenger needs their squad. Find other Marvel fans and track each other's progress across the universe.
        </p>
        <div className="flex gap-2 mt-2">
          {['🦸','🕷','🔨','🛡','💚','🪃'].map((e, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-[#141414] border border-[#222] flex items-center justify-center text-lg">
              {e}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#E81C2E] font-semibold tracking-widest uppercase mt-1">Use "Find People" to connect</p>
      </div>
    )
  }
  return (
    <ul className="divide-y divide-[#161616]">
      {friends.map(fship => {
        const friend = friendOf(fship)
        return (
          <FriendRow
            key={fship.id}
            friend={friend}
            onView={() => onView(friend, fship)}
            onRemove={() => onRemove(fship.id)}
          />
        )
      })}
    </ul>
  )
}

function FriendRow({ friend, onView, onRemove }) {
  const [confirmRemove, setConfirmRemove] = useState(false)
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <button onClick={onView} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <Avatar avatar={friend?.avatar} size="md"/>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{friend?.username ?? 'Unknown'}</div>
          <div className="text-[11px] text-[#555]">🔥 {friend?.streak ?? 0}d streak</div>
        </div>
      </button>
      {confirmRemove ? (
        <div className="flex gap-1.5 flex-shrink-0">
          <button onClick={() => setConfirmRemove(false)}
            className="px-3 py-1.5 text-[10px] border border-[#222] rounded-lg text-[#555] hover:text-white transition-colors">
            Keep
          </button>
          <button onClick={onRemove}
            className="px-3 py-1.5 text-[10px] border border-[#E81C2E]/30 rounded-lg text-[#E81C2E] hover:bg-[#E81C2E]/10 transition-colors">
            Remove
          </button>
        </div>
      ) : (
        <button onClick={() => setConfirmRemove(true)}
          className="text-[#2a2a2a] hover:text-[#555] transition-colors px-2 py-1 text-lg flex-shrink-0">
          ···
        </button>
      )}
    </li>
  )
}

// ── Requests ──────────────────────────────────────────────────────────────────
function RequestsList({ incoming, outgoing, userId, friendOf, onAccept, onDecline, onCancel }) {
  if (incoming.length === 0 && outgoing.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-[#333]">
        <span className="text-4xl">📬</span>
        <p className="text-sm">No pending requests.</p>
      </div>
    )
  }
  return (
    <div className="divide-y divide-[#161616]">
      {incoming.length > 0 && (
        <div>
          <div className="px-4 py-2 text-[10px] text-[#555] uppercase tracking-widest">Incoming</div>
          {incoming.map(fship => {
            const friend = fship.requester
            return (
              <div key={fship.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar avatar={friend?.avatar} size="md"/>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{friend?.username ?? 'Unknown'}</div>
                  <div className="text-[10px] text-[#555]">wants to be friends</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => onDecline(fship.id)}
                    className="px-3 py-1.5 text-[10px] border border-[#222] rounded-lg text-[#555] hover:text-white transition-colors">
                    Decline
                  </button>
                  <button onClick={() => onAccept(fship.id)}
                    className="px-3 py-1.5 text-[10px] bg-[#E81C2E] rounded-lg text-white font-semibold hover:shadow-[0_0_8px_rgba(232,28,46,0.4)] transition-all">
                    Accept
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {outgoing.length > 0 && (
        <div>
          <div className="px-4 py-2 text-[10px] text-[#555] uppercase tracking-widest">Sent</div>
          {outgoing.map(fship => {
            const friend = fship.addressee
            return (
              <div key={fship.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar avatar={friend?.avatar} size="md"/>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{friend?.username ?? 'Unknown'}</div>
                  <div className="text-[10px] text-[#555]">request pending</div>
                </div>
                <button onClick={() => onCancel(fship.id)}
                  className="px-3 py-1.5 text-[10px] border border-[#222] rounded-lg text-[#555] hover:text-[#E81C2E] transition-colors flex-shrink-0">
                  Cancel
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Search ────────────────────────────────────────────────────────────────────
function SearchTab({ userId, friendships, onRequestSent }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(new Set())
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mvt-recent-searches') || '[]') } catch { return [] }
  })

  const existingIds = new Set(
    friendships.flatMap(f => [f.requester?.id, f.addressee?.id]).filter(Boolean)
  )

  async function handleSearch(q) {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    const { data } = await searchUsers(q.trim(), userId)
    setResults(data ?? [])
    setLoading(false)
    if (q.trim() && data?.length > 0) {
      const recent = [q.trim(), ...recentSearches.filter(r => r !== q.trim())].slice(0, 5)
      setRecentSearches(recent)
      try { localStorage.setItem('mvt-recent-searches', JSON.stringify(recent)) } catch {}
    }
  }

  async function handleSendRequest(toId) {
    await sendFriendRequest(userId, toId)
    setSent(prev => new Set([...prev, toId]))
    onRequestSent?.()
  }

  return (
    <div className="px-4 pt-4">
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
        </svg>
        <input
          type="search"
          placeholder="Search by username…"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          className="w-full bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#3a3a3a] focus:outline-none focus:border-[#E81C2E]/50 transition-colors"
        />
      </div>

      {loading && <div className="text-center text-[#333] text-sm py-8">Searching…</div>}

      {!query.trim() && recentSearches.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2">Recent Searches</div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(r => (
              <button key={r} onClick={() => handleSearch(r)}
                className="px-3 py-1.5 rounded-full bg-[#141414] border border-[#222] text-[11px] text-[#666] hover:text-white hover:border-[#333] transition-all">
                🔍 {r}
              </button>
            ))}
            <button onClick={() => { setRecentSearches([]); localStorage.removeItem('mvt-recent-searches') }}
              className="px-3 py-1.5 rounded-full text-[11px] text-[#333] hover:text-[#555] transition-colors">
              Clear
            </button>
          </div>
        </div>
      )}

      {query.trim() && !loading && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <div className="text-4xl">🕷️</div>
          <p className="text-sm font-semibold text-[#555]">No heroes found in the Multiverse</p>
          <p className="text-[11px] text-[#333]">Try a different username</p>
        </div>
      )}

      <ul className="divide-y divide-[#161616]">
        {results.map(user => {
          const alreadyFriend = existingIds.has(user.id)
          const requestSent   = sent.has(user.id)
          return (
            <li key={user.id} className="flex items-center gap-3 py-3">
              <Avatar avatar={user.avatar} size="md"/>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{user.username}</div>
                <div className="text-[11px] text-[#555]">🔥 {user.streak ?? 0}d streak</div>
              </div>
              {alreadyFriend ? (
                <span className="text-[10px] text-[#444] px-3 py-1.5 border border-[#222] rounded-lg">Friends</span>
              ) : requestSent ? (
                <span className="text-[10px] text-[#555] px-3 py-1.5 border border-[#222] rounded-lg">Sent ✓</span>
              ) : (
                <button onClick={() => handleSendRequest(user.id)}
                  className="text-[10px] font-semibold px-3 py-1.5 bg-[#E81C2E] text-white rounded-lg hover:shadow-[0_0_8px_rgba(232,28,46,0.4)] transition-all">
                  Add Friend
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── Friend profile view ───────────────────────────────────────────────────────
function FriendProfileView({ friend, selfId, onBack, onRemove }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [muted, setMuted] = useState(false)
  const [reported, setReported] = useState(false)

  useEffect(() => {
    fetchFriendProfile(friend.id).then(({ data }) => { setProfile(data); setLoading(false) })
  }, [friend.id])

  const listTitles = profile ? getTitlesForListSize(profile.list_size ?? 'avenger') : []
  const watchedIds = new Set(profile?.watched_ids ?? [])
  const watchedCount = listTitles.filter(t => watchedIds.has(t.id)).length
  const total = listTitles.length
  const pct   = total ? Math.round((watchedCount / total) * 100) : 0
  const hours = Math.floor(
    listTitles.filter(t => watchedIds.has(t.id)).reduce((s, t) => s + getRuntimeMinutes(t), 0) / 60
  )

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col" style={{ animation: 'fadeIn 0.2s ease both' }}>
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-[#161616] flex-shrink-0">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-[#555] hover:text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="font-bebas text-xl tracking-widest text-white flex-1 truncate">{friend.username}</h2>
        <button onClick={() => setConfirmRemove(true)}
          className="text-[10px] border border-[#E81C2E]/25 text-[#E81C2E]/60 hover:text-[#E81C2E] px-3 py-1.5 rounded-lg transition-colors">
          Remove
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <Avatar avatar={friend.avatar} size="lg"/>
          <div>
            <div className="font-bebas text-2xl text-white tracking-wide">{friend.username}</div>
            <div className="text-[11px] text-[#555]">🔥 {friend.streak ?? 0}d watch streak</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-[#333] text-sm py-12">Loading profile…</div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3 text-center">
                <div className="font-bebas text-2xl text-[#E81C2E]">{watchedCount}</div>
                <div className="text-[9px] text-[#555] uppercase tracking-widest">Watched</div>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3 text-center">
                <div className="font-bebas text-2xl text-[#F5C518]">{pct}%</div>
                <div className="text-[9px] text-[#555] uppercase tracking-widest">Done</div>
              </div>
              <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3 text-center">
                <div className="font-bebas text-2xl text-white">{hours}h</div>
                <div className="text-[9px] text-[#555] uppercase tracking-widest">Hours</div>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-[10px] text-[#555] mb-1">
                <span>{watchedCount} / {total} titles</span>
                <span className="capitalize">{profile?.list_size ?? 'avenger'} list</span>
              </div>
              <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #E81C2E 0%, #ff3d4e 100%)' }}/>
              </div>
            </div>

            {/* Recently watched */}
            {profile?.watch_history && (() => {
              const recent = Object.entries(profile.watch_history)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .flatMap(([, ids]) => ids)
                .slice(0, 5)
              const recentTitles = recent.map(id => listTitles.find(t => t.id === id)).filter(Boolean)
              return recentTitles.length > 0 ? (
                <div>
                  <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Recently Watched</div>
                  <ul className="space-y-1.5">
                    {recentTitles.map(t => (
                      <li key={t.id} className="flex items-center gap-2 py-1.5 px-3 bg-[#111] rounded-xl border border-[#1e1e1e]">
                        <span className="text-[10px] text-[#E81C2E] font-bold">✓</span>
                        <span className="text-sm text-white truncate">{t.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            })()}

            {/* Block / Mute */}
            <div className="mt-4 border-t border-[#1a1a1a] pt-4">
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-3">Privacy Controls</div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (blocked) { await unblockUser(selfId, friend.id); setBlocked(false) }
                    else { await blockUser(selfId, friend.id); setBlocked(true) }
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    blocked ? 'bg-[#E81C2E]/10 border-[#E81C2E]/40 text-[#E81C2E]' : 'bg-[#111] border-[#222] text-[#555] hover:text-white hover:border-[#333]'
                  }`}
                >
                  {blocked ? '🚫 Unblock' : '🚫 Block'}
                </button>
                <button
                  onClick={async () => {
                    if (muted) { await unmuteUser(selfId, friend.id); setMuted(false) }
                    else { await muteUser(selfId, friend.id); setMuted(true) }
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    muted ? 'bg-[#333] border-[#444] text-[#888]' : 'bg-[#111] border-[#222] text-[#555] hover:text-white hover:border-[#333]'
                  }`}
                >
                  {muted ? '🔇 Unmute' : '🔇 Mute'}
                </button>
                <button
                  onClick={async () => {
                    setReported(true)
                    await reportUser(selfId, friend.id, 'profile-report')
                  }}
                  disabled={reported}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-[#222] text-[#444] hover:text-[#888] disabled:opacity-40 transition-all bg-[#111]"
                >
                  {reported ? '✓ Reported' : '⚑ Report'}
                </button>
              </div>
              {blocked && (
                <p className="text-[10px] text-[#E81C2E]/60 mt-2 text-center">This user cannot see your profile or send you requests.</p>
              )}
              {muted && (
                <p className="text-[10px] text-[#555] mt-2 text-center">Their posts are hidden from your community feed.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Remove confirmation */}
      {confirmRemove && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setConfirmRemove(false)}>
          <div className="w-full max-w-xs bg-[#0f0f0f] border border-[#222] rounded-2xl p-6 text-center"
            style={{ animation: 'completionPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
            onClick={e => e.stopPropagation()}>
            <div className="text-3xl mb-3">💔</div>
            <h3 className="font-bebas text-xl tracking-widest text-white mb-2">REMOVE FRIEND?</h3>
            <p className="text-[#555] text-sm mb-6">Remove <span className="text-white">{friend.username}</span> from your friends?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRemove(false)}
                className="flex-1 py-3 rounded-xl text-[#555] text-sm border border-[#222] hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={() => onRemove(friend.friendshipId)}
                className="flex-1 py-3 rounded-xl font-bebas text-lg tracking-widest bg-[#E81C2E] text-white hover:shadow-[0_0_12px_rgba(232,28,46,0.4)] transition-all">
                REMOVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared components ─────────────────────────────────────────────────────────
function Avatar({ avatar, size = 'md' }) {
  const cls = size === 'lg'
    ? 'w-16 h-16 rounded-2xl text-3xl'
    : 'w-10 h-10 rounded-xl text-xl'
  const isPhoto = avatar?.startsWith('data:') || avatar?.startsWith('http')
  return (
    <div className={`${cls} flex items-center justify-center flex-shrink-0`}
      style={{ background: '#161616', border: '1.5px solid rgba(232,28,46,0.25)' }}>
      {isPhoto
        ? <img src={avatar} alt="avatar" className="w-full h-full object-cover rounded-[inherit]"/>
        : <span>{avatar ?? '👤'}</span>
      }
    </div>
  )
}

function SupabaseRequired({ onClose, feature }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center">
      <button onClick={onClose}
        className="absolute top-12 left-4 w-9 h-9 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-[#555] hover:text-white">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div className="text-5xl mb-4">🔌</div>
      <h2 className="font-bebas text-2xl tracking-widest text-white mb-2">{feature} Requires an Account</h2>
      <p className="text-[#555] text-sm max-w-xs leading-relaxed mb-6">
        Connect your app to Supabase to use {feature}. Add your credentials to <code className="text-[#888] bg-[#111] px-1.5 py-0.5 rounded">.env.local</code> and restart.
      </p>
      <button onClick={onClose}
        className="px-6 py-3 rounded-xl font-bebas tracking-widest text-lg bg-[#E81C2E] text-white">
        GO BACK
      </button>
    </div>
  )
}
