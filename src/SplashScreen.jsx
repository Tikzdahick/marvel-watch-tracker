import { useState, useEffect } from 'react'

const PARTICLE_OFFSETS = [
  { x: -60,  y: -40  },
  { x:  60,  y: -40  },
  { x: -80,  y:  20  },
  { x:  80,  y:  20  },
  { x: -40,  y:  70  },
  { x:  40,  y:  70  },
  { x: -100, y: -60  },
  { x:  100, y: -60  },
  { x:  0,   y: -90  },
  { x:  0,   y:  90  },
  { x: -120, y:  30  },
  { x:  120, y:  30  },
]

export default function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true)
    }, 2500)

    const doneTimer = setTimeout(() => {
      onDone()
    }, 3000)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: exiting ? 'splashFadeOut 0.5s ease forwards' : undefined,
      }}
    >
      {/* Particles */}
      {PARTICLE_OFFSETS.map((offset, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: i % 3 === 0 ? '8px' : i % 3 === 1 ? '6px' : '7px',
            height: i % 3 === 0 ? '8px' : i % 3 === 1 ? '6px' : '7px',
            borderRadius: '50%',
            backgroundColor: i % 2 === 0 ? '#E81C2E' : '#F5C518',
            opacity: i % 2 === 0 ? 0.5 : 0.4,
            '--particle-translate': `translate(${offset.x}px, ${offset.y}px)`,
            animation: `splashParticle 1.5s ease-out ${0.5 + (i * 0.04)}s both`,
          }}
        />
      ))}

      {/* Center content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Logo */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F5C518, #d4a017)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(245,197,24,0.6)',
            animation: 'splashLogoReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}
        >
          <span
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '56px',
              color: '#000',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            M
          </span>
        </div>

        {/* Title text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div
            className="font-bebas"
            style={{
              fontSize: '2.25rem',
              letterSpacing: '0.3em',
              color: '#fff',
              animation: 'fadeIn 0.5s ease 0.6s both',
            }}
          >
            MARVEL
          </div>
          <div
            className="font-bebas"
            style={{
              fontSize: '1.25rem',
              letterSpacing: '0.4em',
              color: '#E81C2E',
              animation: 'fadeIn 0.5s ease 0.8s both',
            }}
          >
            WATCH TRACKER
          </div>
        </div>
      </div>
    </div>
  )
}
