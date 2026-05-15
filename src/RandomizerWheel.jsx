import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * RandomizerWheel — CSS + Canvas spinning wheel that replaces the 🎲 button.
 *
 * Props:
 *   titles:   array of TITLES entries (should be unwatched, unlocked titles)
 *   onPick:   (title) → void — called when the wheel lands on a title
 *   onClose:  () → void
 */
export default function RandomizerWheel({ titles, onPick, onClose }) {
  const canvasRef  = useRef(null)
  const spinRef    = useRef(null)   // animation frame id
  const angleRef   = useRef(0)      // current rotation in radians
  const velRef     = useRef(0)      // current angular velocity (rad/frame)
  const [spinning,  setSpinning]  = useState(false)
  const [winner,    setWinner]    = useState(null)

  // Slice the wheel to at most 24 entries for readability
  const slices = titles.slice(0, 24)
  const n      = slices.length

  // ── Colors alternating between MCU red, gold, and dark variants ────────────
  const COLORS = [
    '#E81C2E', '#b01020', '#F5C518', '#c49a14',
    '#c0392b', '#922b21', '#d4a017', '#a37a10',
  ]

  // ── Draw wheel on canvas ───────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || n === 0) return
    const ctx  = canvas.getContext('2d')
    const W    = canvas.width
    const H    = canvas.height
    const cx   = W / 2
    const cy   = H / 2
    const r    = Math.min(cx, cy) - 4

    ctx.clearRect(0, 0, W, H)

    const sliceAngle = (2 * Math.PI) / n

    for (let i = 0; i < n; i++) {
      const start = angleRef.current + i * sliceAngle
      const end   = start + sliceAngle

      // ── Fill slice ──
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()

      // ── Border ──
      ctx.strokeStyle = '#0a0a0a'
      ctx.lineWidth   = 1.5
      ctx.stroke()

      // ── Label ──
      const midAngle = start + sliceAngle / 2
      const maxLen   = n <= 8 ? 20 : n <= 16 ? 14 : 10
      let label = slices[i].title
      if (label.length > maxLen) label = label.slice(0, maxLen - 1) + '…'

      const textR = r * 0.65
      const tx    = cx + textR * Math.cos(midAngle)
      const ty    = cy + textR * Math.sin(midAngle)

      ctx.save()
      ctx.translate(tx, ty)
      ctx.rotate(midAngle + Math.PI / 2)
      ctx.fillStyle   = '#fff'
      ctx.font        = `bold ${n <= 8 ? 11 : n <= 16 ? 9 : 8}px sans-serif`
      ctx.textAlign   = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor  = 'rgba(0,0,0,0.8)'
      ctx.shadowBlur   = 3
      ctx.fillText(label, 0, 0)
      ctx.restore()
    }

    // ── Center circle ──
    ctx.beginPath()
    ctx.arc(cx, cy, 18, 0, 2 * Math.PI)
    ctx.fillStyle = '#0a0a0a'
    ctx.fill()
    ctx.strokeStyle = '#F5C518'
    ctx.lineWidth   = 2
    ctx.stroke()

    // M letter
    ctx.fillStyle   = '#F5C518'
    ctx.font        = 'bold 13px sans-serif'
    ctx.textAlign   = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('M', cx, cy)
  }, [n, slices, COLORS])

  // ── Spin animation ─────────────────────────────────────────────────────────
  const animate = useCallback(() => {
    const FRICTION = 0.985

    function frame() {
      velRef.current   *= FRICTION
      angleRef.current += velRef.current

      draw()

      if (velRef.current > 0.002) {
        spinRef.current = requestAnimationFrame(frame)
      } else {
        // Settled — determine winner
        velRef.current = 0
        const sliceAngle = (2 * Math.PI) / n
        // The pointer is at the top (−π/2 in standard coords).
        // Normalise the angle so "top" lands on a slice index.
        const normalised = ((-angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
        const idx        = Math.floor(normalised / sliceAngle) % n
        setWinner(slices[idx])
        setSpinning(false)
      }
    }

    spinRef.current = requestAnimationFrame(frame)
  }, [draw, n, slices])

  function handleSpin() {
    if (spinning || n === 0) return
    setWinner(null)
    setSpinning(true)
    // Random initial velocity: 0.25–0.45 rad/frame (≈ 8–14 full rotations)
    velRef.current = 0.25 + Math.random() * 0.2
    animate()
  }

  // Initial draw
  useEffect(() => { draw() }, [draw])

  // Cleanup on unmount
  useEffect(() => () => cancelAnimationFrame(spinRef.current), [])

  // ── Pointer (triangle at top of wheel) drawn in CSS ───────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center gap-4"
        style={{ animation: 'slideUp 0.3s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-[10px] text-[#555] uppercase tracking-widest">
          {n} unwatched titles
        </div>

        {/* Wheel + pointer wrapper */}
        <div className="relative">
          {/* Pointer triangle at top */}
          <div
            className="absolute top-[-2px] left-1/2 -translate-x-1/2 z-10"
            style={{
              width:        0,
              height:       0,
              borderLeft:   '8px solid transparent',
              borderRight:  '8px solid transparent',
              borderTop:    '16px solid #F5C518',
              filter:       'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
            }}
          />
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="rounded-full"
            style={{ boxShadow: '0 0 40px rgba(0,0,0,0.6)' }}
          />
        </div>

        {/* Winner display */}
        {winner ? (
          <div
            className="bg-[#0f0f0f] border border-[#F5C518]/40 rounded-2xl px-5 py-4 text-center max-w-[280px]"
            style={{ animation: 'completionPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            <div className="text-[9px] text-[#F5C518] uppercase tracking-widest mb-1">🎲 The wheel chose…</div>
            <div className="text-white font-semibold text-base leading-snug mb-3">{winner.title}</div>
            <div className="flex gap-2">
              <button
                onClick={handleSpin}
                className="flex-1 py-2 text-xs text-[#555] hover:text-white border border-[#222] rounded-xl transition-colors"
              >
                Spin again
              </button>
              <button
                onClick={() => { onPick(winner); onClose() }}
                className="flex-1 py-2 text-xs font-bold bg-[#E81C2E] text-white rounded-xl hover:shadow-[0_0_10px_rgba(232,28,46,0.4)] transition-all"
              >
                Watch it!
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSpin}
            disabled={spinning || n === 0}
            className="px-10 py-3.5 rounded-xl font-bebas text-xl tracking-widest transition-all disabled:opacity-40"
            style={{
              background: spinning
                ? 'linear-gradient(135deg, #555 0%, #333 100%)'
                : 'linear-gradient(135deg, #E81C2E 0%, #b01020 100%)',
              boxShadow: spinning ? 'none' : '0 0 20px rgba(232,28,46,0.4)',
              color: '#fff',
            }}
          >
            {spinning ? 'SPINNING…' : 'SPIN!'}
          </button>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="text-[#444] text-xs hover:text-[#666] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
