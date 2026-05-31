import { useState, useEffect, useMemo } from 'react'

// ── Franchise definitions ─────────────────────────────────────────────────────
const UNIVERSES = [
  {
    id: 'marvel', label: 'MARVEL', sub: 'Cinematic Universe', icon: 'M', emoji: null,
    color: '#E81C2E', glow: 'rgba(232,28,46,0.4)',
    logoStyle: { background: 'linear-gradient(135deg,#E81C2E,#a0001a)', color: '#fff', borderRadius: 16 },
    desc: '107 titles · Movies & Disney+ Shows',
    tagline: '"I am Iron Man."',
  },
  {
    id: 'dc', label: 'DC', sub: 'Universe', icon: 'DC', emoji: null,
    color: '#FFD700', glow: 'rgba(255,215,0,0.4)',
    logoStyle: { background: 'linear-gradient(135deg,#FFD700,#d4a017)', color: '#000', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' },
    desc: '32 titles · Movies & TV Shows',
    tagline: '"Why so serious?"',
  },
  {
    id: 'hp', label: 'HARRY POTTER', sub: 'Wizarding World', icon: null, emoji: '⚡',
    color: '#c9a227', glow: 'rgba(201,162,39,0.35)',
    logoStyle: { background: 'linear-gradient(135deg,#1a0a2e,#2d1555)', border: '1px solid rgba(201,162,39,0.5)', borderRadius: 14 },
    desc: '12 titles · Films & HBO Series',
    tagline: '"You\'re a wizard, Harry."',
  },
  {
    id: 'sw', label: 'STAR WARS', sub: 'The Skywalker Saga & Beyond', icon: null, emoji: '⚔️',
    color: '#ffe81f', glow: 'rgba(255,232,31,0.3)',
    logoStyle: { background: '#030308', border: '1px solid rgba(255,232,31,0.4)', borderRadius: 14 },
    desc: '19 titles · Films & Streaming Shows',
    tagline: '"May the Force be with you."',
  },
]

const MARVEL_SIZES = [
  { id: 'rookie',   label: 'ROOKIE',   count: '77',  desc: 'Movies only. Jump straight to the action.' },
  { id: 'hero',     label: 'HERO',     count: '93',  desc: 'Movies + all Disney+ originals.' },
  { id: 'avenger',  label: 'AVENGER',  count: '100', desc: 'Everything — including the Netflix Defenders saga.' },
  { id: 'infinity', label: 'INFINITY', count: '107', desc: 'Every. Single. Thing. Including animated.' },
]
const DC_SIZES = [
  { id: 'rookie',   label: 'ROOKIE',   count: '26', desc: 'Movies only — Classic DC + DCEU + New DCU.' },
  { id: 'hero',     label: 'HERO',     count: '28', desc: 'Movies + Peacemaker & Creature Commandos.' },
  { id: 'infinity', label: 'INFINITY', count: '32', desc: 'Everything, including announced titles.' },
]
const PACE_OPTS = [
  { id: 'casual',     label: 'CASUAL',      icon: '😎', desc: 'No pressure. Just track what you watch.' },
  { id: 'assembling', label: 'ASSEMBLING',  icon: '🔨', desc: 'Finish by late 2026.' },
  { id: 'avenger',    label: 'HERO PACE',   icon: '🛡', desc: 'Push to finish within the year.' },
  { id: 'thanos',     label: 'THANOS MODE', icon: '💜', desc: 'All or nothing. Destiny arrives.' },
]

// ── Animated star field ───────────────────────────────────────────────────────
function Stars() {
  const stars = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    x: (i * 43 + 7) % 100, y: (i * 67 + 11) % 100,
    size: i % 5 === 0 ? 2 : 1, opacity: 0.1 + (i % 6) * 0.08,
    color: ['#E81C2E','#FFD700','#c9a227','#ffe81f','#fff'][i % 5],
  })), [])
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: s.color, opacity: s.opacity }}/>
      ))}
    </div>
  )
}

// ── Universe Card ─────────────────────────────────────────────────────────────
function UniverseCard({ u, selected, onToggle }) {
  return (
    <button onClick={() => onToggle(u.id)}
      className="relative flex flex-col gap-3 p-4 rounded-2xl text-left transition-all active:scale-[0.97]"
      style={{
        background: selected ? `${u.color}10` : 'rgba(255,255,255,0.03)',
        border: `2px solid ${selected ? u.color : 'rgba(255,255,255,0.08)'}`,
        boxShadow: selected ? `0 0 20px ${u.glow}` : 'none',
      }}>
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: u.color }}>
          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 font-black text-[14px]"
          style={{ ...u.logoStyle, width: 40, height: 40 }}>
          {u.emoji ?? u.icon}
        </div>
        <div>
          <div className="font-bebas text-[15px] tracking-widest text-white leading-none">{u.label}</div>
          <div className="text-[9px] mt-0.5" style={{ color: `${u.color}aa` }}>{u.sub}</div>
        </div>
      </div>
      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{u.desc}</p>
      <p className="text-[10px] italic" style={{ color: `${u.color}88` }}>{u.tagline}</p>
    </button>
  )
}

// ── Size option button ────────────────────────────────────────────────────────
function SizeBtn({ opt, selected, color, onSelect }) {
  return (
    <button onClick={() => onSelect(opt.id)}
      className="relative p-3 rounded-xl text-left transition-all"
      style={selected
        ? { background: `${color}14`, border: `1px solid ${color}`, boxShadow: `0 0 12px ${color}30` }
        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: color }}>
          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      )}
      <div className="font-bebas text-[15px] tracking-wider leading-none mb-1"
        style={{ color: selected ? color : 'rgba(255,255,255,0.5)' }}>{opt.label}</div>
      <div className="text-[10px] font-semibold" style={{ color: color }}>{opt.count} titles</div>
      <div className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{opt.desc}</div>
    </button>
  )
}

// ── Progress dots ─────────────────────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="rounded-full transition-all"
          style={{ width: i === current ? 20 : 6, height: 6,
            background: i === current ? '#fff' : i < current ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)' }}/>
      ))}
    </div>
  )
}

// ── Main Onboarding ───────────────────────────────────────────────────────────
export default function Onboarding({ onComplete }) {
  const [step,          setStep]          = useState(0)
  const [selected,      setSelected]      = useState(new Set(['marvel','dc','hp','sw']))
  const [marvelSize,    setMarvelSize]    = useState(null)
  const [dcSize,        setDcSize]        = useState(null)
  const [pace,          setPace]          = useState(null)
  const [profileName,   setProfileName]   = useState('')
  const [favFranchise,  setFavFranchise]  = useState(null)

  // Determine which size steps are needed based on selection
  const needsMarvel = selected.has('marvel')
  const needsDC     = selected.has('dc')

  // Step indices: 0=welcome, 1=universes, 2=rosters(marvel), 3=rosters(dc), 4=pace, 5=profile, 6=done
  // We'll dynamically compute steps
  const STEPS = ['welcome', 'universes',
    ...(needsMarvel ? ['marvel_roster'] : []),
    ...(needsDC     ? ['dc_roster'] : []),
    'pace', 'profile', 'done'
  ]
  const totalSteps = STEPS.length
  const currentStepName = STEPS[step] ?? 'done'

  function toggleUniverse(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id) && next.size > 1) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function next() { setStep(s => Math.min(s + 1, totalSteps - 1)) }
  function prev() { setStep(s => Math.max(s - 1, 0)) }

  function canAdvance() {
    if (currentStepName === 'welcome')       return true
    if (currentStepName === 'universes')     return selected.size > 0
    if (currentStepName === 'marvel_roster') return !!marvelSize
    if (currentStepName === 'dc_roster')     return !!dcSize
    if (currentStepName === 'pace')          return !!pace
    if (currentStepName === 'profile')       return profileName.trim().length >= 1
    return true
  }

  function handleComplete() {
    onComplete({
      listSize:   marvelSize ?? 'hero',
      dcListSize: dcSize ?? 'hero',
      pace:       pace ?? 'casual',
      profileName: profileName.trim() || 'Explorer',
      favFranchise: favFranchise ?? (selected.has('marvel') ? 'marvel' : [...selected][0]),
      selectedUniverses: [...selected],
    })
  }

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: '#04060f' }}>
      <Stars/>
      <div className="relative z-10 max-w-lg mx-auto w-full px-4 py-8 pb-20">

        {/* ── Step 0: Welcome ── */}
        {currentStepName === 'welcome' && (
          <div className="flex flex-col items-center gap-6 pt-12 animate-[fadeIn_0.5s_ease_both]">
            {/* 4-franchise logo cluster */}
            <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.06)' }}/>
              {/* Franchise dots */}
              {[
                { color: '#E81C2E', angle: 270, label: 'M', style: { background: 'linear-gradient(135deg,#E81C2E,#a0001a)', color: '#fff', borderRadius: 10 } },
                { color: '#FFD700', angle: 0,   label: 'DC', style: { background: 'linear-gradient(135deg,#FFD700,#d4a017)', color: '#000', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' } },
                { color: '#c9a227', angle: 90,  label: '⚡', style: { background: 'linear-gradient(135deg,#1a0a2e,#2d1555)', border: '1px solid rgba(201,162,39,0.6)' } },
                { color: '#ffe81f', angle: 180, label: '⚔️', style: { background: '#030308', border: '1px solid rgba(255,232,31,0.5)' } },
              ].map(({ color, angle, label, style }) => {
                const rad = (angle * Math.PI) / 180
                const x = 50 + 45 * Math.cos(rad)
                const y = 50 + 45 * Math.sin(rad)
                return (
                  <div key={angle} className="absolute flex items-center justify-center font-black text-[12px]"
                    style={{ ...style, width: 34, height: 34, left: `${x}%`, top: `${y}%`,
                      transform: 'translate(-50%,-50%)', boxShadow: `0 0 12px ${color}55` }}>
                    {label}
                  </div>
                )
              })}
              {/* Center MT */}
              <div className="relative font-bebas text-[22px] text-white" style={{ letterSpacing: '0.05em' }}>MT</div>
            </div>

            <div className="text-center">
              <div className="font-bebas text-[38px] tracking-[0.15em] text-white leading-none">
                MULTIVERSE TRACKER
              </div>
              <p className="mt-2 text-[13px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Track Every Universe
              </p>
            </div>

            <div className="flex gap-3 text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <span>Marvel</span><span>·</span><span>DC</span><span>·</span><span>Harry Potter</span><span>·</span><span>Star Wars</span>
            </div>

            <button onClick={next}
              className="mt-4 px-10 py-4 rounded-2xl font-bebas text-[22px] tracking-[0.2em] text-white transition-all active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #E81C2E 0%, #FFD700 50%, #ffe81f 100%)',
                boxShadow: '0 0 32px rgba(232,28,46,0.4)' }}>
              GET STARTED →
            </button>
            <p className="text-[9px] text-center" style={{ color: 'rgba(255,255,255,0.15)' }}>
              Track your watch progress across the multiverse
            </p>
          </div>
        )}

        {/* ── Step 1: Choose universes ── */}
        {currentStepName === 'universes' && (
          <div className="animate-[fadeIn_0.4s_ease_both]">
            <StepDots current={step} total={totalSteps}/>
            <h2 className="font-bebas text-[28px] tracking-widest text-white mb-1">CHOOSE YOUR UNIVERSES</h2>
            <p className="text-[11px] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Select which franchises you want to track. You can add more later.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {UNIVERSES.map(u => (
                <UniverseCard key={u.id} u={u} selected={selected.has(u.id)} onToggle={toggleUniverse}/>
              ))}
            </div>
            <p className="text-[9px] text-center mb-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {selected.size} universe{selected.size !== 1 ? 's' : ''} selected
            </p>
            <NavButtons onBack={prev} onNext={next} canNext={canAdvance()} showBack={true}/>
          </div>
        )}

        {/* ── Marvel Roster ── */}
        {currentStepName === 'marvel_roster' && (
          <div className="animate-[fadeIn_0.4s_ease_both]">
            <StepDots current={step} total={totalSteps}/>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
                style={{ background: 'linear-gradient(135deg,#E81C2E,#a0001a)', color: '#fff' }}>M</div>
              <h2 className="font-bebas text-[24px] tracking-widest text-white">MARVEL ROSTER</h2>
            </div>
            <p className="text-[11px] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              How many Marvel titles do you want to track?
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {MARVEL_SIZES.map(o => (
                <SizeBtn key={o.id} opt={o} selected={marvelSize === o.id} color="#E81C2E" onSelect={setMarvelSize}/>
              ))}
            </div>
            <NavButtons onBack={prev} onNext={next} canNext={canAdvance()} showBack={true}/>
          </div>
        )}

        {/* ── DC Roster ── */}
        {currentStepName === 'dc_roster' && (
          <div className="animate-[fadeIn_0.4s_ease_both]">
            <StepDots current={step} total={totalSteps}/>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 flex items-center justify-center font-black text-base"
                style={{ background: 'linear-gradient(135deg,#FFD700,#d4a017)', color: '#000', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>
                DC
              </div>
              <h2 className="font-bebas text-[24px] tracking-widest text-white">DC ROSTER</h2>
            </div>
            <p className="text-[11px] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              How many DC titles do you want to track?
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {DC_SIZES.map(o => (
                <SizeBtn key={o.id} opt={o} selected={dcSize === o.id} color="#FFD700" onSelect={setDcSize}/>
              ))}
            </div>
            <NavButtons onBack={prev} onNext={next} canNext={canAdvance()} showBack={true}/>
          </div>
        )}

        {/* ── Pace ── */}
        {currentStepName === 'pace' && (
          <div className="animate-[fadeIn_0.4s_ease_both]">
            <StepDots current={step} total={totalSteps}/>
            <h2 className="font-bebas text-[28px] tracking-widest text-white mb-1">SET YOUR PACE</h2>
            <p className="text-[11px] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              How quickly do you want to work through your list?
            </p>
            <div className="flex flex-col gap-2 mb-6">
              {PACE_OPTS.map(o => (
                <button key={o.id} onClick={() => setPace(o.id)}
                  className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                  style={pace === o.id
                    ? { background: 'rgba(232,28,46,0.12)', border: '1px solid #E81C2E', boxShadow: '0 0 12px rgba(232,28,46,0.2)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-2xl w-8">{o.icon}</span>
                  <div className="flex-1">
                    <div className="font-bebas text-[15px] tracking-wider text-white">{o.label}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{o.desc}</div>
                  </div>
                  {pace === o.id && (
                    <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: '#E81C2E' }}>
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <NavButtons onBack={prev} onNext={next} canNext={canAdvance()} showBack={true}/>
          </div>
        )}

        {/* ── Profile Setup ── */}
        {currentStepName === 'profile' && (
          <div className="animate-[fadeIn_0.4s_ease_both]">
            <StepDots current={step} total={totalSteps}/>
            <h2 className="font-bebas text-[28px] tracking-widest text-white mb-1">YOUR PROFILE</h2>
            <p className="text-[11px] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Almost there. Tell us who you are.
            </p>

            {/* Name input */}
            <div className="mb-5">
              <label className="text-[9px] uppercase tracking-widest font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Your name / username
              </label>
              <input
                type="text" value={profileName} onChange={e => setProfileName(e.target.value)}
                placeholder="e.g. Tony Stark"
                maxLength={30}
                className="w-full rounded-xl px-4 py-3 text-white text-[14px] focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${profileName.trim() ? '#fff' : 'rgba(255,255,255,0.12)'}` }}
              />
            </div>

            {/* Favorite franchise */}
            <div className="mb-6">
              <label className="text-[9px] uppercase tracking-widest font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Favorite universe
              </label>
              <div className="grid grid-cols-2 gap-2">
                {UNIVERSES.filter(u => selected.has(u.id)).map(u => (
                  <button key={u.id} onClick={() => setFavFranchise(u.id)}
                    className="flex items-center gap-2 p-3 rounded-xl transition-all"
                    style={favFranchise === u.id
                      ? { background: `${u.color}14`, border: `1px solid ${u.color}` }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-8 h-8 flex items-center justify-center font-black text-[12px] flex-shrink-0"
                      style={{ ...u.logoStyle, width: 32, height: 32 }}>
                      {u.emoji ?? u.icon}
                    </div>
                    <span className="font-bebas text-[13px] tracking-wide"
                      style={{ color: favFranchise === u.id ? u.color : 'rgba(255,255,255,0.5)' }}>
                      {u.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <NavButtons onBack={prev} onNext={next} canNext={canAdvance()} showBack={true}/>
          </div>
        )}

        {/* ── Done ── */}
        {currentStepName === 'done' && (
          <div className="flex flex-col items-center gap-5 pt-8 animate-[fadeIn_0.5s_ease_both]">
            <div className="text-6xl">🌌</div>
            <div className="text-center">
              <div className="font-bebas text-[32px] tracking-widest text-white leading-none">YOU'RE READY</div>
              <p className="text-[12px] mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Welcome to the Multiverse, <span className="text-white font-semibold">{profileName || 'Explorer'}</span>
              </p>
            </div>

            {/* Summary */}
            <div className="w-full rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Your Setup</div>
              {[...selected].map(id => {
                const u = UNIVERSES.find(x => x.id === id)
                const size = id === 'marvel' ? marvelSize : id === 'dc' ? dcSize : null
                const SIZES = id === 'marvel' ? MARVEL_SIZES : DC_SIZES
                const sizeLabel = size ? SIZES.find(s => s.id === size)?.count + ' titles' : 'All titles'
                return (
                  <div key={id} className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center font-black text-[11px] flex-shrink-0"
                      style={{ ...u.logoStyle, width: 32, height: 32 }}>
                      {u.emoji ?? u.icon}
                    </div>
                    <div className="flex-1">
                      <span className="text-[12px] font-semibold text-white">{u.label}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: u.color }}>{sizeLabel}</span>
                  </div>
                )
              })}
              <div className="flex items-center gap-3 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-lg">⚡</span>
                <span className="text-[11px] text-white">Pace: <span style={{ color: 'rgba(255,255,255,0.5)' }}>{PACE_OPTS.find(p => p.id === pace)?.label ?? 'Casual'}</span></span>
              </div>
            </div>

            <button onClick={handleComplete}
              className="w-full py-4 rounded-2xl font-bebas text-[22px] tracking-[0.2em] text-white transition-all active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg,#E81C2E 0%,#FFD700 50%,#ffe81f 100%)',
                boxShadow: '0 0 32px rgba(232,28,46,0.3)' }}>
              ENTER THE MULTIVERSE →
            </button>
            <p className="text-[9px] text-center" style={{ color: 'rgba(255,255,255,0.15)' }}>
              You can change everything from Settings at any time
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Nav buttons ───────────────────────────────────────────────────────────────
function NavButtons({ onBack, onNext, canNext, showBack, nextLabel }) {
  return (
    <div className="flex gap-3">
      {showBack && (
        <button onClick={onBack}
          className="px-5 py-3.5 rounded-xl font-bebas text-[15px] tracking-wider transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
          ← BACK
        </button>
      )}
      <button onClick={onNext} disabled={!canNext}
        className="flex-1 py-3.5 rounded-xl font-bebas text-[17px] tracking-wider transition-all"
        style={canNext
          ? { background: '#fff', color: '#000', boxShadow: '0 0 20px rgba(255,255,255,0.15)' }
          : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.2)', cursor: 'not-allowed' }}>
        {nextLabel ?? 'CONTINUE →'}
      </button>
    </div>
  )
}
