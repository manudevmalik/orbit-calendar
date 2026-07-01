import { format, isSameDay, parseISO } from 'date-fns'
import { Clock, List, Timer } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAppearance } from '../context/AppearanceContext'
import { getDayColor } from '../lib/appearance'
import { EventCard } from './EventCard'
import { computeFreeGaps, formatTimeRange } from '../lib/utils'
import { Badge } from './ui/Badge'

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7)

function GapsView({ dayEvents, date }: { dayEvents: { start: string; end: string; id: string; title: string }[]; date: Date }) {
  const gaps = computeFreeGaps(dayEvents, date)

  if (gaps.length === 0) {
    return (
      <div className="orbit-empty-state py-8">
        <Timer size={28} className="orbit-empty-state-icon" />
        <p className="text-sm font-medium">No open gaps today</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {gaps.map((gap, i) => (
        <div
          key={i}
          className="orbit-card p-4 !rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Free time</p>
              <p className="text-sm text-zinc-500 tabular-nums">{formatTimeRange(gap.start, gap.end)}</p>
            </div>
            <Badge variant="success" dot>
              {gap.durationMinutes >= 60
                ? `${Math.floor(gap.durationMinutes / 60)}h ${gap.durationMinutes % 60}m`
                : `${gap.durationMinutes} min`}
            </Badge>
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
  const isToday = isSameDay(date, new Date())
  const dayEvents = state.events
    .filter((e) => isSameDay(parseISO(e.start), date))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  const mode = state.dayViewMode

  return (
    <div className="space-y-3 animate-orbit-slide-up">
      {dayColor && (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
          style={{ background: `${dayColor}18`, borderLeft: `3px solid ${dayColor}` }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: dayColor }} />
          <span className="text-zinc-400 font-medium">Custom color for {format(date, 'EEEE')}</span>
        </div>
      )}

      {isToday && (
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm">Today</Badge>
          <span className="text-xs text-zinc-500">{format(date, 'EEEE, MMM d')}</span>
        </div>
      )}

      <div className="orbit-segmented">
        <button
          onClick={() => dispatch({ type: 'SET_DAY_VIEW_MODE', mode: 'list' })}
          className="orbit-segmented-item flex items-center justify-center gap-1"
          data-active={mode === 'list' ? 'true' : undefined}
        >
          <List size={14} /> List
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_DAY_VIEW_MODE', mode: 'gaps' })}
          className="orbit-segmented-item flex items-center justify-center gap-1"
          data-active={mode === 'gaps' ? 'true' : undefined}
        >
          <Timer size={14} /> Gaps
        </button>
      </div>

      {mode === 'gaps' ? (
        <GapsView dayEvents={dayEvents} date={date} />
      ) : dayEvents.length === 0 ? (
        <div className="orbit-empty-state py-12">
          <Clock size={32} className="orbit-empty-state-icon" />
          <p className="text-sm font-medium">No events today</p>
        </div>
      ) : (
        <>
          <div className="relative">
            {HOURS.map((hour) => {
              const hourEvents = dayEvents.filter((e) => new Date(e.start).getHours() === hour)
              if (hourEvents.length === 0) return null
              return (
                <div key={hour} className="flex gap-3 mb-4">
                  <div className="orbit-time-gutter">
                    {format(new Date().setHours(hour, 0), 'h a')}
                  </div>
                  <div className="flex-1 space-y-2 border-l-2 border-orbit-border/60 pl-4">
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
            <div className="space-y-2 pt-3 border-t border-orbit-border">
              <p className="orbit-section-label">Other</p>
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
