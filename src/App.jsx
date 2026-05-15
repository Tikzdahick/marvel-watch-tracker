import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Onboarding from './Onboarding.jsx'
import Achievements from './Achievements.jsx'
import ProfileSetup from './ProfileSetup.jsx'
import ProfilePage from './ProfilePage.jsx'
import StatsPage from './StatsPage.jsx'
import TitleDetailModal from './TitleDetailModal.jsx'
import RandomizerWheel from './RandomizerWheel.jsx'
import PinModal from './PinModal.jsx'
import {
  TITLES, DEFAULT_WATCHED, getTitlesForListSize, TIER_MAP, getRuntimeMinutes,
} from './data/titles.js'
import {
  ACHIEVEMENTS, ACHIEVEMENT_MAP, checkAchievements, todayStr,
} from './data/achievements.js'
import {
  LOCK_TIERS, LOCK_TIER_ORDER, getLocksForTitle, getPrimaryLock, isTitleLocked,
  SK_LOCK_PINS,
} from './data/locks.js'

// ── Storage keys ──────────────────────────────────────────────────────────────
const SK_CONFIG       = 'mvt-config'
const SK_WATCHED      = 'mvt-watched-v1'
const SK_HISTORY      = 'mvt-watch-history'
const SK_LOGIN        = 'mvt-login-dates'
const SK_ACHIEVEMENTS = 'mvt-achievements'
const SK_ONBOARDED    = 'mvt-onboarded'
const SK_PROFILE      = 'mvt-profile'
const SK_RATINGS      = 'mvt-ratings'
const SK_NOTES        = 'mvt-notes'
const SK_GOAL         = 'mvt-goal'
const SK_REMINDER     = 'mvt-reminder'
const SK_PLANNER      = 'mvt-planner'

// ── Constants ─────────────────────────────────────────────────────────────────
const DOOMSDAY      = new Date('2026-12-18T00:00:00')
const PACE_TARGETS  = {
  casual:     null,
  assembling: new Date('2026-09-18T00:00:00'),
  avenger:    new Date('2026-11-18T00:00:00'),
  thanos:     new Date('2026-12-01T00:00:00'),
}
const HISTORICAL_PACE = 72 / 204  // items/day from user's data

// ── Helpers ───────────────────────────────────────────────────────────────────
function pad2(n) { return String(n).padStart(2, '0') }

function calcCountdown(target) {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function loadJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) } catch {}
  return fallback
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function initAchievements() {
  const saved = loadJSON(SK_ACHIEVEMENTS, {})
  const result = {}
  for (const def of ACHIEVEMENTS) {
    result[def.id] = saved[def.id] ?? { unlocked: false, unlockedAt: null }
  }
  return result
}

// ── Sub-components ────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const c = {
    movie:    'bg-red-950 text-[#E81C2E] border-[#E81C2E]/25',
    tv:       'bg-blue-950 text-blue-400 border-blue-400/25',
    animated: 'bg-purple-950 text-purple-400 border-purple-400/25',
  }
  const l = { movie: 'MOVIE', tv: 'TV', animated: 'ANIM' }
  return (
    <span className={`inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest ${c[type] ?? c.movie}`}>
      {l[type] ?? '?'}
    </span>
  )
}

function CheckCircle({ watched, isLocked, lockTier, comingSoon }) {
  if (comingSoon) return (
    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-[#F5C518]/40">
      <span className="text-[10px] leading-none">⏳</span>
    </div>
  )
  if (isLocked) {
    const bg   = lockTier?.bgColor     ?? 'bg-pink-950'
    const bdr  = lockTier?.borderColor ?? 'border border-pink-500/40'
    const clr  = lockTier?.color       ?? '#f9a8d4'
    return (
      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${bg} border ${bdr}`}>
        <span className="text-[10px] leading-none" style={{ color: clr }}>
          {lockTier?.emoji ?? '🔒'}
        </span>
      </div>
    )
  }
  return (
    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
      watched ? 'bg-[#E81C2E] shadow-[0_0_8px_rgba(232,28,46,0.4)]' : 'border-2 border-[#2a2a2a]'
    }`}>
      {watched && (
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      )}
    </div>
  )
}

function TitleCard({
  title, isWatched, isNextUp, onToggle, onOpenDetail, rating, hasNote,
  isRandomPick, isLocked, lockTier, isPlanned,
}) {
  const comingSoon = !!title.comingSoon
  const pressRef   = useRef(null)

  function startPress() {
    pressRef.current = setTimeout(() => onOpenDetail?.(), 600)
  }
  function endPress() { clearTimeout(pressRef.current) }

  function handleClick() {
    if (comingSoon) return
    if (isLocked) { onOpenDetail?.(); return }   // locked → open detail w/ unlock btn
    onToggle(title.id)
  }

  return (
    <li
      id={`title-${title.id}`}
      onClick={handleClick}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 select-none',
        isRandomPick ? 'cursor-pointer bg-[#1a0d00] border-[#F5C518] shadow-[0_0_18px_rgba(245,197,24,0.25)]'
        : comingSoon ? 'cursor-default bg-[#0f0d00] border-[#F5C518]/20'
        : isLocked   ? 'cursor-pointer bg-[#100a0a] border-pink-900/40 hover:border-pink-800/60'
        : isWatched  ? 'cursor-pointer bg-[#0d0d0d] border-[#181818] active:scale-[0.99]'
        : isNextUp   ? 'cursor-pointer bg-[#180000] border-[#E81C2E]/50 shadow-[0_0_16px_rgba(232,28,46,0.12)] active:scale-[0.99]'
        : 'cursor-pointer bg-[#111] border-[#1c1c1c] hover:border-[#2a2a2a] active:scale-[0.99]',
      ].join(' ')}
    >
      <CheckCircle
        watched={isWatched}
        isLocked={isLocked}
        lockTier={lockTier}
        comingSoon={comingSoon}
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <TypeBadge type={title.type}/>
          {isRandomPick && (
            <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border bg-yellow-950 text-[#F5C518] border-[#F5C518]/30 font-bold tracking-widest">
              🎲 PICK
            </span>
          )}
          {isNextUp && !isRandomPick && (
            <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border bg-yellow-950 text-[#F5C518] border-[#F5C518]/30 font-bold tracking-widest">
              NEXT UP
            </span>
          )}
          {comingSoon && (
            <span className="inline-block text-[9px] px-1.5 py-[2px] rounded border bg-yellow-950 text-[#F5C518] border-[#F5C518]/40 font-bold tracking-widest">
              COMING SOON
            </span>
          )}
          {isLocked && lockTier && (
            <span
              className={`inline-block text-[9px] px-1.5 py-[2px] rounded border font-bold tracking-widest ${lockTier.bgColor} ${lockTier.borderColor}`}
              style={{ color: lockTier.color }}
            >
              {lockTier.emoji} {lockTier.rating}
            </span>
          )}
        </div>
        <p className={`text-sm leading-snug font-medium ${
          isWatched    ? 'line-through text-[#3a3a3a]'
          : comingSoon ? 'text-[#888]'
          : isLocked   ? 'text-[#666]'
          : 'text-white'
        }`}>{title.title}</p>
        {/* Mini star rating */}
        {rating != null && !isLocked && (
          <div className="flex mt-0.5">
            {[1,2,3,4,5].map(n => (
              <span key={n} className="text-[10px]" style={{ color: n <= rating ? '#F5C518' : '#2a2a2a' }}>★</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isPlanned && <span className="text-[12px] opacity-70" title="Scheduled">📅</span>}
        {hasNote && !isLocked && <span className="text-[12px] opacity-60" title="Has note">📝</span>}
        <span className="text-[11px] text-[#2a2a2a] font-mono tabular-nums">{pad2(title.id)}</span>
      </div>
    </li>
  )
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`font-bebas text-2xl tracking-wider leading-none ${color}`}>{value}</span>
      <span className="text-[9px] uppercase tracking-widest text-[#444] font-medium">{label}</span>
    </div>
  )
}

// ── Isolated countdown (only this re-renders every second) ───────────────────
function CountdownTicker() {
  const [cd, setCd] = useState(() => calcCountdown(DOOMSDAY))
  useEffect(() => {
    const id = setInterval(() => setCd(calcCountdown(DOOMSDAY)), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="font-mono text-[#F5C518] text-xs font-semibold">
      {cd.days}d {pad2(cd.hours)}h {pad2(cd.minutes)}m {pad2(cd.seconds)}s
    </span>
  )
}

// ── Achievement Toast ─────────────────────────────────────────────────────────
function AchievementToast({ achievementId, onDone }) {
  const def = ACHIEVEMENT_MAP[achievementId]
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])
  if (!def) return null
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)]"
      style={{ animation: 'toastSlide 0.4s ease both' }}
    >
      <div
        className="rounded-2xl border border-[#F5C518]/30 px-4 py-3 flex items-center gap-3 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #1a1200 0%, #0f0d00 100%)' }}
      >
        <div className="w-10 h-10 rounded-xl bg-[#F5C518]/15 flex items-center justify-center text-xl flex-shrink-0">
          {def.icon}
        </div>
        <div className="flex-1">
          <div className="text-[10px] text-[#F5C518] font-bold tracking-widest uppercase mb-0.5">
            Achievement Unlocked!
          </div>
          <div className="text-sm font-semibold text-white">{def.name}</div>
          <div className="text-[11px] text-[#666]">{def.desc}</div>
        </div>
        <button onClick={onDone} className="text-[#333] hover:text-white ml-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Completion Card ───────────────────────────────────────────────────────────
function CompletionModal({ config, watchedCount, achievementsUnlocked, onClose }) {
  const LIST_LABELS = { rookie: 'ROOKIE', hero: 'HERO', avenger: 'AVENGER', infinity: 'INFINITY' }
  const PACE_LABELS = { casual: 'CASUAL', assembling: 'ASSEMBLING', avenger: 'AVENGER', thanos: 'THANOS MODE' }
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  async function handleShare() {
    const text = `🎬 MARVEL UNIVERSE COMPLETE!\n\n${watchedCount} titles conquered\nList: ${LIST_LABELS[config.listSize]}\nPace: ${PACE_LABELS[config.pace]}\nCompleted: ${today}\n🏆 ${achievementsUnlocked} achievements unlocked\n\n#MarvelWatchTracker`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Marvel Watch Tracker', text })
      } else {
        await navigator.clipboard.writeText(text)
        alert('Copied to clipboard!')
      }
    } catch {}
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full rounded-3xl border border-[#F5C518]/30 p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, #0f0800 0%, #0a0a0a 50%, #0a0000 100%)',
          boxShadow: '0 0 60px rgba(245,197,24,0.15), 0 0 120px rgba(232,28,46,0.1)',
          animation: 'completionPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(245,197,24,0.08) 0%, transparent 60%)' }}/>
        </div>
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black shadow-[0_0_24px_rgba(245,197,24,0.4)]"
            style={{ background: 'linear-gradient(135deg, #F5C518 0%, #d4a017 100%)' }}
          >
            <span className="text-black">M</span>
          </div>
          <div className="text-2xl mb-2">✦ ✦ ✦</div>
          <h2 className="font-bebas text-3xl tracking-[0.15em] text-[#F5C518] mb-1">MARVEL UNIVERSE</h2>
          <h3 className="font-bebas text-4xl tracking-[0.1em] text-white mb-6">COMPLETE</h3>
          <div className="space-y-2 mb-6">
            {[
              ['Titles Watched', watchedCount, 'text-white'],
              ['List Size',  LIST_LABELS[config.listSize], 'text-[#E81C2E]'],
              ['Pace',       PACE_LABELS[config.pace],     'text-[#F5C518]'],
              ['Completed',  today,                          'text-white'],
              ['Achievements', `🏆 ${achievementsUnlocked}`, 'text-[#F5C518]'],
            ].map(([label, val, cls]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[#1a1a1a] last:border-0">
                <span className="text-[11px] text-[#555] uppercase tracking-widest">{label}</span>
                <span className={`font-bebas text-xl ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleShare} className="flex-1 py-3 rounded-xl font-bebas text-lg tracking-widest bg-[#E81C2E] text-white hover:shadow-[0_0_16px_rgba(232,28,46,0.5)] transition-all">
              📱 SHARE
            </button>
            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bebas text-lg tracking-widest bg-[#1a1a1a] text-[#666] hover:text-white border border-[#222] transition-all">
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Settings Modal ────────────────────────────────────────────────────────────
function SettingsModal({ config, onUpdate, onClose }) {
  const [listSize, setListSize] = useState(config.listSize)
  const [pace, setPace]         = useState(config.pace)

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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#0f0f0f] border border-[#222] rounded-t-3xl p-6 pb-10"
        style={{ animation: 'slideUp 0.3s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#333] rounded-full mx-auto mb-6"/>
        <h2 className="font-bebas text-2xl tracking-[0.15em] text-white mb-5">SETTINGS</h2>
        <div className="mb-5">
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">List Size</div>
          <div className="grid grid-cols-4 gap-2">
            {LIST_OPTS.map(o => (
              <button key={o.id} onClick={() => setListSize(o.id)}
                className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                  listSize === o.id ? 'bg-[#E81C2E] border-[#E81C2E] text-white' : 'bg-[#151515] border-[#222] text-[#555] hover:text-white'
                }`}>
                {o.label}<br/><span className="text-[10px] opacity-60">{o.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Pace</div>
          <div className="grid grid-cols-2 gap-2">
            {PACE_OPTS.map(o => (
              <button key={o.id} onClick={() => setPace(o.id)}
                className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                  pace === o.id ? 'bg-[#E81C2E] border-[#E81C2E] text-white' : 'bg-[#151515] border-[#222] text-[#555] hover:text-white'
                }`}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => { onUpdate({ listSize, pace }); onClose() }}
          className="w-full py-3.5 rounded-xl font-bebas text-xl tracking-widest bg-[#E81C2E] text-white hover:shadow-[0_0_16px_rgba(232,28,46,0.4)] transition-all"
        >
          SAVE SETTINGS
        </button>
      </div>
    </div>
  )
}

// ── Rating Modal ──────────────────────────────────────────────────────────────
function RatingModal({ titleName, currentRating, onRate, onDismiss }) {
  const [hovered,  setHovered]  = useState(currentRating ?? 0)
  const [selected, setSelected] = useState(currentRating ?? 0)
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-lg bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-6"
        style={{ animation: 'slideUp 0.3s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#333] rounded-full mx-auto mb-5"/>
        <div className="text-[10px] text-[#555] uppercase tracking-widest mb-1">How was it?</div>
        <p className="text-white font-medium text-[15px] mb-5 leading-snug">{titleName}</p>
        <div className="flex justify-center gap-3 mb-6">
          {[1,2,3,4,5].map(n => (
            <button key={n}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(selected)}
              onClick={() => setSelected(n)}
              className="text-4xl transition-transform hover:scale-125 active:scale-110"
            >
              <span style={{ color: n <= (hovered || selected) ? '#F5C518' : '#2a2a2a' }}>★</span>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onDismiss} className="flex-1 py-3 rounded-xl text-[#555] text-sm border border-[#222] hover:text-white transition-colors">
            Maybe later
          </button>
          <button
            onClick={() => { if (selected) onRate(selected); onDismiss() }}
            disabled={!selected}
            className="flex-1 py-3 rounded-xl font-bebas text-xl tracking-widest bg-[#E81C2E] text-white disabled:opacity-30 hover:shadow-[0_0_12px_rgba(232,28,46,0.4)] transition-all"
          >
            RATE IT
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
const FILTERS       = ['all','unwatched','watched','movies','tv','animated']
const FILTER_LABELS = { all:'All', unwatched:'Unwatched', watched:'Watched', movies:'Movies', tv:'TV', animated:'Animated' }

export default function App() {
  // ── Profile ──
  const [profile, setProfile] = useState(() => loadJSON(SK_PROFILE, null))

  // ── Onboarding ──
  const [onboarded, setOnboarded] = useState(() => loadJSON(SK_ONBOARDED, false))
  const [config,    setConfig]    = useState(() => loadJSON(SK_CONFIG, { listSize: 'avenger', pace: 'casual' }))

  // ── Watched ──
  const [watched, setWatched] = useState(() =>
    new Set(loadJSON(SK_WATCHED, [...DEFAULT_WATCHED]))
  )

  // ── Watch history ──
  const [watchHistory, setWatchHistory] = useState(() => loadJSON(SK_HISTORY, {}))

  // ── Login dates ──
  const [loginDates, setLoginDates] = useState(() => {
    const saved = loadJSON(SK_LOGIN, [])
    const today = todayStr()
    if (!saved.includes(today)) {
      const next = [...new Set([...saved, today])]
      saveJSON(SK_LOGIN, next)
      return next
    }
    return saved
  })

  // ── Achievements ──
  const [achievements, setAchievements] = useState(initAchievements)

  // ── Content lock state ──
  // lockPins: { pg13: '1234'|null, tv14: ..., tvma: ..., r: ... }
  // null = tier lock disabled; string = PIN set and lock active
  const [lockPins,      setLockPins]      = useState(() => loadJSON(SK_LOCK_PINS, {}))
  // unlockedTiers: Set of tier keys unlocked this session (e.g. new Set(['pg13']))
  const [unlockedTiers, setUnlockedTiers] = useState(() => new Set())
  // Which tier PIN modal to show: { tierKey, mode } or null
  const [pinModal,      setPinModal]      = useState(null)

  // ── Watch Planner ──
  // { [titleId]: dateStr 'YYYY-MM-DD' }
  const [planner, setPlanner] = useState(() => loadJSON(SK_PLANNER, {}))

  // ── UI state ──
  const [activeTab,      setActiveTab]      = useState('tracker')
  const [filter,         setFilter]         = useState('all')
  const [search,         setSearch]         = useState('')
  const [toastQueue,     setToastQueue]     = useState([])
  const [currentToast,   setCurrentToast]   = useState(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showSettings,   setShowSettings]   = useState(false)
  const [showProfile,    setShowProfile]    = useState(false)
  const [showWheel,      setShowWheel]      = useState(false)

  // ── Feature state ──
  const [ratingModalId,  setRatingModalId]  = useState(null)
  const [detailModalId,  setDetailModalId]  = useState(null)
  const [randomPickId,   setRandomPickId]   = useState(null)
  const [ratings,        setRatings]        = useState(() => loadJSON(SK_RATINGS, {}))
  const [notes,          setNotes]          = useState(() => loadJSON(SK_NOTES, {}))
  const [goal,           setGoal]           = useState(() => loadJSON(SK_GOAL, { weekly: 3 }))
  const [reminder,       setReminder]       = useState(() => loadJSON(SK_REMINDER, { time: '20:00', enabled: false }))

  const shownCompletion = useRef(false)
  const isInitialMount  = useRef(true)

  // ── Derived list data (must be before any useEffect that uses them) ──
  const listTitles = useMemo(
    () => getTitlesForListSize(config.listSize),
    [config.listSize]
  )
  const listWatchedCount = useMemo(
    () => listTitles.filter(t => watched.has(t.id)).length,
    [listTitles, watched]
  )

  // ── Persist ──
  useEffect(() => { saveJSON(SK_WATCHED,      [...watched]) },     [watched])
  useEffect(() => { saveJSON(SK_HISTORY,      watchHistory) },     [watchHistory])
  useEffect(() => { saveJSON(SK_ACHIEVEMENTS, achievements) },     [achievements])
  useEffect(() => { saveJSON(SK_CONFIG,       config) },           [config])
  useEffect(() => { if (profile) saveJSON(SK_PROFILE, profile) }, [profile])
  useEffect(() => { saveJSON(SK_RATINGS,  ratings) },  [ratings])
  useEffect(() => { saveJSON(SK_NOTES,    notes) },    [notes])
  useEffect(() => { saveJSON(SK_GOAL,     goal) },     [goal])
  useEffect(() => { saveJSON(SK_REMINDER, reminder) }, [reminder])
  useEffect(() => { saveJSON(SK_LOCK_PINS, lockPins) }, [lockPins])
  useEffect(() => { saveJSON(SK_PLANNER,   planner) },  [planner])

  // ── Daily reminder notification ──
  useEffect(() => {
    if (!reminder?.enabled || !reminder.time) return
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const [h, m] = reminder.time.split(':').map(Number)
    const now  = new Date()
    const next = new Date(now)
    next.setHours(h, m, 0, 0)
    if (next <= now) next.setDate(next.getDate() + 1)
    const timer = setTimeout(() => {
      const nextUp = listTitles.find(t => !watched.has(t.id) && !isTitleLocked(t.id, lockPins, unlockedTiers))
      try {
        new Notification('🎬 Marvel Watch Tracker', {
          body: `Time to watch: ${nextUp?.title ?? 'your next Marvel title'}!`,
          icon: '/marvel-icon.svg',
        })
      } catch {}
    }, next.getTime() - now.getTime())
    return () => clearTimeout(timer)
  }, [reminder, listTitles, watched, lockPins, unlockedTiers])

  // ── Scroll to random pick ──
  useEffect(() => {
    if (!randomPickId) return
    const el = document.getElementById(`title-${randomPickId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [randomPickId])

  // ── Toast queue processor ──
  useEffect(() => {
    if (!currentToast && toastQueue.length > 0) {
      setCurrentToast(toastQueue[0])
      setToastQueue(q => q.slice(1))
    }
  }, [currentToast, toastQueue])

  // ── Check achievements ──
  const runAchievementCheck = useCallback((newWatched, newHistory) => {
    setAchievements(prev => {
      const ctx = { watched: newWatched, watchHistory: newHistory, loginDates, listSize: config.listSize }
      const newIds = checkAchievements(prev, ctx)
      if (!newIds.length) return prev
      const next = { ...prev }
      const now  = new Date().toISOString()
      for (const id of newIds) next[id] = { unlocked: true, unlockedAt: now }
      setToastQueue(q => [...q, ...newIds])
      return next
    })
  }, [loginDates, config.listSize])

  // Check login-based achievements on mount
  useEffect(() => {
    setAchievements(prev => {
      const ctx = { watched, watchHistory, loginDates, listSize: config.listSize }
      const newIds = checkAchievements(prev, ctx)
      if (!newIds.length) return prev
      const next = { ...prev }
      const now  = new Date().toISOString()
      for (const id of newIds) next[id] = { unlocked: true, unlockedAt: now }
      if (!isInitialMount.current) setToastQueue(q => [...q, ...newIds])
      return next
    })

    const h = new Date().getHours()
    if (h >= 0 && h < 3) {
      setAchievements(prev => {
        if (prev['secret-midnight']?.unlocked) return prev
        const next = { ...prev, 'secret-midnight': { unlocked: true, unlockedAt: new Date().toISOString() } }
        setToastQueue(q => [...q, 'secret-midnight'])
        return next
      })
    }

    isInitialMount.current = false
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Watch for 100% completion
  useEffect(() => {
    if (listWatchedCount >= listTitles.length && !shownCompletion.current) {
      shownCompletion.current = true
      setTimeout(() => setShowCompletion(true), 800)
    }
  }, [listWatchedCount, listTitles.length])

  // ── Toggle watched ──
  const toggle = useCallback((id) => {
    const title = TITLES.find(t => t.id === id)
    if (!title) return
    if (title.comingSoon) return
    if (isTitleLocked(id, lockPins, unlockedTiers)) return

    const isMarkingWatched = !watched.has(id)

    setWatched(prevW => {
      const wasWatched = prevW.has(id)
      const nextW = new Set(prevW)
      wasWatched ? nextW.delete(id) : nextW.add(id)

      setWatchHistory(prevH => {
        const today = todayStr()
        const nextH = { ...prevH }
        if (!wasWatched) {
          nextH[today] = [...new Set([...(nextH[today] ?? []), id])]
          if (id === 21 && nextW.size === 1) {
            setAchievements(prev => {
              if (prev['secret-iron-man']?.unlocked) return prev
              const next = { ...prev, 'secret-iron-man': { unlocked: true, unlockedAt: new Date().toISOString() } }
              setToastQueue(q => [...q, 'secret-iron-man'])
              return next
            })
          }
        }
        runAchievementCheck(nextW, nextH)
        return nextH
      })

      return nextW
    })

    if (isMarkingWatched) {
      setTimeout(() => setRatingModalId(id), 150)
    }
  }, [runAchievementCheck, watched, lockPins, unlockedTiers])

  // ── Stats ──
  const total      = listTitles.length
  const remaining  = total - listWatchedCount
  const pct        = total ? Math.round((listWatchedCount / total) * 100) : 0
  const totalHours = Math.floor(
    listTitles.filter(t => watched.has(t.id)).reduce((s, t) => s + getRuntimeMinutes(t), 0) / 60
  )

  // ── Pace display ──
  const paceInfo = useMemo(() => {
    const target = PACE_TARGETS[config.pace]
    if (!target) {
      const daysLeft = remaining / HISTORICAL_PACE
      const finish = new Date()
      finish.setDate(finish.getDate() + Math.ceil(daysLeft))
      return { label: 'Est. finish', dateStr: finish.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), onTrack: null, reqPerWeek: null }
    }
    const daysUntilTarget = Math.max(0, (target - Date.now()) / 86400000)
    const reqPerDay  = daysUntilTarget > 0 ? remaining / daysUntilTarget : Infinity
    const reqPerWeek = reqPerDay * 7
    const curPerWeek = HISTORICAL_PACE * 7
    const onTrack    = curPerWeek >= reqPerWeek
    return {
      label: 'Target',
      dateStr: target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      onTrack, reqPerWeek: reqPerWeek.toFixed(1), curPerWeek: curPerWeek.toFixed(1),
    }
  }, [config.pace, remaining])

  // ── First unwatched ──
  const nextUpId = useMemo(
    () => listTitles.find(t => !watched.has(t.id) && !isTitleLocked(t.id, lockPins, unlockedTiers))?.id,
    [listTitles, watched, lockPins, unlockedTiers]
  )

  // ── Filtered list ──
  const visible = useMemo(() => {
    const q = search.toLowerCase().trim()
    return listTitles.filter(t => {
      if (q && !t.title.toLowerCase().includes(q)) return false
      switch (filter) {
        case 'watched':   return watched.has(t.id)
        case 'unwatched': return !watched.has(t.id)
        case 'movies':    return t.type === 'movie'
        case 'tv':        return t.type === 'tv'
        case 'animated':  return t.type === 'animated'
        default:          return true
      }
    })
  }, [filter, search, listTitles, watched])

  // ── Unwatched + unlocked titles for randomizer wheel ──
  const wheelTitles = useMemo(
    () => listTitles.filter(t => !watched.has(t.id) && !t.comingSoon && !isTitleLocked(t.id, lockPins, unlockedTiers)),
    [listTitles, watched, lockPins, unlockedTiers]
  )

  // ── Lock PIN helpers ──
  function handleUnlockRequest(tierKey) {
    const pin = lockPins[tierKey]
    if (!pin) return // no PIN set → tier not locked
    setPinModal({ tierKey, mode: 'verify' })
  }

  function handlePinVerified(tierKey) {
    setUnlockedTiers(prev => new Set([...prev, tierKey]))
    setPinModal(null)
  }

  function handlePinSetup(tierKey, newPin) {
    setLockPins(prev => ({ ...prev, [tierKey]: newPin }))
    setPinModal(null)
  }

  function handleLockDisable(tierKey) {
    // Require current PIN to disable (re-open verify, then on success clear)
    const pin = lockPins[tierKey]
    if (!pin) { setLockPins(prev => ({ ...prev, [tierKey]: null })); return }
    setPinModal({ tierKey, mode: 'verify', onSuccessOverride: () => {
      setLockPins(prev => ({ ...prev, [tierKey]: null }))
      setPinModal(null)
    }})
  }

  // ── Planner helpers ──
  function handleScheduleTitle(titleId, dateStr) {
    setPlanner(prev => {
      const next = { ...prev }
      if (dateStr) next[titleId] = dateStr
      else delete next[titleId]
      return next
    })
  }

  // ── Profile / onboarding handlers ──
  function handleProfileComplete(prof) { setProfile(prof); saveJSON(SK_PROFILE, prof) }
  function handleProfileUpdate(prof)   { setProfile(prof); saveJSON(SK_PROFILE, prof) }
  function handleConfigUpdate(cfg)     { setConfig(cfg);   saveJSON(SK_CONFIG, cfg) }
  function handleResetOnboarding()     { setShowProfile(false); saveJSON(SK_ONBOARDED, false); setOnboarded(false) }

  // ── Random pick ──
  function handleRandomPick(pickedTitle) {
    if (pickedTitle) {
      // called from wheel with a specific pick
      setRandomPickId(pickedTitle.id)
      setShowWheel(false)
      return
    }
    // fallback: pick without wheel
    const unwatched = wheelTitles
    if (!unwatched.length) return
    const pick = unwatched[Math.floor(Math.random() * unwatched.length)]
    setRandomPickId(prev => prev === pick.id ? null : null)
    requestAnimationFrame(() => setRandomPickId(pick.id))
  }

  // ── Rating + notes handlers ──
  function handleRate(id, stars)   { setRatings(prev => ({ ...prev, [id]: stars })) }
  function handleSaveNote(id, text) {
    setNotes(prev => {
      const next = { ...prev }
      if (text) next[id] = text; else delete next[id]
      return next
    })
  }

  // ── Gates ──
  if (!profile) return <ProfileSetup onComplete={handleProfileComplete}/>

  function handleOnboardingComplete(cfg) {
    setConfig(cfg); saveJSON(SK_CONFIG, cfg)
    saveJSON(SK_ONBOARDED, true); setOnboarded(true)
  }
  if (!onboarded) return <Onboarding onComplete={handleOnboardingComplete}/>

  const unlockedAchievements = Object.values(achievements).filter(a => a.unlocked).length

  // ── Detail modal title ──
  const detailTitle = detailModalId ? TITLES.find(t => t.id === detailModalId) : null

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── TOAST ── */}
      {currentToast && (
        <AchievementToast achievementId={currentToast} onDone={() => setCurrentToast(null)}/>
      )}

      {/* ── COMPLETION MODAL ── */}
      {showCompletion && (
        <CompletionModal config={config} watchedCount={listWatchedCount}
          achievementsUnlocked={unlockedAchievements} onClose={() => setShowCompletion(false)}/>
      )}

      {/* ── SETTINGS MODAL ── */}
      {showSettings && (
        <SettingsModal config={config}
          onUpdate={cfg => { setConfig(cfg); saveJSON(SK_CONFIG, cfg) }}
          onClose={() => setShowSettings(false)}/>
      )}

      {/* ── PIN MODAL ── */}
      {pinModal && (
        <PinModal
          mode={pinModal.mode}
          tierKey={pinModal.tierKey}
          currentPin={lockPins[pinModal.tierKey]}
          onSuccess={(pin) => {
            if (pinModal.onSuccessOverride) {
              pinModal.onSuccessOverride()
            } else if (pinModal.mode === 'verify') {
              handlePinVerified(pinModal.tierKey)
            } else {
              handlePinSetup(pinModal.tierKey, pin)
            }
          }}
          onCancel={() => setPinModal(null)}
        />
      )}

      {/* ── TITLE DETAIL MODAL ── */}
      {detailTitle && (
        <TitleDetailModal
          title={detailTitle}
          isWatched={watched.has(detailTitle.id)}
          rating={ratings[detailTitle.id]}
          note={notes[detailTitle.id]}
          isLocked={isTitleLocked(detailTitle.id, lockPins, unlockedTiers)}
          onToggle={toggle}
          onRate={handleRate}
          onSaveNote={handleSaveNote}
          onClose={() => setDetailModalId(null)}
          onUnlockRequest={(tierKey) => { setDetailModalId(null); handleUnlockRequest(tierKey) }}
        />
      )}

      {/* ── RANDOMIZER WHEEL ── */}
      {showWheel && (
        <RandomizerWheel
          titles={wheelTitles}
          onPick={pickedTitle => handleRandomPick(pickedTitle)}
          onClose={() => setShowWheel(false)}
        />
      )}

      {/* ── PROFILE PAGE ── */}
      {showProfile && (
        <ProfilePage
          profile={profile}
          config={config}
          stats={{ watchedCount: listWatchedCount, total, remaining, pct, watchHistory, loginDates, unlockedAchievements }}
          lockPins={lockPins}
          onUpdateProfile={handleProfileUpdate}
          onUpdateConfig={handleConfigUpdate}
          onClose={() => setShowProfile(false)}
          onResetOnboarding={handleResetOnboarding}
          onSetupLock={(tierKey) => setPinModal({ tierKey, mode: 'setup' })}
          onDisableLock={handleLockDisable}
          onChangeLockPin={(tierKey) => setPinModal({ tierKey, mode: 'setup' })}
        />
      )}

      {/* ── RATING MODAL ── */}
      {ratingModalId && (
        <RatingModal
          titleName={TITLES.find(t => t.id === ratingModalId)?.title ?? ''}
          currentRating={ratings[ratingModalId]}
          onRate={stars => handleRate(ratingModalId, stars)}
          onDismiss={() => setRatingModalId(null)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TRACKER TAB                                                            */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tracker' && (
        <>
          {/* ── Sticky header ── */}
          <header className="sticky top-0 z-10 bg-[#0a0a0a]/96 backdrop-blur-md border-b border-[#161616]">
            <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
              {/* Logo row */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex flex-col gap-1">
                  <div className="w-1 h-3 bg-[#E81C2E] rounded-full"/>
                  <div className="w-1 h-3 bg-[#F5C518] rounded-full"/>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-bebas text-[26px] tracking-[0.1em] text-white leading-none">
                    MARVEL WATCH TRACKER
                  </h1>
                  {profile && (
                    <div className="text-[10px] text-[#444] tracking-wide leading-none mt-0.5 truncate">
                      {profile.name} · ⏱ {totalHours}h watched
                    </div>
                  )}
                </div>
                {/* Settings button */}
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:bg-[#1a1a1a] text-[#555] hover:text-white"
                  style={{ border: '1.5px solid rgba(255,255,255,0.07)' }}
                  title="Settings (change difficulty & pace)"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                </button>
                {/* Avatar / profile button */}
                <button
                  onClick={() => setShowProfile(true)}
                  className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 transition-all hover:ring-2 hover:ring-[#E81C2E]/50"
                  style={{ background: '#161616', border: '1.5px solid rgba(232,28,46,0.25)' }}
                  title="Profile"
                >
                  {profile?.avatar?.startsWith('data:')
                    ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover"/>
                    : <span className="text-lg">{profile?.avatar ?? '👤'}</span>
                  }
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <StatPill label="Watched"   value={listWatchedCount} color="text-[#E81C2E]"/>
                <StatPill label="Remaining" value={remaining}        color="text-white"/>
                <StatPill label="Complete"  value={`${pct}%`}        color="text-[#F5C518]"/>
                <StatPill label="Total"     value={total}            color="text-[#555]"/>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[#181818] rounded-full mb-3 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #E81C2E 0%, #ff3d4e 100%)' }}/>
              </div>

              {/* Countdown + pace row */}
              <div className="flex flex-wrap items-center justify-between gap-y-1 gap-x-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#444] font-medium">Doomsday</span>
                  <CountdownTicker />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#444] font-medium">{paceInfo.label}</span>
                  <span className={`font-mono text-xs font-semibold ${
                    paceInfo.onTrack === true ? 'text-green-400' : 'text-[#E81C2E]'
                  }`}>{paceInfo.dateStr}</span>
                  {paceInfo.onTrack !== null && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      paceInfo.onTrack ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-[#E81C2E]'
                    }`}>
                      {paceInfo.onTrack ? '✓ On Track' : `Need ${paceInfo.reqPerWeek}/wk`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* ── Controls ── */}
          <div className="max-w-lg mx-auto px-4 pt-3 pb-2 space-y-2.5">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
              <input
                type="search"
                placeholder="Search titles…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#3a3a3a] focus:outline-none focus:border-[#E81C2E]/50 transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={[
                    'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all',
                    filter === f
                      ? 'bg-[#E81C2E] text-white shadow-[0_0_10px_rgba(232,28,46,0.35)]'
                      : 'bg-[#111] text-[#555] border border-[#1e1e1e] hover:text-white',
                  ].join(' ')}
                >{FILTER_LABELS[f]}</button>
              ))}
            </div>
          </div>

          {/* ── Title list ── */}
          <main className="max-w-lg mx-auto px-4 pb-28">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center mt-16 gap-3 text-[#333]">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
                <p className="text-sm">No titles match your filter.</p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {visible.map(t => {
                  const isLocked  = isTitleLocked(t.id, lockPins, unlockedTiers)
                  const lockKey   = isLocked ? getPrimaryLock(t.id) : null
                  const lockTier  = lockKey  ? LOCK_TIERS[lockKey] : null
                  const isPlanned = !!planner[t.id]
                  return (
                    <TitleCard
                      key={t.id}
                      title={t}
                      isWatched={watched.has(t.id)}
                      isNextUp={t.id === nextUpId}
                      onToggle={toggle}
                      onOpenDetail={() => setDetailModalId(t.id)}
                      rating={ratings[t.id]}
                      hasNote={!!notes[t.id]}
                      isRandomPick={t.id === randomPickId}
                      isLocked={isLocked}
                      lockTier={lockTier}
                      isPlanned={isPlanned}
                    />
                  )
                })}
              </ul>
            )}
          </main>

          {/* ── Random Pick / Wheel floating button ── */}
          <div className="fixed bottom-20 right-4 z-20 flex flex-col items-end gap-2">
            {randomPickId && (() => {
              const pick = TITLES.find(t => t.id === randomPickId)
              return pick ? (
                <div
                  className="bg-[#0f0f0f] border border-[#F5C518]/40 rounded-xl px-4 py-3 max-w-[220px] shadow-2xl"
                  style={{ animation: 'slideUp 0.25s ease both' }}
                >
                  <p className="text-[9px] text-[#F5C518] uppercase tracking-widest mb-1">🎲 Random Pick</p>
                  <p className="text-white text-xs font-medium leading-snug line-clamp-2">{pick.title}</p>
                  <div className="flex gap-2 mt-2.5">
                    <button onClick={() => handleRandomPick(null)}
                      className="flex-1 text-[10px] text-[#555] hover:text-white border border-[#222] rounded-lg py-1 transition-colors">
                      Skip
                    </button>
                    <button onClick={() => { toggle(pick.id); setRandomPickId(null) }}
                      className="flex-1 text-[10px] text-[#E81C2E] border border-[#E81C2E]/30 rounded-lg py-1 hover:bg-[#E81C2E]/10 transition-colors">
                      Watch!
                    </button>
                    <button onClick={() => setRandomPickId(null)}
                      className="flex-1 text-[10px] text-[#555] hover:text-white border border-[#222] rounded-lg py-1 transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              ) : null
            })()}
            <button
              onClick={() => setShowWheel(true)}
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-2xl shadow-2xl transition-all hover:scale-110 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #E81C2E 0%, #b01020 100%)',
                boxShadow: '0 0 20px rgba(232,28,46,0.4)',
              }}
              title="Spin the Randomizer Wheel"
            >
              🎲
            </button>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ACHIEVEMENTS TAB                                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'achievements' && (
        <Achievements achievements={achievements} watchHistory={watchHistory}
          loginDates={loginDates} watched={watched}/>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* STATS TAB                                                               */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'stats' && (
        <StatsPage
          watched={watched}
          watchHistory={watchHistory}
          loginDates={loginDates}
          config={config}
          ratings={ratings}
          goal={goal}
          onSetGoal={setGoal}
          reminder={reminder}
          onSetReminder={setReminder}
          profile={profile}
          planner={planner}
          onScheduleTitle={handleScheduleTitle}
          titles={listTitles}
        />
      )}

      {/* ── Bottom nav ── */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, background: '#111111', borderTop: '1px solid #2a2a2a' }}>
        <div className="max-w-lg mx-auto flex">
          {[
            {
              id: 'tracker', label: 'TRACKER', badge: null,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V3a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v15.75m-18 0H3m16.5 0h1.5m-1.5 0V3.375M6 18.375V3.375m12 15V3.375M6 3.375h12"/>
                </svg>
              ),
            },
            {
              id: 'achievements', label: 'AWARDS', badge: unlockedAchievements,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"/>
                </svg>
              ),
            },
            {
              id: 'stats', label: 'STATS', badge: null,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
                </svg>
              ),
            },
            {
              id: 'profile', label: 'PROFILE', badge: null, isProfileTab: true,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                </svg>
              ),
            },
          ].map(tab => {
            const isActive = tab.isProfileTab ? showProfile : (activeTab === tab.id && !showProfile)
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.isProfileTab) { setShowProfile(true) }
                  else { setActiveTab(tab.id); setShowProfile(false) }
                }}
                className={[
                  'flex-1 flex flex-col items-center gap-1 py-3 transition-all relative',
                  isActive ? 'text-[#E81C2E]' : 'text-[#666] hover:text-[#999]',
                ].join(' ')}
              >
                {tab.icon}
                <span className="font-bebas text-[10px] tracking-widest">{tab.label}</span>
                {tab.badge != null && tab.badge > 0 && (
                  <span className="absolute top-2 right-[calc(50%-14px)] w-4 h-4 rounded-full bg-[#F5C518] text-black text-[9px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#E81C2E] rounded-full"/>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Fade at list bottom */}
      {activeTab === 'tracker' && (
        <div className="fixed bottom-16 inset-x-0 h-12 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)' }}/>
      )}
    </div>
  )
}
