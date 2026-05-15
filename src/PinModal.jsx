import { useState, useRef, useEffect } from 'react'
import { LOCK_TIERS } from './data/locks.js'

/**
 * PinModal — 4-digit PIN entry (verify) or setup (create/change) modal.
 *
 * Props:
 *   mode:       'verify' | 'setup'
 *   tierKey:    one of 'pg13' | 'tv14' | 'tvma' | 'r'
 *   onSuccess:  called with the PIN string when verify succeeds, or the new PIN when setup completes
 *   onCancel:   called when the user dismisses without completing
 *
 * In 'verify' mode, currentPin must be provided; onSuccess is called with no args on match.
 * In 'setup'  mode, onSuccess is called with the new 4-digit PIN string.
 */
export default function PinModal({ mode, tierKey, currentPin, onSuccess, onCancel }) {
  const tier = LOCK_TIERS[tierKey] ?? LOCK_TIERS.pg13
  const [digits,    setDigits]    = useState(['', '', '', ''])
  const [confirm,   setConfirm]   = useState(['', '', '', ''])  // setup only
  const [step,      setStep]      = useState(1)   // 1=enter, 2=confirm (setup only)
  const [shake,     setShake]     = useState(false)
  const [error,     setError]     = useState(null)
  const inputRefs  = useRef([])
  const confirmRefs = useRef([])

  // Focus first input on mount
  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  function handleDigit(idx, val, arr, setArr, refs, onFull) {
    if (!/^\d?$/.test(val)) return
    const next = [...arr]
    next[idx] = val.slice(-1)
    setArr(next)
    if (val && idx < 3) refs.current[idx + 1]?.focus()
    if (val && idx === 3) onFull(next.join(''))
  }

  function handleKey(e, idx, arr, setArr, refs) {
    if (e.key === 'Backspace' && !arr[idx] && idx > 0) {
      refs.current[idx - 1]?.focus()
      const next = [...arr]
      next[idx - 1] = ''
      setArr(next)
    }
  }

  function triggerShake(msg) {
    setError(msg)
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  function handleEntryFull(pin) {
    if (mode === 'verify') {
      if (pin === currentPin) {
        onSuccess()
      } else {
        triggerShake('Incorrect PIN. Try again.')
        setDigits(['', '', '', ''])
        setTimeout(() => inputRefs.current[0]?.focus(), 50)
      }
    } else {
      // setup — move to confirm step
      setStep(2)
      setTimeout(() => confirmRefs.current[0]?.focus(), 50)
    }
  }

  function handleConfirmFull(pin) {
    const entered = digits.join('')
    if (pin === entered) {
      onSuccess(pin)
    } else {
      triggerShake('PINs don\'t match. Start over.')
      setDigits(['', '', '', ''])
      setConfirm(['', '', '', ''])
      setStep(1)
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    }
  }

  const title = mode === 'verify'
    ? `Enter ${tier.label} PIN`
    : step === 1
      ? `Create ${tier.label} PIN`
      : `Confirm PIN`

  const subtitle = mode === 'verify'
    ? `${tier.emoji} ${tier.description}`
    : step === 1
      ? 'Enter a 4-digit PIN to lock this rating tier'
      : 'Enter the same PIN again to confirm'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xs bg-[#0f0f0f] border border-[#222] rounded-2xl p-6 text-center"
        style={{
          animation: shake ? 'pinShake 0.5s ease' : 'slideUp 0.3s ease both',
          borderColor: shake ? '#E81C2E' : undefined,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Tier badge */}
        <div
          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border mb-4 ${tier.bgColor} ${tier.borderColor}`}
          style={{ color: tier.color }}
        >
          <span>{tier.emoji}</span>
          <span className="font-bold tracking-widest">{tier.rating}</span>
        </div>

        <h2 className="font-bebas text-xl tracking-widest text-white mb-1">{title}</h2>
        <p className="text-[#555] text-xs mb-6">{subtitle}</p>

        {/* PIN inputs */}
        <div className="flex justify-center gap-3 mb-2">
          {(step === 1 ? digits : confirm).map((d, i) => (
            <input
              key={i}
              ref={el => (step === 1 ? inputRefs : confirmRefs).current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => step === 1
                ? handleDigit(i, e.target.value, digits, setDigits, inputRefs, handleEntryFull)
                : handleDigit(i, e.target.value, confirm, setConfirm, confirmRefs, handleConfirmFull)
              }
              onKeyDown={e => step === 1
                ? handleKey(e, i, digits, setDigits, inputRefs)
                : handleKey(e, i, confirm, setConfirm, confirmRefs)
              }
              className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border bg-[#161616] text-white focus:outline-none transition-all ${
                d ? 'border-[#E81C2E]' : 'border-[#222] focus:border-[#E81C2E]/50'
              }`}
              style={{ caretColor: 'transparent' }}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-[#E81C2E] text-xs mt-3 mb-0">{error}</p>
        )}

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="mt-5 text-[#444] text-xs hover:text-[#666] transition-colors"
        >
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes pinShake {
          0%,100% { transform: translateX(0) }
          20%      { transform: translateX(-8px) }
          40%      { transform: translateX(8px) }
          60%      { transform: translateX(-6px) }
          80%      { transform: translateX(6px) }
        }
      `}</style>
    </div>
  )
}

/**
 * PinSetupSection — used in ProfilePage to enable/disable/change PIN per tier.
 *
 * Props:
 *   tierKey:    'pg13' | 'tv14' | 'tvma' | 'r'
 *   enabled:    boolean — whether this tier's lock is active
 *   hasPin:     boolean — whether a PIN is set for this tier
 *   onEnable:   () → void — called to start PIN setup (enabling the lock)
 *   onDisable:  () → void — called to disable the lock (requires current PIN)
 *   onChangePin:() → void — called to start PIN change flow
 */
export function PinSetupSection({ tierKey, enabled, hasPin, onEnable, onDisable, onChangePin }) {
  const tier = LOCK_TIERS[tierKey] ?? LOCK_TIERS.pg13
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${tier.bgColor} border ${tier.borderColor}`}
        >
          {tier.emoji}
        </div>
        <div>
          <div className="text-sm font-medium text-white">{tier.label}</div>
          <div className="text-[10px] text-[#555]">{tier.description}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {enabled && hasPin && (
          <button
            onClick={onChangePin}
            className="text-[10px] text-[#555] hover:text-white border border-[#222] px-2.5 py-1 rounded-lg transition-colors"
          >
            Change
          </button>
        )}
        <button
          onClick={enabled ? onDisable : onEnable}
          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
            enabled
              ? 'bg-red-950/50 border-[#E81C2E]/30 text-[#E81C2E]'
              : 'bg-[#151515] border-[#222] text-[#555] hover:text-white'
          }`}
        >
          {enabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  )
}
