import { useState, useRef, useCallback } from 'react'

// ── Tier config ────────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  S: {
    key: 'S',
    label: 'Legendary',
    color: '#F5C518',
    bg: 'rgba(245,197,24,0.12)',
    border: 'rgba(245,197,24,0.3)',
    glow: 'rgba(245,197,24,0.4)',
    textOnTier: '#000',
  },
  A: {
    key: 'A',
    label: 'Great',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.25)',
    glow: 'rgba(34,197,94,0.35)',
    textOnTier: '#fff',
  },
  B: {
    key: 'B',
    label: 'Good',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.25)',
    glow: 'rgba(96,165,250,0.35)',
    textOnTier: '#fff',
  },
  C: {
    key: 'C',
    label: 'Okay',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.25)',
    glow: 'rgba(249,115,22,0.35)',
    textOnTier: '#fff',
  },
  D: {
    key: 'D',
    label: 'Weak',
    color: '#E81C2E',
    bg: 'rgba(232,28,46,0.1)',
    border: 'rgba(232,28,46,0.25)',
    glow: 'rgba(232,28,46,0.35)',
    textOnTier: '#fff',
  },
}

const TIER_ORDER = ['S', 'A', 'B', 'C', 'D']

// ── Type badge ─────────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const styles = {
    movie:    { bg: 'rgba(232,28,46,0.15)',  color: '#E81C2E', border: 'rgba(232,28,46,0.25)' },
    tv:       { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
    animated: { bg: 'rgba(168,85,247,0.15)', color: '#a855f7', border: 'rgba(168,85,247,0.25)' },
  }
  const labels = { movie: 'MOVIE', tv: 'TV', animated: 'ANIM' }
  const s = styles[type] ?? styles.movie
  return (
    <span
      className="text-[8px] font-bold tracking-widest px-1 py-px rounded"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {labels[type] ?? 'MOVIE'}
    </span>
  )
}

// ── Tier picker popover ────────────────────────────────────────────────────────
function TierPickerPopover({ titleId, currentTier, onSetTier, onClose }) {
  return (
    <div
      className="absolute z-10 rounded-2xl border p-2 flex gap-1.5 shadow-2xl"
      style={{
        top: 'calc(100% + 6px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#161616',
        borderColor: 'rgba(255,255,255,0.1)',
        animation: 'pickBounce 0.2s ease both',
        minWidth: 'max-content',
      }}
    >
      {TIER_ORDER.map(t => {
        const cfg = TIER_CONFIG[t]
        const isCurrent = currentTier === t
        return (
          <button
            key={t}
            onClick={(e) => { e.stopPropagation(); onSetTier(titleId, t); onClose() }}
            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all duration-100 outline-none"
            style={{
              background: isCurrent
                ? `linear-gradient(160deg, ${cfg.color}33 0%, ${cfg.color}22 100%)`
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isCurrent ? cfg.color : 'rgba(255,255,255,0.06)'}`,
              transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <span className="font-bebas text-lg leading-none" style={{ color: cfg.color }}>{t}</span>
            <span className="text-[8px] leading-none" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {cfg.label}
            </span>
          </button>
        )
      })}
      {/* Remove tier option */}
      {currentTier && (
        <button
          onClick={(e) => { e.stopPropagation(); onSetTier(titleId, null); onClose() }}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-100"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span className="text-sm leading-none" style={{ color: 'rgba(255,255,255,0.3)' }}>✕</span>
          <span className="text-[8px] leading-none" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Clear
          </span>
        </button>
      )}
    </div>
  )
}

// ── Title card in tier list ────────────────────────────────────────────────────
function TierTitleCard({ title, tier, onSetTier }) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const cardRef = useRef(null)

  function handleClick(e) {
    e.stopPropagation()
    setPopoverOpen(prev => !prev)
  }

  return (
    <div ref={cardRef} className="relative flex-shrink-0" style={{ maxWidth: 140 }}>
      <button
        onClick={handleClick}
        className="w-full text-left rounded-xl border px-2.5 py-2 transition-all duration-150 outline-none"
        style={{
          background: popoverOpen
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(255,255,255,0.04)',
          borderColor: popoverOpen
            ? (tier ? TIER_CONFIG[tier]?.color + '66' : 'rgba(255,255,255,0.2)')
            : 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-1 mb-1">
          <TypeBadge type={title.type} />
        </div>
        <p
          className="text-xs font-medium leading-snug"
          style={{
            color: 'rgba(255,255,255,0.85)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          title={title.title}
        >
          {title.title}
        </p>
      </button>

      {popoverOpen && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 9 }}
            onClick={(e) => { e.stopPropagation(); setPopoverOpen(false) }}
          />
          <div style={{ position: 'absolute', zIndex: 10 }}>
            <TierPickerPopover
              titleId={title.id}
              currentTier={tier}
              onSetTier={onSetTier}
              onClose={() => setPopoverOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  )
}

// ── Tier row section ───────────────────────────────────────────────────────────
function TierSection({ tierKey, titles, tiers, onSetTier }) {
  const cfg = TIER_CONFIG[tierKey]
  const tieredTitles = titles.filter(t => tiers[t.id] === tierKey)

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: cfg.border, background: cfg.bg }}
    >
      {/* Tier header */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ borderBottom: `1px solid ${cfg.border}` }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bebas text-2xl leading-none"
          style={{
            background: `linear-gradient(135deg, ${cfg.color} 0%, ${cfg.color}aa 100%)`,
            color: cfg.textOnTier,
            boxShadow: `0 0 16px ${cfg.glow}`,
          }}
        >
          {tierKey}
        </div>
        <div>
          <p className="font-bebas text-base tracking-widest leading-none" style={{ color: cfg.color }}>
            {tierKey} — {cfg.label}
          </p>
          <p className="text-[10px] leading-none mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {tieredTitles.length} title{tieredTitles.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Cards row */}
      <div className="px-3 py-3 overflow-x-auto no-scrollbar">
        {tieredTitles.length === 0 ? (
          <div
            className="flex items-center justify-center h-14 rounded-xl border border-dashed"
            style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.18)' }}
          >
            <span className="text-xs">Drop titles here</span>
          </div>
        ) : (
          <div className="flex gap-2">
            {tieredTitles.map(title => (
              <TierTitleCard
                key={title.id}
                title={title}
                tier={tierKey}
                onSetTier={onSetTier}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Stats bar section ──────────────────────────────────────────────────────────
function TierStats({ titles, watched, tiers }) {
  const watchedTitles = titles.filter(t => watched.has(t.id))
  const total = watchedTitles.length
  if (total === 0) return null

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <p className="font-bebas text-sm tracking-widest text-white/50 mb-3 uppercase">Tier Breakdown</p>
      <div className="space-y-2.5">
        {TIER_ORDER.map(tierKey => {
          const cfg   = TIER_CONFIG[tierKey]
          const count = watchedTitles.filter(t => tiers[t.id] === tierKey).length
          const pct   = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={tierKey} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center font-bebas text-sm leading-none flex-shrink-0"
                style={{ background: cfg.color + '22', color: cfg.color, border: `1px solid ${cfg.color}44` }}
              >
                {tierKey}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {cfg.label}
                  </span>
                  <span className="text-[10px] font-semibold tabular-nums" style={{ color: cfg.color }}>
                    {count} <span style={{ color: 'rgba(255,255,255,0.25)' }}>({pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: cfg.color, boxShadow: pct > 0 ? `0 0 8px ${cfg.glow}` : 'none' }}
                  />
                </div>
              </div>
            </div>
          )
        })}
        {/* Unrated row */}
        {(() => {
          const unrated = watchedTitles.filter(t => !tiers[t.id]).length
          const pct = total > 0 ? Math.round((unrated / total) * 100) : 0
          return (
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                ?
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>Not rated</span>
                  <span className="text-[10px] tabular-nums" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {unrated} ({pct}%)
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: 'rgba(255,255,255,0.12)' }}
                  />
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// ── Share card modal ───────────────────────────────────────────────────────────
function ShareModal({ titles, watched, tiers, onClose }) {
  const watchedTitles = titles.filter(t => watched.has(t.id))

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 10001, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm flex flex-col gap-4"
        style={{ animation: 'pickBounce 0.3s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Screenshot hint */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-1">Screenshot this to share!</p>
          <p className="text-[11px] text-[#333]">Long-press on mobile · Cmd+Shift+4 on Mac</p>
        </div>

        {/* The shareable card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #1a0000 0%, #0a0a0a 40%, #0d0800 100%)',
            border: '2px solid rgba(232,28,46,0.4)',
            boxShadow: '0 0 40px rgba(232,28,46,0.2), 0 0 80px rgba(245,197,24,0.1)',
          }}
        >
          {/* Header */}
          <div
            className="px-5 pt-5 pb-4 text-center"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center font-bebas text-sm font-black"
                style={{ background: 'linear-gradient(135deg, #E81C2E 0%, #b01020 100%)', color: '#fff' }}
              >
                M
              </div>
              <p
                className="font-bebas text-lg tracking-[0.2em] leading-none"
                style={{ color: '#E81C2E' }}
              >
                MARVEL WATCH TRACKER
              </p>
            </div>
            <p className="font-bebas text-3xl tracking-[0.15em] text-white">MY TIER LIST</p>
            <p className="text-[10px] tracking-widest" style={{ color: '#F5C518' }}>
              {watchedTitles.length} titles watched
            </p>
          </div>

          {/* Tier rows */}
          <div className="px-4 py-3 space-y-2">
            {TIER_ORDER.map(tierKey => {
              const cfg = TIER_CONFIG[tierKey]
              const tieredTitles = watchedTitles.filter(t => tiers[t.id] === tierKey)
              if (tieredTitles.length === 0) return null
              return (
                <div
                  key={tierKey}
                  className="flex gap-2 rounded-xl overflow-hidden"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                  {/* Tier badge column */}
                  <div
                    className="flex items-center justify-center w-8 flex-shrink-0 font-bebas text-xl"
                    style={{
                      background: `linear-gradient(160deg, ${cfg.color}33 0%, ${cfg.color}18 100%)`,
                      color: cfg.color,
                      borderRight: `1px solid ${cfg.border}`,
                    }}
                  >
                    {tierKey}
                  </div>
                  {/* Titles */}
                  <div className="flex-1 min-w-0 py-2 pr-2">
                    <div className="flex flex-wrap gap-1">
                      {tieredTitles.map(t => (
                        <span
                          key={t.id}
                          className="text-[9px] font-medium rounded-lg px-1.5 py-0.5"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            color: 'rgba(255,255,255,0.75)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            maxWidth: 110,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'inline-block',
                          }}
                          title={t.title}
                        >
                          {t.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* If nothing is tiered */}
            {TIER_ORDER.every(t => watchedTitles.filter(w => tiers[w.id] === t).length === 0) && (
              <div className="py-4 text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
                <p className="text-xs">No titles rated yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-5 py-3 text-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="text-[9px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
              marvelwatchtracker.app
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mx-auto text-[11px] text-[#444] hover:text-white transition-colors underline underline-offset-2"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ── Main TierListPage ──────────────────────────────────────────────────────────
export default function TierListPage({ titles, watched, tiers, onSetTier, onClose }) {
  const [showShare, setShowShare] = useState(false)

  // Only show watched titles in the tier list
  const watchedTitles = titles.filter(t => watched.has(t.id))

  // Untiered watched titles
  const untieredTitles = watchedTitles.filter(t => !tiers[t.id])

  // Stats counts
  const ratedCount = watchedTitles.filter(t => !!tiers[t.id]).length

  return (
    <>
      <div
        className="fixed inset-0 flex flex-col"
        style={{
          zIndex: 10000,
          background: '#0a0a0a',
          animation: 'slideUp 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both',
        }}
      >
        {/* ── Top bar ── */}
        <div
          className="flex-shrink-0 flex items-center gap-3 px-4 pt-safe-top"
          style={{
            paddingTop: 'max(env(safe-area-inset-top), 16px)',
            paddingBottom: 14,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(10,10,10,0.97)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Back button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
            </svg>
            <span className="text-[11px] font-semibold tracking-wide">Back</span>
          </button>

          {/* Title */}
          <div className="flex-1 text-center">
            <h1 className="font-bebas text-2xl tracking-[0.2em] leading-none text-white">
              TIER LIST
            </h1>
            <p className="text-[9px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {ratedCount} of {watchedTitles.length} rated
            </p>
          </div>

          {/* Share button */}
          <button
            onClick={() => setShowShare(true)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all"
            style={{
              background: 'rgba(232,28,46,0.12)',
              border: '1px solid rgba(232,28,46,0.25)',
              color: '#E81C2E',
            }}
          >
            <span className="text-base leading-none">📤</span>
            <span className="font-bebas text-base tracking-widest leading-none">Share</span>
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="max-w-lg mx-auto px-4 py-4 space-y-3 pb-8">

            {/* Intro tip */}
            {watchedTitles.length > 0 && (
              <p className="text-[10px] text-center tracking-wider" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Tap any title card to reassign its tier
              </p>
            )}

            {watchedTitles.length === 0 && (
              <div
                className="rounded-2xl border p-8 text-center mt-8"
                style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="text-4xl mb-3">🎬</div>
                <p className="font-bebas text-xl tracking-widest text-white mb-1">NO TITLES YET</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Mark titles as watched to start building your tier list
                </p>
              </div>
            )}

            {/* Tier sections */}
            {TIER_ORDER.map(tierKey => (
              <TierSection
                key={tierKey}
                tierKey={tierKey}
                titles={watchedTitles}
                tiers={tiers}
                onSetTier={onSetTier}
              />
            ))}

            {/* Not yet rated section */}
            {untieredTitles.length > 0 && (
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  borderColor: 'rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    ?
                  </div>
                  <div>
                    <p className="font-bebas text-base tracking-widest leading-none" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Not Yet Rated
                    </p>
                    <p className="text-[10px] leading-none mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {untieredTitles.length} title{untieredTitles.length !== 1 ? 's' : ''} — tap to assign a tier
                    </p>
                  </div>
                </div>

                <div className="px-3 py-3 overflow-x-auto no-scrollbar">
                  <div className="flex gap-2">
                    {untieredTitles.map(title => (
                      <TierTitleCard
                        key={title.id}
                        title={title}
                        tier={null}
                        onSetTier={onSetTier}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stats breakdown */}
            {watchedTitles.length > 0 && (
              <TierStats titles={titles} watched={watched} tiers={tiers} />
            )}
          </div>
        </div>
      </div>

      {/* Share modal */}
      {showShare && (
        <ShareModal
          titles={titles}
          watched={watched}
          tiers={tiers}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  )
}
