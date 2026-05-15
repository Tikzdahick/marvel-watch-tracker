import { useState, useRef, useMemo } from 'react'
import { calcStreak, calcLongestStreak } from './data/achievements.js'

const PRESET_AVATARS = [
  { emoji: '🤖', label: 'Iron Man' },
  { emoji: '🛡️', label: 'Cap' },
  { emoji: '⚡', label: 'Thor' },
  { emoji: '🕷️', label: 'Spider-Man' },
  { emoji: '🐾', label: 'Panther' },
  { emoji: '🌀', label: 'Strange' },
  { emoji: '💚', label: 'Hulk' },
  { emoji: '🕸️', label: 'Widow' },
  { emoji: '🏹', label: 'Hawkeye' },
  { emoji: '⭐', label: 'Marvel' },
  { emoji: '💜', label: 'Wanda' },
  { emoji: '🦅', label: 'Falcon' },
]

const LIST_OPTS = [
  { id: 'rookie',   label: 'Rookie',   count: '58' },
  { id: 'hero',     label: 'Hero',     count: '74' },
  { id: 'avenger',  label: 'Avenger',  count: '81' },
  { id: 'infinity', label: 'Infinity', count: '85' },
]
const PACE_OPTS = [
  { id: 'casual',     label: 'Casual' },
  { id: 'assembling', label: 'Assembling' },
  { id: 'avenger',    label: 'Avenger' },
  { id: 'thanos',     label: 'Thanos Mode' },
]

function AvatarDisplay({ avatar, size = 'lg' }) {
  const dim = size === 'lg' ? 'w-24 h-24 text-5xl rounded-3xl' : 'w-10 h-10 text-2xl rounded-xl'
  const isPhoto = avatar?.startsWith('data:')
  return (
    <div className={`${dim} flex items-center justify-center overflow-hidden flex-shrink-0`}
      style={{ background: '#161616', border: '2px solid rgba(232,28,46,0.35)' }}>
      {isPhoto
        ? <img src={avatar} alt="avatar" className="w-full h-full object-cover"/>
        : <span>{avatar}</span>
      }
    </div>
  )
}

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
  onUpdateProfile,
  onUpdateConfig,
  onClose,
  onResetOnboarding,
}) {
  const [editing, setEditing] = useState(false)

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
    setEditAvatar(profile.isCustomPhoto ? profile.avatar : profile.avatar)
    setEditPhoto(profile.isCustomPhoto ? profile.avatar : null)
    setEditList(config.listSize)
    setEditPace(config.pace)
    setEditing(false)
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

        {/* ── Avatar + Name card ── */}
        <div
          className="rounded-2xl border border-[#1e1e1e] p-5 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #120000 0%, #0f0f0f 100%)' }}
        >
          {/* Avatar */}
          {editing ? (
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden flex-shrink-0 text-5xl"
              style={{ background: '#161616', border: '2px solid rgba(232,28,46,0.35)' }}>
              {displayAvatar?.startsWith('data:')
                ? <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover"/>
                : <span>{displayAvatar}</span>
              }
            </div>
          ) : (
            <AvatarDisplay avatar={profile.avatar} size="lg"/>
          )}

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
          </div>
        </div>

        {/* ── Avatar picker (editing only) ── */}
        {editing && (
          <div className="rounded-2xl border border-[#1e1e1e] p-4 bg-[#0f0f0f] space-y-3">
            <div className="text-[10px] text-[#555] uppercase tracking-widest">Change Avatar</div>

            {/* Upload row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="text-[11px] text-[#E81C2E] border border-[#E81C2E]/40 px-3 py-1.5 rounded-lg hover:bg-[#E81C2E]/10 transition-colors"
              >
                📷 Upload Photo
              </button>
              {editPhoto && (
                <button
                  onClick={() => { setEditPhoto(null); setEditAvatar(PRESET_AVATARS[0].emoji) }}
                  className="text-[11px] text-[#444] hover:text-[#888] transition-colors"
                >
                  Remove photo
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            {/* Preset grid */}
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map(p => (
                <button
                  key={p.emoji}
                  onClick={() => { setEditAvatar(p.emoji); setEditPhoto(null) }}
                  title={p.label}
                  className={[
                    'flex items-center justify-center p-2 rounded-xl text-2xl transition-all',
                    !editPhoto && editAvatar === p.emoji
                      ? 'bg-[#E81C2E]/15 border-2 border-[#E81C2E]/60 shadow-[0_0_10px_rgba(232,28,46,0.2)]'
                      : 'bg-[#111] border border-[#1e1e1e] hover:border-[#333]',
                  ].join(' ')}
                >
                  {p.emoji}
                </button>
              ))}
            </div>
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

        {/* ── Reset Onboarding ── */}
        <div className="pt-2 border-t border-[#161616]">
          <button
            onClick={onResetOnboarding}
            className="w-full py-3 rounded-xl border border-[#1e1e1e] text-[#444] text-xs font-semibold tracking-widest hover:border-[#333] hover:text-[#666] transition-all uppercase"
          >
            ↩ Redo Onboarding
          </button>
        </div>
      </div>
    </div>
  )
}
