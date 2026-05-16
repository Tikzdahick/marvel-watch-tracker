/**
 * AvatarDisplay — shared avatar rendering component + Marvel character definitions.
 *
 * Avatar value formats:
 *   data:image/…    → custom photo (base64 or object URL)
 *   marvel-{id}     → Marvel character avatar (styled gradient circle)
 *   undefined/null  → initials fallback (red gradient circle)
 *   anything else   → legacy emoji / text (backwards-compat)
 */

// ── Marvel character roster ────────────────────────────────────────────────────
export const MARVEL_AVATARS = [
  {
    id: 'iron-man',
    label: 'Iron Man',
    symbol: 'IM',
    bg: 'linear-gradient(135deg, #7f1010 0%, #C41E3A 55%, #F5C518 100%)',
    color: '#F5C518',
    ring: '#F5C518',
  },
  {
    id: 'cap',
    label: 'Captain America',
    symbol: '★',
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 65%, #93c5fd 100%)',
    color: '#fff',
    ring: '#3b82f6',
  },
  {
    id: 'thor',
    label: 'Thor',
    symbol: '⚡',
    bg: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 55%, #F5C518 100%)',
    color: '#F5C518',
    ring: '#3b82f6',
  },
  {
    id: 'black-widow',
    label: 'Black Widow',
    symbol: 'BW',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 55%, #7f0000 100%)',
    color: '#E81C2E',
    ring: '#E81C2E',
  },
  {
    id: 'spider-man',
    label: 'Spider-Man',
    symbol: '◈',
    bg: 'linear-gradient(135deg, #991b1b 0%, #E81C2E 50%, #1e3a8a 100%)',
    color: '#fff',
    ring: '#E81C2E',
  },
  {
    id: 'black-panther',
    label: 'Black Panther',
    symbol: '◆',
    bg: 'linear-gradient(135deg, #1a0033 0%, #4c1d95 60%, #a855f7 100%)',
    color: '#e9d5ff',
    ring: '#a855f7',
  },
  {
    id: 'captain-marvel',
    label: 'Captain Marvel',
    symbol: 'CM',
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 45%, #F5C518 100%)',
    color: '#F5C518',
    ring: '#7c3aed',
  },
  {
    id: 'dr-strange',
    label: 'Dr. Strange',
    symbol: '⊕',
    bg: 'linear-gradient(135deg, #431407 0%, #9a3412 50%, #f97316 100%)',
    color: '#fed7aa',
    ring: '#f97316',
  },
  {
    id: 'wanda',
    label: 'Scarlet Witch',
    symbol: '❋',
    bg: 'linear-gradient(135deg, #4a044e 0%, #86198f 55%, #e879f9 100%)',
    color: '#fce7f3',
    ring: '#e879f9',
  },
  {
    id: 'loki',
    label: 'Loki',
    symbol: 'L',
    bg: 'linear-gradient(135deg, #052e16 0%, #15803d 55%, #F5C518 100%)',
    color: '#F5C518',
    ring: '#22c55e',
  },
  {
    id: 'deadpool',
    label: 'Deadpool',
    symbol: 'DP',
    bg: 'linear-gradient(135deg, #3f0000 0%, #dc2626 50%, #111 100%)',
    color: '#fff',
    ring: '#dc2626',
  },
  {
    id: 'wolverine',
    label: 'Wolverine',
    symbol: 'W',
    bg: 'linear-gradient(135deg, #111 0%, #78350f 40%, #F5C518 100%)',
    color: '#F5C518',
    ring: '#F5C518',
  },
  {
    id: 'hulk',
    label: 'Hulk',
    symbol: 'H',
    bg: 'linear-gradient(135deg, #14532d 0%, #16a34a 60%, #4ade80 100%)',
    color: '#f0fdf4',
    ring: '#22c55e',
  },
  {
    id: 'hawkeye',
    label: 'Hawkeye',
    symbol: '◎',
    bg: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 60%, #c4b5fd 100%)',
    color: '#ede9fe',
    ring: '#7c3aed',
  },
  {
    id: 'ant-man',
    label: 'Ant-Man',
    symbol: '⬡',
    bg: 'linear-gradient(135deg, #7f0000 0%, #E81C2E 60%, #fca5a5 100%)',
    color: '#fff',
    ring: '#E81C2E',
  },
  {
    id: 'star-lord',
    label: 'Star-Lord',
    symbol: '✦',
    bg: 'linear-gradient(135deg, #431407 0%, #ea580c 50%, #F5C518 100%)',
    color: '#fff',
    ring: '#ea580c',
  },
]

// ── getMarvelChar ──────────────────────────────────────────────────────────────
export function getMarvelChar(avatar) {
  if (!avatar?.startsWith('marvel-')) return null
  return MARVEL_AVATARS.find(c => `marvel-${c.id}` === avatar) ?? null
}

// ── Initials helper ────────────────────────────────────────────────────────────
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// ── AvatarDisplay ──────────────────────────────────────────────────────────────
/**
 * Renders the avatar for a given avatar string + name fallback.
 *
 * size:  'sm' (w-10 h-10) | 'md' (w-12 h-12) | 'lg' (w-24 h-24) | 'home' (w-16 h-16)
 */
export function AvatarDisplay({ avatar, name, size = 'md' }) {
  const sizeMap = {
    sm:   { dim: 'w-10 h-10',  font: 'text-base',  radius: 'rounded-xl',  symFont: 'text-xl',   border: '1.5px' },
    md:   { dim: 'w-12 h-12',  font: 'text-lg',    radius: 'rounded-xl',  symFont: 'text-2xl',  border: '1.5px' },
    lg:   { dim: 'w-24 h-24',  font: 'text-5xl',   radius: 'rounded-3xl', symFont: 'text-3xl',  border: '2px' },
    home: { dim: 'w-16 h-16',  font: 'text-2xl',   radius: 'rounded-2xl', symFont: 'text-2xl',  border: '2px' },
  }
  const s = sizeMap[size] ?? sizeMap.md

  // 1. Custom photo
  if (avatar?.startsWith('data:') || avatar?.startsWith('http')) {
    return (
      <div
        className={`${s.dim} ${s.radius} overflow-hidden flex-shrink-0`}
        style={{ border: `${s.border} solid rgba(232,28,46,0.4)` }}
      >
        <img src={avatar} alt="avatar" className="w-full h-full object-cover"/>
      </div>
    )
  }

  // 2. Marvel character avatar
  const char = getMarvelChar(avatar)
  if (char) {
    return (
      <div
        className={`${s.dim} ${s.radius} flex items-center justify-center flex-shrink-0 font-bebas ${s.symFont} select-none`}
        style={{
          background: char.bg,
          color: char.color,
          border: `${s.border} solid ${char.ring}55`,
          letterSpacing: '0.05em',
        }}
      >
        {char.symbol}
      </div>
    )
  }

  // 3. Legacy emoji / text (backwards compat)
  if (avatar) {
    return (
      <div
        className={`${s.dim} ${s.radius} flex items-center justify-center flex-shrink-0`}
        style={{ background: '#161616', border: `${s.border} solid rgba(232,28,46,0.25)` }}
      >
        <span className={s.font}>{avatar}</span>
      </div>
    )
  }

  // 4. Initials fallback
  const initials = getInitials(name)
  return (
    <div
      className={`${s.dim} ${s.radius} flex items-center justify-center flex-shrink-0 font-bebas select-none`}
      style={{
        background: 'linear-gradient(135deg, #7f0000 0%, #E81C2E 100%)',
        color: '#fff',
        fontSize: size === 'lg' ? '2.5rem' : size === 'home' ? '1.75rem' : '1.1rem',
        letterSpacing: '0.05em',
        border: `${s.border} solid rgba(232,28,46,0.4)`,
      }}
    >
      {initials}
    </div>
  )
}
