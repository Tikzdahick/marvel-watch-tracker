import { useState } from 'react'

const STEPS = [
  {
    icon: '🎬',
    title: 'WELCOME TO MARVEL WATCH TRACKER',
    desc: 'Track your journey through the Marvel Cinematic Universe and beyond. From Blade to the Avengers — every title, every saga, all in one place.',
    visual: null,
  },
  {
    icon: null,
    title: 'TRACK YOUR WATCHES',
    desc: 'Tap any title to open its detail page. Mark it watched, rate it 1-5 stars, add notes, and set your tier (S/A/B/C/D). Your progress syncs automatically.',
    visual: 'title-card',
  },
  {
    icon: '🏆',
    title: 'EARN ACHIEVEMENTS',
    desc: 'Unlock achievements as you watch more. Build a daily streak by logging in and watching. Race against the Doomsday countdown — Dec 18, 2026!',
    visual: 'achievements',
  },
  {
    icon: '👥',
    title: 'ASSEMBLE YOUR TEAM',
    desc: 'Connect with friends, share reviews in the community feed, and track each other\'s progress. Use Friend Requests in the Friends tab.',
    visual: null,
  },
]

// Mock title card visual for step 2
function TitleCardMock() {
  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        maxWidth: '260px',
        margin: '0 auto',
      }}
    >
      <div>
        <div
          className="font-bebas"
          style={{ fontSize: '1.1rem', color: '#fff', letterSpacing: '0.05em' }}
        >
          Iron Man
        </div>
        <div style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>MOVIE</div>
      </div>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#E81C2E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          flexShrink: 0,
        }}
      >
        ✓
      </div>
    </div>
  )
}

// Mock achievement badges for step 3
function AchievementMocks() {
  const badges = [
    { label: 'First Watch', icon: '🎬' },
    { label: '10 Watched', icon: '⭐' },
    { label: 'Streak x7',  icon: '🔥' },
  ]
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {badges.map((b) => (
        <div
          key={b.label}
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #F5C518',
            borderRadius: '12px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            minWidth: '72px',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{b.icon}</span>
          <span style={{ fontSize: '0.6rem', color: '#F5C518', letterSpacing: '0.05em', textAlign: 'center' }}>
            {b.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function OnboardingTutorial({ onDone }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState('')

  function goNext() {
    if (step === STEPS.length - 1) {
      onDone()
      return
    }
    setDirection('left')
    setTimeout(() => {
      setStep((s) => s + 1)
      setDirection('in-left')
      setTimeout(() => setDirection(''), 300)
    }, 250)
  }

  function goBack() {
    if (step === 0) return
    setDirection('right')
    setTimeout(() => {
      setStep((s) => s - 1)
      setDirection('in-right')
      setTimeout(() => setDirection(''), 300)
    }, 250)
  }

  const current = STEPS[step]

  const contentAnimation =
    direction === 'left'     ? 'tutorialSlideLeft 0.25s ease forwards' :
    direction === 'right'    ? 'tutorialSlideRight 0.25s ease forwards' :
    direction === 'in-left'  ? 'tutorialSlideInLeft 0.25s ease forwards' :
    direction === 'in-right' ? 'tutorialSlideInRight 0.25s ease forwards' :
    undefined

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: 'slideUp 0.4s ease both',
      }}
    >
      <div
        style={{
          backgroundColor: '#111',
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: '480px',
          padding: '24px 24px 40px',
          overflow: 'hidden',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          {/* Step dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: i === step ? '#E81C2E' : '#444',
                  transition: 'background-color 0.2s',
                }}
              />
            ))}
          </div>

          {/* Skip button */}
          <button
            onClick={onDone}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              fontSize: '0.8rem',
              cursor: 'pointer',
              padding: '4px 8px',
              letterSpacing: '0.05em',
            }}
          >
            Skip
          </button>
        </div>

        {/* Step content */}
        <div
          style={{
            animation: contentAnimation,
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          {/* Icon or visual */}
          {current.icon && (
            <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>{current.icon}</div>
          )}

          {current.visual === 'title-card' && (
            <div style={{ marginBottom: '4px' }}>
              <TitleCardMock />
            </div>
          )}

          {current.visual === 'achievements' && (
            <div style={{ marginBottom: '4px' }}>
              <AchievementMocks />
            </div>
          )}

          {/* Title */}
          <div
            className="font-bebas"
            style={{
              fontSize: '1.6rem',
              color: '#fff',
              letterSpacing: '0.08em',
              lineHeight: 1.1,
            }}
          >
            {current.title}
          </div>

          {/* Description */}
          <p
            style={{
              color: '#aaa',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '340px',
            }}
          >
            {current.desc}
          </p>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
          {step > 0 && (
            <button
              onClick={goBack}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#222',
                color: '#aaa',
                border: '1px solid #333',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: '1rem',
                letterSpacing: '0.1em',
              }}
            >
              BACK
            </button>
          )}

          <button
            onClick={goNext}
            style={{
              flex: 2,
              padding: '14px',
              backgroundColor: '#E81C2E',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '1rem',
              letterSpacing: '0.1em',
            }}
          >
            {step === STEPS.length - 1 ? "LET'S GO!" : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  )
}
