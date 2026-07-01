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
        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-orbit-surface transition-colors"
      >
        <span className="flex items-center gap-2 text-zinc-300">
          <Palette size={16} className="text-accent" /> Appearance
        </span>
        <ChevronRight size={16} className="text-zinc-500" />
      </button>
    )
  }

  return (
    <div className="px-4 py-4 space-y-5 border-t border-orbit-border">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Palette size={16} className="text-accent" /> Appearance
        </h4>
        <button onClick={() => setExpanded(false)} className="text-xs text-zinc-500 hover:text-zinc-300">
          Done
        </button>
      </div>

      <div>
        <p className="text-xs text-zinc-500 mb-2 font-medium">Color mode</p>
        <div className="flex gap-1 p-1 rounded-xl bg-orbit-surface-2">
          {COLOR_MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setColorMode(id)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${
                settings.colorMode === id
                  ? 'bg-orbit-accent text-orbit-bg'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-zinc-500 mb-2 font-medium">Theme</p>
        <div className="grid grid-cols-2 gap-2">
          {THEME_PRESETS.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setThemeId(theme.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                settings.themeId === theme.id
                  ? 'border-orbit-accent ring-1 ring-orbit-accent/40'
                  : 'border-orbit-border hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full" style={{ background: theme.accent }} />
                <span className="text-xs font-medium">{theme.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-zinc-500 mb-2 font-medium">Day colors</p>
        <p className="text-[11px] text-zinc-600 mb-3">Pick accent colors for weekdays — shown as dots in Week/Day views</p>
        <div className="space-y-2">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs w-8 text-zinc-400">{label}</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                <button
                  onClick={() => setWeekdayColor(i, null)}
                  className={`w-6 h-6 rounded-full border text-[8px] flex items-center justify-center ${
                    !settings.weekdayColors[i] ? 'border-orbit-accent' : 'border-orbit-border text-zinc-600'
                  }`}
                >
                  ∅
                </button>
                {DAY_COLOR_SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setWeekdayColor(i, c)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      settings.weekdayColors[i] === c ? 'border-white scale-110' : 'border-transparent'
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
