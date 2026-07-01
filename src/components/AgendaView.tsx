import { addDays, format, isSameDay, parseISO, isBefore, startOfDay } from 'date-fns'
import { Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { EventCard } from './EventCard'
import { EVENT_TYPE_CONFIG } from '../data/constants'
import { formatTimeRange } from '../lib/utils'
import { Badge } from './ui/Badge'
import { Card } from './ui/Card'

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
    <div className="space-y-6 animate-orbit-slide-up">
      {dueToday.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="warning" dot>Due today</Badge>
          </div>
          <div className="space-y-2">
            {dueToday.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {dueSoon.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="danger" dot>Coming up</Badge>
          </div>
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
            <div className={`flex items-center gap-2 mb-3 ${isToday ? 'orbit-today-highlight rounded-xl px-3 py-2 -mx-1' : ''}`}>
              <h3 className={`text-sm font-semibold tracking-tight ${isToday ? 'text-accent' : 'text-zinc-500'}`}>
                {isToday ? 'Today' : format(day, 'EEEE, MMM d')}
              </h3>
              {isToday && <Badge variant="accent" size="sm">Now</Badge>}
            </div>
            <div className="space-y-2">
              {dayEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )
      })}

      {upcoming.length === 0 && (
        <div className="orbit-empty-state py-12">
          <Sparkles size={32} className="orbit-empty-state-icon" />
          <p className="text-sm font-medium">Your agenda is clear</p>
          <p className="text-xs text-zinc-600 mt-1">Enjoy the free time</p>
        </div>
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
      <Card variant="hero" className="relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orbit-accent/15 flex items-center justify-center">
            <Sparkles size={22} className="text-accent" />
          </div>
          <div>
            <p className="orbit-section-label">Next up</p>
            <p className="font-bold text-lg tracking-tight mt-0.5">All clear</p>
            <p className="text-sm text-zinc-500">Nothing coming up — enjoy the break</p>
          </div>
        </div>
      </Card>
    )
  }

  const config = EVENT_TYPE_CONFIG[next.type]
  const minsUntil = Math.max(0, Math.round((new Date(next.start).getTime() - now.getTime()) / 60000))
  const countdown = minsUntil < 60 ? `${minsUntil} min` : `${Math.floor(minsUntil / 60)}h ${minsUntil % 60}m`

  return (
    <Card
      variant="hero"
      className="relative overflow-hidden"
      style={{ borderLeftWidth: 4, borderLeftColor: config.color }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl"
            style={{ background: config.bg }}
          >
            {config.emoji}
          </div>
          <div className="min-w-0">
            <p className="orbit-section-label">Next up</p>
            <h3 className="font-bold text-lg tracking-tight truncate mt-0.5">{next.title}</h3>
            <p className="text-sm text-zinc-500 mt-1 tabular-nums">
              {formatTimeRange(next.start, next.end)}
            </p>
            {next.location && (
              <p className="text-xs text-zinc-600 mt-0.5 truncate">{next.location}</p>
            )}
          </div>
        </div>
        <div className="shrink-0 text-center px-3 py-2 rounded-xl bg-orbit-accent/12 border border-orbit-accent/20">
          <p className="text-[10px] text-zinc-500 font-medium">in</p>
          <p className="font-bold text-accent text-sm tabular-nums">{countdown}</p>
        </div>
      </div>
      {next.reminder && (
        <p className="text-xs text-zinc-600 mt-3 ml-[60px]">Reminder {next.reminder} min before</p>
      )}
    </Card>
  )
}
