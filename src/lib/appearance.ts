export type ColorMode = 'light' | 'dark' | 'system'

export type ThemeId =
  | 'default'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'lavender'
  | 'classic-snap'

export interface ThemePreset {
  id: ThemeId
  label: string
  accent: string
  accentDim: string
  bgTint: string
  surfaceTint: string
}

export interface AppearanceSettings {
  colorMode: ColorMode
  themeId: ThemeId
  weekdayColors: Record<number, string | null>
  dateColors: Record<string, string | null>
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'default', label: 'Default (Amber)', accent: '#e8b923', accentDim: '#b8921c', bgTint: '#0a0a0a', surfaceTint: '#141414' },
  { id: 'ocean', label: 'Ocean', accent: '#38bdf8', accentDim: '#0284c7', bgTint: '#071018', surfaceTint: '#0c1a24' },
  { id: 'forest', label: 'Forest', accent: '#34d399', accentDim: '#059669', bgTint: '#071210', surfaceTint: '#0c1a16' },
  { id: 'sunset', label: 'Sunset', accent: '#fb923c', accentDim: '#ea580c', bgTint: '#120c08', surfaceTint: '#1a120c' },
  { id: 'lavender', label: 'Lavender', accent: '#c084fc', accentDim: '#9333ea', bgTint: '#0e0a14', surfaceTint: '#16101e' },
  { id: 'classic-snap', label: 'Classic Snap', accent: '#FFFC00', accentDim: '#d4d000', bgTint: '#0a0a0a', surfaceTint: '#141414' },
]

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const DAY_COLOR_SWATCHES = [
  '#e8b923', '#38bdf8', '#34d399', '#fb923c', '#c084fc', '#f472b6', '#ef4444', '#a3a3a3',
]

const STORAGE_KEY = 'orbit-appearance'

export function defaultAppearance(): AppearanceSettings {
  return {
    colorMode: 'dark',
    themeId: 'default',
    weekdayColors: {},
    dateColors: {},
  }
}

export function loadAppearance(): AppearanceSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultAppearance()
    return { ...defaultAppearance(), ...JSON.parse(raw) }
  } catch {
    return defaultAppearance()
  }
}

export function saveAppearance(settings: AppearanceSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // quota exceeded
  }
}

function resolveColorMode(mode: ColorMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return mode
}

export function applyAppearance(settings: AppearanceSettings): void {
  const theme = THEME_PRESETS.find((t) => t.id === settings.themeId) ?? THEME_PRESETS[0]
  const resolved = resolveColorMode(settings.colorMode)
  const root = document.documentElement

  const isLight = resolved === 'light'
  const bg = isLight ? lighten(theme.bgTint, 0.92) : theme.bgTint
  const surface = isLight ? '#f5f5f5' : theme.surfaceTint
  const surface2 = isLight ? '#ebebeb' : adjustBrightness(theme.surfaceTint, 1.15)
  const border = isLight ? '#d4d4d4' : '#2a2a2a'
  const text = isLight ? '#171717' : '#fafafa'

  root.style.setProperty('--color-orbit-accent', theme.accent)
  root.style.setProperty('--color-orbit-accent-dim', theme.accentDim)
  root.style.setProperty('--color-orbit-bg', bg)
  root.style.setProperty('--color-orbit-surface', surface)
  root.style.setProperty('--color-orbit-surface-2', surface2)
  root.style.setProperty('--color-orbit-border', border)
  root.style.setProperty('--color-orbit-text', text)
  root.style.setProperty('--color-orbit-purple', theme.accent)
  root.style.setProperty('--color-orbit-orange', theme.accent)
  root.dataset.colorMode = resolved
  root.dataset.theme = settings.themeId
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount)
}

function adjustBrightness(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(Math.min(255, r * factor), Math.min(255, g * factor), Math.min(255, b * factor))
}

export function getDayColor(
  settings: AppearanceSettings,
  date: Date,
): string | null {
  const dateKey = date.toISOString().slice(0, 10)
  if (settings.dateColors[dateKey]) return settings.dateColors[dateKey]
  const dow = (date.getDay() + 6) % 7
  return settings.weekdayColors[dow] ?? null
}
