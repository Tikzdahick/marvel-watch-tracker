import { useState, useRef } from 'react'

const PRESET_AVATARS = [
  { emoji: '🤖', label: 'Iron Man' },
  { emoji: '🛡️', label: 'Cap' },
  { emoji: '⚡', label: 'Thor' },
  { emoji: '🕷️', label: 'Spider-Man' },
  { emoji: '🐾', label: 'Panther' },
  { emoji: '🌀', label: 'Strange' },
  { emoji: '💚', label: 'Hulk' },
  { emoji: '🕸️', label: 'Widow' },
  { emoji: '🏹', label: 'Hawkeye' },
  { emoji: '⭐', label: 'Marvel' },
  { emoji: '💜', label: 'Wanda' },
  { emoji: '🦅', label: 'Falcon' },
]

export default function ProfileSetup({ onComplete }) {
  const [name, setName]           = useState('')
  const [avatar, setAvatar]       = useState(PRESET_AVATARS[0].emoji)
  const [customPhoto, setCustomPhoto] = useState(null)
  const fileRef = useRef(null)

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setCustomPhoto(ev.target.result)
      setAvatar(null)
    }
    reader.readAsDataURL(file)
  }

  function handleContinue() {
    if (!name.trim()) return
    onComplete({
      name: name.trim(),
      avatar: customPhoto ?? avatar,
      isCustomPhoto: !!customPhoto,
    })
  }

  const displayAvatar = customPhoto ?? avatar

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col" style={{ animation: 'fadeIn 0.5s ease both' }}>

      {/* ── Top decoration ── */}
      <div className="flex flex-col items-center pt-14 pb-6 px-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 font-black text-3xl text-black shadow-[0_0_32px_rgba(232,28,46,0.4)]"
          style={{ background: 'linear-gradient(135deg, #E81C2E 0%, #b01020 100%)' }}
        >
          M
        </div>
        <h1 className="font-bebas text-[34px] tracking-[0.15em] text-white leading-none mb-1">
          CREATE PROFILE
        </h1>
        <p className="text-[#444] text-[13px] text-center tracking-wide">
          Set up your Marvel identity
        </p>
      </div>

      {/* ── Form ── */}
      <div className="flex-1 px-5 max-w-lg mx-auto w-full space-y-7 overflow-y-auto">

        {/* Name */}
        <div>
          <label className="block text-[10px] text-[#555] uppercase tracking-widest mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleContinue()}
            placeholder="Enter your name…"
            maxLength={24}
            autoFocus
            className="w-full bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl px-4 py-3.5 text-white placeholder-[#333] text-base focus:outline-none focus:border-[#E81C2E]/60 transition-colors"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-[10px] text-[#555] uppercase tracking-widest mb-3">
            Choose Avatar
          </label>

          {/* Preview row */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-3xl border-2 border-[#E81C2E]/60 overflow-hidden flex-shrink-0"
              style={{ background: '#161616' }}
            >
              {displayAvatar?.startsWith('data:')
                ? <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover"/>
                : <span>{displayAvatar}</span>
              }
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="text-[11px] text-[#E81C2E] border border-[#E81C2E]/40 px-3 py-1.5 rounded-lg hover:bg-[#E81C2E]/10 transition-colors"
              >
                📷 Upload Photo
              </button>
              {customPhoto && (
                <button
                  onClick={() => { setCustomPhoto(null); setAvatar(PRESET_AVATARS[0].emoji) }}
                  className="text-[11px] text-[#444] hover:text-[#888] transition-colors text-left"
                >
                  Remove photo
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Preset grid */}
          <div className="grid grid-cols-6 gap-2">
            {PRESET_AVATARS.map(p => (
              <button
                key={p.emoji}
                onClick={() => { setAvatar(p.emoji); setCustomPhoto(null) }}
                title={p.label}
                className={[
                  'flex items-center justify-center p-2.5 rounded-xl text-2xl transition-all',
                  !customPhoto && avatar === p.emoji
                    ? 'bg-[#E81C2E]/15 border-2 border-[#E81C2E]/60 shadow-[0_0_10px_rgba(232,28,46,0.2)]'
                    : 'bg-[#111] border border-[#1e1e1e] hover:border-[#333]',
                ].join(' ')}
              >
                {p.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Continue button ── */}
      <div className="px-5 pb-12 pt-6 max-w-lg mx-auto w-full">
        <button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="w-full py-4 rounded-2xl font-bebas text-xl tracking-[0.15em] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white"
          style={{
            background: name.trim()
              ? 'linear-gradient(135deg, #E81C2E 0%, #b01020 100%)'
              : '#1a1a1a',
            boxShadow: name.trim() ? '0 0 24px rgba(232,28,46,0.35)' : 'none',
          }}
        >
          CONTINUE →
        </button>
      </div>
    </div>
  )
}
