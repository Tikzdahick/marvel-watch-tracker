/**
 * Compute compatibility score between two users' ratings.
 * Both are { [titleId]: 1-5 }
 * Returns 0-100 or null (< 3 shared)
 */
export function computeCompatibility(myRatings, theirRatings) {
  const myIds    = Object.keys(myRatings    ?? {})
  const theirIds = Object.keys(theirRatings ?? {})
  const shared   = myIds.filter(id => theirIds.includes(id))
  if (shared.length < 3) return null

  const diffs  = shared.map(id => Math.abs((myRatings[id] ?? 3) - (theirRatings[id] ?? 3)))
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length
  return Math.max(0, Math.round(100 - (avgDiff / 4) * 100))
}

/**
 * WatchCompatibility — compatibility gauge for friend profile
 * Props:
 *   score:       number (0-100) | null
 *   friendName:  string
 *   sharedCount: number
 */
export default function WatchCompatibility({ score, friendName, sharedCount = 0 }) {
  if (score === null) {
    return (
      <div className="rounded-2xl p-4 text-center" style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}>
        <div className="text-2xl mb-2">🤝</div>
        <div className="font-bebas tracking-widest text-white text-lg">COMPATIBILITY</div>
        <p className="text-[#555] text-xs mt-1">
          Rate at least 3 titles in common with {friendName} to see your compatibility score.
        </p>
      </div>
    )
  }

  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#F5C518' : score >= 40 ? '#f97316' : '#E81C2E'
  const label = score >= 80 ? 'PERFECT MATCH' : score >= 60 ? 'GREAT MATCH' : score >= 40 ? 'DECENT MATCH' : 'DIFFERENT TASTES'
  const emoji = score >= 80 ? '💚' : score >= 60 ? '⭐' : score >= 40 ? '🤝' : '⚔️'

  const r            = 30
  const circumference = 2 * Math.PI * r
  const strokeDash   = (score / 100) * circumference

  return (
    <div className="rounded-2xl p-4" style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}>
      <div className="font-bebas text-[11px] tracking-widest text-[#555] mb-3">WATCH COMPATIBILITY</div>
      <div className="flex items-center gap-4">
        {/* Arc gauge */}
        <svg width="72" height="72" viewBox="0 0 72 72" className="flex-shrink-0">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#1e1e1e" strokeWidth="6"/>
          <circle
            cx="36" cy="36" r={r} fill="none"
            stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeDashoffset={circumference / 4}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
          <text x="36" y="40" textAnchor="middle" fill={color} fontSize="13" fontWeight="bold" fontFamily="sans-serif">
            {score}%
          </text>
        </svg>

        <div className="flex-1">
          <div className="font-bebas text-xl tracking-widest mb-0.5" style={{ color }}>
            {emoji} {label}
          </div>
          <p className="text-[#666] text-xs">
            You and {friendName} share ratings on {sharedCount} title{sharedCount !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>
    </div>
  )
}
