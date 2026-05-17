import { useState, useEffect } from 'react'

// 30 hardcoded particle offsets ranging from -200 to 200px
const CONFETTI_OFFSETS = [
  { x: -180, y: -120, rot: 45  },
  { x:  150, y: -160, rot: 120 },
  { x: -80,  y: -200, rot: 200 },
  { x:  90,  y: -190, rot: 30  },
  { x:  200, y: -80,  rot: 165 },
  { x: -200, y: -60,  rot: 90  },
  { x:  170, y:  60,  rot: 10  },
  { x: -170, y:  80,  rot: 140 },
  { x:  50,  y:  180, rot: 70  },
  { x: -60,  y:  190, rot: 175 },
  { x:  130, y:  150, rot: 55  },
  { x: -140, y:  140, rot: 100 },
  { x:  190, y: -140, rot: 20  },
  { x: -190, y: -100, rot: 155 },
  { x:  70,  y: -170, rot: 80  },
  { x: -70,  y: -150, rot: 130 },
  { x:  160, y:  100, rot: 35  },
  { x: -160, y:  110, rot: 170 },
  { x:  100, y:  170, rot: 60  },
  { x: -100, y:  160, rot: 115 },
  { x:  30,  y: -110, rot: 145 },
  { x: -30,  y: -130, rot: 25  },
  { x:  120, y: -50,  rot: 95  },
  { x: -120, y: -40,  rot: 50  },
  { x:  80,  y:  120, rot: 160 },
  { x: -80,  y:  130, rot: 5   },
  { x:  180, y: -20,  rot: 75  },
  { x: -180, y:  20,  rot: 110 },
  { x:  40,  y:  200, rot: 135 },
  { x: -40,  y: -180, rot: 180 },
]

const DEFAULT_COLORS = ['#E81C2E', '#F5C518', '#fff', '#60a5fa', '#22c55e']

// ConfettiExplosion — 30 particles flying outward
export function ConfettiExplosion({ active, colors = DEFAULT_COLORS }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (active) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [active])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {CONFETTI_OFFSETS.map((offset, i) => {
        const size = 6 + (i % 3) * 2 // 6, 8, or 10px
        const color = colors[i % colors.length]
        const delay = (i * 0.017).toFixed(3) // spread 0–0.5s across 30 particles
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: i % 4 === 0 ? '50%' : '2px',
              transform: `rotate(${offset.rot}deg)`,
              '--confetti-translate': `translate(${offset.x}px, ${offset.y}px)`,
              '--confetti-rotate': `${offset.rot}deg`,
              animation: `confettiParticle 1.2s ease-out ${delay}s both`,
            }}
          />
        )
      })}
    </div>
  )
}

// EraCompleteBanner — "ERA COMPLETE!" celebration banner
export function EraCompleteBanner({ eraName, eraColor, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone()
    }, 4000)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#111',
          border: '2px solid #F5C518',
          borderRadius: '24px',
          maxWidth: '384px',
          width: '100%',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          animation: 'pickBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '4px' }}>🏆</div>

        <div
          className="font-bebas"
          style={{
            fontSize: '2rem',
            color: '#F5C518',
            letterSpacing: '0.1em',
          }}
        >
          ✦ ERA COMPLETE ✦
        </div>

        <div
          className="font-bebas"
          style={{
            fontSize: '1.75rem',
            color: eraColor || '#E81C2E',
            letterSpacing: '0.05em',
          }}
        >
          {eraName}
        </div>

        <div
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            color: '#888',
            textTransform: 'uppercase',
          }}
        >
          Legendary Achievement
        </div>

        <button
          onClick={onDone}
          style={{
            marginTop: '16px',
            padding: '10px 28px',
            backgroundColor: '#E81C2E',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '1rem',
            letterSpacing: '0.1em',
          }}
        >
          AWESOME!
        </button>
      </div>
    </div>
  )
}

// MilestoneBanner — Progress milestone celebration
const MILESTONE_MESSAGES = {
  25:  'QUARTER COMPLETE!',
  50:  'HALFWAY THERE!',
  75:  'ALMOST A HERO!',
  100: 'MARVEL UNIVERSE COMPLETE!',
}

export function MilestoneBanner({ percent, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone()
    }, 3500)
    return () => clearTimeout(timer)
  }, [onDone])

  const message = MILESTONE_MESSAGES[percent] || `${percent}% COMPLETE!`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#111',
          border: '2px solid #E81C2E',
          borderRadius: '24px',
          maxWidth: '384px',
          width: '100%',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          animation: 'pickBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '4px' }}>🎯</div>

        <div
          className="font-bebas"
          style={{
            fontSize: '1.5rem',
            color: '#F5C518',
            letterSpacing: '0.15em',
          }}
        >
          {percent}% MILESTONE
        </div>

        <div
          className="font-bebas"
          style={{
            fontSize: '2rem',
            color: '#E81C2E',
            letterSpacing: '0.05em',
          }}
        >
          {message}
        </div>

        <div
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: '#888',
            textTransform: 'uppercase',
          }}
        >
          Keep Watching, Hero
        </div>

        <button
          onClick={onDone}
          style={{
            marginTop: '16px',
            padding: '10px 28px',
            backgroundColor: '#E81C2E',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '1rem',
            letterSpacing: '0.1em',
          }}
        >
          LET'S GO!
        </button>
      </div>
    </div>
  )
}
