/**
 * RelationshipMapPage — interactive MCU character relationship network.
 * Pan with drag, pinch-to-zoom. Tap a node to see the character profile.
 */
import { useState, useRef, useCallback, useEffect } from 'react'

// ── Edge types ──────────────────────────────────────────────────────────────
const EDGE_TYPES = {
  ally:     { color: '#4ade80', label: 'Ally' },
  enemy:    { color: '#E81C2E', label: 'Enemy' },
  romantic: { color: '#f472b6', label: 'Romantic' },
  family:   { color: '#F5C518', label: 'Family' },
  mentor:   { color: '#60a5fa', label: 'Mentor' },
}

// ── Node group colors ───────────────────────────────────────────────────────
const GROUP_COLORS = {
  avengers:  '#E81C2E',
  guardians: '#f97316',
  xmen:      '#facc15',
  defenders: '#a78bfa',
  shield:    '#60a5fa',
  villain:   '#6b7280',
  asgard:    '#fcd34d',
  wakanda:   '#a3e635',
  other:     '#94a3b8',
}

// ── Nodes (character circles) ───────────────────────────────────────────────
// x, y are in the 1400×1200 canvas coordinate space
const NODES = [
  // Core Avengers — center cluster
  { id: 'iron-man',        label: 'Iron Man',        group: 'avengers', x: 700, y: 560 },
  { id: 'captain-america', label: 'Captain America', group: 'avengers', x: 580, y: 480 },
  { id: 'thor',            label: 'Thor',             group: 'avengers', x: 820, y: 480 },
  { id: 'hulk',            label: 'Hulk',             group: 'avengers', x: 700, y: 440 },
  { id: 'black-widow',     label: 'Black Widow',      group: 'avengers', x: 570, y: 580 },
  { id: 'hawkeye',         label: 'Hawkeye',          group: 'avengers', x: 820, y: 580 },
  { id: 'spider-man',      label: 'Spider-Man',       group: 'avengers', x: 630, y: 660 },
  { id: 'doctor-strange',  label: 'Dr. Strange',      group: 'avengers', x: 780, y: 660 },
  { id: 'scarlet-witch',   label: 'Scarlet Witch',    group: 'avengers', x: 650, y: 730 },
  { id: 'vision',          label: 'Vision',           group: 'avengers', x: 760, y: 730 },
  { id: 'black-panther',   label: 'Black Panther',    group: 'wakanda',  x: 700, y: 800 },
  { id: 'captain-marvel',  label: 'Captain Marvel',   group: 'avengers', x: 490, y: 460 },
  { id: 'ant-man',         label: 'Ant-Man',          group: 'avengers', x: 480, y: 620 },
  { id: 'sam-wilson',      label: 'Sam Wilson',       group: 'avengers', x: 490, y: 540 },
  { id: 'winter-soldier',  label: 'Bucky Barnes',     group: 'avengers', x: 510, y: 700 },
  { id: 'nick-fury',       label: 'Nick Fury',        group: 'shield',   x: 700, y: 360 },
  { id: 'wong',            label: 'Wong',             group: 'avengers', x: 850, y: 740 },
  { id: 'kate-bishop',     label: 'Kate Bishop',      group: 'avengers', x: 900, y: 620 },
  { id: 'yelena-belova',   label: 'Yelena Belova',    group: 'avengers', x: 440, y: 680 },
  { id: 'moon-knight',     label: 'Moon Knight',      group: 'other',    x: 920, y: 700 },
  { id: 'ms-marvel',       label: 'Ms. Marvel',       group: 'avengers', x: 390, y: 580 },
  { id: 'shuri',           label: 'Shuri',            group: 'wakanda',  x: 770, y: 850 },
  { id: 'okoye',           label: 'Okoye',            group: 'wakanda',  x: 640, y: 870 },
  { id: 'daredevil',       label: 'Daredevil',        group: 'defenders',x: 960, y: 560 },
  { id: 'valkyrie',        label: 'Valkyrie',         group: 'asgard',   x: 940, y: 440 },

  // Asgard cluster — upper-right
  { id: 'loki',            label: 'Loki',             group: 'asgard',   x: 1000, y: 360 },
  { id: 'hela',            label: 'Hela',             group: 'villain',  x: 1100, y: 300 },

  // Guardians cluster — right side
  { id: 'star-lord',       label: 'Star-Lord',        group: 'guardians',x: 1100, y: 500 },
  { id: 'gamora',          label: 'Gamora',           group: 'guardians',x: 1200, y: 440 },
  { id: 'drax',            label: 'Drax',             group: 'guardians',x: 1200, y: 560 },
  { id: 'rocket',          label: 'Rocket',           group: 'guardians',x: 1100, y: 620 },
  { id: 'groot',           label: 'Groot',            group: 'guardians',x: 1200, y: 640 },
  { id: 'nebula',          label: 'Nebula',           group: 'guardians',x: 1100, y: 700 },
  { id: 'mantis',          label: 'Mantis',           group: 'guardians',x: 1200, y: 720 },

  // X-Men cluster — upper-left
  { id: 'wolverine',       label: 'Wolverine',        group: 'xmen',     x: 240, y: 360 },
  { id: 'professor-x',     label: 'Professor X',      group: 'xmen',     x: 140, y: 280 },
  { id: 'deadpool',        label: 'Deadpool',         group: 'xmen',     x: 350, y: 280 },
  { id: 'magneto',         label: 'Magneto',          group: 'villain',  x: 140, y: 420 },
  { id: 'colossus',        label: 'Colossus',         group: 'xmen',     x: 240, y: 240 },
  { id: 'negasonic',       label: 'NTW',             group: 'xmen',     x: 350, y: 200 },
  { id: 'x23',             label: 'X-23',             group: 'xmen',     x: 140, y: 520 },
  { id: 'cable',           label: 'Cable',            group: 'xmen',     x: 250, y: 460 },

  // Villains cluster — bottom
  { id: 'thanos',          label: 'Thanos',           group: 'villain',  x: 700, y: 1020 },
  { id: 'ultron',          label: 'Ultron',           group: 'villain',  x: 580, y: 1000 },
  { id: 'red-skull',       label: 'Red Skull',        group: 'villain',  x: 450, y: 940 },
  { id: 'killmonger',      label: 'Killmonger',       group: 'villain',  x: 770, y: 960 },
  { id: 'vulture',         label: 'Vulture',          group: 'villain',  x: 550, y: 920 },
  { id: 'mysterio',        label: 'Mysterio',         group: 'villain',  x: 640, y: 960 },
  { id: 'kang',            label: 'Kang',             group: 'villain',  x: 850, y: 1000 },
  { id: 'dormammu',        label: 'Dormammu',         group: 'villain',  x: 920, y: 940 },
  { id: 'kingpin',         label: 'Kingpin',          group: 'villain',  x: 1020, y: 880 },
  { id: 'baron-zemo',      label: 'Baron Zemo',       group: 'villain',  x: 480, y: 860 },
  { id: 'gorr',            label: 'Gorr',             group: 'villain',  x: 1040, y: 420 },
  { id: 'namor',           label: 'Namor',            group: 'villain',  x: 700, y: 920 },
  { id: 'green-goblin',    label: 'Green Goblin',     group: 'villain',  x: 580, y: 820 },
]

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]))

// ── Edges ────────────────────────────────────────────────────────────────────
const EDGES = [
  // Core Avengers allies
  { from: 'iron-man',        to: 'captain-america', type: 'ally' },
  { from: 'iron-man',        to: 'thor',            type: 'ally' },
  { from: 'iron-man',        to: 'hulk',            type: 'ally' },
  { from: 'iron-man',        to: 'black-widow',     type: 'ally' },
  { from: 'iron-man',        to: 'spider-man',      type: 'mentor' },
  { from: 'iron-man',        to: 'war-machine',     type: 'ally' },
  { from: 'captain-america', to: 'black-widow',     type: 'ally' },
  { from: 'captain-america', to: 'hawkeye',         type: 'ally' },
  { from: 'captain-america', to: 'sam-wilson',      type: 'ally' },
  { from: 'captain-america', to: 'winter-soldier',  type: 'family' },
  { from: 'captain-america', to: 'ant-man',         type: 'ally' },
  { from: 'thor',            to: 'loki',            type: 'family' },
  { from: 'thor',            to: 'valkyrie',        type: 'ally' },
  { from: 'thor',            to: 'hela',            type: 'family' },
  { from: 'black-widow',     to: 'hawkeye',         type: 'ally' },
  { from: 'black-widow',     to: 'yelena-belova',   type: 'family' },
  { from: 'black-widow',     to: 'nick-fury',       type: 'mentor' },
  { from: 'spider-man',      to: 'doctor-strange',  type: 'ally' },
  { from: 'spider-man',      to: 'vulture',         type: 'enemy' },
  { from: 'spider-man',      to: 'green-goblin',    type: 'enemy' },
  { from: 'spider-man',      to: 'mysterio',        type: 'enemy' },
  { from: 'doctor-strange',  to: 'wong',            type: 'ally' },
  { from: 'doctor-strange',  to: 'scarlet-witch',   type: 'ally' },
  { from: 'doctor-strange',  to: 'dormammu',        type: 'enemy' },
  { from: 'scarlet-witch',   to: 'vision',          type: 'romantic' },
  { from: 'scarlet-witch',   to: 'agatha-harkness', type: 'enemy' },
  { from: 'black-panther',   to: 'shuri',           type: 'family' },
  { from: 'black-panther',   to: 'okoye',           type: 'ally' },
  { from: 'black-panther',   to: 'killmonger',      type: 'enemy' },
  { from: 'black-panther',   to: 'namor',           type: 'enemy' },
  { from: 'captain-marvel',  to: 'nick-fury',       type: 'ally' },
  { from: 'ant-man',         to: 'captain-america', type: 'ally' },
  { from: 'hawkeye',         to: 'kate-bishop',     type: 'mentor' },
  { from: 'daredevil',       to: 'kingpin',         type: 'enemy' },
  { from: 'ms-marvel',       to: 'captain-marvel',  type: 'ally' },

  // Guardians
  { from: 'star-lord',       to: 'gamora',          type: 'romantic' },
  { from: 'star-lord',       to: 'drax',            type: 'ally' },
  { from: 'star-lord',       to: 'rocket',          type: 'ally' },
  { from: 'star-lord',       to: 'groot',           type: 'ally' },
  { from: 'star-lord',       to: 'nebula',          type: 'ally' },
  { from: 'star-lord',       to: 'mantis',          type: 'ally' },
  { from: 'gamora',          to: 'nebula',          type: 'family' },
  { from: 'gamora',          to: 'thanos',          type: 'family' },
  { from: 'nebula',          to: 'thanos',          type: 'family' },
  { from: 'rocket',          to: 'groot',           type: 'ally' },
  { from: 'star-lord',       to: 'thor',            type: 'ally' },

  // X-Men
  { from: 'wolverine',       to: 'professor-x',     type: 'ally' },
  { from: 'wolverine',       to: 'magneto',         type: 'enemy' },
  { from: 'wolverine',       to: 'x23',             type: 'family' },
  { from: 'wolverine',       to: 'deadpool',        type: 'ally' },
  { from: 'professor-x',     to: 'magneto',         type: 'ally' },
  { from: 'professor-x',     to: 'colossus',        type: 'mentor' },
  { from: 'professor-x',     to: 'negasonic',       type: 'mentor' },
  { from: 'deadpool',        to: 'cable',           type: 'ally' },
  { from: 'deadpool',        to: 'colossus',        type: 'ally' },

  // Nick Fury
  { from: 'nick-fury',       to: 'captain-america', type: 'mentor' },
  { from: 'nick-fury',       to: 'iron-man',        type: 'ally' },

  // Loki
  { from: 'loki',            to: 'thor',            type: 'family' },
  { from: 'loki',            to: 'iron-man',        type: 'enemy' },

  // Villains
  { from: 'thanos',          to: 'iron-man',        type: 'enemy' },
  { from: 'thanos',          to: 'captain-america', type: 'enemy' },
  { from: 'thanos',          to: 'thor',            type: 'enemy' },
  { from: 'thanos',          to: 'kang',            type: 'enemy' },
  { from: 'ultron',          to: 'iron-man',        type: 'enemy' },
  { from: 'ultron',          to: 'scarlet-witch',   type: 'ally' },
  { from: 'red-skull',       to: 'captain-america', type: 'enemy' },
  { from: 'baron-zemo',      to: 'captain-america', type: 'enemy' },
  { from: 'baron-zemo',      to: 'winter-soldier',  type: 'enemy' },
  { from: 'kang',            to: 'ant-man',         type: 'enemy' },
  { from: 'gorr',            to: 'thor',            type: 'enemy' },
  { from: 'kingpin',         to: 'daredevil',       type: 'enemy' },
  { from: 'green-goblin',    to: 'spider-man',      type: 'enemy' },

  // Moon Knight
  { from: 'moon-knight',     to: 'daredevil',       type: 'ally' },
]

// ── Legend component ─────────────────────────────────────────────────────────
function Legend() {
  return (
    <div style={{
      position: 'absolute', bottom: 80, left: 12,
      background: 'rgba(10,10,10,0.92)',
      border: '1px solid #222', borderRadius: 12, padding: '10px 12px',
      zIndex: 10,
    }}>
      <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
        Relationship
      </div>
      {Object.entries(EDGE_TYPES).map(([key, et]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 20, height: 2, background: et.color, borderRadius: 1 }}/>
          <span style={{ fontSize: 11, color: '#aaa' }}>{et.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
const CANVAS_W = 1400
const CANVAS_H = 1100
const NODE_R   = 28

export default function RelationshipMapPage({ onClose, onOpenCharacter }) {
  const containerRef  = useRef(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.55 })
  const dragRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [tooltip, setTooltip] = useState(null)

  // ── Pan & Pinch ─────────────────────────────────────────────────────────────
  const onPointerDown = useCallback(e => {
    if (e.target.closest('[data-node]')) return
    dragRef.current = { startX: e.clientX, startY: e.clientY, tx: transform.x, ty: transform.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [transform])

  const onPointerMove = useCallback(e => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setTransform(t => ({ ...t, x: dragRef.current.tx + dx, y: dragRef.current.ty + dy }))
  }, [])

  const onPointerUp = useCallback(() => { dragRef.current = null }, [])

  const onWheel = useCallback(e => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setTransform(t => ({ ...t, scale: Math.min(2.5, Math.max(0.2, t.scale * delta)) }))
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // touch pinch
  const touchRef = useRef({})
  function onTouchStart(e) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      touchRef.current.dist = Math.hypot(dx, dy)
    } else if (e.touches.length === 1) {
      dragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, tx: transform.x, ty: transform.y }
    }
  }
  function onTouchMove(e) {
    e.preventDefault()
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      if (touchRef.current.dist) {
        const delta = dist / touchRef.current.dist
        setTransform(t => ({ ...t, scale: Math.min(2.5, Math.max(0.2, t.scale * delta)) }))
      }
      touchRef.current.dist = dist
    } else if (e.touches.length === 1 && dragRef.current) {
      const ddx = e.touches[0].clientX - dragRef.current.startX
      const ddy = e.touches[0].clientY - dragRef.current.startY
      setTransform(t => ({ ...t, x: dragRef.current.tx + ddx, y: dragRef.current.ty + ddy }))
    }
  }
  function onTouchEnd() { touchRef.current = {}; dragRef.current = null }

  function handleNodeTap(node) {
    if (selected?.id === node.id) {
      if (onOpenCharacter) onOpenCharacter(node.id)
    } else {
      setSelected(node)
    }
  }

  const edgesForSelected = selected
    ? EDGES.filter(e => e.from === selected.id || e.to === selected.id)
    : []

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #161616', flexShrink: 0 }}>
        <button
          onClick={onClose}
          style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-bebas, sans-serif)', fontSize: 20, color: '#fff', letterSpacing: 2, margin: 0 }}>
            MCU RELATIONSHIP MAP
          </h1>
          <p style={{ margin: 0, fontSize: 10, color: '#444' }}>Drag to pan · Pinch or scroll to zoom · Tap node to highlight · Double-tap to view profile</p>
        </div>
        {/* Zoom controls */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setTransform(t => ({ ...t, scale: Math.min(2.5, t.scale * 1.2) }))}
            style={{ width: 32, height: 32, borderRadius: 8, background: '#161616', border: '1px solid #222', color: '#fff', fontSize: 16, cursor: 'pointer' }}>+</button>
          <button onClick={() => setTransform(t => ({ ...t, scale: Math.max(0.2, t.scale * 0.8) }))}
            style={{ width: 32, height: 32, borderRadius: 8, background: '#161616', border: '1px solid #222', color: '#fff', fontSize: 16, cursor: 'pointer' }}>−</button>
          <button onClick={() => setTransform({ x: 0, y: 0, scale: 0.55 })}
            style={{ width: 32, height: 32, borderRadius: 8, background: '#161616', border: '1px solid #222', color: '#888', fontSize: 10, cursor: 'pointer' }}>↺</button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflow: 'hidden', position: 'relative', cursor: 'grab', userSelect: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <svg
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0', overflow: 'visible' }}
        >
          {/* Edges */}
          <g>
            {EDGES.map((edge, i) => {
              const a = NODE_MAP[edge.from]
              const b = NODE_MAP[edge.to]
              if (!a || !b) return null
              const isHighlighted = selected && (edge.from === selected.id || edge.to === selected.id)
              const isDimmed = selected && !isHighlighted
              const et = EDGE_TYPES[edge.type]
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={et.color}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeOpacity={isDimmed ? 0.08 : isHighlighted ? 0.95 : 0.35}
                  strokeDasharray={edge.type === 'enemy' ? '6 4' : undefined}
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g>
            {NODES.map(node => {
              const gc = GROUP_COLORS[node.group] ?? '#94a3b8'
              const isSelected = selected?.id === node.id
              const isConnected = selected && edgesForSelected.some(e => e.from === node.id || e.to === node.id)
              const isDimmed = selected && !isSelected && !isConnected
              const opacity = isDimmed ? 0.2 : 1

              return (
                <g
                  key={node.id}
                  data-node={node.id}
                  onClick={() => handleNodeTap(node)}
                  style={{ cursor: 'pointer' }}
                  opacity={opacity}
                >
                  {/* Glow ring when selected */}
                  {isSelected && (
                    <circle cx={node.x} cy={node.y} r={NODE_R + 8} fill="none"
                      stroke={gc} strokeWidth={2} strokeOpacity={0.6}/>
                  )}
                  {/* Main circle */}
                  <circle
                    cx={node.x} cy={node.y} r={NODE_R}
                    fill={`${gc}22`}
                    stroke={gc}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  {/* Label */}
                  <text
                    x={node.x} y={node.y + NODE_R + 14}
                    textAnchor="middle"
                    fontSize={10}
                    fill={isDimmed ? '#333' : '#ccc'}
                    fontFamily="system-ui, sans-serif"
                    fontWeight={isSelected ? 700 : 400}
                  >
                    {node.label}
                  </text>
                  {/* Short name inside circle */}
                  <text
                    x={node.x} y={node.y + 4}
                    textAnchor="middle"
                    fontSize={9}
                    fill={isDimmed ? '#333' : gc}
                    fontFamily="system-ui, sans-serif"
                    fontWeight={700}
                  >
                    {node.label.split(' ')[0].slice(0, 8)}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>

        {/* Legend */}
        <Legend/>

        {/* Selected character panel */}
        {selected && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(10,10,10,0.96)', border: `1px solid ${GROUP_COLORS[selected.group] ?? '#333'}50`,
            borderRadius: 14, padding: '14px 16px', maxWidth: 220, zIndex: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{selected.label}</span>
              <button onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 10 }}>
              {edgesForSelected.length} connection{edgesForSelected.length !== 1 ? 's' : ''}
            </div>
            {edgesForSelected.slice(0, 8).map((e, i) => {
              const otherId = e.from === selected.id ? e.to : e.from
              const other = NODE_MAP[otherId]
              if (!other) return null
              const et = EDGE_TYPES[e.type]
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: et.color, flexShrink: 0 }}/>
                  <span style={{ fontSize: 11, color: '#aaa' }}>{other.label}</span>
                  <span style={{ fontSize: 9, color: et.color, marginLeft: 'auto' }}>{et.label}</span>
                </div>
              )
            })}
            {onOpenCharacter && (
              <button
                onClick={() => onOpenCharacter(selected.id)}
                style={{
                  marginTop: 10, width: '100%', padding: '7px 0',
                  borderRadius: 8, border: `1px solid ${GROUP_COLORS[selected.group] ?? '#333'}50`,
                  background: `${GROUP_COLORS[selected.group] ?? '#333'}18`,
                  color: GROUP_COLORS[selected.group] ?? '#aaa',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: 1,
                }}
              >
                VIEW PROFILE →
              </button>
            )}
          </div>
        )}

        {/* Hint overlay */}
        {!selected && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(10,10,10,0.8)', border: '1px solid #1a1a1a',
            borderRadius: 10, padding: '8px 12px', pointerEvents: 'none',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: '#555' }}>Tap a character to see connections</p>
          </div>
        )}
      </div>
    </div>
  )
}
