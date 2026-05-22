/**
 * CharactersPage — Character Encyclopedia
 *
 * Props:
 *   onOpenTitle  — (titleId) => void  (navigate to that title's detail)
 *   watchedIds   — Set of watched title IDs (for showing watched status on linked titles)
 */
import { useState, useMemo, useEffect } from 'react'
import { CHARACTER_PROFILES, AFFILIATIONS } from './data/characterProfiles.js'
import { CHARACTER_TITLES }                  from './data/characters.js'
import { TITLES }                            from './data/titles.js'

// ── helpers ────────────────────────────────────────────────────────────────────
const FAVORITES_KEY = 'mvt-char-favorites'
function loadFavs() {
  try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')) } catch { return new Set() }
}
function saveFavs(s) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...s])) } catch {}
}

// ── CharacterPhoto — photo with emoji fallback ────────────────────────────────
function CharacterPhoto({ profile, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false)
  const sizeMap = { sm: 'w-11 h-11', md: 'w-14 h-14', lg: 'w-20 h-20' }
  const textMap  = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl' }
  const sizeClass = sizeMap[size] ?? sizeMap.md
  const textClass = textMap[size] ?? textMap.md

  if (profile.img && !imgError) {
    return (
      <div
        className={`${sizeClass} rounded-2xl overflow-hidden flex-shrink-0 ${className}`}
        style={{ border: `1.5px solid ${profile.color}40` }}
      >
        <img
          src={profile.img}
          alt={profile.alias}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top"
        />
      </div>
    )
  }

  // Fallback: colored symbol tile
  return (
    <div
      className={`${sizeClass} rounded-2xl flex items-center justify-center flex-shrink-0 ${textClass} ${className}`}
      style={{ background: profile.bg, border: `1.5px solid ${profile.color}40` }}
    >
      <span style={{ filter: 'drop-shadow(0 0 6px ' + profile.color + '80)' }}>
        {profile.symbol}
      </span>
    </div>
  )
}

// ── CharacterCard ──────────────────────────────────────────────────────────────
function CharacterCard({ profile, isFav, onToggleFav, onClick }) {
  const titleIds = CHARACTER_TITLES[profile.charKey] ?? []
  return (
    <button
      onClick={onClick}
      className="relative bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden flex flex-col items-center text-center active:scale-95 transition-all hover:border-[#333]"
      style={{ boxShadow: `0 2px 12px ${profile.color}10` }}
    >
      {/* Photo / symbol header */}
      <div
        className="w-full h-28 overflow-hidden relative"
        style={{ background: profile.bg }}
      >
        {profile.img
          ? <CharacterPhoto profile={profile} size="lg" className="w-full h-full rounded-none" />
          : (
            <div className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: profile.bg }}>
              <span style={{ filter: 'drop-shadow(0 0 8px ' + profile.color + '80)' }}>
                {profile.symbol}
              </span>
            </div>
          )
        }
        {/* Color accent bar */}
        <div className="absolute bottom-0 inset-x-0 h-0.5" style={{ background: profile.color + '80' }}/>
        {/* Fav button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(profile.id) }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-[12px] transition-all hover:scale-110"
          style={{ color: isFav ? '#F5C518' : '#666' }}
        >
          {isFav ? '★' : '☆'}
        </button>
      </div>

      {/* Name / alias / count */}
      <div className="w-full min-w-0 px-2.5 py-2">
        <div
          className="text-[11px] font-bebas tracking-widest leading-tight truncate"
          style={{ color: profile.color }}
        >
          {profile.alias}
        </div>
        <div className="text-[9px] text-[#555] leading-tight truncate mt-0.5">
          {profile.name}
        </div>
        {titleIds.length > 0 && (
          <div className="text-[9px] text-[#3a3a3a] font-semibold mt-1">
            {titleIds.length} title{titleIds.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </button>
  )
}

// ── CharacterDetailPanel ───────────────────────────────────────────────────────
function CharacterDetailPanel({ profile, isFav, onToggleFav, watchedIds, onOpenTitle, onClose }) {
  const titleIds  = CHARACTER_TITLES[profile.charKey] ?? []
  const titles    = titleIds.map(id => TITLES.find(t => t.id === id)).filter(Boolean)
  const [showAllTitles, setShowAllTitles] = useState(false)
  const visibleTitles = showAllTitles ? titles : titles.slice(0, 6)

  const affiliationLabel = AFFILIATIONS.find(a => a.id === profile.affiliation)?.label ?? profile.affiliation

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        zIndex: 10010,
        background: 'rgba(0,0,0,0.97)',
        backdropFilter: 'blur(12px)',
        animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1) both',
      }}
    >
      {/* Top bar */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]"
        style={{ background: '#0d0d0d' }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#666] hover:text-white transition-colors py-1 pr-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span className="text-sm font-medium">Characters</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFav(profile.id)}
            className="text-xl transition-colors"
            style={{ color: isFav ? '#F5C518' : '#333' }}
          >
            {isFav ? '★' : '☆'}
          </button>
          <span
            className="text-[9px] px-2 py-[3px] rounded-md border font-bold tracking-widest"
            style={{ color: profile.color, background: profile.bg, borderColor: profile.color + '40' }}
          >
            {affiliationLabel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#0d0d0d' }}>
        <div className="max-w-lg mx-auto px-5 pt-6 pb-16">

          {/* Hero section */}
          <div className="flex items-start gap-4 mb-6">
            <div style={{ boxShadow: `0 0 20px ${profile.color}25` }}>
              <CharacterPhoto profile={profile} size="lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-bebas text-2xl tracking-widest leading-tight"
                style={{ color: profile.color }}
              >
                {profile.alias}
              </div>
              <div className="text-[#888] text-sm mt-0.5">{profile.name}</div>
              {profile.actor && (
                <div className="text-[#555] text-[11px] mt-1">
                  Portrayed by <span className="text-[#777]">{profile.actor}</span>
                </div>
              )}
              {profile.firstAppearance && (
                <div className="text-[#444] text-[10px] mt-1 uppercase tracking-wider">
                  First appearance: {profile.firstAppearance}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-semibold">Biography</div>
            <p className="text-[#bbb] text-[14px] leading-[1.7]">{profile.bio}</p>
          </div>

          {/* Powers */}
          <div className="mb-6">
            <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-semibold">Powers & Abilities</div>
            <ul className="space-y-1.5">
              {profile.powers.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[10px] mt-1 flex-shrink-0" style={{ color: profile.color }}>▸</span>
                  <span className="text-[13px] text-[#aaa] leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allies & Enemies */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-semibold">Allies</div>
              <div className="flex flex-wrap gap-1.5">
                {profile.allies.length > 0
                  ? profile.allies.map(a => (
                      <span key={a} className="text-[10px] px-2 py-1 rounded-lg bg-[#111] border border-[#1e1e1e] text-[#888]">{a}</span>
                    ))
                  : <span className="text-[11px] text-[#444] italic">—</span>
                }
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-semibold">Enemies</div>
              <div className="flex flex-wrap gap-1.5">
                {profile.enemies.length > 0
                  ? profile.enemies.map(e => (
                      <span key={e} className="text-[10px] px-2 py-1 rounded-lg bg-[#E81C2E]/5 border border-[#E81C2E]/15 text-[#E81C2E]/70">{e}</span>
                    ))
                  : <span className="text-[11px] text-[#444] italic">—</span>
                }
              </div>
            </div>
          </div>

          {/* Appears in */}
          {titles.length > 0 && (
            <div className="mb-6">
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2 font-semibold">
                Appears In ({titles.length})
              </div>
              <div className="space-y-1.5">
                {visibleTitles.map(t => {
                  const watched = watchedIds.has(t.id)
                  return (
                    <button
                      key={t.id}
                      onClick={() => onOpenTitle?.(t.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#111] border border-[#1e1e1e] hover:border-[#333] transition-colors text-left"
                    >
                      <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${
                        watched ? 'bg-[#E81C2E]' : 'border border-[#333] bg-[#0a0a0a]'
                      }`}>
                        {watched && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                      <span className="flex-1 min-w-0 text-[12px] text-[#aaa] truncate">{t.title}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        t.type === 'movie' ? 'text-[#E81C2E]/70' : t.type === 'tv' ? 'text-blue-400/70' : 'text-purple-400/70'
                      }`}>
                        {t.type === 'movie' ? 'FILM' : t.type === 'tv' ? 'TV' : 'ANIM'}
                      </span>
                    </button>
                  )
                })}
              </div>
              {titles.length > 6 && (
                <button
                  onClick={() => setShowAllTitles(v => !v)}
                  className="mt-2 w-full py-2 text-[11px] text-[#555] hover:text-[#888] transition-colors"
                >
                  {showAllTitles ? 'Show less ↑' : `Show all ${titles.length} titles ↓`}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CharactersPage({ onOpenTitle, watchedIds = new Set(), initialFocus = null, onClearFocus }) {
  const [search,      setSearch]      = useState('')
  const [affiliation, setAffiliation] = useState('all')
  const [favorites,   setFavorites]   = useState(() => loadFavs())
  const [selected,    setSelected]    = useState(null) // profile id

  // Auto-open a character panel if we navigated here from TitleDetailModal
  useEffect(() => {
    if (!initialFocus) return
    const profile = CHARACTER_PROFILES.find(p => p.charKey === initialFocus)
    if (profile) setSelected(profile.id)
    onClearFocus?.()
  }, [initialFocus]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleFav(id) {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      saveFavs(next)
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return CHARACTER_PROFILES.filter(p => {
      const matchAff = affiliation === 'all' || p.affiliation === affiliation
      if (!matchAff) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.alias.toLowerCase().includes(q) ||
        p.actor?.toLowerCase().includes(q) ||
        p.powers.some(pw => pw.toLowerCase().includes(q))
      )
    })
  }, [search, affiliation])

  // Favorites first
  const sorted = useMemo(() => {
    const favs    = filtered.filter(p => favorites.has(p.id))
    const nonFavs = filtered.filter(p => !favorites.has(p.id))
    return [...favs, ...nonFavs]
  }, [filtered, favorites])

  const selectedProfile = selected ? CHARACTER_PROFILES.find(p => p.id === selected) : null

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-28">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bebas text-2xl tracking-[0.12em] text-white leading-none">CHARACTERS</h2>
        <p className="text-[10px] text-[#444] tracking-wide mt-0.5">
          {CHARACTER_PROFILES.length} heroes, villains & icons
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
        </svg>
        <input
          type="search"
          placeholder="Search by name, alias, actor, power…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#3a3a3a] focus:outline-none focus:border-[#E81C2E]/50 transition-colors"
        />
      </div>

      {/* Affiliation filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-4">
        {AFFILIATIONS.map(a => (
          <button
            key={a.id}
            onClick={() => setAffiliation(a.id)}
            className={[
              'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all',
              affiliation === a.id
                ? 'bg-[#E81C2E] text-white shadow-[0_0_10px_rgba(232,28,46,0.35)]'
                : 'bg-[#111] text-[#555] border border-[#1e1e1e] hover:text-white',
            ].join(' ')}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Results count + favorites note */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-[#444]">
          {sorted.length} character{sorted.length !== 1 ? 's' : ''}
          {favorites.size > 0 && ` · ${favorites.size} ★ favorited`}
        </span>
        {favorites.size > 0 && affiliation === 'all' && !search && (
          <span className="text-[9px] text-[#F5C518]">★ Favorites shown first</span>
        )}
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center mt-16 gap-3 text-[#333]">
          <span className="text-4xl">🦸</span>
          <p className="text-sm text-[#444]">No characters match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          {sorted.map(profile => (
            <CharacterCard
              key={profile.id}
              profile={profile}
              isFav={favorites.has(profile.id)}
              onToggleFav={toggleFav}
              onClick={() => setSelected(profile.id)}
            />
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selectedProfile && (
        <CharacterDetailPanel
          profile={selectedProfile}
          isFav={favorites.has(selectedProfile.id)}
          onToggleFav={toggleFav}
          watchedIds={watchedIds}
          onOpenTitle={id => {
            setSelected(null)
            onOpenTitle?.(id)
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
