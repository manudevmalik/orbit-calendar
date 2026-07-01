import { addDays, startOfWeek, format, isSameDay, parseISO } from 'date-fns'
import { useApp } from '../context/AppContext'
import { useAppearance } from '../context/AppearanceContext'
import { getDayColor } from '../lib/appearance'
import { EVENT_TYPE_CONFIG } from '../data/constants'

export function WeekView() {
  const { state, dispatch } = useApp()
  const { settings } = useAppearance()
  const baseDate = parseISO(state.selectedDate + 'T12:00:00')
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 })
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i))
  const today = new Date()

  const periods = ['7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p']

  return (
    <div className="animate-orbit-slide-up overflow-x-auto -mx-4 px-4">
      <div className="min-w-[500px]">
        <div className="grid grid-cols-6 gap-1.5 mb-3">
          <div />
          {days.map((day) => {
            const isToday = isSameDay(day, today)
            const dayColor = getDayColor(settings, day)
            return (
              <button
                key={day.toISOString()}
                onClick={() => dispatch({ type: 'SET_DATE', date: format(day, 'yyyy-MM-dd') })}
                className={`text-center py-2.5 rounded-xl transition-all duration-200 ${
                  isToday
                    ? 'bg-orbit-accent/15 ring-2 ring-orbit-accent/30 shadow-sm'
                    : 'hover:bg-orbit-surface-2 border border-transparent hover:border-orbit-border'
                }`}
                style={dayColor && !isToday ? { background: `${dayColor}18` } : undefined}
              >
                <div className="text-[10px] text-zinc-600 uppercase font-semibold flex items-center justify-center gap-1">
                  {format(day, 'EEE')}
                  {dayColor && (
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dayColor }} />
                  )}
                </div>
                <div className={`text-base font-bold tabular-nums ${isToday ? 'text-accent' : ''}`}>
                  {format(day, 'd')}
                </div>
              </button>
            )
          })}
        </div>

        <div className="space-y-1">
          {periods.map((label, pi) => {
            const hour = pi + 7
            return (
              <div key={label} className="grid grid-cols-6 gap-1.5 items-stretch">
                <div className="text-[10px] text-zinc-600 py-1.5 text-right pr-2 font-medium tabular-nums">{label}</div>
                {days.map((day) => {
                  const cellEvents = state.events.filter((e) => {
                    const start = parseISO(e.start)
                    return isSameDay(start, day) && start.getHours() === hour
                  })
                  const isToday = isSameDay(day, today)
                  return (
                    <div
                      key={day.toISOString() + label}
                      className={`min-h-[32px] rounded-lg p-0.5 transition-colors ${
                        isToday ? 'bg-orbit-accent/5' : 'bg-orbit-surface/50'
                      }`}
                    >
                      {cellEvents.map((e) => {
                        const cfg = EVENT_TYPE_CONFIG[e.type]
                        return (
                          <div
                            key={e.id}
                            className="text-[9px] font-semibold truncate rounded-md px-1.5 py-0.5 mb-0.5 border-l-2"
                            style={{
                              background: cfg.bg,
                              color: cfg.color,
                              borderLeftColor: cfg.color,
                            }}
                            title={e.title}
                          >
                            {e.title}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
