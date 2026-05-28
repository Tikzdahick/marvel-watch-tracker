/**
 * CharactersPage — Heroes & Villains Encyclopedia (cinematic redesign)
 */
import { useState, useMemo, useEffect, useRef } from 'react'
import { CHARACTER_PROFILES, CHARACTER_PROFILE_MAP, CONNECTIONS } from './data/characterProfiles.js'
import { CHARACTER_TITLES } from './data/characters.js'
import { TITLES } from './data/titles.js'
import { getCharAttrs } from './data/characterAttributes.js'

// ── constants ──────────────────────────────────────────────────────────────────
const FAVORITES_KEY = 'mvt-char-favorites'

function loadFavs() {
  try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')) } catch { return new Set() }
}
function saveFavs(s) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...s])) } catch {}
}

// Card border/accent color by type
function borderColor(p) {
  if (p.affiliation === 'villain') return '#E81C2E'
  if (p.affiliation === 'other')   return '#555555'
  return '#F5C518'
}

// Special filter sets (IDs that belong to each virtual category)
const ASGARD_IDS = new Set([
  'thor','loki','odin','frigga','valkyrie','heimdall','sif','hela','skurge',
  'volstagg','fandral','hogun','laufey','amora','surtur','korg','miek',
  'zeus-asgard','jane-foster','eitri','gorr-villain',
])
const COSMIC_IDS = new Set([
  'thanos','gamora','rocket','groot','drax','nebula','star-lord','mantis',
  'yondu','ego','ronan','korath','ayesha','taserface','kraglin','adam-warlock',
  'collector','grandmaster','meredith-quill','stakar-ogord','lylla','cosmo',
  'phyla-vell','high-evolutionary','arishem','tiamut','eros','pip-troll',
  'kro','deviant-kro','captain-marvel','talos','soren','gravik','giah',
  'silver-surfer','galactus','galactus','silver-surfer',
])
const SPIDER_IDS = new Set([
  'spider-man','miles-morales','gwen-stacy','spider-ham','peni-parker',
  'spider-noir','iron-spider','vulture','green-goblin','otto-octavius',
  'shocker-schultz','mysterio','lizard','j-jonah-jameson',
  'aunt-may','ned-leeds','mj-michelle','happy-hogan',
])

// Filter tab definitions
const FILTER_TABS = [
  { id: 'all',         label: 'All' },
  { id: 'heroes',      label: 'Heroes' },
  { id: 'villains',    label: 'Villains' },
  { id: 'side',        label: 'Side Chars' },
  { id: 'avengers',    label: 'Avengers' },
  { id: 'xmen',        label: 'X-Men' },
  { id: 'guardians',   label: 'Guardians' },
  { id: 'defenders',   label: 'Defenders' },
  { id: 'shield',      label: 'S.H.I.E.L.D.' },
  { id: 'asgard',      label: 'Asgard' },
  { id: 'cosmic',      label: 'Cosmic' },
  { id: 'spiderverse', label: 'Spider-Verse' },
]

function applyFilter(profiles, tab) {
  switch (tab) {
    case 'heroes':      return profiles.filter(p => p.affiliation !== 'villain')
    case 'villains':    return profiles.filter(p => p.affiliation === 'villain')
    case 'side':        return profiles.filter(p => p.affiliation === 'other')
    case 'avengers':    return profiles.filter(p => p.affiliation === 'avengers')
    case 'xmen':        return profiles.filter(p => p.affiliation === 'xmen')
    case 'guardians':   return profiles.filter(p => p.affiliation === 'guardians')
    case 'defenders':   return profiles.filter(p => p.affiliation === 'defenders')
    case 'shield':      return profiles.filter(p => p.affiliation === 'shield')
    case 'asgard':      return profiles.filter(p => ASGARD_IDS.has(p.id))
    case 'cosmic':      return profiles.filter(p => COSMIC_IDS.has(p.id))
    case 'spiderverse': return profiles.filter(p => SPIDER_IDS.has(p.id))
    default:            return profiles
  }
}

// ── Advanced filter config ─────────────────────────────────────────────────────
const GENDER_OPTS     = [{ id:'all',label:'All' },{ id:'male',label:'Male' },{ id:'female',label:'Female' },{ id:'nonbinary',label:'Non-binary' }]
const ORIGIN_OPTS     = [{ id:'all',label:'All' },{ id:'earth',label:'From Earth' },{ id:'not-earth',label:'Not From Earth' },{ id:'alien',label:'Alien' },{ id:'asgardian',label:'Asgardian' },{ id:'mutant',label:'Mutant' },{ id:'enhanced',label:'Enhanced Human' },{ id:'android',label:'AI / Android' },{ id:'cosmic',label:'Cosmic Entity' }]
const POWER_TYPE_OPTS = [{ id:'strength',label:'Strength' },{ id:'speed',label:'Speed' },{ id:'flight',label:'Flight' },{ id:'magic',label:'Magic' },{ id:'tech',label:'Tech' },{ id:'telepathy',label:'Telepathy' },{ id:'energy',label:'Energy' },{ id:'healing',label:'Healing' },{ id:'stealth',label:'Stealth' },{ id:'elemental',label:'Elemental' },{ id:'time-reality',label:'Time / Reality' },{ id:'martial-arts',label:'Martial Arts' },{ id:'weapons',label:'Weapons' }]
const POWER_LEVEL_OPTS= [{ id:'all',label:'All' },{ id:'street',label:'Street Level' },{ id:'enhanced',label:'Enhanced' },{ id:'superhuman',label:'Superhuman' },{ id:'cosmic',label:'Cosmic' },{ id:'universal',label:'Universal' },{ id:'multiversal',label:'Multiversal' }]
const STATUS_OPTS     = [{ id:'all',label:'All' },{ id:'hero',label:'Hero' },{ id:'villain',label:'Villain' },{ id:'anti-hero',label:'Anti-Hero' },{ id:'side',label:'Side Character' },{ id:'deceased',label:'Deceased' }]
const TEAM_OPTS       = [{ id:'all',label:'All' },{ id:'avengers',label:'Avengers' },{ id:'xmen',label:'X-Men' },{ id:'guardians',label:'Guardians' },{ id:'defenders',label:'Defenders' },{ id:'shield',label:'S.H.I.E.L.D.' },{ id:'hydra',label:'HYDRA' },{ id:'asgard',label:'Asgard' },{ id:'wakanda',label:'Wakanda' },{ id:'eternals',label:'Eternals' },{ id:'spider-verse',label:'Spider-Verse' },{ id:'symbiotes',label:'Symbiotes' }]

const BLANK_FILTERS = { gender:'all', origin:'all', powerTypes:[], powerLevel:'all', status:'all', team:'all' }

function countActiveFilters(f) {
  return (f.gender !== 'all' ? 1 : 0) +
         (f.origin !== 'all' ? 1 : 0) +
         (f.powerTypes.length > 0 ? 1 : 0) +
         (f.powerLevel !== 'all' ? 1 : 0) +
         (f.status !== 'all' ? 1 : 0) +
         (f.team !== 'all' ? 1 : 0)
}

function applyAdvancedFilters(profiles, filters) {
  const { gender, origin, powerTypes, powerLevel, status, team } = filters
  return profiles.filter(p => {
    const a = getCharAttrs(p)
    if (gender !== 'all' && a.gender !== gender) return false
    if (origin !== 'all') {
      if (origin === 'not-earth') { if (a.origin === 'earth') return false }
      else if (a.origin !== origin) return false
    }
    if (powerTypes.length > 0 && !powerTypes.some(pt => a.powerTypes.includes(pt))) return false
    if (powerLevel !== 'all' && a.powerLevel !== powerLevel) return false
    if (status !== 'all') {
      if (status === 'deceased') { if (!a.deceased) return false }
      else if (a.status !== status) return false
    }
    if (team !== 'all' && !a.teams.includes(team)) return false
    return true
  })
}

// ── Hero Groups data ───────────────────────────────────────────────────────────
export const HERO_GROUPS = [
  { id: 'avengers',       emoji: '🛡', name: 'Avengers',            color: '#E81C2E',
    members: ['Iron Man','Captain America','Thor','Hulk','Black Widow','Hawkeye','War Machine','Falcon','Ant-Man','Wasp','Spider-Man','Doctor Strange','Black Panther','Captain Marvel','Scarlet Witch','Vision','Quicksilver','Mantis','Nebula','Star-Lord','Groot','Rocket','Drax','Gamora','Okoye','Wong','Shang-Chi','Kate Bishop','Yelena Belova','Sam Wilson','Bucky Barnes'] },
  { id: 'xmen',           emoji: '✖', name: 'X-Men',               color: '#facc15',
    members: ['Professor X','Magneto','Jean Grey','Cyclops','Storm','Rogue','Gambit','Wolverine','Beast','Iceman','Nightcrawler','Jubilee','Psylocke','Angel','Colossus','Deadpool','Cable','Domino','X-23','Negasonic Teenage Warhead','Quicksilver','Mystique','Banshee','Havok','Darwin','Dazzler','Polaris'] },
  { id: 'guardians',      emoji: '🌌', name: 'Guardians of the Galaxy', color: '#f97316',
    members: ['Star-Lord','Gamora','Drax','Rocket','Groot','Nebula','Mantis','Yondu','Kraglin','Adam Warlock','Phyla-Vell','Cosmo','Howard the Duck','Stakar'] },
  { id: 'defenders',      emoji: '⚖', name: 'Defenders',            color: '#a78bfa',
    members: ['Daredevil','Jessica Jones','Luke Cage','Iron Fist','Punisher','Elektra'] },
  { id: 'shield',         emoji: '🔵', name: 'S.H.I.E.L.D.',        color: '#60a5fa',
    members: ['Nick Fury','Phil Coulson','Maria Hill','Melinda May','Daisy Johnson','Leo Fitz','Jemma Simmons','Mack','Lance Hunter','Bobbi Morse','Elena Rodriguez'] },
  { id: 'hydra',          emoji: '🐙', name: 'HYDRA',               color: '#6b7280',
    members: ['Red Skull','Arnim Zola','Alexander Pierce','Crossbones','Grant Ward','John Garrett','Daniel Whitehall'] },
  { id: 'asgardians',     emoji: '⚡', name: 'Asgardians',           color: '#fcd34d',
    members: ['Thor','Loki','Odin','Frigga','Heimdall','Sif','Valkyrie','Volstagg','Fandral','Hogun','Skurge','Hela'] },
  { id: 'eternals-group', emoji: '🌟', name: 'Eternals',             color: '#818cf8',
    members: ['Sersi','Ikaris','Thena','Gilgamesh','Druig','Makkari','Phastos','Kingo','Sprite','Ajak'] },
  { id: 'wakandans',      emoji: '🌿', name: 'Wakandans',            color: '#a3e635',
    members: ['Black Panther','Shuri','Okoye','Nakia','Ramonda','M\'Baku','Ayo','Aneka','W\'Kabi','Zuri','T\'Chaka'] },
  { id: 'skrulls',        emoji: '👽', name: 'Skrulls',              color: '#34d399',
    members: ['Talos','Soren','G\'iah','Gravik','Beto','Pagon','Brogan','Brixo','Kora'] },
  { id: 'symbiotes',      emoji: '🖤', name: 'Symbiotes',            color: '#1e1b4b',
    members: ['Venom','Carnage','Shriek','Eddie Brock','Anne Weying','Dan Lewis'] },
  { id: 'midnight-sons',  emoji: '🌙', name: 'Midnight Sons',        color: '#94a3b8',
    members: ['Moon Knight','Blade','Ghost Rider','Elsa Bloodstone','Man-Thing','Werewolf by Night'] },
  { id: 'spider-verse',   emoji: '🕷', name: 'Spider-Verse',         color: '#f9a8d4',
    members: ['Spider-Man (Peter Parker)','Miles Morales','Spider-Man Noir','Spider-Ham','Peni Parker','Gwen Stacy','Spider-Man 2099'] },
  { id: 'thunderbolts',   emoji: '⚡', name: 'Thunderbolts*',        color: '#f87171',
    members: ['Yelena Belova','US Agent','Ghost','Red Guardian','Taskmaster','Bucky Barnes','Sentry'] },
  { id: 'young-avengers', emoji: '🌱', name: 'Young Avengers',       color: '#7dd3fc',
    members: ['Kate Bishop','America Chavez','Wiccan','Speed','Kid Loki','Patriot','Stature','Iron Lad'] },
  { id: 'illuminati',     emoji: '💡', name: 'Illuminati',           color: '#c084fc',
    members: ['Iron Man','Captain America','Professor X','Reed Richards','Black Bolt','Namor','Doctor Strange'] },
  { id: 'sinister-six',   emoji: '☠', name: 'Sinister Six',         color: '#fb923c',
    members: ['Doctor Octopus','Green Goblin','Electro','Vulture','Sandman','Mysterio'] },
  { id: 'black-order',    emoji: '💀', name: 'Black Order',          color: '#7f1d1d',
    members: ['Thanos','Corvus Glaive','Proxima Midnight','Ebony Maw','Cull Obsidian','Black Dwarf'] },
  { id: 'nova-corps',     emoji: '🌠', name: 'Nova Corps',           color: '#fbbf24',
    members: ['Nova Prime','Rhomann Dey','Denarian Saal','Garthan Saal'] },
  { id: 'ravagers',       emoji: '🏴‍☠️', name: 'Ravagers',           color: '#f97316',
    members: ['Yondu','Kraglin','Stakar','Aleta','Charlie-27','Martinex','Krugarr'] },
]

// name → profile (case-insensitive best-effort lookup)
function findProfileByName(name) {
  const lower = name.toLowerCase()
  return CHARACTER_PROFILES.find(p =>
    p.name.toLowerCase() === lower ||
    p.alias.toLowerCase() === lower ||
    p.charKey?.toLowerCase() === lower
  )
}

// ── GroupsView ─────────────────────────────────────────────────────────────────
function GroupsView({ onSelectProfile }) {
  const [openGroup, setOpenGroup] = useState(null)

  return (
    <div className="space-y-2">
      {HERO_GROUPS.map(group => {
        const isOpen = openGroup === group.id
        return (
          <div
            key={group.id}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${group.color}25`, background: '#0e0e0e' }}
          >
            {/* Group header */}
            <button
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
              onClick={() => setOpenGroup(isOpen ? null : group.id)}
            >
              <span className="text-xl flex-shrink-0">{group.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] text-white leading-snug">{group.name}</div>
                <div className="text-[10px] mt-0.5" style={{ color: group.color + 'aa' }}>
                  {group.members.length} members
                </div>
              </div>
              <svg
                className="w-4 h-4 flex-shrink-0 transition-transform"
                style={{ color: '#444', transform: isOpen ? 'rotate(90deg)' : 'none' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            {/* Member list */}
            {isOpen && (
              <div style={{ borderTop: `1px solid ${group.color}15`, padding: '12px 16px 16px' }}>
                <div className="grid grid-cols-2 gap-2">
                  {group.members.map(name => {
                    const profile = findProfileByName(name)
                    return (
                      <button
                        key={name}
                        onClick={() => profile && onSelectProfile(profile.id)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all active:scale-95"
                        style={{
                          background: profile ? `${group.color}0d` : '#111',
                          border: `1px solid ${profile ? group.color + '30' : '#1a1a1a'}`,
                          cursor: profile ? 'pointer' : 'default',
                        }}
                      >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                          style={{ background: profile ? `${group.color}22` : '#1a1a1a', border: `1px solid ${profile ? group.color + '40' : '#222'}` }}>
                          {profile?.img
                            ? <img src={profile.img} alt={name} className="w-full h-full object-cover object-top" onError={e => { e.target.style.display='none' }}/>
                            : <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: group.color }}>
                                {profile?.symbol ?? name[0]}
                              </div>
                          }
                        </div>
                        <span className="text-[11px] leading-snug truncate" style={{ color: profile ? '#ccc' : '#444' }}>
                          {name}
                        </span>
                        {profile && (
                          <svg className="w-3 h-3 flex-shrink-0 ml-auto" style={{ color: group.color + '80' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Daily featured character — changes each day, picks from well-represented ones
function getDailyFeatured() {
  const day  = Math.floor(Date.now() / 86400000)
  const pool = CHARACTER_PROFILES.filter(p => (CHARACTER_TITLES[p.charKey] ?? []).length >= 2)
  const src  = pool.length ? pool : CHARACTER_PROFILES
  return src[day % src.length]
}

// ── CharacterVisual ────────────────────────────────────────────────────────────
// Full-bleed image with emoji+gradient fallback
function CharacterVisual({ profile, className = '' }) {
  const [err, setErr] = useState(false)
  if (profile.img && !err) {
    return (
      <img
        src={profile.img}
        alt={profile.alias}
        onError={() => setErr(true)}
        className={`w-full h-full object-cover object-top ${className}`}
      />
    )
  }
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{ background: `radial-gradient(ellipse at center, ${profile.bg} 0%, #000 100%)` }}
    >
      <span
        className="text-7xl select-none"
        style={{ filter: `drop-shadow(0 0 28px ${profile.color}90)` }}
      >
        {profile.symbol}
      </span>
    </div>
  )
}

// ── FeaturedBanner ─────────────────────────────────────────────────────────────
function FeaturedBanner({ profile, onViewProfile }) {
  const titleCount = (CHARACTER_TITLES[profile.charKey] ?? []).length
  const bc = borderColor(profile)

  return (
    <button
      onClick={onViewProfile}
      className="w-full relative overflow-hidden rounded-3xl mb-5 active:scale-[0.98] transition-transform"
      style={{
        height: 210,
        border: `1.5px solid ${bc}35`,
        boxShadow: `0 0 40px ${profile.color}18, 0 6px 24px rgba(0,0,0,0.7)`,
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <CharacterVisual profile={profile} />
      </div>

      {/* Left-to-right gradient so text is readable on left */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      {/* Right color glow */}
      <div
        className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${profile.color}18, transparent)` }}
      />

      {/* Top label */}
      <div className="absolute top-4 left-5">
        <span className="text-[9px] uppercase tracking-[0.25em] font-bold" style={{ color: bc }}>
          ✦ Featured Character
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 text-left">
        <div className="font-bebas text-4xl tracking-widest leading-none text-white drop-shadow-lg">
          {profile.alias}
        </div>
        <div className="text-[11px] text-white/45 mt-0.5 mb-3">{profile.name}</div>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[11px] font-bold"
            style={{ background: bc, color: bc === '#555555' ? '#fff' : '#000' }}
          >
            View Profile →
          </span>
          {titleCount > 0 && (
            <span className="text-[10px] text-white/35">
              {titleCount} appearance{titleCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// ── CharacterCard (2-col, cinematic) ──────────────────────────────────────────
function CharacterCard({ profile, isFav, onToggleFav, onClick }) {
  const titleCount = (CHARACTER_TITLES[profile.charKey] ?? []).length
  const bc = borderColor(profile)

  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl active:scale-[0.95] transition-transform text-left"
      style={{
        background: '#080808',
        border: `1.5px solid ${bc}28`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.6)`,
        aspectRatio: '3/4',
      }}
    >
      {/* Full-card image */}
      <div className="absolute inset-0">
        <CharacterVisual profile={profile} />
        {/* Bottom gradient for name legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.5) 38%, transparent 62%)',
          }}
        />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: `${bc}70` }} />

      {/* Fav button */}
      <button
        onClick={e => { e.stopPropagation(); onToggleFav(profile.id) }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm active:scale-110 transition-all"
        style={{
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          color: isFav ? '#F5C518' : '#444',
        }}
      >
        {isFav ? '★' : '☆'}
      </button>

      {/* Appearance count badge */}
      {titleCount > 0 && (
        <div
          className="absolute top-2 left-2 px-1.5 py-0.5 rounded-lg text-[9px] font-bold leading-none"
          style={{
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            color: bc === '#555555' ? '#aaa' : bc,
          }}
        >
          {titleCount}×
        </div>
      )}

      {/* Name / real name */}
      <div className="absolute bottom-0 inset-x-0 px-3 pb-3 pt-2">
        <div
          className="text-[13px] font-bebas tracking-widest leading-tight truncate"
          style={{ color: bc === '#555555' ? '#ccc' : bc }}
        >
          {profile.alias}
        </div>
        <div className="text-[9px] leading-tight truncate mt-0.5" style={{ color: '#555' }}>
          {profile.name}
        </div>
      </div>
    </button>
  )
}

// ── ConnectionCircle ───────────────────────────────────────────────────────────
function ConnectionCircle({ profile }) {
  const [err, setErr] = useState(false)
  if (profile.img && !err) {
    return (
      <img
        src={profile.img}
        alt={profile.alias}
        onError={() => setErr(true)}
        className="w-full h-full object-cover object-top"
      />
    )
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center text-2xl"
      style={{ background: `radial-gradient(ellipse, ${profile.bg} 0%, #000 100%)` }}
    >
      <span style={{ filter: `drop-shadow(0 0 8px ${profile.color}80)` }}>{profile.symbol}</span>
    </div>
  )
}

// ── CharacterDetailPanel (cinematic full-screen) ───────────────────────────────
function CharacterDetailPanel({ profile, isFav, onToggleFav, watchedIds, onOpenTitle, onClose, onNavigateToProfile }) {
  const titleIds     = CHARACTER_TITLES[profile.charKey] ?? []
  const titles       = titleIds.map(id => TITLES.find(t => t.id === id)).filter(Boolean)
  const [showAll, setShowAll] = useState(false)
  const visibleTitles = showAll ? titles : titles.slice(0, 6)
  const bc = borderColor(profile)

  // Type badge config
  const badge =
    profile.affiliation === 'villain'
      ? { label: 'VILLAIN',        bg: '#E81C2E15', color: '#E81C2E', border: '#E81C2E35' }
      : profile.affiliation === 'other'
      ? { label: 'SIDE CHARACTER', bg: '#55555515', color: '#888',    border: '#55555535' }
      : { label: 'HERO',           bg: '#F5C51815', color: '#F5C518', border: '#F5C51835' }

  // Connections
  const connectedKeys = CONNECTIONS[profile.charKey] ?? profile.allies ?? []
  const connections   = connectedKeys.map(k => CHARACTER_PROFILE_MAP[k]).filter(Boolean).slice(0, 12)

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ zIndex: 10010, background: '#060606', animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1) both' }}
    >
      {/* ── Cinematic hero image ── */}
      <div className="relative flex-shrink-0" style={{ height: 300 }}>
        <div className="absolute inset-0">
          <CharacterVisual profile={profile} />
        </div>
        {/* Bottom fade to page bg */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(6,6,6,0.15) 0%, rgba(6,6,6,0.45) 55%, rgba(6,6,6,1) 100%)',
          }}
        />
        {/* Side color glow */}
        <div
          className="absolute top-0 right-0 bottom-0 w-24 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${profile.color}12, transparent)` }}
        />

        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute top-safe-or-4 left-4 mt-4 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold text-white active:scale-95 transition-all"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', marginTop: 'env(safe-area-inset-top, 16px)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>

        {/* Fav button */}
        <button
          onClick={() => onToggleFav(profile.id)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl active:scale-95 transition-all"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: isFav ? '#F5C518' : '#444', marginTop: 'env(safe-area-inset-top, 0px)' }}
        >
          {isFav ? '★' : '☆'}
        </button>

        {/* Identity block at bottom of header */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <span
            className="inline-block text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-lg mb-2"
            style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
          >
            {badge.label}
          </span>
          <h1 className="font-bebas text-5xl tracking-widest text-white leading-none drop-shadow-lg">
            {profile.alias}
          </h1>
          <div className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{profile.name}</div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#060606' }}>
        <div className="px-5 pt-5 pb-28">

          {/* Actor + debut chips */}
          {(profile.actor || profile.firstAppearance) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {profile.actor && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
                  <span className="text-[9px] uppercase tracking-widest text-[#444]">Actor</span>
                  <span className="text-[11px] text-[#ccc] font-semibold">{profile.actor}</span>
                </div>
              )}
              {profile.firstAppearance && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
                  <span className="text-[9px] uppercase tracking-widest text-[#444]">Debut</span>
                  <span className="text-[11px] text-[#ccc] font-semibold">{profile.firstAppearance}</span>
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          <div className="mb-7">
            <div className="text-[9px] uppercase tracking-[0.22em] font-bold text-[#3a3a3a] mb-2.5">Biography</div>
            <p className="text-[14px] text-[#bbb] leading-[1.75]">{profile.bio}</p>
          </div>

          {/* Powers — pill chips */}
          {profile.powers?.length > 0 && (
            <div className="mb-7">
              <div className="text-[9px] uppercase tracking-[0.22em] font-bold text-[#3a3a3a] mb-3">Powers & Abilities</div>
              <div className="flex flex-wrap gap-2">
                {profile.powers.map((pw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-medium"
                    style={{ background: `${profile.color}12`, color: profile.color, border: `1px solid ${profile.color}28` }}
                  >
                    {pw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Connections — horizontal scroll circles */}
          {connections.length > 0 && (
            <div className="mb-7">
              <div className="text-[9px] uppercase tracking-[0.22em] font-bold text-[#3a3a3a] mb-3">Connections</div>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5">
                {connections.map(conn => {
                  const cbc = borderColor(conn)
                  return (
                    <button
                      key={conn.id}
                      onClick={() => onNavigateToProfile?.(conn.charKey)}
                      className="flex-shrink-0 flex flex-col items-center gap-2 active:scale-90 transition-transform"
                      style={{ width: 68 }}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl overflow-hidden"
                        style={{ border: `2px solid ${cbc}35`, boxShadow: `0 2px 10px ${conn.color}15` }}
                      >
                        <ConnectionCircle profile={conn} />
                      </div>
                      <div
                        className="text-[9px] text-center leading-tight w-full truncate font-medium"
                        style={{ color: cbc === '#555555' ? '#888' : cbc }}
                      >
                        {conn.alias}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Appears in */}
          {titles.length > 0 && (
            <div>
              <div className="text-[9px] uppercase tracking-[0.22em] font-bold text-[#3a3a3a] mb-3">
                Appears In
                <span className="ml-2 text-[#2a2a2a]">({titles.length})</span>
              </div>
              <div className="space-y-2">
                {visibleTitles.map(t => {
                  const watched = watchedIds.has(t.id)
                  return (
                    <button
                      key={t.id}
                      onClick={() => onOpenTitle?.(t.id)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left active:scale-[0.98] transition-all"
                      style={{ background: '#0f0f0f', border: `1px solid ${watched ? '#E81C2E20' : '#1a1a1a'}` }}
                    >
                      {/* Watch checkmark */}
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{
                          background: watched ? '#E81C2E' : '#1a1a1a',
                          border: watched ? 'none' : '1.5px solid #2a2a2a',
                        }}
                      >
                        {watched && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                      <span className="flex-1 min-w-0 text-[13px] text-[#ccc] truncate">{t.title}</span>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg flex-shrink-0"
                        style={{
                          color:       t.type === 'movie' ? '#E81C2E' : t.type === 'tv' ? '#60a5fa' : '#c084fc',
                          background:  t.type === 'movie' ? '#E81C2E15' : t.type === 'tv' ? '#3b82f615' : '#a855f715',
                        }}
                      >
                        {t.type === 'movie' ? 'FILM' : t.type === 'tv' ? 'TV' : 'ANIM'}
                      </span>
                    </button>
                  )
                })}
              </div>
              {titles.length > 6 && (
                <button
                  onClick={() => setShowAll(v => !v)}
                  className="mt-3 w-full py-3 rounded-2xl text-[12px] font-semibold active:scale-[0.98] transition-all"
                  style={{ background: '#111', border: '1px solid #1e1e1e', color: '#555' }}
                >
                  {showAll ? '↑ Show Less' : `↓ Show All ${titles.length} Titles`}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── FilterChip ─────────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all active:scale-95"
      style={{
        background: active ? '#E81C2E' : '#1a1a1a',
        color:      active ? '#fff'    : '#555',
        border:     active ? '1px solid transparent' : '1px solid #252525',
      }}
    >
      {label}
    </button>
  )
}

function FilterSection({ title, children }) {
  return (
    <div className="mb-5">
      <div className="text-[9px] uppercase tracking-[0.22em] font-bold mb-2.5" style={{ color: '#3a3a3a' }}>{title}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

// ── FilterPanel (bottom-sheet) ─────────────────────────────────────────────────
function FilterPanel({ filters, onFiltersChange, onClose }) {
  const activeCount = countActiveFilters(filters)

  function set(key, value) {
    if (key === 'powerTypes') {
      const curr = filters.powerTypes
      const next = curr.includes(value) ? curr.filter(t => t !== value) : [...curr, value]
      onFiltersChange({ ...filters, powerTypes: next })
    } else {
      const next = filters[key] === value && value !== 'all' ? 'all' : value
      onFiltersChange({ ...filters, [key]: next })
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 10005, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="fixed left-0 right-0 bottom-0 rounded-t-3xl flex flex-col"
        style={{ zIndex: 10006, background: '#0e0e0e', maxHeight: '88vh', border: '1px solid #1e1e1e', borderBottom: 'none', animation: 'slideUp 0.25s cubic-bezier(0.32,0.72,0,1) both' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: '#2a2a2a' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <div className="flex items-center gap-2.5">
            <span className="font-bebas text-xl tracking-wider text-white">FILTERS</span>
            {activeCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg" style={{ background: '#E81C2E', color: '#fff' }}>
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={() => onFiltersChange(BLANK_FILTERS)}
                className="text-[12px] font-bold active:scale-95 transition-all"
                style={{ color: '#E81C2E' }}
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
              style={{ background: '#1a1a1a', color: '#888' }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable sections */}
        <div className="overflow-y-auto px-5 pt-5 pb-12 flex-1">
          <FilterSection title="Gender">
            {GENDER_OPTS.map(o => (
              <FilterChip key={o.id} label={o.label} active={o.id !== 'all' && filters.gender === o.id} onClick={() => set('gender', o.id)} />
            ))}
          </FilterSection>

          <FilterSection title="Origin">
            {ORIGIN_OPTS.map(o => (
              <FilterChip key={o.id} label={o.label} active={o.id !== 'all' && filters.origin === o.id} onClick={() => set('origin', o.id)} />
            ))}
          </FilterSection>

          <FilterSection title="Power Type  (any match)">
            {POWER_TYPE_OPTS.map(o => (
              <FilterChip key={o.id} label={o.label} active={filters.powerTypes.includes(o.id)} onClick={() => set('powerTypes', o.id)} />
            ))}
          </FilterSection>

          <FilterSection title="Power Level">
            {POWER_LEVEL_OPTS.map(o => (
              <FilterChip key={o.id} label={o.label} active={o.id !== 'all' && filters.powerLevel === o.id} onClick={() => set('powerLevel', o.id)} />
            ))}
          </FilterSection>

          <FilterSection title="Status">
            {STATUS_OPTS.map(o => (
              <FilterChip key={o.id} label={o.label} active={o.id !== 'all' && filters.status === o.id} onClick={() => set('status', o.id)} />
            ))}
          </FilterSection>

          <FilterSection title="Team">
            {TEAM_OPTS.map(o => (
              <FilterChip key={o.id} label={o.label} active={o.id !== 'all' && filters.team === o.id} onClick={() => set('team', o.id)} />
            ))}
          </FilterSection>
        </div>
      </div>
    </>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function CharactersPage({ onOpenTitle, watchedIds = new Set(), initialFocus = null, onClearFocus }) {
  const [search,     setSearch]     = useState('')
  const [activeTab,  setActiveTab]  = useState('all')
  const [favorites,  setFavorites]  = useState(() => loadFavs())
  const [selected,   setSelected]   = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters,    setFilters]    = useState(BLANK_FILTERS)
  const [viewMode,   setViewMode]   = useState('browse') // 'browse' | 'groups'
  const tabsRef = useRef(null)
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])

  const featuredProfile = useMemo(() => getDailyFeatured(), [])

  // Auto-open from TitleDetailModal cross-link
  useEffect(() => {
    if (!initialFocus) return
    const p = CHARACTER_PROFILES.find(pr => pr.charKey === initialFocus)
    if (p) setSelected(p.id)
    onClearFocus?.()
  }, [initialFocus]) // eslint-disable-line

  function toggleFav(id) {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      saveFavs(next)
      return next
    })
  }

  // Filter + search
  const filtered = useMemo(() => {
    let base = applyFilter(CHARACTER_PROFILES, activeTab)
    base = applyAdvancedFilters(base, filters)
    const q = search.toLowerCase().trim()
    if (!q) return base
    return base.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.alias.toLowerCase().includes(q) ||
      p.actor?.toLowerCase().includes(q) ||
      p.powers.some(pw => pw.toLowerCase().includes(q))
    )
  }, [search, activeTab, filters])

  // Favorites float to top
  const sorted = useMemo(() => {
    const favs = filtered.filter(p =>  favorites.has(p.id))
    const rest  = filtered.filter(p => !favorites.has(p.id))
    return [...favs, ...rest]
  }, [filtered, favorites])

  const selectedProfile = selected ? CHARACTER_PROFILES.find(p => p.id === selected) : null
  const showFeatured    = activeTab === 'all' && !search

  return (
    <div className="max-w-lg mx-auto pb-28">

      {/* ── HEADER ── */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <h1 className="font-bebas text-3xl tracking-[0.15em] text-white leading-none">
            HEROES & VILLAINS
          </h1>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
            style={{ background: '#E81C2E15', color: '#E81C2E', border: '1px solid #E81C2E25' }}
          >
            {CHARACTER_PROFILES.length}
          </span>
        </div>
        <p className="text-[10px] text-[#3a3a3a] tracking-wide mb-4">
          The complete Marvel universe encyclopedia
        </p>

        {/* Search + Filter row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: '#3a3a3a' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input
              type="search"
              placeholder="Search heroes, villains, actors, powers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-[#2e2e2e] focus:outline-none transition-colors"
              style={{ background: '#111', border: '1.5px solid #1e1e1e' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#444] hover:text-white text-xl leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="relative flex-shrink-0 flex items-center gap-1.5 px-3.5 rounded-2xl transition-all active:scale-95"
            style={{
              background: activeFilterCount > 0 ? '#E81C2E12' : '#111',
              border:     `1.5px solid ${activeFilterCount > 0 ? '#E81C2E40' : '#1e1e1e'}`,
              color:      activeFilterCount > 0 ? '#E81C2E' : '#555',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2"/>
            </svg>
            {activeFilterCount > 0 && (
              <span
                className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                style={{ background: '#E81C2E', color: '#fff' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── VIEW MODE TOGGLE ── */}
      <div className="flex gap-2 px-4 pb-3">
        <button
          onClick={() => setViewMode('browse')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all active:scale-95"
          style={{
            background: viewMode === 'browse' ? '#E81C2E' : '#111',
            color:      viewMode === 'browse' ? '#fff' : '#555',
            border:     viewMode === 'browse' ? '1.5px solid transparent' : '1.5px solid #1e1e1e',
            boxShadow:  viewMode === 'browse' ? '0 0 14px rgba(232,28,46,0.35)' : 'none',
          }}
        >
          🔍 Browse
        </button>
        <button
          onClick={() => setViewMode('groups')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all active:scale-95"
          style={{
            background: viewMode === 'groups' ? '#F5C518' : '#111',
            color:      viewMode === 'groups' ? '#000' : '#555',
            border:     viewMode === 'groups' ? '1.5px solid transparent' : '1.5px solid #1e1e1e',
            boxShadow:  viewMode === 'groups' ? '0 0 14px rgba(245,197,24,0.35)' : 'none',
          }}
        >
          👥 Groups
          <span className="text-[9px] px-1.5 py-0.5 rounded-full ml-1"
            style={{ background: viewMode === 'groups' ? 'rgba(0,0,0,0.2)' : '#1e1e1e' }}>
            {HERO_GROUPS.length}
          </span>
        </button>
      </div>

      {/* ── FILTER TABS (only in browse mode) ── */}
      {viewMode === 'browse' && (
      <div ref={tabsRef} className="flex gap-2 overflow-x-auto px-4 pb-4 no-scrollbar">
        {FILTER_TABS.map(tab => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all active:scale-95"
              style={{
                background: active ? '#E81C2E' : '#111',
                color:      active ? '#fff'    : '#555',
                border:     active ? '1.5px solid transparent' : '1.5px solid #1e1e1e',
                boxShadow:  active ? '0 0 14px rgba(232,28,46,0.45)' : 'none',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      )}

      <div className="px-4">

        {/* ── GROUPS VIEW ── */}
        {viewMode === 'groups' && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-[#444] mb-3 font-semibold">
              {HERO_GROUPS.length} groups · {HERO_GROUPS.reduce((s, g) => s + g.members.length, 0)} total members
            </div>
            <GroupsView onSelectProfile={id => setSelected(id)} />
          </>
        )}

        {/* ── FEATURED BANNER (browse mode only) ── */}
        {viewMode === 'browse' && showFeatured && (
          <FeaturedBanner
            profile={featuredProfile}
            onViewProfile={() => setSelected(featuredProfile.id)}
          />
        )}

        {/* ── BROWSE MODE CONTENT ── */}
        {viewMode === 'browse' && (
          <>
            {/* ── RESULT META ── */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px]" style={{ color: '#2e2e2e' }}>
                {sorted.length} character{sorted.length !== 1 ? 's' : ''}
                {favorites.size > 0 ? ` · ${favorites.size} ★ favorited` : ''}
              </span>
              {favorites.size > 0 && !search && (
                <span className="text-[9px]" style={{ color: '#F5C51880' }}>★ favorites first</span>
              )}
            </div>

            {/* ── 2-COLUMN GRID ── */}
            {sorted.length === 0 ? (
              <div className="flex flex-col items-center mt-24 gap-3">
                <span className="text-5xl">🦸</span>
                <p className="text-[14px]" style={{ color: '#3a3a3a' }}>No characters found</p>
                {search && (
                  <button onClick={() => setSearch('')} className="text-[12px] underline" style={{ color: '#E81C2E' }}>
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
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
          </>
        )}
      </div>

      {/* ── FILTER PANEL ── */}
      {filterOpen && (
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* ── DETAIL PANEL ── */}
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
          onNavigateToProfile={charKey => {
            const p = CHARACTER_PROFILES.find(pr => pr.charKey === charKey)
            if (p) setSelected(p.id)
          }}
        />
      )}
    </div>
  )
}
