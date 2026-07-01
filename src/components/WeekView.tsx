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
    <div className="animate-slide-up overflow-x-auto -mx-4 px-4">
      <div className="min-w-[500px]">
        {/* Day headers */}
        <div className="grid grid-cols-6 gap-1 mb-2">
          <div />
          {days.map((day) => {
            const isToday = isSameDay(day, today)
            const dayColor = getDayColor(settings, day)
            return (
              <button
                key={day.toISOString()}
                onClick={() => dispatch({ type: 'SET_DATE', date: format(day, 'yyyy-MM-dd') })}
                className={`text-center py-2 rounded-lg transition-colors relative ${
                  isToday ? 'bg-orbit-accent/15 ring-1 ring-orbit-accent/40' : 'hover:bg-orbit-surface-2'
                }`}
                style={dayColor && !isToday ? { background: `${dayColor}18` } : undefined}
              >
                <div className="text-[10px] text-zinc-600 uppercase flex items-center justify-center gap-1">
                  {format(day, 'EEE')}
                  {dayColor && (
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dayColor }} />
                  )}
                </div>
                <div className={`text-sm font-semibold ${isToday ? 'text-accent' : ''}`}>
                  {format(day, 'd')}
                </div>
              </button>
            )
          })}
        </div>

        {/* Period grid */}
        <div className="space-y-0.5">
          {periods.map((label, pi) => {
            const hour = pi + 7
            return (
              <div key={label} className="grid grid-cols-6 gap-1 items-stretch">
                <div className="text-[10px] text-zinc-600 py-1 text-right pr-1">{label}</div>
                {days.map((day) => {
                  const cellEvents = state.events.filter((e) => {
                    const start = parseISO(e.start)
                    return isSameDay(start, day) && start.getHours() === hour
                  })
                  return (
                    <div key={day.toISOString() + label} className="min-h-[28px] rounded-md bg-orbit-surface/50 p-0.5">
                      {cellEvents.map((e) => {
                        const cfg = EVENT_TYPE_CONFIG[e.type]
                        return (
                          <div
                            key={e.id}
                            className="text-[9px] font-medium truncate rounded px-1 py-0.5 mb-0.5"
                            style={{ background: cfg.bg, color: cfg.color }}
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
