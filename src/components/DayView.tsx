import { format, isSameDay, parseISO } from 'date-fns'
import { Clock, List, Timer } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAppearance } from '../context/AppearanceContext'
import { getDayColor } from '../lib/appearance'
import { EventCard } from './EventCard'
import { computeFreeGaps, formatTimeRange } from '../lib/utils'

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7)

function GapsView({ dayEvents, date }: { dayEvents: { start: string; end: string; id: string; title: string }[]; date: Date }) {
  const gaps = computeFreeGaps(dayEvents, date)

  if (gaps.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        <Timer size={28} className="mx-auto mb-2 opacity-40" />
        <p className="text-sm">No open gaps today</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {gaps.map((gap, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-orbit-border bg-orbit-surface-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Free time</p>
              <p className="text-sm text-zinc-500">{formatTimeRange(gap.start, gap.end)}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-500 font-medium">
              {gap.durationMinutes >= 60
                ? `${Math.floor(gap.durationMinutes / 60)}h ${gap.durationMinutes % 60}m`
                : `${gap.durationMinutes} min`}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function DayView() {
  const { state, dispatch } = useApp()
  const { settings } = useAppearance()
  const date = parseISO(state.selectedDate + 'T12:00:00')
  const dayColor = getDayColor(settings, date)
  const dayEvents = state.events
    .filter((e) => isSameDay(parseISO(e.start), date))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  const mode = state.dayViewMode

  return (
    <div className="space-y-3 animate-slide-up">
      {dayColor && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: `${dayColor}18`, borderLeft: `3px solid ${dayColor}` }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: dayColor }} />
          <span className="text-zinc-400">Custom color for {format(date, 'EEEE')}</span>
        </div>
      )}
      <div className="flex gap-1 p-1 rounded-lg bg-orbit-surface-2 border border-orbit-border">
        <button
          onClick={() => dispatch({ type: 'SET_DAY_VIEW_MODE', mode: 'list' })}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1 transition-all ${
            mode === 'list' ? 'bg-orbit-accent text-orbit-bg' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <List size={14} /> List
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_DAY_VIEW_MODE', mode: 'gaps' })}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1 transition-all ${
            mode === 'gaps' ? 'bg-orbit-accent text-orbit-bg' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Timer size={14} /> Gaps
        </button>
      </div>

      {mode === 'gaps' ? (
        <GapsView dayEvents={dayEvents} date={date} />
      ) : dayEvents.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <Clock size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No events today</p>
        </div>
      ) : (
        <>
          <div className="relative">
            {HOURS.map((hour) => {
              const hourEvents = dayEvents.filter((e) => new Date(e.start).getHours() === hour)
              if (hourEvents.length === 0) return null
              return (
                <div key={hour} className="flex gap-3 mb-3">
                  <div className="w-14 shrink-0 text-xs text-zinc-600 pt-3 text-right">
                    {format(new Date().setHours(hour, 0), 'h a')}
                  </div>
                  <div className="flex-1 space-y-2 border-l border-orbit-border pl-3">
                    {hourEvents.map((e) => (
                      <EventCard key={e.id} event={e} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          {dayEvents.filter((e) => {
            const h = new Date(e.start).getHours()
            return h < 7 || h >= 21
          }).length > 0 && (
            <div className="space-y-2 pt-2 border-t border-orbit-border">
              <p className="text-xs text-zinc-600 uppercase tracking-wide">Other</p>
              {dayEvents
                .filter((e) => {
                  const h = new Date(e.start).getHours()
                  return h < 7 || h >= 21
                })
                .map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
