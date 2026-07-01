import { useState } from 'react'
import { ChevronRight, Monitor, Moon, Palette, Sun } from 'lucide-react'
import {
  DAY_COLOR_SWATCHES,
  THEME_PRESETS,
  WEEKDAY_LABELS,
  type ColorMode,
} from '../lib/appearance'
import { useAppearance } from '../context/AppearanceContext'

const COLOR_MODES: { id: ColorMode; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
]

export function AppearanceSettingsPanel() {
  const { settings, setColorMode, setThemeId, setWeekdayColor } = useAppearance()
  const [expanded, setExpanded] = useState(false)

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-sm hover:bg-orbit-surface transition-colors"
      >
        <span className="flex items-center gap-2.5 text-zinc-300">
          <div className="w-8 h-8 rounded-xl bg-orbit-accent/10 flex items-center justify-center">
            <Palette size={16} className="text-accent" />
          </div>
          Appearance
        </span>
        <ChevronRight size={16} className="text-zinc-500" />
      </button>
    )
  }

  return (
    <div className="px-4 py-4 space-y-6 border-t border-orbit-border">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Palette size={16} className="text-accent" /> Appearance
        </h4>
        <button onClick={() => setExpanded(false)} className="text-xs text-accent font-medium hover:opacity-80">
          Done
        </button>
      </div>

      <div>
        <p className="text-xs text-zinc-500 mb-3 font-semibold uppercase tracking-wide">Color mode</p>
        <div className="orbit-segmented">
          {COLOR_MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setColorMode(id)}
              className="orbit-segmented-item flex items-center justify-center gap-1"
              data-active={settings.colorMode === id ? 'true' : undefined}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-zinc-500 mb-3 font-semibold uppercase tracking-wide">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {THEME_PRESETS.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setThemeId(theme.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                settings.themeId === theme.id
                  ? 'border-orbit-accent bg-orbit-accent/8 ring-2 ring-orbit-accent/30'
                  : 'border-orbit-border hover:border-zinc-600'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full shadow-sm border-2 border-white/10"
                style={{ background: theme.accent }}
              />
              <span className="text-[10px] font-semibold text-center leading-tight">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-zinc-500 mb-1 font-semibold uppercase tracking-wide">Day colors</p>
        <p className="text-[11px] text-zinc-600 mb-4">Accent colors for weekdays in Week/Day views</p>
        <div className="space-y-3">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs w-8 font-medium text-zinc-400">{label}</span>
              <div className="flex flex-wrap gap-2 flex-1">
                <button
                  onClick={() => setWeekdayColor(i, null)}
                  className={`w-7 h-7 rounded-full border-2 text-[9px] flex items-center justify-center transition-transform hover:scale-110 ${
                    !settings.weekdayColors[i] ? 'border-orbit-accent scale-110' : 'border-orbit-border text-zinc-600'
                  }`}
                >
                  ∅
                </button>
                {DAY_COLOR_SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setWeekdayColor(i, c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      settings.weekdayColors[i] === c ? 'border-white scale-110 shadow-md' : 'border-transparent'
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
