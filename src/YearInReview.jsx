import { useState } from 'react'

const SLIDES = ['intro', 'watched', 'binge', 'favorite_era', 'streak', 'trivia', 'outro']

/**
 * YearInReview — animated annual "Wrapped" recap
 * Props:
 *   year:  number
 *   data:  { watchedCount, runtimeHours, biggestBingeDate, biggestBingeCount,
 *             favoriteEra, favoriteEraCount, bestStreak, triviaCorrect, triviaTotal }
 *   onClose: () => void
 */
export default function YearInReview({ year, data = {}, onClose }) {
  const [slide, setSlide] = useState(0)
  const [dir, setDir]     = useState(1) // 1=forward, -1=back

  const currentSlide = SLIDES[slide]
  const accuracy = data.triviaTotal > 0 ? Math.round((data.triviaCorrect / data.triviaTotal) * 100) : 0

  function go(next) {
    setDir(next > slide ? 1 : -1)
    setSlide(next)
  }

  function renderSlide() {
    switch (currentSlide) {
      case 'intro': return (
        <Slide key="intro">
          <div className="text-6xl mb-4">🎬</div>
          <div className="font-bebas text-6xl tracking-widest text-white leading-none">{year}</div>
          <div className="font-bebas text-2xl tracking-widest mt-1" style={{ color: '#E81C2E' }}>YEAR IN REVIEW</div>
          <p className="text-[#666] text-sm mt-4 max-w-xs">Your Marvel journey through the year — let's relive it.</p>
        </Slide>
      )
      case 'watched': return (
        <Slide key="watched">
          <div className="text-4xl mb-2">📺</div>
          <div className="text-[#555] text-sm uppercase tracking-widest mb-2">You watched</div>
          <div className="font-bebas leading-none mb-2" style={{ fontSize: '6rem', color: '#E81C2E' }}>{data.watchedCount ?? 0}</div>
          <div className="font-bebas text-2xl tracking-wider text-white">TITLES</div>
          {(data.runtimeHours ?? 0) > 0 && (
            <div className="text-[#555] text-sm mt-3">That's {data.runtimeHours} hours of Marvel</div>
          )}
        </Slide>
      )
      case 'binge': return (
        <Slide key="binge">
          <div className="text-4xl mb-2">🍿</div>
          <div className="text-[#555] text-sm uppercase tracking-widest mb-2">Biggest binge day</div>
          {(data.biggestBingeCount ?? 0) > 0 ? (
            <>
              <div className="font-bebas leading-none mb-2" style={{ fontSize: '6rem', color: '#F5C518' }}>{data.biggestBingeCount}</div>
              <div className="font-bebas text-xl tracking-wider text-white">TITLES IN ONE DAY</div>
              {data.biggestBingeDate && <div className="text-[#555] text-sm mt-2">{data.biggestBingeDate}</div>}
            </>
          ) : (
            <div className="text-white text-lg mt-4">No binge days recorded yet</div>
          )}
        </Slide>
      )
      case 'favorite_era': return (
        <Slide key="era">
          <div className="text-4xl mb-2">📅</div>
          <div className="text-[#555] text-sm uppercase tracking-widest mb-2">Your favorite era</div>
          {data.favoriteEra ? (
            <>
              <div className="font-bebas text-4xl tracking-widest mb-2" style={{ color: '#E81C2E' }}>{data.favoriteEra}</div>
              <div className="font-bebas text-2xl tracking-wider text-white">{data.favoriteEraCount} TITLES</div>
            </>
          ) : (
            <div className="text-white text-lg mt-4">Watch more to discover your era!</div>
          )}
        </Slide>
      )
      case 'streak': return (
        <Slide key="streak">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-[#555] text-sm uppercase tracking-widest mb-2">Best watch streak</div>
          <div className="font-bebas leading-none mb-2" style={{ fontSize: '6rem', color: '#F5C518' }}>{data.bestStreak ?? 0}</div>
          <div className="font-bebas text-2xl tracking-wider text-white">DAYS</div>
        </Slide>
      )
      case 'trivia': return (
        <Slide key="trivia">
          <div className="text-4xl mb-2">🧠</div>
          <div className="text-[#555] text-sm uppercase tracking-widest mb-2">Trivia accuracy</div>
          <div className="font-bebas leading-none mb-2" style={{ fontSize: '6rem', color: '#a78bfa' }}>{accuracy}%</div>
          <div className="text-[#555] text-sm">{data.triviaCorrect ?? 0} correct out of {data.triviaTotal ?? 0}</div>
        </Slide>
      )
      case 'outro': return (
        <Slide key="outro">
          <div className="text-5xl mb-4">🌟</div>
          <div className="font-bebas text-3xl tracking-widest text-white">ANOTHER YEAR,</div>
          <div className="font-bebas text-3xl tracking-widest" style={{ color: '#E81C2E' }}>ANOTHER SAGA</div>
          <p className="text-[#555] text-sm max-w-xs mt-4">Keep assembling. The multiverse awaits.</p>
          <button
            onClick={onClose}
            className="font-bebas tracking-widest text-lg px-8 py-3 rounded-2xl text-white mt-8 transition-all active:scale-95"
            style={{ background: '#E81C2E' }}
          >
            CLOSE REVIEW
          </button>
        </Slide>
      )
      default: return null
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 10002, background: 'linear-gradient(180deg, #0a0000 0%, #0a0a0a 100%)' }}
    >
      {/* Progress dots */}
      <div className="flex gap-1.5 px-6 pt-6 pb-2 flex-shrink-0">
        {SLIDES.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-300"
            style={{ background: i <= slide ? '#E81C2E' : '#1e1e1e' }}
          />
        ))}
      </div>

      {/* Close */}
      <button onClick={onClose} className="absolute top-4 right-4 text-[#555] hover:text-white text-lg z-10">✕</button>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 overflow-hidden">
        {renderSlide()}
      </div>

      {/* Nav */}
      <div className="flex gap-3 px-6 pb-12 flex-shrink-0">
        {slide > 0 && (
          <button onClick={() => go(slide - 1)}
            className="flex-1 py-4 rounded-2xl font-bebas tracking-widest transition-all"
            style={{ background: '#1a1a1a', color: '#666' }}
          >
            BACK
          </button>
        )}
        {slide < SLIDES.length - 1 && (
          <button onClick={() => go(slide + 1)}
            className="flex-1 py-4 rounded-2xl font-bebas tracking-widest text-white transition-all"
            style={{ background: '#E81C2E' }}
          >
            NEXT →
          </button>
        )}
      </div>

      <style>{`
        @keyframes yrSlideIn { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }
      `}</style>
    </div>
  )
}

function Slide({ children }) {
  return (
    <div
      className="text-center flex flex-col items-center justify-center w-full"
      style={{ animation: 'yrSlideIn 0.35s ease both' }}
    >
      {children}
    </div>
  )
}
