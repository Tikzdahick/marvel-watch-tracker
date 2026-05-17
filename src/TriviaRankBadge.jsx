import { getRank, getNextRank, getPointsToNext, getRankProgress } from './data/triviaRanks.js'

const SIZE_CONFIG = {
  xs: { container: 20, icon: 10, fontSize: '10px' },
  sm: { container: 28, icon: 14, fontSize: '11px' },
  md: { container: 40, icon: 20, fontSize: '12px' },
  lg: { container: 56, icon: 28, fontSize: '14px' },
}

export default function TriviaRankBadge({ points = 0, size = 'sm', showLabel = false, showProgress = false }) {
  const rank = getRank(points)
  const nextRank = getNextRank(points)
  const ptsToNext = getPointsToNext(points)
  const progress = getRankProgress(points)
  const cfg = SIZE_CONFIG[size] ?? SIZE_CONFIG.sm

  const isNexus = rank.key === 'nexus-being'

  const badgeStyle = {
    width: cfg.container,
    height: cfg.container,
    borderRadius: '50%',
    background: isNexus ? rank.gradient : rank.bg,
    border: `1.5px solid ${rank.border}`,
    boxShadow: rank.glow === 'none' ? undefined : rank.glow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: cfg.icon,
    flexShrink: 0,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={badgeStyle} title={rank.label}>
        <span style={{ fontSize: cfg.icon, lineHeight: 1 }}>{rank.icon}</span>
      </div>

      {showLabel && (
        <span style={{ fontSize: cfg.fontSize, color: rank.color, whiteSpace: 'nowrap', fontWeight: 600 }}>
          {rank.label}
        </span>
      )}

      {showProgress && (
        <div style={{ width: '100%', minWidth: 80 }}>
          {nextRank ? (
            <>
              <div style={{
                height: 4,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
                marginBottom: 2,
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress * 100}%`,
                  background: rank.gradient ?? rank.color,
                  borderRadius: 2,
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <p style={{ fontSize: '10px', color: '#555', textAlign: 'center', margin: 0 }}>
                {ptsToNext} pts to {nextRank.label}
              </p>
            </>
          ) : (
            <p style={{ fontSize: '10px', color: rank.color, textAlign: 'center', margin: 0, fontWeight: 700 }}>
              MAX RANK ✦
            </p>
          )}
        </div>
      )}
    </div>
  )
}
