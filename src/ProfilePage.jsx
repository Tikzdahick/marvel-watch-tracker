import { useState, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { calcStreak, calcLongestStreak } from './data/achievements.js'
import { LOCK_TIERS, LOCK_TIER_ORDER } from './data/locks.js'
import { SUPABASE_ENABLED, signOut, changePassword } from './hooks/useAuth.js'
import { AvatarDisplay, MARVEL_AVATARS } from './AvatarDisplay.jsx'
import TriviaRankBadge from './TriviaRankBadge.jsx'
import XPProgressBar from './XPProgressBar.jsx'
import { BADGES, BADGE_MAP } from './data/badges.js'
import { PERSONALITY_MAP } from './data/marvelPersonality.js'
import { BANNER_MAP } from './ProfileBannerPicker.jsx'

const LIST_OPTS = [
  { id: 'rookie',   label: 'Rookie',   count: '77' },
  { id: 'hero',     label: 'Hero',     count: '93' },
  { id: 'avenger',  label: 'Avenger',  count: '100' },
  { id: 'infinity', label: 'Infinity', count: '107' },
]
const PACE_OPTS = [
  { id: 'casual',     label: 'Casual' },
  { id: 'assembling', label: 'Assembling' },
  { id: 'avenger',    label: 'Avenger' },
  { id: 'thanos',     label: 'Thanos Mode' },
]

function StatCard({ label, value, sub, color = 'text-white' }) {
  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-3 py-3 flex flex-col gap-0.5">
      <span className={`font-bebas text-2xl leading-none tracking-wider ${color}`}>{value}</span>
      {sub && <span className="text-[9px] text-[#444] uppercase tracking-wider">{sub}</span>}
      <span className="text-[9px] text-[#555] uppercase tracking-widest mt-0.5">{label}</span>
    </div>
  )
}

export default function ProfilePage({
  profile,
  config,
  stats,          // { watchedCount, total, remaining, pct, watchHistory, loginDates, unlockedAchievements }
  lockPins,       // { pg13: '1234'|null, ... }
  onUpdateProfile,
  onUpdateConfig,
  onClose,
  onResetOnboarding,
  onSetupLock,    // (tierKey) → void — open PIN setup modal
  onDisableLock,  // (tierKey) → void — disable a lock (verifies current PIN first)
  onChangeLockPin,// (tierKey) → void — change a PIN
  onSignOut,      // () → void — called after confirmed sign out
  onShowFriends,  // () → void — open Friends page
  userId,         // string | undefined — current auth user id
  triviaState = {},
  onOpenLeaderboard,
  xp = 0,
  earnedBadges = {},
  personalityType = null,
  profileBanner = 'none',
  onOpenBadges,
  onOpenPersonality,
  onOpenYearInReview,
  onOpenBannerPicker,
  onDeleteAccount,  // async (email) => void — clear all data and sign out
  userEmail,        // string | undefined — pre-fill email confirmation
}) {
  const [editing,         setEditing]         = useState(false)
  const [confirmSignOut,  setConfirmSignOut]   = useState(false)
  const [signingOut,      setSigningOut]       = useState(false)
  const [showDeleteModal, setShowDeleteModal]  = useState(false)
  const [deleteEmail,     setDeleteEmail]      = useState('')
  const [deleting,        setDeleting]         = useState(false)
  const [deleteError,     setDeleteError]      = useState(null)

  // Change-password state
  const [showChangePw, setShowChangePw] = useState(false)
  const [currentPw,    setCurrentPw]   = useState('')
  const [newPw,        setNewPw]       = useState('')
  const [confirmPw,    setConfirmPw]   = useState('')
  const [pwLoading,    setPwLoading]   = useState(false)
  const [pwError,      setPwError]     = useState(null)
  const [pwSuccess,    setPwSuccess]   = useState(false)

  // Edit state — initialised from current values
  const [editName,   setEditName]   = useState(profile.name)
  const [editAvatar, setEditAvatar] = useState(profile.avatar)
  const [editPhoto,  setEditPhoto]  = useState(profile.isCustomPhoto ? profile.avatar : null)
  const [editList,   setEditList]   = useState(config.listSize)
  const [editPace,   setEditPace]   = useState(config.pace)
  const fileRef = useRef(null)

  // Streak calculations
  const watchDates  = useMemo(() => Object.keys(stats.watchHistory ?? {}), [stats.watchHistory])
  const watchStreak  = useMemo(() => calcStreak(watchDates),        [watchDates])
  const watchBest    = useMemo(() => calcLongestStreak(watchDates), [watchDates])
  const loginStreak  = useMemo(() => calcStreak(stats.loginDates ?? []),        [stats.loginDates])
  const loginBest    = useMemo(() => calcLongestStreak(stats.loginDates ?? []), [stats.loginDates])

  const LIST_LABELS = { rookie: 'Rookie', hero: 'Hero', avenger: 'Avenger', infinity: 'Infinity' }
  const PACE_LABELS = { casual: 'Casual', assembling: 'Assembling', avenger: 'Avenger', thanos: 'Thanos Mode' }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setEditPhoto(ev.target.result)
      setEditAvatar(ev.target.result)
    }
    reader.readAsDataURL(file)
    e.target.value = '' // reset so same file can be re-selected
  }

  function handleSave() {
    const newAvatar = editPhoto ?? editAvatar
    onUpdateProfile({
      name: editName.trim() || profile.name,
      avatar: newAvatar,
      isCustomPhoto: !!editPhoto,
    })
    onUpdateConfig({ listSize: editList, pace: editPace })
    setEditing(false)
  }

  function handleCancel() {
    setEditName(profile.name)
    setEditAvatar(profile.avatar ?? null)
    setEditPhoto(profile.isCustomPhoto ? profile.avatar : null)
    setEditList(config.listSize)
    setEditPace(config.pace)
    setEditing(false)
  }

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      onSignOut?.()
    } catch {}
    setSigningOut(false)
    setConfirmSignOut(false)
  }

  async function handleChangePw() {
    setPwError(null)
    setPwSuccess(false)
    if (!SUPABASE_ENABLED) { setPwError('Password changes require a cloud account. Enable Supabase to use this feature.'); return }
    if (newPw !== confirmPw) { setPwError('New passwords do not match'); return }
    if (newPw.length < 6)    { setPwError('Password must be at least 6 characters'); return }
    setPwLoading(true)
    try {
      await changePassword(currentPw, newPw)
      setPwSuccess(true)
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(() => { setShowChangePw(false); setPwSuccess(false) }, 1500)
    } catch (err) {
      setPwError(err?.message ?? 'Failed to update password. Please try again.')
    } finally {
      setPwLoading(false)
    }
  }

  async function handleDeleteAccount() {
    if (!deleteEmail.trim()) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await onDeleteAccount?.(deleteEmail.trim())
    } catch (err) {
      setDeleteError(err?.message ?? 'Failed to delete account. Please try again.')
      setDeleting(false)
    }
  }

  const displayAvatar = editPhoto ?? editAvatar

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col overflow-y-auto"
      style={{ animation: 'fadeIn 0.25s ease both' }}
    >
      {/* ── Header bar ── */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-[#555] hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="font-bebas text-2xl tracking-[0.15em] text-white leading-none flex-1">
          PROFILE
        </h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-1.5 rounded-lg border border-[#E81C2E]/40 text-[#E81C2E] text-xs font-semibold hover:bg-[#E81C2E]/10 transition-colors"
          >
            EDIT
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg border border-[#222] text-[#555] text-xs font-semibold hover:text-white transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={!editName.trim()}
              className="px-4 py-1.5 rounded-lg bg-[#E81C2E] text-white text-xs font-semibold disabled:opacity-40 hover:shadow-[0_0_12px_rgba(232,28,46,0.4)] transition-all"
            >
              SAVE
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 px-4 pb-16 max-w-lg mx-auto w-full space-y-5">

        {/* ── Profile Banner ── */}
        {(() => {
          const banner = BANNER_MAP?.[profileBanner ?? 'none'] ?? null
          if (!banner || banner.id === 'none') return null
          return (
            <div
              className="rounded-2xl h-20 flex items-center justify-between px-4 -mb-2 relative overflow-hidden cursor-pointer"
              style={banner.style}
              onClick={onOpenBannerPicker}
            >
              <span className="text-3xl opacity-40">{banner.emoji}</span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Tap to change</span>
            </div>
          )
        })()}

        {/* ── Avatar + Name card ── */}
        <div
          className="rounded-2xl border border-[#1e1e1e] p-5 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #120000 0%, #0f0f0f 100%)' }}
        >
          {/* Avatar — same component whether editing or not */}
          <AvatarDisplay
            avatar={editing ? displayAvatar : profile.avatar}
            name={profile.name}
            size="lg"
          />

          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                maxLength={24}
                autoFocus
                className="w-full bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl px-3 py-2.5 text-white text-base focus:outline-none focus:border-[#E81C2E]/60 transition-colors mb-2"
                placeholder="Your name…"
              />
            ) : (
              <div className="font-bebas text-3xl tracking-wide text-white leading-none mb-1 truncate">
                {profile.name}
              </div>
            )}
            <div className="text-[11px] text-[#444] uppercase tracking-widest">
              {LIST_LABELS[config.listSize]} · {PACE_LABELS[config.pace]}
            </div>
            {/* Trivia rank badge */}
            <div className="flex items-center gap-2 mt-2">
              <TriviaRankBadge points={triviaState.points ?? 0} size="sm" showLabel/>
              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="text-[9px] text-[#555] hover:text-[#E81C2E] transition-colors uppercase tracking-widest"
                >
                  Leaderboard →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── XP Level ── */}
        <XPProgressBar xp={xp}/>

        {/* ── Badges Showcase ── */}
        {(() => {
          const earnedList = Object.entries(earnedBadges)
            .filter(([, v]) => v.unlocked)
            .map(([id]) => BADGE_MAP[id])
            .filter(Boolean)
            .slice(0, 3)
          const earnedCount = Object.values(earnedBadges).filter(v => v.unlocked).length
          return (
            <div
              className="rounded-2xl p-4"
              style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-bebas text-sm tracking-widest text-[#F5C518]">BADGES</div>
                <button
                  onClick={onOpenBadges}
                  className="text-[9px] text-[#555] hover:text-[#E81C2E] transition-colors uppercase tracking-widest"
                >
                  View All ({earnedCount}) →
                </button>
              </div>
              {earnedList.length === 0 ? (
                <p className="text-[#444] text-xs">Watch titles and complete challenges to earn badges!</p>
              ) : (
                <div className="flex gap-3">
                  {earnedList.map(badge => (
                    <div key={badge.id} className="flex flex-col items-center gap-1 flex-1">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="text-[9px] text-[#555] text-center leading-snug">{badge.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* ── Marvel Personality ── */}
        <button
          onClick={onOpenPersonality}
          className="w-full rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
          style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
        >
          {personalityType && PERSONALITY_MAP[personalityType] ? (() => {
            const type = PERSONALITY_MAP[personalityType]
            return (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: type.gradient ?? type.color + '22', border: `1px solid ${type.color}44` }}
                >
                  {type.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bebas text-sm tracking-widest" style={{ color: type.color }}>{type.name}</div>
                  <div className="text-[10px] text-[#555]">{type.subtitle}</div>
                </div>
                <span className="text-[10px] text-[#444]">→</span>
              </div>
            )
          })() : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-[#1a1a1a]">🎭</div>
              <div className="flex-1">
                <div className="font-bebas text-sm tracking-widest text-white">MARVEL PERSONALITY</div>
                <div className="text-[10px] text-[#555]">Discover your Marvel hero type</div>
              </div>
              <span className="text-[10px] text-[#444]">→</span>
            </div>
          )}
        </button>

        {/* ── Year in Review ── */}
        <button
          onClick={onOpenYearInReview}
          className="w-full rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
          style={{ background: '#0f0000', border: '1px solid rgba(232,28,46,0.15)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎬</span>
            <div className="flex-1">
              <div className="font-bebas text-sm tracking-widest text-white">YEAR IN REVIEW</div>
              <div className="text-[10px] text-[#555]">{new Date().getFullYear()} Marvel recap</div>
            </div>
            <span className="text-[10px] text-[#E81C2E]">View →</span>
          </div>
        </button>

        {/* ── Change Banner ── */}
        <button
          onClick={onOpenBannerPicker}
          className="w-full rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
          style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🖼️</span>
            <div className="flex-1">
              <div className="font-bebas text-sm tracking-widest text-white">PROFILE BANNER</div>
              <div className="text-[10px] text-[#555]">{BANNER_MAP?.[profileBanner]?.label ?? 'None'} — tap to change</div>
            </div>
            <span className="text-[10px] text-[#444]">→</span>
          </div>
        </button>

        {/* ── Avatar picker (editing only) ── */}
        {editing && (
          <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f] space-y-4">
            <div className="text-[10px] text-[#555] uppercase tracking-widest">Change Avatar</div>

            {/* Photo upload row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-[12px] font-semibold text-white border border-[#E81C2E]/40 bg-[#E81C2E]/10 px-4 py-2.5 rounded-xl hover:bg-[#E81C2E]/20 transition-colors"
              >
                <svg className="w-4 h-4 text-[#E81C2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
                </svg>
                Upload Photo
              </button>
              {editPhoto && (
                <button
                  onClick={() => { setEditPhoto(null); setEditAvatar(null) }}
                  className="text-[11px] text-[#555] hover:text-[#E81C2E] transition-colors"
                >
                  Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1e1e1e]"/>
              <span className="text-[9px] text-[#444] uppercase tracking-widest">or choose a character</span>
              <div className="flex-1 h-px bg-[#1e1e1e]"/>
            </div>

            {/* Marvel character grid */}
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-0.5">
              {MARVEL_AVATARS.map(char => {
                const avatarKey  = `marvel-${char.id}`
                const isSelected = !editPhoto && editAvatar === avatarKey
                return (
                  <button
                    key={char.id}
                    onClick={() => { setEditAvatar(avatarKey); setEditPhoto(null) }}
                    title={char.label}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all active:scale-95"
                    style={isSelected ? {
                      background: char.ring + '18',
                      border: `2px solid ${char.ring}70`,
                      boxShadow: `0 0 12px ${char.ring}30`,
                    } : {
                      background: '#111',
                      border: '1.5px solid #1e1e1e',
                    }}
                  >
                    {/* Mini avatar */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bebas text-lg flex-shrink-0"
                      style={{ background: char.bg, color: char.color }}
                    >
                      {char.symbol}
                    </div>
                    <span
                      className="text-[9px] leading-none text-center w-full truncate px-0.5"
                      style={{ color: isSelected ? char.ring : '#555' }}
                    >
                      {char.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Clear / use initials */}
            <button
              onClick={() => { setEditAvatar(null); setEditPhoto(null) }}
              className="w-full py-2.5 rounded-xl text-[11px] text-[#555] border border-[#1e1e1e] hover:text-[#888] hover:border-[#333] transition-all"
            >
              Use initials instead
            </button>
          </div>
        )}

        {/* ── Stats grid ── */}
        <div>
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Stats</div>
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Watched"   value={stats.watchedCount} color="text-[#E81C2E]"/>
            <StatCard label="Remaining" value={stats.remaining}    color="text-white"/>
            <StatCard label="Complete"  value={`${stats.pct}%`}    color="text-[#F5C518]"/>
          </div>
        </div>

        {/* ── Streak grid ── */}
        <div>
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Streaks</div>
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="Watch Streak"
              value={`${watchStreak}d`}
              sub={`Best: ${watchBest}d`}
              color="text-[#E81C2E]"
            />
            <StatCard
              label="Login Streak"
              value={`${loginStreak}d`}
              sub={`Best: ${loginBest}d`}
              color="text-[#F5C518]"
            />
          </div>
        </div>

        {/* ── Achievements ── */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5C518]/10 flex items-center justify-center text-xl flex-shrink-0">
            🏆
          </div>
          <div>
            <div className="font-bebas text-2xl text-[#F5C518] leading-none">{stats.unlockedAchievements}</div>
            <div className="text-[9px] text-[#555] uppercase tracking-widest">Achievements Unlocked</div>
          </div>
        </div>

        {/* ── List size & Pace (editing) ── */}
        {editing && (
          <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f] space-y-4">
            <div>
              <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">List Size</div>
              <div className="grid grid-cols-4 gap-2">
                {LIST_OPTS.map(o => (
                  <button key={o.id} onClick={() => setEditList(o.id)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      editList === o.id
                        ? 'bg-[#E81C2E] border-[#E81C2E] text-white'
                        : 'bg-[#151515] border-[#222] text-[#555] hover:text-white'
                    }`}>
                    {o.label}<br/><span className="text-[10px] opacity-60">{o.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Pace</div>
              <div className="grid grid-cols-2 gap-2">
                {PACE_OPTS.map(o => (
                  <button key={o.id} onClick={() => setEditPace(o.id)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      editPace === o.id
                        ? 'bg-[#E81C2E] border-[#E81C2E] text-white'
                        : 'bg-[#151515] border-[#222] text-[#555] hover:text-white'
                    }`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Content Locks ── */}
        <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f]">
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Content Locks</div>
          <p className="text-[11px] text-[#444] mb-3 leading-relaxed">
            Set a 4-digit PIN to restrict access to age-rated content. Unlocking in a session carries through until you close the app.
          </p>
          <div className="space-y-0">
            {LOCK_TIER_ORDER.map(tierKey => {
              const tier    = LOCK_TIERS[tierKey]
              const hasPin  = !!(lockPins?.[tierKey])
              return (
                <div key={tierKey} className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${tier.bgColor} border ${tier.borderColor}`}>
                      {tier.emoji}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{tier.label}</div>
                      <div className="text-[10px] text-[#555]">{tier.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasPin && (
                      <button
                        onClick={() => onChangeLockPin?.(tierKey)}
                        className="text-[10px] text-[#555] hover:text-white border border-[#222] px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Change
                      </button>
                    )}
                    <button
                      onClick={() => hasPin ? onDisableLock?.(tierKey) : onSetupLock?.(tierKey)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        hasPin
                          ? 'bg-red-950/50 border-[#E81C2E]/30 text-[#E81C2E]'
                          : 'bg-[#151515] border-[#222] text-[#555] hover:text-white'
                      }`}
                    >
                      {hasPin ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Reset Onboarding ── */}
        <div className="pt-2 border-t border-[#161616] space-y-2">
          <button
            onClick={onResetOnboarding}
            className="w-full py-3 rounded-xl border border-[#1e1e1e] text-[#444] text-xs font-semibold tracking-widest hover:border-[#333] hover:text-[#666] transition-all uppercase"
          >
            ↩ Redo Onboarding
          </button>

          {/* Friends — only shown when Supabase auth is active */}
          {SUPABASE_ENABLED && (
            <button
              onClick={onShowFriends}
              className="w-full py-3 rounded-xl border border-[#2a2a2a] text-[#888] text-xs font-semibold tracking-widest hover:border-[#3a3a3a] hover:text-white transition-all uppercase flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
              </svg>
              Friends
            </button>
          )}

          {/* ── Change Password ── */}
          <div className="rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] overflow-hidden">
              {/* Toggle row */}
              <button
                onClick={() => {
                  setShowChangePw(v => !v)
                  setPwError(null); setPwSuccess(false)
                  setCurrentPw(''); setNewPw(''); setConfirmPw('')
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#111] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z"/>
                  </svg>
                  <span className="text-xs font-semibold tracking-widest text-[#666] uppercase">Change Password</span>
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-[#444] transition-transform duration-200 ${showChangePw ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7"/>
                </svg>
              </button>

              {/* Expanded form */}
              {showChangePw && (
                <div className="px-4 pb-4 pt-1 border-t border-[#1a1a1a] space-y-2.5">
                  <div className="pt-2 space-y-2">
                    {[
                      { label: 'Current password', value: currentPw, set: setCurrentPw, id: 'cur' },
                      { label: 'New password',      value: newPw,     set: setNewPw,     id: 'new' },
                      { label: 'Confirm new password', value: confirmPw, set: setConfirmPw, id: 'cfm' },
                    ].map(({ label, value, set, id }) => (
                      <div key={id} className="relative">
                        <input
                          type="password"
                          value={value}
                          onChange={e => { set(e.target.value); setPwError(null); setPwSuccess(false) }}
                          placeholder={label}
                          disabled={pwLoading}
                          className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#E81C2E]/50 transition-colors disabled:opacity-40"
                        />
                      </div>
                    ))}
                  </div>

                  {pwError && (
                    <p className="text-[11px] text-[#E81C2E] leading-snug">{pwError}</p>
                  )}
                  {pwSuccess && (
                    <p className="text-[11px] text-green-400 leading-snug">✓ Password updated!</p>
                  )}

                  <button
                    onClick={handleChangePw}
                    disabled={pwLoading || !currentPw || !newPw || !confirmPw}
                    className="w-full py-2.5 rounded-xl bg-[#E81C2E] text-white text-xs font-semibold tracking-widest uppercase disabled:opacity-40 hover:shadow-[0_0_12px_rgba(232,28,46,0.4)] transition-all"
                  >
                    {pwLoading ? '…' : 'Update Password'}
                  </button>
                </div>
              )}
            </div>

          {/* ── Sign Out ── */}
          <button
            onClick={() => setConfirmSignOut(true)}
            className="w-full py-3 rounded-xl border border-[#E81C2E]/20 text-[#E81C2E]/70 text-xs font-semibold tracking-widest hover:border-[#E81C2E]/40 hover:text-[#E81C2E] transition-all uppercase"
          >
            ⬡ Sign Out
          </button>

          {/* ── Delete Account ── */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-2.5 rounded-xl text-[#444] text-[10px] font-semibold tracking-widest hover:text-[#E81C2E]/60 transition-colors uppercase"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* ── Delete Account confirmation modal ── */}
      {showDeleteModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-xs bg-[#0f0f0f] border border-[#E81C2E]/30 rounded-2xl p-6"
            style={{ animation: 'completionPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-3xl mb-3 text-center">⚠️</div>
            <h3 className="font-bebas text-xl tracking-widest text-[#E81C2E] mb-1 text-center">DELETE ACCOUNT</h3>
            <p className="text-[#888] text-xs mb-4 leading-relaxed text-center">
              This will permanently delete{' '}
              <span className="text-white font-semibold">all your data</span> — posts,
              comments, progress, friends and achievements.{' '}
              <span className="text-[#E81C2E] font-semibold">This cannot be undone.</span>
            </p>

            <div className="mb-1">
              <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1.5">
                Type your email to confirm
              </div>
              <input
                type="email"
                value={deleteEmail}
                onChange={e => { setDeleteEmail(e.target.value); setDeleteError(null) }}
                placeholder={userEmail ?? 'your@email.com'}
                disabled={deleting}
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#E81C2E]/50 transition-colors disabled:opacity-40"
              />
            </div>

            {deleteError && (
              <p className="text-[11px] text-[#E81C2E] mb-3 mt-1">{deleteError}</p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteEmail(''); setDeleteError(null) }}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl text-[#555] text-sm border border-[#222] hover:text-white transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || !deleteEmail.trim()}
                className="flex-1 py-3 rounded-xl font-bebas text-lg tracking-widest bg-[#E81C2E] text-white hover:shadow-[0_0_12px_rgba(232,28,46,0.4)] transition-all disabled:opacity-40"
              >
                {deleting ? '…' : 'DELETE'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Sign Out confirmation modal ── */}
      {confirmSignOut && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => !signingOut && setConfirmSignOut(false)}
        >
          <div
            className="w-full max-w-xs bg-[#0f0f0f] border border-[#222] rounded-2xl p-6 text-center"
            style={{ animation: 'completionPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-3xl mb-3">👋</div>
            <h3 className="font-bebas text-xl tracking-widest text-white mb-2">SIGN OUT?</h3>
            <p className="text-[#555] text-sm mb-6 leading-relaxed">
              {SUPABASE_ENABLED
                ? 'Your progress is saved in the cloud. You can sign back in any time.'
                : 'This will close your session and return to the start screen.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSignOut(false)}
                disabled={signingOut}
                className="flex-1 py-3 rounded-xl text-[#555] text-sm border border-[#222] hover:text-white transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex-1 py-3 rounded-xl font-bebas text-lg tracking-widest bg-[#E81C2E] text-white hover:shadow-[0_0_12px_rgba(232,28,46,0.4)] transition-all disabled:opacity-50"
              >
                {signingOut ? '…' : 'SIGN OUT'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
