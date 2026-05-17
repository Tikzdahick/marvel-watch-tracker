export const THEMES = [
  {
    key: 'default',
    name: 'Marvel Classic',
    icon: '🦸',
    primary: '#E81C2E',
    secondary: '#F5C518',
    bg: '#0a0a0a',
    surface: '#0f0f0f',
    border: '#1e1e1e',
    desc: 'The classic Marvel red and gold',
  },
  {
    key: 'iron_man',
    name: 'Iron Man',
    icon: '🤖',
    primary: '#ff4500',
    secondary: '#F5C518',
    bg: '#0a0500',
    surface: '#0f0800',
    border: '#2a1500',
    desc: 'Stark Industries red and gold',
  },
  {
    key: 'captain_america',
    name: 'Captain America',
    icon: '🛡️',
    primary: '#1B4FD8',
    secondary: '#ffffff',
    bg: '#020917',
    surface: '#04112a',
    border: '#0d2040',
    desc: 'Star-spangled blue and white',
  },
  {
    key: 'thor',
    name: 'Thor',
    icon: '⚡',
    primary: '#3b82f6',
    secondary: '#FFD700',
    bg: '#010a1a',
    surface: '#040f2a',
    border: '#081a40',
    desc: 'Asgardian deep blue and gold',
  },
  {
    key: 'black_panther',
    name: 'Black Panther',
    icon: '🐾',
    primary: '#7C3AED',
    secondary: '#C0C0C0',
    bg: '#080010',
    surface: '#100020',
    border: '#200040',
    desc: 'Wakandan purple and silver',
  },
  {
    key: 'loki',
    name: 'Loki',
    icon: '🐍',
    primary: '#16a34a',
    secondary: '#FFD700',
    bg: '#010a04',
    surface: '#041208',
    border: '#082014',
    desc: 'God of Mischief green and gold',
  },
  {
    key: 'hulk',
    name: 'Hulk',
    icon: '💚',
    primary: '#15803d',
    secondary: '#7C3AED',
    bg: '#010a04',
    surface: '#041208',
    border: '#083014',
    desc: 'Gamma radiation green and purple',
  },
]

export const THEME_MAP = Object.fromEntries(THEMES.map(t => [t.key, t]))

export function getTheme(key) {
  return THEME_MAP[key] ?? THEMES[0]
}

/** Returns CSS custom properties string for the given theme */
export function getThemeCSS(theme) {
  return `
    :root {
      --color-primary: ${theme.primary};
      --color-secondary: ${theme.secondary};
      --color-bg: ${theme.bg};
      --color-surface: ${theme.surface};
      --color-border: ${theme.border};
    }
  `
}
