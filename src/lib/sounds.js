// Web Audio API sound generator — no audio files needed

let ctx = null

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      // Silently fail if Web Audio is not supported
    }
  }
  return ctx
}

function playTone(frequency, duration, type = 'sine', gain = 0.3, startTime = 0) {
  const context = getCtx()
  if (!context) return

  try {
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + startTime)

    gainNode.gain.setValueAtTime(0, context.currentTime + startTime)
    gainNode.gain.linearRampToValueAtTime(gain, context.currentTime + startTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + startTime + duration)

    oscillator.start(context.currentTime + startTime)
    oscillator.stop(context.currentTime + startTime + duration)
  } catch (e) {
    // Silently catch Web Audio errors
  }
}

function playTones(tones) {
  for (const tone of tones) {
    playTone(tone.freq, tone.dur, tone.type || 'sine', tone.gain || 0.3, tone.delay || 0)
  }
}

// Toggle
let enabled = true

export function setSoundsEnabled(val) {
  enabled = val
}

export function getSoundsEnabled() {
  return enabled
}

export function playWatchSound() {
  if (!enabled) return
  try {
    playTone(880, 0.15, 'triangle', 0.3, 0)
  } catch (e) {}
}

export function playAchievementSound() {
  if (!enabled) return
  try {
    playTones([
      { freq: 523,  dur: 0.1, type: 'sine', gain: 0.3, delay: 0    },
      { freq: 659,  dur: 0.1, type: 'sine', gain: 0.3, delay: 0.1  },
      { freq: 784,  dur: 0.1, type: 'sine', gain: 0.3, delay: 0.2  },
      { freq: 1047, dur: 0.1, type: 'sine', gain: 0.3, delay: 0.3  },
    ])
  } catch (e) {}
}

export function playEraCompleteSound() {
  if (!enabled) return
  try {
    playTones([
      { freq: 523,  dur: 0.12, type: 'sine', gain: 0.35, delay: 0   },
      { freq: 659,  dur: 0.12, type: 'sine', gain: 0.35, delay: 0.12 },
      { freq: 784,  dur: 0.12, type: 'sine', gain: 0.35, delay: 0.24 },
      { freq: 1047, dur: 0.5,  type: 'sine', gain: 0.35, delay: 0.36 },
    ])
  } catch (e) {}
}

export function playLevelUpSound() {
  if (!enabled) return
  try {
    playTones([
      { freq: 392, dur: 0.1, type: 'sine', gain: 0.3, delay: 0    },
      { freq: 523, dur: 0.1, type: 'sine', gain: 0.3, delay: 0.1  },
      { freq: 659, dur: 0.1, type: 'sine', gain: 0.3, delay: 0.2  },
      { freq: 784, dur: 0.2, type: 'sine', gain: 0.3, delay: 0.3  },
    ])
  } catch (e) {}
}

export function playMilestoneSound() {
  if (!enabled) return
  try {
    // Big chord: 523+659+784Hz simultaneously
    playTone(523, 0.6, 'sine', 0.25, 0)
    playTone(659, 0.6, 'sine', 0.25, 0)
    playTone(784, 0.6, 'sine', 0.25, 0)
  } catch (e) {}
}
