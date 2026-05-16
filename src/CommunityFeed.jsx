/**
 * CommunityFeed.jsx — Community posts: reviews, progress updates, opinions.
 *
 * Props:
 *   user       — Supabase user object (auth.user)
 *   friendIds  — string[] of friend user IDs (for "friends first" sorting)
 *
 * Requires Supabase to be configured (SUPABASE_ENABLED). Shows a placeholder
 * when running in local-only mode.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { SUPABASE_ENABLED } from './hooks/useAuth.js'
import {
  fetchPosts, createPost, deletePost, toggleLike,
  fetchComments, addComment, deleteComment, reportPost,
  subscribeToNewPosts,
} from './lib/supabaseHelpers.js'
import { TITLES } from './data/titles.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7)  return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function StarDisplay({ rating }) {
  if (!rating) return null
  return (
    <span className="text-[11px] leading-none">
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ color: n <= rating ? '#F5C518' : '#333' }}>★</span>
      ))}
    </span>
  )
}

function Avatar({ user, size = 8 }) {
  const cls = `w-${size} h-${size} rounded-full flex-shrink-0 flex items-center justify-center bg-[#1e1e1e] border border-[#2a2a2a] overflow-hidden`
  if (!user) return <div className={cls}><span className="text-sm">👤</span></div>
  const av = user.avatar
  if (av?.startsWith('data:') || av?.startsWith('http')) {
    return <div className={cls}><img src={av} alt="" className="w-full h-full object-cover"/></div>
  }
  return <div className={cls}><span className={size >= 8 ? 'text-base' : 'text-xs'}>{av ?? '👤'}</span></div>
}

const TYPE_META = {
  review:   { label: 'REVIEW',   color: 'text-[#E81C2E]', bg: 'bg-red-950',    border: 'border-[#E81C2E]/25' },
  progress: { label: 'PROGRESS', color: 'text-[#F5C518]', bg: 'bg-yellow-950', border: 'border-[#F5C518]/25' },
  opinion:  { label: 'OPINION',  color: 'text-blue-400',  bg: 'bg-blue-950',   border: 'border-blue-400/25' },
}

function TypeBadge({ type }) {
  const m = TYPE_META[type] ?? TYPE_META.opinion
  return (
    <span className={`inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest ${m.bg} ${m.border} ${m.color}`}>
      {m.label}
    </span>
  )
}

// ── SupabaseRequired ──────────────────────────────────────────────────────────

function SupabaseRequired() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-3xl">
        💬
      </div>
      <div>
        <h2 className="font-bebas text-2xl tracking-[0.12em] text-white mb-2">COMMUNITY FEED</h2>
        <p className="text-[13px] text-[#555] leading-relaxed">
          The community feed requires Supabase.<br/>
          Add your <span className="text-[#F5C518] font-mono text-[11px]">VITE_SUPABASE_URL</span> and{' '}
          <span className="text-[#F5C518] font-mono text-[11px]">VITE_SUPABASE_ANON_KEY</span> to{' '}
          <span className="text-[#F5C518] font-mono text-[11px]">.env.local</span> and restart the dev server.
        </p>
      </div>
    </div>
  )
}

// ── CommentThread ─────────────────────────────────────────────────────────────

function CommentThread({ postId, userId, commentCount }) {
  const [open,     setOpen]     = useState(false)
  const [comments, setComments] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [text,     setText]     = useState('')
  const [sending,  setSending]  = useState(false)
  const inputRef = useRef(null)

  async function load() {
    if (loading) return
    setLoading(true)
    const { data } = await fetchComments(postId)
    setComments(data ?? [])
    setLoading(false)
  }

  function toggle() {
    if (!open) load()
    setOpen(o => !o)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  async function submit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || !userId) return
    setSending(true)
    const { data, error } = await addComment(postId, userId, trimmed)
    if (!error && data) {
      setComments(prev => [...prev, data])
      setText('')
    }
    setSending(false)
  }

  async function handleDeleteComment(commentId) {
    await deleteComment(commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  const count = commentCount ?? comments.length

  return (
    <div>
      <button
        onClick={toggle}
        className="text-[11px] text-[#555] hover:text-[#888] transition-colors flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
        </svg>
        {count > 0 ? `${count} comment${count !== 1 ? 's' : ''}` : 'Comment'}
      </button>

      {open && (
        <div className="mt-3 space-y-2.5 border-t border-[#1a1a1a] pt-3">
          {loading && <p className="text-[11px] text-[#444]">Loading…</p>}
          {comments.map(c => (
            <div key={c.id} className="flex gap-2 group">
              <Avatar user={c.author} size={6}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-[#888]">{c.author?.username ?? 'User'}</span>
                  <span className="text-[10px] text-[#444]">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-[12px] text-[#bbb] leading-relaxed mt-0.5 break-words">{c.content}</p>
              </div>
              {c.author?.id === userId && (
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="text-[#333] hover:text-[#E81C2E] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
          {userId && (
            <form onSubmit={submit} className="flex gap-2 mt-2">
              <input
                ref={inputRef}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Add a comment…"
                maxLength={500}
                className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-[12px] text-white placeholder-[#333] focus:outline-none focus:border-[#E81C2E]/40 transition-colors"
              />
              <button
                type="submit"
                disabled={!text.trim() || sending}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bebas tracking-widest bg-[#E81C2E] text-white disabled:opacity-30 transition-opacity"
              >
                {sending ? '…' : 'POST'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

// ── PostCard ──────────────────────────────────────────────────────────────────

function PostCard({ post, userId, isFriend, onDelete, onLikeToggle }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [reported, setReported]           = useState(false)
  const [reportDone, setReportDone]       = useState(false)

  const isOwn   = post.author?.id === userId
  const likes   = post.likes ?? []
  const liked   = likes.some(l => l.user_id === userId)
  const likeCount = likes.length
  const commentCount = Array.isArray(post.comments)
    ? (post.comments[0]?.count ?? post.comments.length)
    : 0

  const titleObj = post.title_id ? TITLES.find(t => t.id === post.title_id) : null

  async function handleReport() {
    if (reportDone) return
    await reportPost(post.id, userId)
    setReportDone(true)
    setReported(false)
  }

  return (
    <div className={[
      'bg-[#0f0f0f] border rounded-2xl p-4 transition-all',
      isFriend ? 'border-[#2a2a1a]' : 'border-[#1a1a1a]',
    ].join(' ')}>

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar user={post.author} size={8}/>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
            <span className="text-[13px] font-semibold text-white truncate">
              {post.author?.username ?? 'Unknown'}
            </span>
            {isFriend && (
              <span className="text-[9px] px-1.5 py-[1px] rounded bg-yellow-950 text-[#F5C518] border border-[#F5C518]/20 font-bold tracking-widest">
                FRIEND
              </span>
            )}
            <TypeBadge type={post.type}/>
            {post.visibility === 'friends' && (
              <span className="text-[9px] px-1.5 py-[1px] rounded bg-[#1a1a1a] text-[#555] border border-[#2a2a2a] font-bold tracking-widest">
                🔒 FRIENDS
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#444]">{timeAgo(post.created_at)}</span>
        </div>
        {/* Actions menu */}
        {isOwn ? (
          <div className="flex-shrink-0">
            {confirmDelete ? (
              <div className="flex gap-2 items-center">
                <button onClick={() => setConfirmDelete(false)} className="text-[10px] text-[#555] hover:text-white">Cancel</button>
                <button
                  onClick={() => { onDelete(post.id); setConfirmDelete(false) }}
                  className="text-[10px] text-[#E81C2E] border border-[#E81C2E]/30 rounded-lg px-2 py-0.5 hover:bg-[#E81C2E]/10"
                >
                  Delete
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="text-[#333] hover:text-[#E81C2E] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="flex-shrink-0">
            {reported ? (
              <div className="flex gap-2 items-center">
                <button onClick={() => setReported(false)} className="text-[10px] text-[#555] hover:text-white">Cancel</button>
                <button
                  onClick={handleReport}
                  className="text-[10px] text-[#E81C2E] border border-[#E81C2E]/30 rounded-lg px-2 py-0.5 hover:bg-[#E81C2E]/10"
                >
                  {reportDone ? '✓ Reported' : 'Report'}
                </button>
              </div>
            ) : reportDone ? (
              <span className="text-[10px] text-[#555]">✓ Reported</span>
            ) : (
              <button onClick={() => setReported(true)} className="text-[#2a2a2a] hover:text-[#555] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Title reference (for reviews) */}
      {titleObj && (
        <div className="flex items-center gap-2 mb-2 bg-[#151515] border border-[#1e1e1e] rounded-xl px-3 py-1.5">
          <span className="text-[10px] text-[#555] uppercase tracking-widest">Reviewing</span>
          <span className="text-[12px] text-white font-medium truncate flex-1">{titleObj.title}</span>
          {post.rating && <StarDisplay rating={post.rating}/>}
        </div>
      )}

      {/* Content */}
      <p className="text-[13px] text-[#ccc] leading-relaxed mb-3 break-words whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-[#141414]">
        {/* Like */}
        <button
          onClick={() => onLikeToggle(post.id)}
          className={`flex items-center gap-1.5 text-[11px] transition-colors ${
            liked ? 'text-[#E81C2E]' : 'text-[#555] hover:text-[#888]'
          }`}
        >
          <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
          </svg>
          {likeCount > 0 && likeCount}
        </button>

        {/* Comments */}
        <CommentThread postId={post.id} userId={userId} commentCount={commentCount}/>
      </div>
    </div>
  )
}

// ── CreatePostForm ────────────────────────────────────────────────────────────

function CreatePostForm({ userId, onCreated }) {
  const [open,       setOpen]       = useState(false)
  const [type,       setType]       = useState('review')
  const [content,    setContent]    = useState('')
  const [titleId,    setTitleId]    = useState('')
  const [rating,     setRating]     = useState(0)
  const [visibility, setVisibility] = useState('public')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)

  const reviewableTitles = TITLES.filter(t => !t.comingSoon)

  async function submit(e) {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    setSubmitting(true)
    setError(null)
    const { data, error: err } = await createPost({
      userId,
      type,
      content: trimmed,
      titleId: type === 'review' && titleId ? Number(titleId) : null,
      rating:  type === 'review' && rating  ? rating           : null,
      visibility,
    })
    setSubmitting(false)
    if (err) { setError('Failed to post. Try again.'); return }
    onCreated?.(data)
    setOpen(false)
    setContent('')
    setTitleId('')
    setRating(0)
    setType('review')
    setVisibility('public')
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl px-4 py-3 text-[#444] hover:border-[#2a2a2a] hover:text-[#666] transition-all"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"/>
        </svg>
        <span className="text-sm">Share a review, progress update, or opinion…</span>
      </button>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-4 space-y-3"
      style={{ animation: 'slideUp 0.2s ease both' }}
    >
      {/* Type selector */}
      <div className="flex gap-2">
        {['review', 'progress', 'opinion'].map(t => (
          <button
            key={t} type="button"
            onClick={() => setType(t)}
            className={[
              'flex-1 py-1.5 rounded-xl text-[11px] font-bold tracking-widest uppercase border transition-all',
              type === t ? `${TYPE_META[t].bg} ${TYPE_META[t].border} ${TYPE_META[t].color}` : 'bg-[#151515] border-[#1e1e1e] text-[#444]',
            ].join(' ')}
          >
            {TYPE_META[t].label}
          </button>
        ))}
      </div>

      {/* Review-specific fields */}
      {type === 'review' && (
        <>
          <select
            value={titleId}
            onChange={e => setTitleId(e.target.value)}
            className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#E81C2E]/40 transition-colors"
          >
            <option value="">Select a title (optional)</option>
            {reviewableTitles.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          {/* Star rating */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#555] uppercase tracking-widest">Rating</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n} type="button"
                  onClick={() => setRating(prev => prev === n ? 0 : n)}
                  className="text-xl transition-transform hover:scale-110 active:scale-95"
                >
                  <span style={{ color: n <= rating ? '#F5C518' : '#2a2a2a' }}>★</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Content */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={
          type === 'review'   ? 'What did you think?'
          : type === 'progress' ? "Share your milestone — e.g. 'Just finished the Infinity Saga!'"
          : 'Share your Marvel opinion…'
        }
        rows={3}
        maxLength={1000}
        className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder-[#333] focus:outline-none focus:border-[#E81C2E]/40 resize-none transition-colors"
      />

      {/* Footer */}
      <div className="flex items-center gap-3">
        {/* Visibility */}
        <button
          type="button"
          onClick={() => setVisibility(v => v === 'public' ? 'friends' : 'public')}
          className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
            visibility === 'friends'
              ? 'bg-blue-950 border-blue-500/30 text-blue-400'
              : 'bg-[#151515] border-[#2a2a2a] text-[#555] hover:text-[#888]'
          }`}
        >
          {visibility === 'public' ? (
            <>🌐 <span>Public</span></>
          ) : (
            <>🔒 <span>Friends only</span></>
          )}
        </button>

        <div className="flex-1"/>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[11px] text-[#555] hover:text-white transition-colors px-3 py-1.5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="px-4 py-1.5 rounded-xl font-bebas text-base tracking-widest bg-[#E81C2E] text-white disabled:opacity-30 hover:shadow-[0_0_10px_rgba(232,28,46,0.4)] transition-all"
        >
          {submitting ? 'Posting…' : 'POST'}
        </button>
      </div>
      {error && <p className="text-[11px] text-[#E81C2E]">{error}</p>}
    </form>
  )
}

// ── Main CommunityFeed ────────────────────────────────────────────────────────

export default function CommunityFeed({ user, friendIds = [] }) {
  if (!SUPABASE_ENABLED) return <SupabaseRequired/>

  const [posts,       setPosts]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor,      setCursor]      = useState(null)
  const [hasMore,     setHasMore]     = useState(true)
  const [newCount,    setNewCount]    = useState(0)
  const friendSet = new Set(friendIds)
  const PAGE = 20

  const [fetchError, setFetchError] = useState(false)

  const loadPosts = useCallback(async (reset = false) => {
    if (reset) { setLoading(true); setFetchError(false) }
    else setLoadingMore(true)
    const { data, error } = await fetchPosts({ cursor: reset ? null : cursor, limit: PAGE })
    if (error) {
      setFetchError(true)
    } else if (data) {
      setFetchError(false)
      const sorted = sortPosts(data, friendSet)
      if (reset) {
        setPosts(sorted)
        setCursor(data.length ? data[data.length - 1].created_at : null)
        setHasMore(data.length === PAGE)
      } else {
        setPosts(prev => mergePosts(prev, sorted, friendSet))
        setCursor(data.length ? data[data.length - 1].created_at : null)
        setHasMore(data.length === PAGE)
      }
    }
    if (reset) setLoading(false); else setLoadingMore(false)
  }, [cursor, friendIds]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadPosts(true) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Real-time subscription
  useEffect(() => {
    const unsub = subscribeToNewPosts(payload => {
      const newPost = payload.new
      if (!newPost) return
      // If we're at the top of the feed, prepend; otherwise show "New posts" banner
      setPosts(prev => {
        if (prev.length === 0 || !cursor) return [newPost, ...prev]
        // Check if this is the author's own post (just created)
        if (newPost.user_id === user?.id) return [newPost, ...prev]
        setNewCount(n => n + 1)
        return prev
      })
    })
    return unsub
  }, [user?.id, cursor])

  function sortPosts(list, fSet) {
    return [...list].sort((a, b) => {
      const aFriend = fSet.has(a.author?.id)
      const bFriend = fSet.has(b.author?.id)
      if (aFriend && !bFriend) return -1
      if (!aFriend && bFriend) return 1
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }

  function mergePosts(existing, incoming, fSet) {
    const ids = new Set(existing.map(p => p.id))
    const merged = [...existing, ...incoming.filter(p => !ids.has(p.id))]
    return sortPosts(merged, fSet)
  }

  function handleNewPostCreated(newPost) {
    if (!newPost) return
    setPosts(prev => [newPost, ...prev])
  }

  async function handleLikeToggle(postId) {
    if (!user) return
    // Optimistic
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const liked = p.likes?.some(l => l.user_id === user.id)
      return {
        ...p,
        likes: liked
          ? p.likes.filter(l => l.user_id !== user.id)
          : [...(p.likes ?? []), { user_id: user.id }],
      }
    }))
    await toggleLike(postId, user.id)
  }

  async function handleDelete(postId) {
    await deletePost(postId)
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  function handleShowNew() {
    loadPosts(true)
    setNewCount(0)
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-28">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bebas text-2xl tracking-[0.12em] text-white leading-none">COMMUNITY</h2>
          <p className="text-[10px] text-[#444] tracking-wide mt-0.5">Marvel fans sharing their journey</p>
        </div>
        <button
          onClick={() => loadPosts(true)}
          className="text-[#444] hover:text-white transition-colors p-2"
          title="Refresh"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
        </button>
      </div>

      {/* Create post */}
      {user && (
        <div className="mb-5">
          <CreatePostForm userId={user.id} onCreated={handleNewPostCreated}/>
        </div>
      )}
      {!user && (
        <div className="mb-5 bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-4 text-center">
          <p className="text-[12px] text-[#555]">Sign in to post and interact with the community</p>
        </div>
      )}

      {/* "New posts available" banner */}
      {newCount > 0 && (
        <button
          onClick={handleShowNew}
          className="w-full mb-4 py-2.5 rounded-xl bg-[#E81C2E]/10 border border-[#E81C2E]/30 text-[12px] text-[#E81C2E] font-semibold hover:bg-[#E81C2E]/15 transition-all"
        >
          ↑ {newCount} new post{newCount !== 1 ? 's' : ''} — tap to refresh
        </button>
      )}

      {/* Feed */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 mt-16 text-[#333]">
          <div className="w-6 h-6 rounded-full border-2 border-[#E81C2E]/40 border-t-[#E81C2E] animate-spin"/>
          <p className="text-[12px]">Loading posts…</p>
        </div>
      ) : fetchError ? (
        <div className="flex flex-col items-center mt-16 gap-4 text-center px-4">
          <span className="text-4xl">⚠️</span>
          <div>
            <p className="text-[#888] text-sm font-semibold mb-1">Couldn't load posts</p>
            <p className="text-[#444] text-[12px] leading-relaxed">
              Check that your Supabase credentials are correct and the database tables have been created.
            </p>
          </div>
          <button
            onClick={() => loadPosts(true)}
            className="px-4 py-2 rounded-xl text-[12px] text-[#E81C2E] border border-[#E81C2E]/30 hover:bg-[#E81C2E]/10 transition-all"
          >
            Try again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center mt-16 gap-4 text-center">
          <span className="text-4xl">💬</span>
          <div>
            <p className="text-[#555] text-sm mb-1">No posts yet</p>
            <p className="text-[#333] text-[12px]">Be the first to share your Marvel journey!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              userId={user?.id}
              isFriend={friendSet.has(post.author?.id)}
              onDelete={handleDelete}
              onLikeToggle={handleLikeToggle}
            />
          ))}
          {hasMore && !loadingMore && (
            <button
              onClick={() => loadPosts(false)}
              className="w-full py-3 rounded-xl text-[12px] text-[#555] hover:text-white border border-[#1e1e1e] hover:border-[#2a2a2a] transition-all"
            >
              Load more
            </button>
          )}
          {loadingMore && (
            <div className="flex justify-center py-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#E81C2E]/40 border-t-[#E81C2E] animate-spin"/>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
