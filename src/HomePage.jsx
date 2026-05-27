/**
 * HomePage — cinematic Marvel landing screen.
 *
 * Shows after login/onboarding as the first thing users see.
 * Props:
 *   profile:      { name, avatar }
 *   stats:        { watchedCount, total, remaining, pct, unlockedAchievements }
 *   nextUp:       title object | null
 *   loginDates:   string[]
 *   watchHistory: { [dateStr]: number }
 *   onNavigate:   (tabId) → void
 */

import { useMemo, useState, useEffect } from 'react'
import { AvatarDisplay } from './AvatarDisplay.jsx'
import { calcStreak } from './data/achievements.js'
import XPProgressBar from './XPProgressBar.jsx'
import DailyMissionsWidget from './DailyMissionsWidget.jsx'
import WeeklySeasonWidget from './WeeklySeasonWidget.jsx'
import DebateWidget from './DebateWidget.jsx'
import { MCU_PHASES, INFINITY_STONES } from './data/marvelExtras.js'

const STONE_KEY = 'mvt-stones-seen'
function loadStonesSeen() { try { return JSON.parse(localStorage.getItem(STONE_KEY) ?? '[]') } catch { return [] } }
function saveStonesSeen(v) { try { localStorage.setItem(STONE_KEY, JSON.stringify(v)) } catch {} }

const DOOMSDAY = new Date('2026-12-18T00:00:00')

function getDaysLeft() {
  return Math.max(0, Math.floor((DOOMSDAY.getTime() - Date.now()) / 86400000))
}

function getDoomsdayMessage(pct, daysLeft) {
  if (pct >= 100) return { msg: 'Mission complete. The Multiverse is grateful.', color: '#F5C518' }
  if (pct >= 90)  return { msg: "You're nearly there. One last push before Doomsday.", color: '#F5C518' }
  if (pct >= 75)  return { msg: 'Outstanding progress. The Avengers would approve.', color: '#4ade80' }
  if (pct >= 50)  return { msg: "Halfway through the Multiverse Saga. Keep assembling.", color: '#60a5fa' }
  if (pct >= 25)  return { msg: 'Your saga has begun. Many battles lie ahead.', color: '#F5C518' }
  if (daysLeft < 90) return { msg: '⚠️ Doomsday is closer than you think. Time to assemble.', color: '#E81C2E' }
  return { msg: 'Every Avenger started as a beginner. Begin your saga.', color: '#666' }
}

function pad2(n) { return String(n).padStart(2, '0') }

function useCountdown(target) {
  const [cd, setCd] = useState(() => calcDiff(target))
  useEffect(() => {
    const id = setInterval(() => setCd(calcDiff(target)), 1000)
    return () => clearInterval(id)
  }, [target])
  return cd
}

function calcDiff(target) {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function HomeStat({ label, value, color }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col items-center text-center"
      style={{ background: '#0f0f0f', border: '1px solid #1a1a1a' }}
    >
      <span className="font-bebas text-3xl leading-none mb-1" style={{ color }}>{value}</span>
      <span className="text-[9px] text-[#444] uppercase tracking-widest">{label}</span>
    </div>
  )
}

function QuickCard({ icon, label, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.97] group"
      style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
        style={{ background: color + '18', border: `1px solid ${color}30` }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-white text-[13px] font-semibold leading-snug">{label}</div>
        <div className="text-[#444] text-[10px] mt-0.5 truncate">{sub}</div>
      </div>
    </button>
  )
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-bebas text-2xl text-[#E81C2E] leading-none tracking-widest">
        {pad2(value)}
      </span>
      <span className="text-[8px] text-[#444] uppercase tracking-widest mt-0.5">{label}</span>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function HomePage({
  profile, stats, nextUp, loginDates, watchHistory, onNavigate,
  dailyFact, triviaState, parties, activeMood,
  onOpenMoodPicker, onOpenTrivia, onOpenWatchParty, onOpenTierList,
  xp = 0, weeklyState = {}, seasonState = {}, debateState = {}, onDebateVote,
  onSelectFranchise,
  watched,         // Set of watched IDs — for phase progress + stone tracker
  allTitles = [],  // full list of titles for phase lookup
}) {
  const { watchedCount, total, remaining, pct, unlockedAchievements } = stats

  // Infinity stone seen tracking (localStorage)
  const [stonesSeen, setStonesSeen] = useState(loadStonesSeen)
  function toggleStoneSeen(id) {
    setStonesSeen(prev => {
      const next = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
      saveStonesSeen(next)
      return next
    })
  }

  // Phase progress
  const phaseStats = useMemo(() => {
    if (!watched) return []
    return MCU_PHASES.map(phase => {
      const phaseTitles = phase.ids.filter(id => allTitles.some(t => t.id === id))
      const watchedHere = phaseTitles.filter(id => watched.has(id)).length
      return { ...phase, total: phaseTitles.length, watchedHere }
    }).filter(p => p.total > 0)
  }, [watched, allTitles])

  const loginStreak  = useMemo(() => calcStreak(loginDates ?? []), [loginDates])
  const watchDates   = useMemo(() => Object.keys(watchHistory ?? {}), [watchHistory])
  const watchStreak  = useMemo(() => calcStreak(watchDates), [watchDates])
  const activeStreak = Math.max(loginStreak, watchStreak)

  const cd       = useCountdown(DOOMSDAY)
  const daysLeft = cd.days
  const { msg: doomMsg, color: doomColor } = getDoomsdayMessage(pct, daysLeft)

  const firstName = (profile?.name ?? 'Agent').split(' ')[0]

  // Per-week needed to finish by Doomsday
  const weeksLeft   = Math.max(1, daysLeft / 7)
  const perWeekNeeded = Math.ceil(remaining / weeksLeft)

  return (
    <div
      className="min-h-screen flex flex-col pb-24"
      style={{ background: '#0a0a0a', animation: 'fadeIn 0.35s ease both' }}
    >
      {/* ── Hero banner ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a0000 0%, #0e0000 45%, #0a0a0a 100%)',
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(232,28,46,0.18) 0%, transparent 65%)',
          }}
        />

        {/* Decorative grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(232,28,46,1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,28,46,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-lg mx-auto px-5 pt-14 pb-8 relative">

          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex flex-col gap-1.5">
              <div className="w-1.5 h-4 bg-[#E81C2E] rounded-full"/>
              <div className="w-1.5 h-4 bg-[#F5C518] rounded-full"/>
            </div>
            <div>
              <div className="font-bebas text-[10px] tracking-[0.35em] text-[#E81C2E] leading-none mb-0.5">MARVEL</div>
              <div className="font-bebas text-[20px] tracking-[0.15em] text-white leading-none">WATCH TRACKER</div>
            </div>
          </div>

          {/* Avatar + welcome row */}
          <div className="flex items-center gap-4 mb-7">
            <AvatarDisplay avatar={profile?.avatar} name={profile?.name} size="home"/>
            <div className="flex-1 min-w-0">
              <div className="text-[#555] text-[10px] uppercase tracking-widest mb-1">Welcome back</div>
              <div className="font-bebas text-[32px] text-white tracking-wide leading-none truncate">
                {firstName}
              </div>
              {activeStreak > 1 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-sm">🔥</span>
                  <span className="font-semibold text-[12px]" style={{ color: '#F5C518' }}>
                    {activeStreak}-day streak
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <HomeStat label="Watched"   value={watchedCount} color="#E81C2E"/>
            <HomeStat label="Remaining" value={remaining}    color="#fff"/>
            <HomeStat label="Complete"  value={`${pct}%`}   color="#F5C518"/>
          </div>

          {/* Progress bar */}
          <div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #E81C2E 0%, #ff4d5e 60%, #F5C518 100%)',
                  transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-[#333]">0</span>
              <span className="text-[9px] text-[#555] font-mono">{watchedCount} / {total} titles</span>
              <span className="text-[9px] text-[#333]">{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-lg mx-auto px-5 w-full space-y-4 mt-5">

        {/* ── Franchise Selector ── */}
        {onSelectFranchise && (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1a1a1a', background: '#0f0f0f' }}>
            <div className="px-4 pt-3 pb-2">
              <div className="text-[9px] text-[#444] uppercase tracking-widest font-semibold">Choose Your Universe</div>
            </div>
            <div className="grid grid-cols-2 gap-0">
              {/* Marvel */}
              <div className="flex flex-col items-center gap-2 px-4 py-4 border-r border-[#1a1a1a] rounded-bl-2xl"
                style={{ background: 'rgba(232,28,46,0.06)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl"
                  style={{ background: 'linear-gradient(135deg, #E81C2E 0%, #a0001a 100%)', color: 'white', boxShadow: '0 0 16px rgba(232,28,46,0.4)' }}
                >
                  M
                </div>
                <div className="text-center">
                  <div className="font-bebas text-[15px] tracking-widest text-white">MARVEL</div>
                  <div className="text-[9px] text-[#444]">107 titles</div>
                </div>
                <div className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-lg"
                  style={{ background: 'rgba(232,28,46,0.15)', color: '#E81C2E', border: '1px solid rgba(232,28,46,0.25)' }}
                >
                  ✓ ACTIVE
                </div>
              </div>
              {/* DC */}
              <button
                onClick={() => onSelectFranchise('dc')}
                className="flex flex-col items-center gap-2 px-4 py-4 transition-all active:scale-[0.97] rounded-br-2xl group"
                style={{ background: 'rgba(255,215,0,0.03)' }}
              >
                <div className="w-10 h-10 flex items-center justify-center font-black text-base text-black flex-shrink-0 transition-all group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #d4a017 100%)',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    boxShadow: '0 0 16px rgba(255,215,0,0.3)',
                  }}
                >
                  DC
                </div>
                <div className="text-center">
                  <div className="font-bebas text-[15px] tracking-widest text-white">DC UNIVERSE</div>
                  <div className="text-[9px] text-[#444]">32 titles</div>
                </div>
                <div className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-lg transition-all group-hover:opacity-100 opacity-70"
                  style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}
                >
                  SWITCH →
                </div>
              </button>
            </div>
          </div>
        )}

        {/* XP Level Bar */}
        <XPProgressBar xp={xp} compact={false}/>

        {/* Motivational message */}
        <div
          className="rounded-2xl px-5 py-4"
          style={{ background: '#0f0f0f', border: `1px solid ${doomColor}22` }}
        >
          <p className="text-[13px] leading-relaxed font-medium italic" style={{ color: doomColor }}>
            "{doomMsg}"
          </p>
        </div>

        {/* Daily Missions */}
        <DailyMissionsWidget
          dateStr={new Date().toISOString().slice(0, 10)}
          activity={{
            watchedToday: Object.values(watchHistory ?? {}).filter(ids => {
              const today = new Date().toISOString().slice(0, 10)
              return Object.keys(watchHistory ?? {}).includes(today)
            }).length,
            loggedIn: true,
            triviaAnswered: !!(triviaState?.answers?.[new Date().toISOString().slice(0, 10)]),
            currentStreak: calcStreak(Object.keys(watchHistory ?? {})),
          }}
          onNavigate={onNavigate}
        />

        {/* Weekly Challenge + Season Pass */}
        <WeeklySeasonWidget
          dateStr={new Date().toISOString().slice(0, 10)}
          weeklyState={weeklyState}
          seasonState={seasonState}
          onNavigate={onNavigate}
        />

        {/* Next Up */}
        {nextUp && (
          <div>
            <div className="text-[9px] text-[#444] uppercase tracking-widest mb-2 font-semibold">▶ Up Next</div>
            <button
              onClick={() => onNavigate('tracker')}
              className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98] group"
              style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
            >
              <div className="flex items-center gap-4">
                {/* Play icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(232,28,46,0.12)', border: '1px solid rgba(232,28,46,0.25)' }}
                >
                  <svg className="w-5 h-5" style={{ color: '#E81C2E' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-white font-semibold text-[15px] leading-snug group-hover:text-[#E81C2E] transition-colors mb-0.5"
                  >
                    {nextUp.title}
                  </div>
                  <div className="text-[#555] text-[11px] capitalize">{nextUp.type}</div>
                </div>
                <svg
                  className="w-4 h-4 text-[#333] group-hover:text-[#E81C2E] transition-colors flex-shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Continue Watching CTA */}
        <button
          onClick={() => onNavigate('tracker')}
          className="w-full py-5 rounded-2xl font-bebas text-[22px] tracking-[0.15em] text-white transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #E81C2E 0%, #b01020 100%)',
            boxShadow: '0 0 40px rgba(232,28,46,0.3), 0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          ▶ CONTINUE WATCHING
        </button>

        {/* Quick access grid */}
        <div>
          <div className="text-[9px] text-[#444] uppercase tracking-widest mb-2 font-semibold">Quick Access</div>
          <div className="grid grid-cols-2 gap-2.5">
            <QuickCard
              icon="🎬"
              label="Tracker"
              sub={`${remaining} left to watch`}
              color="#E81C2E"
              onClick={() => onNavigate('tracker')}
            />
            <QuickCard
              icon="🏆"
              label="Awards"
              sub={`${unlockedAchievements} unlocked`}
              color="#F5C518"
              onClick={() => onNavigate('achievements')}
            />
            <QuickCard
              icon="📊"
              label="Stats"
              sub="Charts & history"
              color="#60a5fa"
              onClick={() => onNavigate('stats')}
            />
            <QuickCard
              icon="👥"
              label="Social"
              sub="Friends & community"
              color="#a855f7"
              onClick={() => onNavigate('community')}
            />
          </div>
        </div>

        {/* Feature quick-access */}
        <div>
          <div className="text-[9px] text-[#444] uppercase tracking-widest mb-2 font-semibold">Features</div>
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={onOpenTierList}
              className="flex items-center gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.97]"
              style={{ background: '#0f0f0f', border: '1px solid rgba(245,197,24,0.15)' }}>
              <span className="text-xl">⭐</span>
              <div>
                <div className="text-white text-[13px] font-semibold">Tier List</div>
                <div className="text-[#444] text-[10px]">Rate your watches</div>
              </div>
            </button>
            <button onClick={onOpenTrivia}
              className="flex items-center gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.97]"
              style={{ background: '#0f0f0f', border: `1px solid rgba(96,165,250,${triviaState?.answers?.[new Date().toISOString().slice(0,10)] !== undefined ? '0.3' : '0.1'})` }}>
              <span className="text-xl">🎮</span>
              <div>
                <div className="text-white text-[13px] font-semibold">Daily Trivia</div>
                <div className="text-[#444] text-[10px]">
                  {triviaState?.streak > 0 ? `🔥 ${triviaState.streak}-day streak` : 'Play today\'s question'}
                </div>
              </div>
            </button>
            <button onClick={onOpenWatchParty}
              className="flex items-center gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.97]"
              style={{ background: '#0f0f0f', border: '1px solid rgba(168,85,247,0.15)' }}>
              <span className="text-xl">🎉</span>
              <div>
                <div className="text-white text-[13px] font-semibold">Watch Party</div>
                <div className="text-[#444] text-[10px]">
                  {parties?.length > 0 ? `${parties.length} scheduled` : 'Plan a viewing'}
                </div>
              </div>
            </button>
            <button onClick={onOpenMoodPicker}
              className="flex items-center gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.97]"
              style={{ background: '#0f0f0f', border: `1px solid ${activeMood ? 'rgba(232,28,46,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
              <span className="text-xl">😄</span>
              <div>
                <div className="text-white text-[13px] font-semibold">Mood Picker</div>
                <div className="text-[#444] text-[10px]">{activeMood ? `Feeling ${activeMood}` : "What's your mood?"}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Daily Debate */}
        <DebateWidget
          dateStr={new Date().toISOString().slice(0, 10)}
          debateState={debateState}
          onVote={onDebateVote}
        />

        {/* ── Phase Progress ── */}
        {phaseStats.length > 0 && watched && (
          <div className="rounded-2xl p-5" style={{ background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
            <div className="text-[9px] uppercase tracking-widest mb-4 font-semibold" style={{ color: '#444' }}>
              ⚡ MCU Phase Progress
            </div>
            <div className="space-y-3">
              {phaseStats.map(phase => {
                const p = phase.total > 0 ? Math.round((phase.watchedHere / phase.total) * 100) : 0
                return (
                  <div key={phase.key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px]">{phase.emoji}</span>
                        <span className="text-[11px] font-semibold text-white">{phase.label}</span>
                        <span className="text-[9px] hidden sm:inline" style={{ color: '#444' }}>{phase.sub}</span>
                      </div>
                      <span className="text-[10px] font-mono tabular-nums" style={{ color: p === 100 ? '#22c55e' : phase.color }}>
                        {phase.watchedHere}/{phase.total}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${p}%`, background: p === 100 ? '#22c55e' : phase.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Infinity Stone Tracker ── */}
        {watched && (
          <div className="rounded-2xl p-5" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: '#444' }}>
                ♾️ Infinity Stones
              </div>
              <span className="text-[10px] font-mono" style={{ color: '#F5C518' }}>
                {stonesSeen.length}/6 seen
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INFINITY_STONES.map(stone => {
                const seen = stonesSeen.includes(stone.id)
                const firstFilm = watched.size > 0
                const appeared = stone.appearances.some(a => watched.has(a.titleId))
                return (
                  <button
                    key={stone.id}
                    onClick={() => toggleStoneSeen(stone.id)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all active:scale-[0.97]"
                    style={{
                      background: seen ? `${stone.color}12` : '#111',
                      border: `1px solid ${seen ? stone.color + '50' : '#1e1e1e'}`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                      style={{
                        background: seen ? stone.color + '25' : '#1a1a1a',
                        border: `1px solid ${seen ? stone.color + '60' : '#252525'}`,
                        boxShadow: seen ? `0 0 10px ${stone.color}40` : 'none',
                      }}
                    >
                      {stone.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold truncate" style={{ color: seen ? stone.color : '#666' }}>
                        {stone.name}
                      </div>
                      <div className="text-[9px] truncate" style={{ color: '#444' }}>
                        {stone.alias}
                      </div>
                      {appeared && !seen && (
                        <div className="text-[9px] font-bold" style={{ color: stone.color + 'cc' }}>
                          ● appeared in your watches
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            {stonesSeen.length === 6 && (
              <div className="mt-3 text-center">
                <span className="text-[11px] font-bold" style={{ color: '#F5C518' }}>
                  🌟 All six Stones collected. Perfectly balanced.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Daily Fact */}
        {dailyFact && (
          <div
            className="rounded-2xl p-4"
            style={{ background: '#0f0f0f', border: '1px solid rgba(245,197,24,0.12)' }}
          >
            <div className="text-[9px] text-[#F5C518]/60 uppercase tracking-[0.3em] mb-2 font-semibold">💡 Did You Know?</div>
            <p className="text-[#aaa] text-[13px] leading-relaxed italic">"{dailyFact.fact}"</p>
          </div>
        )}

        {/* Doomsday countdown */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: '#0f0000', border: '1px solid rgba(232,28,46,0.15)' }}
        >
          <div className="text-[9px] uppercase tracking-[0.35em] mb-3" style={{ color: 'rgba(232,28,46,0.5)' }}>
            Avengers: Doomsday
          </div>

          {/* Live countdown */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <CountdownUnit value={cd.days}    label="Days"/>
            <span className="text-[#E81C2E]/40 font-bebas text-xl">:</span>
            <CountdownUnit value={cd.hours}   label="Hrs"/>
            <span className="text-[#E81C2E]/40 font-bebas text-xl">:</span>
            <CountdownUnit value={cd.minutes} label="Min"/>
            <span className="text-[#E81C2E]/40 font-bebas text-xl">:</span>
            <CountdownUnit value={cd.seconds} label="Sec"/>
          </div>

          <div className="text-[10px] text-[#444] mb-3">December 18, 2026</div>

          {pct < 100 && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px]"
              style={{ background: 'rgba(232,28,46,0.08)', border: '1px solid rgba(232,28,46,0.15)' }}
            >
              <span className="text-[#666]">To finish in time:</span>
              <span className="font-semibold" style={{ color: perWeekNeeded > 7 ? '#E81C2E' : '#F5C518' }}>
                {perWeekNeeded}/week
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
