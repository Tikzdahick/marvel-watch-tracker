import { useState } from 'react'

const LIST_OPTIONS = [
  {
    id: 'rookie',
    label: 'ROOKIE',
    icon: '🎬',
    count: '75 titles',
    desc: 'Movies only — jump straight to the action.',
    color: 'text-gray-300',
  },
  {
    id: 'hero',
    label: 'HERO',
    icon: '🦸',
    count: '91 titles',
    desc: 'Movies + all Disney+ originals.',
    color: 'text-blue-400',
  },
  {
    id: 'avenger',
    label: 'AVENGER',
    icon: '⚡',
    count: '98 titles',
    desc: 'Everything — including the Netflix Defenders saga.',
    color: 'text-[#F5C518]',
  },
  {
    id: 'infinity',
    label: 'INFINITY',
    icon: '✨',
    count: '105 titles',
    desc: 'Every. Single. Thing. Including animated.',
    color: 'text-purple-400',
  },
]

const PACE_OPTIONS = [
  {
    id: 'casual',
    label: 'CASUAL',
    icon: '😎',
    desc: 'No pressure. Just track what you watch.',
    sub: 'Chill mode',
  },
  {
    id: 'assembling',
    label: 'ASSEMBLING',
    icon: '🔨',
    desc: 'Finish 3 months before Avengers: Doomsday.',
    sub: 'Target: Sep 18, 2026',
  },
  {
    id: 'avenger',
    label: 'AVENGER',
    icon: '🛡',
    desc: 'Finish 1 month before Avengers: Doomsday.',
    sub: 'Target: Nov 18, 2026',
  },
  {
    id: 'thanos',
    label: 'THANOS MODE',
    icon: '💜',
    desc: 'Destiny arrives all the same.',
    sub: 'Target: Dec 1, 2026',
  },
]

export default function Onboarding({ onComplete }) {
  const [listSize, setListSize] = useState(null)
  const [pace, setPace] = useState(null)
  const [step, setStep] = useState(0) // 0 = list, 1 = pace, 2 = enter

  const ready = listSize && pace

  function handleEnter() {
    if (!ready) return
    onComplete({ listSize, pace })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col overflow-y-auto">
      {/* Background radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(232,28,46,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto w-full px-4 py-8 flex flex-col gap-8 pb-24">
        {/* ── Logo / Title ── */}
        <div className="flex flex-col items-center gap-3 pt-4 animate-[fadeIn_0.6s_ease_both]">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-[0_0_24px_rgba(232,28,46,0.5)]"
            style={{ background: 'linear-gradient(135deg, #E81C2E 0%, #a0111e 100%)' }}
          >
            M
          </div>
          <h1 className="font-bebas text-4xl tracking-[0.15em] text-white text-center">
            MARVEL WATCH TRACKER
          </h1>
          <p className="text-sm text-[#555] text-center tracking-wider">
            Choose your path into the Multiverse
          </p>
        </div>

        {/* ── Step 1: List Size ── */}
        <section className="animate-[fadeIn_0.6s_0.1s_ease_both_backwards]">
          <h2 className="font-bebas text-xl tracking-[0.2em] text-[#E81C2E] mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#E81C2E] text-white text-xs flex items-center justify-center font-bold">1</span>
            SELECT YOUR ROSTER
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {LIST_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setListSize(opt.id)}
                className={[
                  'relative p-3 rounded-xl border text-left transition-all duration-150',
                  listSize === opt.id
                    ? 'bg-[#1a0000] border-[#E81C2E] shadow-[0_0_16px_rgba(232,28,46,0.25)]'
                    : 'bg-[#0f0f0f] border-[#1e1e1e] hover:border-[#2a2a2a]',
                ].join(' ')}
              >
                {listSize === opt.id && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#E81C2E] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <div className="text-xl mb-1">{opt.icon}</div>
                <div className={`font-bebas text-lg tracking-wider ${opt.color}`}>{opt.label}</div>
                <div className="text-[10px] text-[#F5C518] font-semibold mb-1">{opt.count}</div>
                <div className="text-[11px] text-[#555] leading-snug">{opt.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Step 2: Pace ── */}
        <section className="animate-[fadeIn_0.6s_0.2s_ease_both_backwards]">
          <h2 className="font-bebas text-xl tracking-[0.2em] text-[#E81C2E] mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#E81C2E] text-white text-xs flex items-center justify-center font-bold">2</span>
            SET YOUR PACE
          </h2>
          <div className="flex flex-col gap-2">
            {PACE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setPace(opt.id)}
                className={[
                  'flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150',
                  pace === opt.id
                    ? 'bg-[#1a0000] border-[#E81C2E] shadow-[0_0_16px_rgba(232,28,46,0.2)]'
                    : 'bg-[#0f0f0f] border-[#1e1e1e] hover:border-[#2a2a2a]',
                ].join(' ')}
              >
                <span className="text-2xl flex-shrink-0 w-8">{opt.icon}</span>
                <div className="flex-1">
                  <div className="font-bebas text-base tracking-wider text-white">{opt.label}</div>
                  <div className="text-[11px] text-[#666] leading-snug">{opt.desc}</div>
                  <div className="text-[10px] text-[#F5C518] mt-0.5 font-medium">{opt.sub}</div>
                </div>
                {pace === opt.id && (
                  <div className="w-5 h-5 rounded-full bg-[#E81C2E] flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── Enter button ── */}
        <div className="animate-[fadeIn_0.6s_0.3s_ease_both_backwards]">
          <button
            onClick={handleEnter}
            disabled={!ready}
            className={[
              'w-full py-4 rounded-2xl font-bebas text-2xl tracking-[0.2em] transition-all duration-200',
              ready
                ? 'bg-[#E81C2E] text-white shadow-[0_0_24px_rgba(232,28,46,0.5)] hover:shadow-[0_0_32px_rgba(232,28,46,0.7)] active:scale-[0.98]'
                : 'bg-[#1a1a1a] text-[#333] cursor-not-allowed',
            ].join(' ')}
          >
            {ready ? 'ENTER THE MULTIVERSE →' : 'SELECT YOUR OPTIONS ABOVE'}
          </button>
          <p className="text-center text-[10px] text-[#333] mt-2 tracking-wider">
            You can change these any time from the Settings tab
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
