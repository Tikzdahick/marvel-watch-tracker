import TriviaRankBadge from './TriviaRankBadge.jsx'
import { getRank, getNextRank, getPointsToNext, getRankProgress } from './data/triviaRanks.js'

const ERA_LABELS = {
  blade: 'Blade Era',
  xmen: 'X-Men Era',
  early: 'Early MCU',
  netflix: 'Netflix Era',
  infinity: 'Infinity Saga',
  disney: 'Disney+ Era',
  recent: 'Recent',
}

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getLast14Days() {
  const days = []
  const today = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    days.push({ iso, abbr: DAY_ABBR[d.getDay()], isToday: i === 0 })
  }
  return days
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-4 flex flex-col items-center gap-1 text-center">
      <span className="font-bebas text-2xl text-[#F5C518]">{value}</span>
      <span style={{ fontSize: 11, color: '#555' }}>{label}</span>
    </div>
  )
}

export default function TriviaHistorySection({ triviaState = {} }) {
  const {
    points = 0,
    totalAnswered = 0,
    totalCorrect = 0,
    bestStreak = 0,
    answers = {},
    pointsHistory = {},
    eraCorrect = {},
  } = triviaState

  const daysPlayed = Object.keys(answers).length
  const correctPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) + '%' : '—'

  const last14 = getLast14Days()
  const maxPts = Math.max(...last14.map(d => pointsHistory[d.iso] ?? 0), 1)

  const rank = getRank(points)
  const nextRank = getNextRank(points)
  const ptsToNext = getPointsToNext(points)
  const progress = getRankProgress(points)

  // Top 3 eras
  const eraEntries = Object.entries(eraCorrect)
    .map(([key, count]) => ({ key, label: ERA_LABELS[key] ?? key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
  const maxEraCount = eraEntries[0]?.count ?? 1

  return (
    <div className="rounded-2xl border border-[#1e1e1e] bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#161616] flex items-center gap-2">
        <span style={{ fontSize: 18 }}>📊</span>
        <h2 className="font-bebas text-lg text-white tracking-wider">TRIVIA STATS</h2>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* 1. Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Points" value={points.toLocaleString()} />
          <StatCard label="Correct %" value={correctPct} />
          <StatCard label="Best Streak" value={bestStreak} />
          <StatCard label="Days Played" value={daysPlayed} />
        </div>

        {/* 2. Points Per Day Chart */}
        <div>
          <h3 className="font-bebas text-sm text-[#555] tracking-widest mb-3">POINTS LAST 14 DAYS</h3>
          <div className="overflow-x-auto pb-1">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, minWidth: last14.length * 30 }}>
              {last14.map(({ iso, abbr, isToday }) => {
                const pts = pointsHistory[iso] ?? 0
                const barH = pts > 0 ? Math.max(4, Math.round((pts / maxPts) * 64)) : 4
                const hasData = pts > 0
                return (
                  <div key={iso} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, minWidth: 24 }}>
                    <span style={{ fontSize: 9, color: '#444' }}>{pts > 0 ? pts : ''}</span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 24,
                        height: barH,
                        background: hasData ? '#F5C518' : '#1a1a1a',
                        borderRadius: 3,
                        border: isToday ? '1px solid #E81C2E' : '1px solid transparent',
                        transition: 'height 0.3s ease',
                      }}
                    />
                    <span style={{ fontSize: 9, color: isToday ? '#E81C2E' : '#444', fontWeight: isToday ? 700 : 400 }}>
                      {abbr}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 3. Era Mastery */}
        <div>
          <h3 className="font-bebas text-sm text-[#555] tracking-widest mb-3">ERA MASTERY</h3>
          {eraEntries.length === 0 ? (
            <p style={{ fontSize: 12, color: '#444', textAlign: 'center' }}>
              Answer more questions to see your era expertise!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {eraEntries.map(({ key, label, count }) => {
                const rel = count / maxEraCount
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: '#aaa' }}>{label}</span>
                      <span style={{ fontSize: 12, color: '#555' }}>{count} correct</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${rel * 100}%`,
                        background: 'linear-gradient(90deg, #F5C518, #E81C2E)',
                        borderRadius: 3,
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 4. Rank Progress */}
        <div>
          <h3 className="font-bebas text-sm text-[#555] tracking-widest mb-3">RANK PROGRESS</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <TriviaRankBadge points={points} size="lg" showLabel={false} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="font-bebas text-base" style={{ color: rank.color }}>{rank.label}</span>
                <span style={{ fontSize: 12, color: '#555' }}>{points.toLocaleString()} pts</span>
              </div>
              {nextRank ? (
                <>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{
                      height: '100%',
                      width: `${progress * 100}%`,
                      background: rank.gradient ?? rank.color,
                      borderRadius: 3,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <p style={{ fontSize: 11, color: '#555', margin: 0 }}>
                    {ptsToNext} pts to <span style={{ color: nextRank.color }}>{nextRank.label}</span>
                  </p>
                </>
              ) : (
                <p className="font-bebas text-sm" style={{ color: rank.color, margin: 0 }}>
                  MAX RANK ACHIEVED ✦
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
