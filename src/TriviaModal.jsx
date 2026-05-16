import { useState, useEffect } from 'react'

/** Returns today's date as YYYY-MM-DD in local time */
export function getTodayDateStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const LABELS = ['A', 'B', 'C', 'D']

/**
 * TriviaModal — Daily trivia question modal.
 *
 * Props:
 *   question:    { id, question, options: string[], correctIndex: number, titleId: number|null }
 *   triviaState: { score: number, streak: number, lastDate: string, answers: {[date]: bool} }
 *   dateStr:     string — today YYYY-MM-DD
 *   onAnswer:    (correct: boolean) => void
 *   onClose:     () => void
 */
export default function TriviaModal({ question, triviaState, dateStr, onAnswer, onClose }) {
  const alreadyAnswered = triviaState.answers?.[dateStr] !== undefined
  const answeredCorrect = triviaState.answers?.[dateStr] === true

  const [selected,   setSelected]   = useState(null)   // index of chosen answer
  const [locked,     setLocked]     = useState(false)
  const [feedback,   setFeedback]   = useState(null)   // 'correct' | 'wrong'
  const [revealed,   setRevealed]   = useState(false)

  // Format the date nicely: "Thursday, May 15"
  function formatDate(str) {
    const [y, m, d] = str.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  function handleAnswer(idx) {
    if (locked) return
    setSelected(idx)
    setLocked(true)
    const correct = idx === question.correctIndex
    setFeedback(correct ? 'correct' : 'wrong')
    setRevealed(true)
    setTimeout(() => {
      onAnswer(correct)
    }, 1500)
  }

  function buttonStyle(idx) {
    if (!revealed) {
      return 'bg-[#141414] border-[#2a2a2a] text-white hover:border-[#E81C2E]/60 hover:bg-[#1a1a1a]'
    }
    if (idx === question.correctIndex) {
      return 'bg-green-900/60 border-green-500 text-green-300'
    }
    if (idx === selected && idx !== question.correctIndex) {
      return 'bg-red-900/60 border-[#E81C2E] text-red-300'
    }
    return 'bg-[#141414] border-[#222] text-[#555]'
  }

  function buttonIcon(idx) {
    if (!revealed) return null
    if (idx === question.correctIndex) return <span className="ml-auto text-green-400 text-lg">✓</span>
    if (idx === selected && idx !== question.correctIndex) return <span className="ml-auto text-[#E81C2E] text-lg">✗</span>
    return null
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 10000, background: 'rgba(0,0,0,0.90)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden"
        style={{ animation: 'triviaSlideUp 0.3s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="px-5 pt-5 pb-4 border-b border-[#1a1a1a]"
          style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0408 100%)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bebas text-3xl tracking-widest text-white leading-none">
                DAILY TRIVIA
              </h2>
              <p className="text-[#555] text-xs mt-0.5">{formatDate(dateStr)}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {triviaState.streak > 0 && (
                <div className="flex items-center gap-1 bg-[#1a0e00] border border-[#F5C518]/30 rounded-full px-3 py-1">
                  <span className="text-sm">🔥</span>
                  <span className="font-bebas text-[#F5C518] tracking-wider text-sm">
                    {triviaState.streak}-DAY STREAK
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-[#0a0a0a] border border-[#222] rounded-full px-3 py-1">
                <span className="text-[#F5C518] text-xs">★</span>
                <span className="text-white text-xs font-bold">{triviaState.score}</span>
                <span className="text-[#555] text-xs">pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-5">
          {alreadyAnswered ? (
            /* Already answered view */
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-3xl ${
                  answeredCorrect
                    ? 'bg-green-900/40 border-2 border-green-500'
                    : 'bg-red-900/40 border-2 border-[#E81C2E]'
                }`}
              >
                {answeredCorrect ? '✓' : '✗'}
              </div>
              <p className={`font-bebas text-2xl tracking-widest mb-1 ${answeredCorrect ? 'text-green-400' : 'text-[#E81C2E]'}`}>
                {answeredCorrect ? 'CORRECT!' : 'WRONG!'}
              </p>
              <p className="text-[#888] text-sm mb-5">You already answered today's question.</p>

              <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl p-4 mb-5 text-left">
                <p className="text-[#888] text-xs mb-2 uppercase tracking-wider">Today's question</p>
                <p className="text-white text-sm font-medium mb-3">{question.question}</p>
                <p className="text-[#555] text-xs mb-1 uppercase tracking-wider">Correct answer</p>
                <p className="text-green-400 text-sm font-bold">
                  {LABELS[question.correctIndex]}. {question.options[question.correctIndex]}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="text-center">
                  <p className="font-bebas text-3xl text-[#F5C518] tracking-wide">{triviaState.score}</p>
                  <p className="text-[#555] text-xs">Total Score</p>
                </div>
                <div className="w-px h-10 bg-[#1e1e1e]" />
                <div className="text-center">
                  <p className="font-bebas text-3xl text-white tracking-wide">🔥 {triviaState.streak}</p>
                  <p className="text-[#555] text-xs">Day Streak</p>
                </div>
              </div>

              <p className="text-[#555] text-xs">Come back tomorrow for a new question!</p>
            </div>
          ) : (
            /* Question view */
            <>
              <p className="text-white text-base font-medium leading-snug mb-5">{question.question}</p>

              <div className="flex flex-col gap-2.5">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={locked}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${buttonStyle(idx)} ${
                      locked ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        revealed && idx === question.correctIndex
                          ? 'bg-green-700/60 text-green-300'
                          : revealed && idx === selected && idx !== question.correctIndex
                            ? 'bg-[#E81C2E]/30 text-[#E81C2E]'
                            : 'bg-[#1e1e1e] text-[#888]'
                      }`}
                    >
                      {LABELS[idx]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {buttonIcon(idx)}
                  </button>
                ))}
              </div>

              {/* Feedback banner */}
              {feedback && (
                <div
                  className={`mt-4 rounded-xl px-4 py-3 text-center font-bebas tracking-widest text-xl ${
                    feedback === 'correct'
                      ? 'bg-green-900/40 border border-green-600 text-green-300'
                      : 'bg-red-900/40 border border-[#E81C2E]/60 text-[#E81C2E]'
                  }`}
                  style={{ animation: 'triviaFeedback 0.25s ease both' }}
                >
                  {feedback === 'correct' ? '✓ CORRECT! +1' : '✗ WRONG!'}
                </div>
              )}

              {/* Score hint */}
              <p className="text-[#444] text-xs text-center mt-4">
                Answer every day to keep your streak!
              </p>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 pb-5 pt-0 flex justify-end">
          <button
            onClick={onClose}
            className="text-[#555] text-xs hover:text-[#888] transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes triviaSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97) }
          to   { opacity: 1; transform: translateY(0)    scale(1)    }
        }
        @keyframes triviaFeedback {
          from { opacity: 0; transform: scale(0.9) }
          to   { opacity: 1; transform: scale(1)   }
        }
      `}</style>
    </div>
  )
}
