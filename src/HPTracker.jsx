/**
 * HPTracker — Harry Potter / Wizarding World tracker.
 * Self-contained; all state under hp- prefixed localStorage keys.
 */
import { useState, useEffect, useMemo, useCallback } from 'react'
import { HP_TITLES } from './data/hpTitles.js'
import { HP_ERAS } from './data/hpEras.js'
import { HP_CHARACTERS } from './data/hpCharacters.js'
import { getHPRank, getNextHPRank } from './data/hpRanks.js'
import { HP_HOUSES, HP_HORCRUXES, HP_SPELLS, HP_GROUPS, SORTING_QUIZ, getSortingResult } from './data/hpExtras.js'
import { AvatarDisplay } from './AvatarDisplay.jsx'

// ── Constants ─────────────────────────────────────────────────────────────────
const SK_WATCHED  = 'hp-watched-v1'
const SK_HISTORY  = 'hp-watch-history'
const SK_HOUSE    = 'hp-sorted-house'
const SK_QUIZ_ANS = 'hp-quiz-answers'
const SK_HORCRUX  = 'hp-horcruxes-found'
const SK_HOUSE_PTS = 'hp-house-points'

const GOLD   = '#c9a227'
const SILVER = '#c0c0c0'
const BG     = '#0e0818'
const BG_CARD = '#160d28'
const BG_CARD2 = '#1a1030'
const BORDER  = '#2a1850'
const TEXT_DIM  = '#3d2860'
const TEXT_MID  = '#7c5ca8'
const TEXT_MAIN = '#d4c4f0'

function loadJSON(k, fb) { try { const r = localStorage.getItem(k); if (r) return JSON.parse(r) } catch {} return fb }
function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

// ── Wand / Logo ───────────────────────────────────────────────────────────────
function WandIcon({ size = 32 }) {
  return (
    <div className="flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.75 }}>
      ⚡
    </div>
  )
}

// ── Stars background ──────────────────────────────────────────────────────────
function StarField() {
  const stars = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    x: (i * 37 + 13) % 100, y: (i * 53 + 7) % 100,
    size: i % 3 === 0 ? 2 : 1, opacity: 0.2 + (i % 5) * 0.1,
  })), [])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
            background: s.size === 2 ? GOLD : SILVER, opacity: s.opacity }} />
      ))}
    </div>
  )
}

// ── Checkbox ──────────────────────────────────────────────────────────────────
function HPCheck({ watched, comingSoon }) {
  if (comingSoon) return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ border: `2px solid ${GOLD}33`, background: BG_CARD }}>
      <span className="text-[11px]">⏳</span>
    </div>
  )
  return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
      style={watched
        ? { background: `linear-gradient(135deg, ${GOLD} 0%, #8b6914 100%)`, boxShadow: `0 0 10px rgba(201,162,39,0.5)` }
        : { border: `2px solid ${BORDER}`, background: '#09050f' }}>
      {watched && <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
    </div>
  )
}

// ── Countdown to movie ────────────────────────────────────────────────────────
function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now())
    return { days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000), minutes: Math.floor((diff%3600000)/60000), seconds: Math.floor((diff%60000)/1000) }
  }
  const [cd, setCd] = useState(calc)
  useEffect(() => { const t = setInterval(() => setCd(calc()), 1000); return () => clearInterval(t) }, [])
  return cd
}

// ── Sorting Hat Quiz ──────────────────────────────────────────────────────────
function SortingHatQuiz({ onSorted, savedHouse }) {
  const [step, setStep] = useState(savedHouse ? 'done' : 'intro')
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(savedHouse)

  function pickAnswer(i) {
    const next = [...answers, i]
    if (next.length < SORTING_QUIZ.length) {
      setAnswers(next)
    } else {
      const house = getSortingResult(next)
      setResult(house)
      setStep('done')
      onSorted(house, next)
    }
  }

  if (step === 'intro') return (
    <div className="rounded-2xl p-4 text-center" style={{ background: BG_CARD2, border: `1px solid ${GOLD}33` }}>
      <div className="text-4xl mb-2">🎩</div>
      <div className="font-bold text-white text-sm mb-1">The Sorting Hat Awaits</div>
      <p className="text-[11px] mb-3" style={{ color: TEXT_MID }}>Answer 5 questions to discover your Hogwarts house</p>
      <button onClick={() => setStep('quiz')}
        className="px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-[0.97]"
        style={{ background: GOLD, color: '#000' }}>
        Begin Sorting
      </button>
    </div>
  )

  if (step === 'quiz') {
    const q = SORTING_QUIZ[answers.length]
    return (
      <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${GOLD}33` }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎩</span>
          <div>
            <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: GOLD }}>Sorting Hat Quiz</div>
            <div className="text-[9px]" style={{ color: TEXT_DIM }}>Question {answers.length + 1} of {SORTING_QUIZ.length}</div>
          </div>
        </div>
        <p className="text-[13px] font-medium text-white mb-3">{q.q}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => pickAnswer(i)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-[12px] transition-all active:scale-[0.98]"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: TEXT_MAIN }}>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // done
  return (
    <div className="rounded-2xl p-4 text-center" style={{ background: BG_CARD2, border: `2px solid ${result?.color ?? GOLD}44` }}>
      <div className="text-4xl mb-2">{result?.emoji ?? '🎩'}</div>
      <div className="text-[9px] uppercase tracking-widest mb-1 font-semibold" style={{ color: result?.color ?? GOLD }}>You belong in…</div>
      <div className="font-bold text-white text-xl mb-1">{result?.label}</div>
      <p className="text-[11px] mb-3" style={{ color: TEXT_MID }}>{result?.traits}</p>
      <div className="flex justify-center gap-3 text-[10px]" style={{ color: TEXT_DIM }}>
        <span>Animal: {result?.animal}</span>
        <span>Element: {result?.element}</span>
      </div>
      <button onClick={() => { setStep('quiz'); setAnswers([]) }}
        className="mt-3 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all"
        style={{ background: `${result?.color ?? GOLD}18`, color: result?.color ?? GOLD, border: `1px solid ${result?.color ?? GOLD}33` }}>
        Re-take quiz
      </button>
    </div>
  )
}

// ── Horcrux Tracker ───────────────────────────────────────────────────────────
function HorcruxTracker({ watched, horcruxFound, onToggleHorcrux }) {
  const destroyed = HP_HORCRUXES.filter(h => {
    if (watched.has(h.titleId)) return true
    return horcruxFound.has(h.id)
  }).length

  return (
    <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid rgba(231,76,60,0.25)` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: '#e74c3c' }}>☠️ Horcrux Tracker</div>
        <span className="text-[10px] font-bold" style={{ color: destroyed === 7 ? GOLD : TEXT_DIM }}>
          {destroyed}/7 {destroyed === 7 ? 'All Destroyed! ✓' : 'destroyed'}
        </span>
      </div>
      <div className="space-y-2">
        {HP_HORCRUXES.map(h => {
          const inWatched = watched.has(h.titleId)
          const marked = horcruxFound.has(h.id)
          const done = inWatched || marked
          return (
            <div key={h.id} className="flex items-center gap-3 px-3 py-2 rounded-xl"
              style={{ background: BG_CARD, border: `1px solid ${done ? 'rgba(201,162,39,0.2)' : BORDER}` }}>
              <span className="text-lg flex-shrink-0">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold" style={{ color: done ? GOLD : TEXT_MAIN }}>{h.name}</div>
                <div className="text-[9px]" style={{ color: TEXT_DIM }}>
                  {done ? `Destroyed by ${h.destroyer} — ${h.how}` : `First seen: ${h.film}`}
                </div>
              </div>
              <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: done ? `${GOLD}25` : BG_CARD2, border: `1px solid ${done ? GOLD : BORDER}` }}>
                {done && <span className="text-[9px]">✓</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── House Points ──────────────────────────────────────────────────────────────
function HousePoints({ watched }) {
  const pts = useMemo(() => {
    const scores = { gryffindor: 0, slytherin: 0, hufflepuff: 0, ravenclaw: 0 }
    // Each watched film earns 50 pts to primary house + 25 to others
    const mainHouses = { 2001:'gryffindor', 2002:'gryffindor', 2003:'gryffindor', 2004:'hufflepuff', 2005:'gryffindor', 2006:'slytherin', 2007:'gryffindor', 2008:'gryffindor', 2009:'hufflepuff', 2010:'slytherin', 2011:'gryffindor' }
    watched.forEach(id => {
      const h = mainHouses[id]
      if (h) { scores[h] += 50; Object.keys(scores).forEach(k => { if (k !== h) scores[k] += 10 }) }
      else { Object.keys(scores).forEach(k => { scores[k] += 10 }) }
    })
    return scores
  }, [watched])

  const max = Math.max(...Object.values(pts))
  const leader = HP_HOUSES.find(h => pts[h.key] === max)

  return (
    <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${GOLD}22` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: GOLD }}>🏆 House Points</div>
        {leader && watched.size > 0 && (
          <span className="text-[10px] font-bold" style={{ color: leader.color }}>{leader.emoji} {leader.label} leads</span>
        )}
      </div>
      <div className="space-y-2">
        {HP_HOUSES.map(h => {
          const p = pts[h.key]
          const pct = max > 0 ? Math.round((p / max) * 100) : 0
          return (
            <div key={h.key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px]" style={{ color: h.color }}>{h.emoji} {h.label}</span>
                <span className="text-[10px] font-mono" style={{ color: TEXT_DIM }}>{p} pts</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: BORDER }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: h.color, boxShadow: pct > 70 ? `0 0 8px ${h.color}66` : 'none' }}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Spell Tracker ─────────────────────────────────────────────────────────────
function SpellTracker({ watched }) {
  const knownSpells = useMemo(() => {
    const s = new Set()
    watched.forEach(id => { HP_SPELLS[id]?.forEach(sp => s.add(sp)) })
    return s
  }, [watched])
  const allSpells = useMemo(() => {
    const s = new Set()
    Object.values(HP_SPELLS).forEach(arr => arr.forEach(sp => s.add(sp)))
    return [...s]
  }, [])

  return (
    <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid rgba(155,89,182,0.25)` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: '#9b59b6' }}>✨ Spell Tracker</div>
        <span className="text-[10px] font-bold" style={{ color: TEXT_DIM }}>{knownSpells.size}/{allSpells.length} spells</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {allSpells.map(spell => (
          <span key={spell} className="text-[10px] px-2 py-1 rounded-lg font-medium"
            style={knownSpells.has(spell)
              ? { background: 'rgba(155,89,182,0.2)', color: '#c39bd3', border: '1px solid rgba(155,89,182,0.3)' }
              : { background: BG_CARD, color: TEXT_DIM, border: `1px solid ${BORDER}` }}>
            {knownSpells.has(spell) ? '✦ ' : ''}{spell}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── HP Stats Page ─────────────────────────────────────────────────────────────
function HPStatsPage({ watched, allTitles }) {
  const countable = allTitles.filter(t => !t.comingSoon)
  const total = countable.length
  const wc = countable.filter(t => watched.has(t.id)).length
  const pct = total > 0 ? Math.round((wc / total) * 100) : 0
  const movies = countable.filter(t => t.type === 'movie')
  const tvs = countable.filter(t => t.type === 'tv')
  const mw = movies.filter(t => watched.has(t.id)).length
  const tw = tvs.filter(t => watched.has(t.id)).length

  const eraStats = HP_ERAS.map(era => {
    const titles = allTitles.filter(t => era.ids.includes(t.id) && !t.comingSoon)
    const w = titles.filter(t => watched.has(t.id)).length
    return { era, total: titles.length, watched: w }
  }).filter(e => e.total > 0)

  return (
    <div className="min-h-screen pb-24" style={{ background: BG }}>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: TEXT_DIM }}>📊 Your Wizarding Stats</div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Watched', value: wc, color: GOLD },
            { label: 'Left',    value: total - wc, color: SILVER },
            { label: 'Movies',  value: mw, color: '#9b59b6' },
            { label: 'Complete', value: `${pct}%`, color: '#27ae60' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
              <div className="font-bold text-2xl mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
          <div className="text-[9px] uppercase tracking-widest font-semibold mb-3" style={{ color: TEXT_DIM }}>Era Breakdown</div>
          <div className="space-y-3">
            {eraStats.map(({ era, watched: ew, total: et }) => {
              const p = et > 0 ? Math.round((ew / et) * 100) : 0
              return (
                <div key={era.key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px]" style={{ color: era.color }}>{era.emoji} {era.label}</span>
                    <span className="text-[10px] font-mono" style={{ color: TEXT_DIM }}>{ew}/{et} · {p}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: era.color }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
          <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: TEXT_DIM }}>Format Split</div>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: '🎬 Movies', watched: mw, total: movies.length }, { label: '📺 TV Shows', watched: tw, total: tvs.length }].map(f => (
              <div key={f.label} className="rounded-xl p-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                <div className="text-[10px] mb-1 font-semibold" style={{ color: TEXT_MAIN }}>{f.label}</div>
                <div className="font-bold text-xl" style={{ color: GOLD }}>{f.watched}</div>
                <div className="text-[9px]" style={{ color: TEXT_DIM }}>of {f.total}</div>
              </div>
            ))}
          </div>
        </div>

        <HousePoints watched={watched}/>
        <SpellTracker watched={watched}/>
      </div>
    </div>
  )
}

// ── HP Characters Page ────────────────────────────────────────────────────────
function HPCharactersPage({ watched, sortedHouse, onSorted }) {
  const [activeGroup, setActiveGroup] = useState('all')

  const chars = activeGroup === 'all'
    ? HP_CHARACTERS
    : HP_CHARACTERS.filter(c => {
        const grp = HP_GROUPS.find(g => g.key === activeGroup)
        return grp?.charIds.includes(c.id)
      })

  return (
    <div className="min-h-screen pb-24" style={{ background: BG }}>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        <SortingHatQuiz onSorted={onSorted} savedHouse={sortedHouse}/>

        <div>
          <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: TEXT_DIM }}>Filter by Group</div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button key="all" onClick={() => setActiveGroup('all')}
              className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
              style={activeGroup === 'all' ? { background: GOLD, color: '#000' } : { background: BG_CARD2, color: TEXT_MID, border: `1px solid ${BORDER}` }}>
              All
            </button>
            {HP_GROUPS.map(g => (
              <button key={g.key} onClick={() => setActiveGroup(g.key)}
                className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
                style={activeGroup === g.key ? { background: g.color, color: '#000' } : { background: BG_CARD2, color: TEXT_MID, border: `1px solid ${BORDER}` }}>
                {g.emoji} {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {chars.map(c => {
            const appearances = c.titleIds.filter(id => watched.has(id)).length
            const house = HP_HOUSES.find(h => h.key.toLowerCase() === c.house?.toLowerCase())
            return (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${c.color ?? GOLD}15`, border: `1px solid ${c.color ?? GOLD}25` }}>
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-[13px]">{c.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                      style={{ background: `${c.color ?? GOLD}18`, color: c.color ?? GOLD }}>
                      {c.role}
                    </span>
                    {house && (
                      <span className="text-[9px]" style={{ color: house.color }}>{house.emoji} {house.label}</span>
                    )}
                  </div>
                  {c.realName && c.realName !== c.name && (
                    <div className="text-[9px] mt-0.5" style={{ color: TEXT_DIM }}>{c.realName}</div>
                  )}
                  <p className="text-[10px] mt-1 leading-snug" style={{ color: TEXT_MID }}>
                    {c.desc?.slice(0, 90)}{(c.desc?.length ?? 0) > 90 ? '…' : ''}
                  </p>
                  <div className="text-[9px] mt-1" style={{ color: TEXT_DIM }}>
                    Seen in <span style={{ color: GOLD }}>{appearances}</span>/{c.titleIds.length} films
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── HP Awards / Achievements ──────────────────────────────────────────────────
const HP_ACHIEVEMENTS = [
  { id: 'first_spell', label: 'First Spell Cast',     desc: 'Watch your first HP film',           emoji: '🪄', check: (w) => w.size >= 1 },
  { id: 'trio',        label: 'The Golden Trio',       desc: 'Watch all 8 main HP films',           emoji: '⚡', check: (w) => [2001,2002,2003,2004,2005,2006,2007,2008].every(id => w.has(id)) },
  { id: 'fb_complete', label: 'Magizoologist',         desc: 'Watch all 3 Fantastic Beasts films',  emoji: '🦄', check: (w) => [2009,2010,2011].every(id => w.has(id)) },
  { id: 'all_watched', label: 'Chosen One',            desc: 'Watch every HP film',                 emoji: '🌟', check: (w, titles) => titles.filter(t => !t.comingSoon).every(t => w.has(t.id)) },
  { id: 'dark_knight', label: 'Battle of Hogwarts',    desc: 'Watch Deathly Hallows Part 2',        emoji: '⚔️', check: (w) => w.has(2008) },
  { id: 'dumbledore',  label: 'Not My Daughter',       desc: 'Watch Deathly Hallows Part 1',        emoji: '🔥', check: (w) => w.has(2007) },
  { id: 'expecto',     label: 'Expecto Patronum!',     desc: 'Watch Prisoner of Azkaban',           emoji: '🦌', check: (w) => w.has(2003) },
  { id: 'half_blood',  label: 'Always',                desc: 'Watch Half-Blood Prince',             emoji: '🖤', check: (w) => w.has(2006) },
  { id: 'triwizard',   label: 'Triwizard Champion',    desc: 'Watch Goblet of Fire',                emoji: '🏆', check: (w) => w.has(2004) },
  { id: 'order',       label: 'Order Member',          desc: 'Watch Order of the Phoenix',          emoji: '🔮', check: (w) => w.has(2005) },
  { id: 'beasts_1',    label: 'Magizoology 101',       desc: 'Watch Fantastic Beasts 1',            emoji: '🧳', check: (w) => w.has(2009) },
  { id: 'grindelwald', label: 'For the Greater Good',  desc: 'Watch Crimes of Grindelwald',         emoji: '☁️', check: (w) => w.has(2010) },
]

function HPAwardsPage({ watched, allTitles }) {
  const unlocked = HP_ACHIEVEMENTS.filter(a => a.check(watched, allTitles))
  return (
    <div className="min-h-screen pb-24" style={{ background: BG }}>
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="text-[9px] uppercase tracking-widest font-semibold mb-4" style={{ color: TEXT_DIM }}>
          🏆 Achievements — {unlocked.length}/{HP_ACHIEVEMENTS.length} Unlocked
        </div>
        <div className="grid grid-cols-2 gap-3">
          {HP_ACHIEVEMENTS.map(a => {
            const done = a.check(watched, allTitles)
            return (
              <div key={a.id} className="rounded-2xl p-4 flex flex-col items-center text-center gap-2"
                style={{ background: BG_CARD2, border: `1px solid ${done ? GOLD : BORDER}`, opacity: done ? 1 : 0.45 }}>
                <div className="text-3xl">{a.emoji}</div>
                <div className="font-bold text-sm" style={{ color: done ? GOLD : TEXT_MID }}>{a.label}</div>
                <div className="text-[10px]" style={{ color: TEXT_DIM }}>{a.desc}</div>
                {done && <div className="text-[9px] font-bold px-2 py-0.5 rounded-lg" style={{ background: `${GOLD}20`, color: GOLD }}>✓ UNLOCKED</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── HP Home Page ──────────────────────────────────────────────────────────────
function HPHomePage({ profile, watched, allTitles, sortedHouse, onNavigate, onSorted }) {
  const countable = allTitles.filter(t => !t.comingSoon)
  const wc = countable.filter(t => watched.has(t.id)).length
  const total = countable.length
  const pct = total > 0 ? Math.round((wc / total) * 100) : 0
  const remaining = total - wc
  const rank = getHPRank(wc)
  const nextRank = getNextHPRank(wc)
  const firstName = (profile?.name ?? 'Wizard').split(' ')[0]
  const nextUp = allTitles.find(t => !watched.has(t.id) && !t.comingSoon)
  const nextEra = nextUp ? HP_ERAS.find(e => e.ids.includes(nextUp.id)) : null

  // Daily featured character
  const featuredChar = HP_CHARACTERS[Math.floor(Date.now() / 86400000) % HP_CHARACTERS.length]
  const charSeen = featuredChar.titleIds.filter(id => watched.has(id)).length

  const eraProgress = HP_ERAS.map(era => {
    const titles = allTitles.filter(t => era.ids.includes(t.id) && !t.comingSoon)
    const w = titles.filter(t => watched.has(t.id)).length
    return { era, total: titles.length, watched: w }
  }).filter(e => e.total > 0)

  const horcruxDestroyed = HP_HORCRUXES.filter(h => watched.has(h.titleId)).length

  return (
    <div className="min-h-screen flex flex-col pb-24 relative" style={{ background: BG }}>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0418 0%, #100622 50%, #0e0818 100%)', minHeight: 180 }}>
        <StarField/>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,162,39,0.08) 0%, transparent 65%)' }}/>
        <div className="relative max-w-lg mx-auto px-5 pt-10 pb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-3xl">⚡</div>
            <div>
              <div className="font-bebas text-[9px] tracking-[0.4em] leading-none mb-0.5" style={{ color: GOLD }}>WIZARDING WORLD</div>
              <div className="font-bebas text-[21px] tracking-[0.12em] text-white leading-none">WATCH TRACKER</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AvatarDisplay avatar={profile?.avatar} name={profile?.name} size="home"/>
            <div>
              <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: TEXT_DIM }}>Welcome back</div>
              <div className="font-bebas text-[28px] text-white tracking-wide leading-none">{firstName}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 w-full space-y-4 mt-4">
        {/* Rank card */}
        <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${rank.color}33` }}>
          <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>Your Hogwarts Rank</div>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl flex-shrink-0">{rank.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bebas text-xl tracking-widest" style={{ color: rank.color }}>{rank.label}</div>
              <div className="text-[10px]" style={{ color: TEXT_MID }}>{rank.desc}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bebas text-2xl" style={{ color: GOLD }}>{wc}</div>
              <div className="text-[9px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>watched</div>
            </div>
          </div>
          {nextRank && (() => {
            const progress = wc - rank.minWatched
            const range = nextRank.minWatched - rank.minWatched
            const bar = Math.round((progress / range) * 100)
            return (
              <>
                <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: BORDER }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${bar}%`, background: `linear-gradient(90deg, ${rank.color} 0%, ${nextRank.color} 100%)` }}/>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px]" style={{ color: rank.color }}>{rank.label}</span>
                  <span className="text-[9px]" style={{ color: TEXT_DIM }}>{nextRank.minWatched - wc} more → {nextRank.label}</span>
                </div>
              </>
            )
          })()}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Watched', value: wc, color: GOLD },
            { label: 'Remaining', value: remaining, color: '#fff' },
            { label: 'Complete', value: `${pct}%`, color: SILVER },
            { label: 'Horcruxes', value: `${horcruxDestroyed}/7`, color: '#e74c3c' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
              <div className="font-bebas text-xl mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Era progress */}
        <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
          <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>Era Progress</div>
          <div className="space-y-3">
            {eraProgress.map(({ era, watched: ew, total: et }) => {
              const p = et > 0 ? Math.round((ew / et) * 100) : 0
              return (
                <div key={era.key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px]" style={{ color: era.color }}>{era.emoji} {era.label}</span>
                    <span className="text-[10px] font-mono" style={{ color: TEXT_DIM }}>{ew}/{et}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: era.color }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Up Next */}
        {nextUp && (
          <button onClick={() => onNavigate('tracker')} className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
            style={{ background: BG_CARD2, border: `1px solid ${GOLD}2a` }}>
            <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>▶ Up Next</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${GOLD}14`, border: `1px solid ${GOLD}24` }}>
                {nextEra?.emoji ?? '🎬'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bebas text-lg text-white tracking-wide">{nextUp.title}</div>
                <div className="text-[10px]" style={{ color: TEXT_MID }}>{nextUp.year} · {nextUp.type}</div>
              </div>
              <div className="px-3 py-2 rounded-xl text-[11px] font-bold" style={{ background: GOLD, color: '#000' }}>
                Watch
              </div>
            </div>
          </button>
        )}

        {/* Sorting Hat */}
        <SortingHatQuiz onSorted={onSorted} savedHouse={sortedHouse}/>

        {/* Featured character */}
        <div className="rounded-2xl p-4" style={{ background: BG_CARD2, border: `1px solid ${GOLD}18` }}>
          <div className="text-[9px] uppercase tracking-widest mb-3 font-semibold" style={{ color: TEXT_DIM }}>★ Daily Character Spotlight</div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${featuredChar.color ?? GOLD}15`, border: `1px solid ${featuredChar.color ?? GOLD}25` }}>
              {featuredChar.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bebas text-lg leading-none mb-0.5" style={{ color: featuredChar.color ?? GOLD }}>{featuredChar.name}</div>
              <div className="text-[9px] mb-1" style={{ color: TEXT_DIM }}>{featuredChar.house} · {featuredChar.role}</div>
              <p className="text-[10px] leading-relaxed" style={{ color: TEXT_MID }}>
                {featuredChar.desc?.slice(0, 100)}{(featuredChar.desc?.length ?? 0) > 100 ? '…' : ''}
              </p>
              <div className="text-[9px] mt-1" style={{ color: TEXT_DIM }}>
                Seen in <span style={{ color: GOLD }}>{charSeen}</span>/{featuredChar.titleIds.length} films
              </div>
            </div>
          </div>
        </div>

        {/* Horcrux tracker */}
        <HorcruxTracker watched={watched} horcruxFound={new Set()} onToggleHorcrux={() => {}}/>

        {/* House Points */}
        <HousePoints watched={watched}/>

        {/* Quick actions */}
        <div>
          <div className="text-[9px] uppercase tracking-widest mb-2 font-semibold" style={{ color: TEXT_DIM }}>Quick Actions</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: '🎬', label: 'Tracker',    onClick: () => onNavigate('tracker') },
              { icon: '🧙', label: 'Characters', onClick: () => onNavigate('characters') },
              { icon: '🏆', label: 'Awards',     onClick: () => onNavigate('awards') },
              { icon: '📊', label: 'Stats',      onClick: () => onNavigate('stats') },
            ].map(({ icon, label, onClick }) => (
              <button key={label} onClick={onClick}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-[0.95]"
                style={{ background: BG_CARD2, border: `1px solid ${BORDER}` }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                  style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}1c` }}>
                  {icon}
                </div>
                <span className="text-[10px] text-white font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main HPTracker ────────────────────────────────────────────────────────────
export default function HPTracker({ profile, onBack }) {
  const [watched,    setWatched]    = useState(() => new Set(loadJSON(SK_WATCHED, [])))
  const [history,    setHistory]    = useState(() => loadJSON(SK_HISTORY, []))
  const [sortedHouse,setSortedHouse]= useState(() => loadJSON(SK_HOUSE, null))
  const [horcruxFound,setHorcruxFound]=useState(() => new Set(loadJSON(SK_HORCRUX, [])))
  const [activeTab,  setActiveTab]  = useState('home')
  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState('all')

  const allTitles = HP_TITLES

  function toggleWatched(id) {
    setWatched(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      saveJSON(SK_WATCHED, [...next])
      return next
    })
    setHistory(prev => {
      const next = [{ id, ts: Date.now() }, ...prev.filter(x => x.id !== id)].slice(0, 50)
      saveJSON(SK_HISTORY, next)
      return next
    })
  }

  function handleSorted(house, answers) {
    setSortedHouse(house)
    saveJSON(SK_HOUSE, house)
    saveJSON(SK_QUIZ_ANS, answers)
  }

  const filtered = useMemo(() => {
    let titles = allTitles
    if (filter === 'movies')   titles = titles.filter(t => t.type === 'movie')
    if (filter === 'tv')       titles = titles.filter(t => t.type === 'tv')
    if (filter === 'watched')  titles = titles.filter(t => watched.has(t.id))
    if (filter === 'unwatched') titles = titles.filter(t => !watched.has(t.id) && !t.comingSoon)
    if (search) titles = titles.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    return titles
  }, [allTitles, filter, search, watched])

  // Group by era for tracker
  const eraGroups = useMemo(() => {
    return HP_ERAS.map(era => ({
      era, titles: filtered.filter(t => era.ids.includes(t.id))
    })).filter(g => g.titles.length > 0)
  }, [filtered])

  const TABS = [
    { id: 'home',       label: 'HOME',    icon: '⚡' },
    { id: 'tracker',    label: 'TRACKER', icon: '📜' },
    { id: 'characters', label: 'CHARS',   icon: '🧙' },
    { id: 'awards',     label: 'AWARDS',  icon: '🏆' },
    { id: 'stats',      label: 'STATS',   icon: '📊' },
  ]

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      {/* Top nav */}
      <div className="sticky top-0 z-20" style={{ background: `${BG}f0`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-lg mx-auto px-4 py-2 flex items-center gap-2">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[11px] font-semibold transition-all" style={{ color: TEXT_MID }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Universes
          </button>
          <div className="flex-1 text-center">
            <span className="font-bebas text-[16px] tracking-widest" style={{ color: GOLD }}>HP TRACKER</span>
          </div>
          <div className="w-12"/>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'home' && (
        <HPHomePage profile={profile} watched={watched} allTitles={allTitles} sortedHouse={sortedHouse} onNavigate={setActiveTab} onSorted={handleSorted}/>
      )}

      {activeTab === 'tracker' && (
        <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
          {/* Search + filter */}
          <div className="space-y-2 mb-4">
            <input type="search" placeholder="Search titles…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: TEXT_MAIN }}/>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[['all','All'],['unwatched','Unwatched'],['watched','Watched'],['movies','Movies'],['tv','TV']].map(([k,l]) => (
                <button key={k} onClick={() => setFilter(k)}
                  className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
                  style={filter === k ? { background: GOLD, color: '#000' } : { background: BG_CARD2, color: TEXT_MID, border: `1px solid ${BORDER}` }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Era groups */}
          <div className="space-y-5">
            {eraGroups.map(({ era, titles }) => (
              <div key={era.key}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: era.color }}>{era.emoji}</span>
                  <span className="font-bebas text-[14px] tracking-widest" style={{ color: era.color }}>{era.label}</span>
                  <span className="text-[9px]" style={{ color: TEXT_DIM }}>
                    {titles.filter(t => watched.has(t.id)).length}/{titles.filter(t => !t.comingSoon).length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {titles.map(t => (
                    <button key={t.id} onClick={() => !t.comingSoon && toggleWatched(t.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all active:scale-[0.98]"
                      style={{ background: BG_CARD2, border: `1px solid ${watched.has(t.id) ? GOLD + '30' : BORDER}` }}>
                      <HPCheck watched={watched.has(t.id)} comingSoon={t.comingSoon}/>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold" style={{ color: watched.has(t.id) ? GOLD : TEXT_MAIN }}>{t.title}</div>
                        <div className="text-[9px] capitalize mt-0.5" style={{ color: TEXT_DIM }}>{t.year} · {t.type}{t.comingSoon ? ' · Coming Soon' : ''}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'characters' && (
        <HPCharactersPage watched={watched} sortedHouse={sortedHouse} onSorted={handleSorted}/>
      )}
      {activeTab === 'awards' && <HPAwardsPage watched={watched} allTitles={allTitles}/>}
      {activeTab === 'stats'  && <HPStatsPage watched={watched} allTitles={allTitles}/>}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30" style={{ background: `${BG}f5`, backdropFilter: 'blur(16px)', borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-lg mx-auto flex">
          {TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-3 transition-all"
                style={{ color: active ? GOLD : TEXT_DIM }}>
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className="text-[8px] uppercase tracking-widest font-semibold">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
