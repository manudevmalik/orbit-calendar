import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  applyAppearance,
  defaultAppearance,
  loadAppearance,
  saveAppearance,
  type AppearanceSettings,
  type ColorMode,
  type ThemeId,
} from '../lib/appearance'

interface AppearanceContextValue {
  settings: AppearanceSettings
  setColorMode: (mode: ColorMode) => void
  setThemeId: (id: ThemeId) => void
  setWeekdayColor: (dayIndex: number, color: string | null) => void
  setDateColor: (dateKey: string, color: string | null) => void
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(() => loadAppearance())

  useEffect(() => {
    applyAppearance(settings)
    saveAppearance(settings)
  }, [settings])

  useEffect(() => {
    if (settings.colorMode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = () => applyAppearance(settings)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [settings])

  const update = (patch: Partial<AppearanceSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  return (
    <AppearanceContext.Provider
      value={{
        settings,
        setColorMode: (colorMode) => update({ colorMode }),
        setThemeId: (themeId) => update({ themeId }),
        setWeekdayColor: (dayIndex, color) =>
          update({ weekdayColors: { ...settings.weekdayColors, [dayIndex]: color } }),
        setDateColor: (dateKey, color) =>
          update({ dateColors: { ...settings.dateColors, [dateKey]: color } }),
      }}
    >
      {children}
    </AppearanceContext.Provider>
  )
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext)
  if (!ctx) throw new Error('useAppearance must be used within AppearanceProvider')
  return ctx
}

export { defaultAppearance }
