// ── Lightsaber Colors ─────────────────────────────────────────────────────────
export const SW_LIGHTSABER_COLORS = [
  { key: 'blue',       label: 'Blue',        emoji: '💙', color: '#4a9eff', wielders: 'Luke, Anakin, Obi-Wan, Rey, Ahsoka (early), Finn',      side: 'light', filmIds: [3001,3002,3003,3004,3006,3008,3009,3010,3017,3018,3019] },
  { key: 'green',      label: 'Green',       emoji: '💚', color: '#27ae60', wielders: 'Yoda, Luke (ROTJ), Qui-Gon, Ahsoka (early)',            side: 'light', filmIds: [3001,3002,3003,3004,3009,3010,3017] },
  { key: 'red',        label: 'Red',         emoji: '❤️', color: '#e74c3c', wielders: 'Darth Vader, Sidious, Dooku, Kylo Ren, Inquisitors',   side: 'dark',  filmIds: [3001,3002,3003,3004,3006,3008,3009,3010,3013,3017,3018,3019] },
  { key: 'purple',     label: 'Purple',      emoji: '💜', color: '#9b59b6', wielders: 'Mace Windu',                                           side: 'light', filmIds: [3001,3002,3003,3004] },
  { key: 'yellow',     label: 'Yellow',      emoji: '💛', color: '#ffe81f', wielders: 'Jedi Temple Guards, Rey (final weapon)',                side: 'light', filmIds: [3019] },
  { key: 'white',      label: 'White',       emoji: '🤍', color: '#ecf0f1', wielders: 'Ahsoka Tano (post-Order 66)',                          side: 'grey',  filmIds: [3005,3015] },
  { key: 'darksaber',  label: 'Darksaber',   emoji: '⬛', color: '#2c3e50', wielders: 'Pre Vizsla, Maul, Sabine, Bo-Katan, Din Djarin',       side: 'grey',  filmIds: [3003,3005,3011,3012,3015] },
  { key: 'orange',     label: 'Orange',      emoji: '🧡', color: '#e67e22', wielders: 'Baylan Skoll (Ahsoka series)',                         side: 'grey',  filmIds: [3015] },
]

// ── Planets by title ──────────────────────────────────────────────────────────
export const SW_PLANETS = {
  3001: ['Tatooine', 'Naboo', 'Coruscant', 'Mustafar (brief)'],
  3002: ['Coruscant', 'Naboo', 'Geonosis', 'Kamino', 'Tatooine'],
  3003: ['Coruscant', 'Mandalore', 'Onderon', 'Mortis', 'Umbara', 'Ryloth'],
  3004: ['Coruscant', 'Utapau', 'Kashyyyk', 'Mustafar', 'Polis Massa', 'Alderaan'],
  3005: ['Lothal', 'Tatooine (Malachor)', 'Geonosis', 'Malachor'],
  3006: ['Scarif', 'Jedha', 'Eadu', 'Yavin 4'],
  3007: ['Corellia', 'Mimban', 'Kessel', 'Savareen'],
  3008: ['Tatooine', 'Alderaan (destroyed)', 'Death Star', 'Yavin 4'],
  3009: ['Hoth', 'Dagobah', 'Bespin (Cloud City)', 'Tatooine', 'Coruscant'],
  3010: ['Tatooine', 'Endor', 'Sullust', 'Coruscant', 'Death Star II'],
  3011: ['Nevarro', 'Arvala-7', 'Sorgan', 'Trask', 'Tython', 'Morak', 'Mandalore'],
  3012: ['Tatooine', 'Kamino', 'Jabba\'s Palace', 'Tython'],
  3013: ['Tatooine', 'Daiyu', 'Mapuzo', 'Jabiim', 'Nur'],
  3014: ['Ferrix', 'Coruscant', 'Narkina 5', 'Fondor', 'Scarif (flashback)'],
  3015: ['Seatos', 'Peridea', 'Coruscant', 'Lothal', 'Mandalore'],
  3016: ['Kelia', 'Coruscant', 'Nevarro'],
  3017: ['Jakku', 'Takodana', 'Starkiller Base', 'D\'Qar', 'Ahch-To'],
  3018: ['Ahch-To', 'Crait', 'Canto Bight', 'D\'Qar', 'Ach-To'],
  3019: ['Pasaana', 'Kijimi', 'Kef Bir', 'Exegol'],
}

// ── Force Side ────────────────────────────────────────────────────────────────
export const SW_FORCE_SIDES = {
  light: { label: 'Light Side', emoji: '☀️', color: '#4a9eff', desc: 'Peace, knowledge, serenity, harmony, the Force.' },
  dark:  { label: 'Dark Side',  emoji: '🌑', color: '#e74c3c', desc: 'Fear, anger, passion, strength — the Sith way.' },
  grey:  { label: 'Grey Force', emoji: '⚖️', color: '#9b59b6', desc: 'Balance between light and dark. The Bendu way.' },
}

// ── Midi-chlorian counts (lore-based approximate) ─────────────────────────────
export const SW_MIDICLORIANS = {
  anakin:    20000, // off the charts — Chosen One
  luke:      14500,
  yoda:      17700,
  palpatine: 16700,
  obiwan:    13400,
  quigon:    12500,
  vader:     13000, // reduced after injuries
  rey:       18500,
  grogu:     unknown => 15000, // sealed potential
  macewindu: 12000,
  dooku:     13500,
  kylo:      11500,
  ahsoka:    14200,
  leia:      14500,
  finn:      11000, // implied Force-sensitive
}

// ── Character groups ──────────────────────────────────────────────────────────
export const SW_GROUPS = [
  { key: 'jedi',         label: 'Jedi Order',       emoji: '⚔️', color: '#4a9eff',  charIds: ['luke','obiwan','yoda','quigon','anakin','macewindu','kanan','ezra','ahsoka'] },
  { key: 'sith',         label: 'Sith',              emoji: '🔴', color: '#e74c3c',  charIds: ['vader','palpatine','dooku','kylo','snoke'] },
  { key: 'empire',       label: 'Galactic Empire',   emoji: '🏛️', color: '#2c3e50',  charIds: ['vader','palpatine','tarkin','thrawn','grievous'] },
  { key: 'rebels',       label: 'Rebel Alliance',    emoji: '🔴', color: '#e74c3c',  charIds: ['luke','leia','han','chewie','lando','wedge','monmothma','jynerso','cassian','hera','kanan','ezra','sabine'] },
  { key: 'republic',     label: 'New Republic',      emoji: '⭐', color: '#ffe81f',  charIds: ['luke','leia','han','lando','din','ahsoka','bokata','monmothma'] },
  { key: 'firstorder',   label: 'First Order',       emoji: '🔱', color: '#95a5a6',  charIds: ['kylo','snoke','hux'] },
  { key: 'resistance',   label: 'Resistance',        emoji: '💫', color: '#27ae60',  charIds: ['leia','rey','finn','poe','bb8'] },
  { key: 'mandalorians', label: 'Mandalorians',      emoji: '🪖', color: '#4a9eff',  charIds: ['din','bobafett','jangofett','bokata','sabine'] },
  { key: 'bounty',       label: 'Bounty Hunters',    emoji: '🎯', color: '#c9a227',  charIds: ['bobafett','jangofett','din'] },
  { key: 'clone',        label: 'Clone Troopers',    emoji: '⚪', color: '#c0c0c0',  charIds: [] },
  { key: 'inquisitors',  label: 'Inquisitors',       emoji: '🌀', color: '#8e44ad',  charIds: [] },
]
