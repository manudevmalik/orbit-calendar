import { addDays, format, isSameDay, parseISO, isBefore, startOfDay } from 'date-fns'
import { useApp } from '../context/AppContext'
import { EventCard } from './EventCard'
import { EVENT_TYPE_CONFIG } from '../data/constants'

export function AgendaView() {
  const { state } = useApp()
  const today = startOfDay(new Date())
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i))

  const upcoming = state.events
    .filter((e) => !isBefore(parseISO(e.end), today))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  const dueToday = upcoming.filter(
    (e) => e.type === 'assignment' && isSameDay(parseISO(e.start), today),
  )
  const dueSoon = upcoming.filter(
    (e) =>
      (e.type === 'assignment' || e.type === 'exam') &&
      !isSameDay(parseISO(e.start), today) &&
      parseISO(e.start) <= addDays(today, 7),
  )

  return (
    <div className="space-y-6 animate-slide-up">
      {dueToday.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-amber-500 mb-2">Due today</h3>
          <div className="space-y-2">
            {dueToday.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {dueSoon.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-red-400 mb-2">Coming up</h3>
          <div className="space-y-2">
            {dueSoon.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {days.map((day) => {
        const dayEvents = upcoming.filter((e) => isSameDay(parseISO(e.start), day))
        if (dayEvents.length === 0) return null
        const isToday = isSameDay(day, today)
        return (
          <section key={day.toISOString()}>
            <h3 className={`text-sm font-medium mb-2 ${isToday ? 'text-accent' : 'text-zinc-500'}`}>
              {isToday ? 'Today' : format(day, 'EEEE, MMM d')}
            </h3>
            <div className="space-y-2">
              {dayEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )
      })}

      {upcoming.length === 0 && (
        <p className="text-center text-zinc-500 py-8 text-sm">Your agenda is clear</p>
      )}
    </div>
  )
}

export function NextUpWidget() {
  const { state } = useApp()
  const now = new Date()

  const next = state.events
    .filter((e) => new Date(e.end) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0]

  if (!next) {
    return (
      <div className="card p-4">
        <p className="text-sm text-zinc-500">All done for now</p>
        <p className="font-semibold text-lg mt-0.5">Nothing coming up</p>
      </div>
    )
  }

  const config = EVENT_TYPE_CONFIG[next.type]
  const minsUntil = Math.max(0, Math.round((new Date(next.start).getTime() - now.getTime()) / 60000))
  const countdown = minsUntil < 60 ? `${minsUntil} min` : `${Math.floor(minsUntil / 60)}h ${minsUntil % 60}m`

  return (
    <div className="card p-4" style={{ borderLeftWidth: 3, borderLeftColor: config.color }}>
      <p className="text-xs text-zinc-500 uppercase tracking-wide">Next up</p>
      <div className="mt-2">
        <h3 className="font-semibold text-lg truncate">{next.title}</h3>
        <p className="text-sm text-zinc-500">
          {next.location && `${next.location} · `}
          in <span className="text-accent font-medium">{countdown}</span>
        </p>
      </div>
      {next.reminder && (
        <p className="text-xs text-zinc-600 mt-2">Reminder {next.reminder} min before</p>
      )}
    </div>
  )
}
