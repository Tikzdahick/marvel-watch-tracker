import { useState, useMemo } from 'react'
import { TRIVIA_QUESTIONS } from './data/trivia.js'
import { getWeekStart } from './data/triviaRanks.js'

// ─── Seeded PRNG (mulberry32) ────────────────────────────────────────────────
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function getDuelQuestions(userId, targetId, weekStart, count = 10) {
  const seed = hashString(`${userId}|${targetId}|${weekStart}`)
  const rand = mulberry32(seed)
  const total = TRIVIA_QUESTIONS.length
  const indices = new Set()
  while (indices.size < Math.min(count, total)) {
    indices.add(Math.floor(rand() * total))
  }
  return Array.from(indices).map(i => TRIVIA_QUESTIONS[i])
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function Avatar({ username, size = 36 }) {
  const initials = (username ?? 'U').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'rgba(232,28,46,0.2)',
      border: '1px solid rgba(232,28,46,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: '#E81C2E', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function OptionButton({ label, text, onClick, selected, correct, revealed }) {
  let bg = 'rgba(255,255,255,0.04)'
  let border = '#222'
  let color = '#ccc'

  if (revealed) {
    if (correct) { bg = 'rgba(74,222,128,0.15)'; border = '#4ade80'; color = '#4ade80' }
    else if (selected && !correct) { bg = 'rgba(232,28,46,0.15)'; border = '#E81C2E'; color = '#E81C2E' }
  } else if (selected) {
    bg = 'rgba(245,197,24,0.1)'; border = '#F5C518'; color = '#F5C518'
  }

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      style={{
        width: '100%', padding: '12px 16px',
        background: bg, border: `1px solid ${border}`, borderRadius: 10,
        color, fontSize: 14, textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 10,
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{ fontWeight: 700, minWidth: 20, opacity: 0.6 }}>{label}</span>
      <span>{text}</span>
    </button>
  )
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'challenge', label: 'CHALLENGE' },
  { key: 'pending', label: 'PENDING' },
  { key: 'duel', label: 'DUEL' },
]

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TriviaDuelModal({ userId, friends = [], triviaState = {}, onClose }) {
  const [tab, setTab] = useState('challenge')

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: '#0a0a0a', display: 'flex', flexDirection: 'column',
        fontFamily: 'inherit',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 16px 0',
        borderBottom: '1px solid #161616',
        paddingBottom: 12,
      }}>
        <button
          onClick={onClose}
          style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'var(--font-bebas, sans-serif)', fontSize: 22, color: '#fff', letterSpacing: 2, flex: 1, margin: 0 }}>
          TRIVIA DUELS
        </h1>
        <span style={{ fontSize: 22 }}>⚔️</span>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #161616' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '12px 0',
              fontFamily: 'var(--font-bebas, sans-serif)', fontSize: 13, letterSpacing: 2,
              color: tab === t.key ? '#E81C2E' : '#555',
              borderBottom: tab === t.key ? '2px solid #E81C2E' : '2px solid transparent',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'challenge' && (
          <ChallengeTab friends={friends} userId={userId} onStartDuel={() => setTab('duel')} />
        )}
        {tab === 'pending' && <PendingTab />}
        {tab === 'duel' && (
          <DuelTab userId={userId} friends={friends} />
        )}
      </div>
    </div>
  )
}

// ─── Challenge Tab ────────────────────────────────────────────────────────────
function ChallengeTab({ friends, userId, onStartDuel }) {
  const [challenged, setChallenged] = useState({})

  if (!friends || friends.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ fontSize: 36, marginBottom: 12 }}>👥</p>
        <p style={{ fontFamily: 'var(--font-bebas, sans-serif)', fontSize: 18, color: '#444', letterSpacing: 1 }}>
          NO FRIENDS YET
        </p>
        <p style={{ fontSize: 13, color: '#333', marginTop: 6 }}>
          Add friends to challenge them to a trivia duel!
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>
        Pick a friend to challenge — you&apos;ll both answer the same 10 questions!
      </p>
      {friends.map(f => (
        <div key={f.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid #1a1a1a', borderRadius: 12,
        }}>
          <Avatar username={f.username} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#ccc', fontWeight: 600 }}>{f.username}</p>
            {f.streak > 0 && (
              <p style={{ margin: 0, fontSize: 11, color: '#555' }}>{f.streak} day streak</p>
            )}
          </div>
          {challenged[f.id] ? (
            <span style={{ fontSize: 12, color: '#4ade80' }}>✓ Sent!</span>
          ) : (
            <button
              onClick={() => setChallenged(prev => ({ ...prev, [f.id]: true }))}
              style={{
                padding: '6px 14px',
                background: 'rgba(232,28,46,0.15)',
                border: '1px solid rgba(232,28,46,0.4)',
                borderRadius: 8, color: '#E81C2E',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Challenge
            </button>
          )}
        </div>
      ))}
      {Object.keys(challenged).length > 0 && (
        <div style={{
          marginTop: 8, padding: 12,
          background: 'rgba(74,222,128,0.08)',
          border: '1px solid rgba(74,222,128,0.2)',
          borderRadius: 10, textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#4ade80' }}>
            Challenge sent! They&apos;ll be notified.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Pending Tab ──────────────────────────────────────────────────────────────
function PendingTab() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <p style={{ fontSize: 36, marginBottom: 12 }}>⏳</p>
      <p style={{ fontFamily: 'var(--font-bebas, sans-serif)', fontSize: 18, color: '#444', letterSpacing: 1 }}>
        NO PENDING CHALLENGES
      </p>
      <p style={{ fontSize: 13, color: '#333', marginTop: 6 }}>
        Challenge a friend to start a duel!
      </p>
      <div style={{
        marginTop: 16, padding: 12,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid #1a1a1a', borderRadius: 10,
      }}>
        <p style={{ margin: 0, fontSize: 12, color: '#333' }}>
          💡 Enable Supabase to receive real-time duel notifications from friends.
        </p>
      </div>
    </div>
  )
}

// ─── Duel Tab (Local Play) ────────────────────────────────────────────────────
function DuelTab({ userId, friends }) {
  const today = new Date().toISOString().split('T')[0]
  const weekStart = getWeekStart(today)

  // For the local duel, use first friend or a self-duel seed
  const targetId = friends?.[0]?.id ?? 'practice'

  const questions = useMemo(
    () => getDuelQuestions(userId ?? 'local', targetId, weekStart, 10),
    [userId, targetId, weekStart]
  )

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  if (questions.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#444' }}>
        No questions available.
      </div>
    )
  }

  if (finished) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ fontSize: 48, marginBottom: 12 }}>
          {score >= 8 ? '🏆' : score >= 5 ? '⚡' : '💪'}
        </p>
        <p style={{ fontFamily: 'var(--font-bebas, sans-serif)', fontSize: 28, color: '#F5C518', letterSpacing: 2 }}>
          DUEL COMPLETE!
        </p>
        <p style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '12px 0' }}>
          You scored {score}/{questions.length}
        </p>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>
          {score === questions.length
            ? 'Perfect score! You are truly a Marvel master.'
            : score >= 7
            ? 'Great job! Keep training to reach perfection.'
            : 'Keep watching and learning — you\'ll get there!'}
        </p>
        <button
          onClick={() => {
            setCurrent(0); setSelected(null); setRevealed(false)
            setScore(0); setFinished(false)
          }}
          style={{
            padding: '12px 28px',
            background: 'rgba(232,28,46,0.15)',
            border: '1px solid rgba(232,28,46,0.4)',
            borderRadius: 10, color: '#E81C2E',
            fontFamily: 'var(--font-bebas, sans-serif)',
            fontSize: 16, letterSpacing: 2, cursor: 'pointer',
          }}
        >
          PLAY AGAIN
        </button>
      </div>
    )
  }

  const q = questions[current]
  const LABELS = ['A', 'B', 'C', 'D']

  function handleSelect(idx) {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    if (idx === q.correctIndex) setScore(s => s + 1)
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: '#555' }}>
          Question <span style={{ color: '#F5C518', fontWeight: 700 }}>{current + 1}</span> / {questions.length}
        </span>
        <span style={{ fontSize: 13, color: '#555' }}>
          Score: <span style={{ color: '#4ade80', fontWeight: 700 }}>{score}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 2, background: '#1a1a1a', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${((current) / questions.length) * 100}%`,
          background: 'linear-gradient(90deg, #E81C2E, #F5C518)',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Question */}
      <div style={{
        padding: 20, background: 'rgba(255,255,255,0.03)',
        border: '1px solid #1a1a1a', borderRadius: 14,
      }}>
        <p style={{ margin: 0, fontSize: 16, color: '#fff', lineHeight: 1.5, fontWeight: 600 }}>
          {q.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.options.map((opt, i) => (
          <OptionButton
            key={i}
            label={LABELS[i]}
            text={opt}
            onClick={() => handleSelect(i)}
            selected={selected === i}
            correct={i === q.correctIndex}
            revealed={revealed}
          />
        ))}
      </div>

      {/* Next button */}
      {revealed && (
        <button
          onClick={handleNext}
          style={{
            padding: '14px',
            background: 'rgba(245,197,24,0.1)',
            border: '1px solid rgba(245,197,24,0.3)',
            borderRadius: 10, color: '#F5C518',
            fontFamily: 'var(--font-bebas, sans-serif)',
            fontSize: 16, letterSpacing: 2, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {current + 1 >= questions.length ? 'SEE RESULTS' : 'NEXT QUESTION →'}
        </button>
      )}
    </div>
  )
}
