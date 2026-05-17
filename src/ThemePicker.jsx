import { THEMES } from './data/themes.js'

/**
 * ThemePicker — bottom-sheet theme selector
 * Props:
 *   currentTheme: string (theme key)
 *   onSelect: (themeKey: string) => void
 *   onClose: () => void
 */
export default function ThemePicker({ currentTheme = 'default', onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 10001, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl overflow-hidden pb-10"
        style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', animation: 'tpSlideUp 0.3s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <div>
            <h2 className="font-bebas text-2xl tracking-widest text-white">APP THEME</h2>
            <p className="text-[10px] text-[#555]">Choose your Marvel aesthetic</p>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors text-lg">✕</button>
        </div>

        {/* Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {THEMES.map(theme => {
            const active = theme.key === currentTheme
            return (
              <button
                key={theme.key}
                onClick={() => { onSelect(theme.key); onClose() }}
                className="rounded-2xl p-4 text-left transition-all active:scale-[0.97]"
                style={{
                  background: active ? theme.primary + '18' : '#0a0a0a',
                  border: `2px solid ${active ? theme.primary : '#1e1e1e'}`,
                }}
              >
                {/* Color swatches */}
                <div className="flex gap-1.5 mb-2.5">
                  <div className="w-5 h-5 rounded-full" style={{ background: theme.primary }}/>
                  <div className="w-5 h-5 rounded-full" style={{ background: theme.secondary }}/>
                </div>
                <div className="text-xl mb-1">{theme.icon}</div>
                <div className="font-bebas text-sm tracking-widest text-white leading-none mb-0.5">{theme.name}</div>
                <div className="text-[9px] text-[#555] leading-snug">{theme.desc}</div>
                {active && (
                  <div className="mt-2 text-[9px] font-bold" style={{ color: theme.primary }}>● ACTIVE</div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes tpSlideUp { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      `}</style>
    </div>
  )
}
