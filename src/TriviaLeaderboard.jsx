import { useState } from 'react'
import TriviaRankBadge from './TriviaRankBadge.jsx'
import { getRank } from './data/triviaRanks.js'
import { SUPABASE_ENABLED } from './hooks/useAuth.js'

const TABS = [
  { key: 'alltime', label: 'ALL TIME' },
  { key: 'weekly', label: 'THIS WEEK' },
  { key: 'friends', label: 'FRIENDS' },
]

const RANK_NUM_COLOR = {
  1: '#F5C518',
  2: '#aaa',
  3: '#cd7f32',
}

function RankNumber({ n }) {
  const color = RANK_NUM_COLOR[n] ?? '#444'
  return (
    <span className="font-bebas text-lg" style={{ color, minWidth: 24, textAlign: 'center' }}>
      {n}
    </span>
  )
}

function Avatar({ username }) {
  const initials = (username ?? 'U').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: 'rgba(232,28,46,0.2)',
      border: '1px solid rgba(232,28,46,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, color: '#E81C2E', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function LeaderboardRow({ rank, username, points, streak, triviaPoints, isYou }) {
  const rankObj = getRank(triviaPoints ?? points ?? 0)
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-[#161616]"
      style={{ background: isYou ? 'rgba(232,28,46,0.06)' : undefined }}
    >
      <RankNumber n={rank} />
      <TriviaRankBadge points={triviaPoints ?? points ?? 0} size="xs" />
      <Avatar username={username} />
      <span
        className="flex-1 text-sm font-medium truncate"
        style={{ color: isYou ? '#E81C2E' : '#ccc' }}
      >
        {isYou ? 'YOU' : username}
      </span>
      <div className="flex flex-col items-end gap-0.5">
        <span className="font-bebas text-lg text-[#F5C518]">{(triviaPoints ?? points ?? 0).toLocaleString()}</span>
        {streak > 0 && (
          <span style={{ fontSize: 11, color: '#555' }}>{streak} day streak</span>
        )}
      </div>
    </div>
  )
}

export default function TriviaLeaderboard({ userId, triviaState = {}, onClose }) {
  const [tab, setTab] = useState('alltime')

  const userPoints = triviaState.points ?? 0
  const userStreak = triviaState.streak ?? 0

  return (
    <div
      className="fixed inset-0 bg-[#0a0a0a] z-40 flex flex-col"
      style={{ fontFamily: 'inherit' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#161616]">
        <button
          onClick={onClose}
          className="text-[#555] hover:text-white transition-colors p-1"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="font-bebas text-2xl text-white tracking-wider flex-1">TRIVIA LEADERBOARD</h1>
        <span style={{ fontSize: 20 }}>🏆</span>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-[#161616]">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 py-3 font-bebas text-sm tracking-wider transition-colors"
            style={{
              color: tab === t.key ? '#E81C2E' : '#555',
              borderBottom: tab === t.key ? '2px solid #E81C2E' : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!SUPABASE_ENABLED ? (
          <LocalOnlyView userPoints={userPoints} userStreak={userStreak} />
        ) : (
          <SupabaseStubView tab={tab} />
        )}
      </div>
    </div>
  )
}

function LocalOnlyView({ userPoints, userStreak }) {
  return (
    <div>
      <LeaderboardRow
        rank={1}
        username="YOU"
        points={userPoints}
        triviaPoints={userPoints}
        streak={userStreak}
        isYou={true}
      />
      <div className="mx-4 mt-4 p-4 rounded-xl border border-[#1e1e1e] bg-[#111] text-center">
        <p style={{ fontSize: 28, marginBottom: 8 }}>🏆</p>
        <p className="font-bebas text-base text-[#F5C518] tracking-wide mb-1">
          Connect Supabase to see global rankings and compete with friends!
        </p>
        <p style={{ fontSize: 12, color: '#555' }}>
          Your stats are saved locally. Enable Supabase to join the global leaderboard.
        </p>
      </div>
    </div>
  )
}

function SupabaseStubView({ tab }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 px-6 text-center">
      <p style={{ fontSize: 48 }}>🏆</p>
      <p className="font-bebas text-xl text-[#444] tracking-wide">
        {tab === 'friends' ? 'No friends yet!' : 'Be the first on the leaderboard!'}
      </p>
      <p style={{ fontSize: 13, color: '#333' }}>
        {tab === 'friends'
          ? 'Add friends to see how you compare.'
          : 'Answer trivia questions to earn points and climb the ranks.'}
      </p>
    </div>
  )
}
