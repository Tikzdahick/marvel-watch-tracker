/**
 * eras.js — Era definitions and per-title era assignments.
 * Used by the tracker list to render era section headers.
 */

export const ERAS = [
  {
    key:    'classic',
    label:  'Classic Marvel',
    sub:    'Pre-MCU Legacy Films (1986–2012)',
    emoji:  '📽️',
    color:  'text-amber-400',
    bg:     'bg-amber-950/40',
    border: 'border-amber-500/20',
  },
  {
    key:    'blade',
    label:  'Blade Era',
    sub:    'Pre-MCU (1998–2004)',
    emoji:  '🧛',
    color:  'text-[#E81C2E]',
    bg:     'bg-red-950/50',
    border: 'border-[#E81C2E]/20',
  },
  {
    key:    'xmen',
    label:  'X-Men Era',
    sub:    'Fox X-Men Universe (2000–2018)',
    emoji:  '⚡',
    color:  'text-purple-400',
    bg:     'bg-purple-950/50',
    border: 'border-purple-500/20',
  },
  {
    key:    'sony',
    label:  'Sony Spider-Verse',
    sub:    'Spider-Man & Symbiotes (2002–present)',
    emoji:  '🕷️',
    color:  'text-red-400',
    bg:     'bg-red-950/40',
    border: 'border-red-500/20',
  },
  {
    key:    'early',
    label:  'Early MCU',
    sub:    'Phase 1–2 (2008–2015)',
    emoji:  '🛡️',
    color:  'text-[#F5C518]',
    bg:     'bg-yellow-950/40',
    border: 'border-[#F5C518]/15',
  },
  {
    key:    'netflix',
    label:  'Netflix Era',
    sub:    'Defenders Saga (2015–2019)',
    emoji:  '🔴',
    color:  'text-red-400',
    bg:     'bg-red-950/40',
    border: 'border-red-500/20',
  },
  {
    key:    'infinity',
    label:  'Infinity Saga',
    sub:    'Phase 3 (2016–2019)',
    emoji:  '∞',
    color:  'text-[#F5C518]',
    bg:     'bg-yellow-950/50',
    border: 'border-[#F5C518]/25',
  },
  {
    key:    'disney',
    label:  'Disney+ Era',
    sub:    'Phase 4–5 (2020–2023)',
    emoji:  '🏰',
    color:  'text-blue-400',
    bg:     'bg-blue-950/40',
    border: 'border-blue-500/20',
  },
  {
    key:    'recent',
    label:  'Recent Releases',
    sub:    '2024–2025',
    emoji:  '🆕',
    color:  'text-green-400',
    bg:     'bg-green-950/40',
    border: 'border-green-500/20',
  },
  {
    key:    'soon',
    label:  'Coming Soon',
    sub:    'Announced / In Production',
    emoji:  '⏳',
    color:  'text-[#555]',
    bg:     'bg-[#0f0f0f]',
    border: 'border-[#1e1e1e]',
  },
]

/** Map each title ID to its era key */
export const ERA_FOR_ID = {
  // ── Blade Era ──────────────────────────────────────────────
  1: 'blade', 2: 'blade', 3: 'blade',

  // ── X-Men Era ──────────────────────────────────────────────
  5: 'xmen', 6: 'xmen', 7: 'xmen', 8: 'xmen', 9: 'xmen',
  10: 'xmen', 11: 'xmen', 12: 'xmen', 13: 'xmen', 14: 'xmen',
  15: 'xmen', 16: 'xmen',

  // ── Early MCU (Phase 1–2) ──────────────────────────────────
  17: 'early', 18: 'early', 19: 'early', 20: 'early',
  21: 'early', 22: 'early', 23: 'early', 24: 'early', 25: 'early',
  26: 'early', 27: 'early', 28: 'early', 29: 'early', 30: 'early',
  31: 'early', 32: 'early', 33: 'early',

  // ── Netflix / Defenders Era ────────────────────────────────
  34: 'netflix', 35: 'netflix', 36: 'netflix',
  37: 'netflix', 38: 'netflix', 39: 'netflix',

  // ── Infinity Saga (Phase 3) ────────────────────────────────
  40: 'infinity', 41: 'infinity', 42: 'infinity', 43: 'infinity', 44: 'infinity',
  45: 'infinity', 46: 'infinity', 47: 'infinity', 48: 'infinity',

  // ── Disney+ Era (Phase 4–5) ────────────────────────────────
  49: 'disney', 50: 'disney', 51: 'disney', 52: 'disney', 53: 'disney',
  54: 'disney', 55: 'disney', 56: 'disney', 57: 'disney', 58: 'disney',
  59: 'disney', 60: 'disney', 61: 'disney', 62: 'disney', 63: 'disney',
  64: 'disney', 65: 'disney', 66: 'disney', 67: 'disney', 68: 'disney',
  69: 'disney', 70: 'disney', 71: 'disney',

  // ── Recent Releases (2024–2025) ────────────────────────────
  // (73 Venom, 74 VLTBC moved to 'sony' below)
  4: 'recent', 72: 'recent', 75: 'recent',
  76: 'recent', 77: 'recent', 78: 'recent', 79: 'recent', 80: 'recent',
  81: 'recent',

  // ── Sony Spider-Verse ───────────────────────────────────────
  73: 'sony', 74: 'sony',
  86: 'sony', 87: 'sony', 88: 'sony', 89: 'sony', 90: 'sony',
  91: 'sony', 92: 'sony', 93: 'sony', 94: 'sony', 95: 'sony',
  106: 'sony', 107: 'sony',

  // ── Classic / Legacy Marvel ─────────────────────────────────
  96: 'classic', 97: 'classic', 98: 'classic', 99: 'classic', 100: 'classic',
  101: 'classic', 102: 'classic', 103: 'classic', 104: 'classic', 105: 'classic',

  // ── Coming Soon ────────────────────────────────────────────
  82: 'soon', 83: 'soon', 84: 'soon', 85: 'soon',
}

export function getEraForId(id) {
  return ERA_FOR_ID[id] ?? 'recent'
}

export function getEra(key) {
  return ERAS.find(e => e.key === key) ?? ERAS[ERAS.length - 1]
}
