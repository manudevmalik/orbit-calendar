import { Bell, MapPin } from 'lucide-react'
import { EVENT_TYPE_CONFIG, SHARING_LABELS } from '../data/constants'
import type { CalendarEvent, EventType, SharingLevel } from '../types'
import { formatTimeRange } from '../lib/utils'
import { Badge } from './ui/Badge'

interface EventCardProps {
  event: CalendarEvent
  compact?: boolean
  onClick?: () => void
}

export function EventCard({ event, compact, onClick }: EventCardProps) {
  const config = EVENT_TYPE_CONFIG[event.type]
  const sharing = SHARING_LABELS[event.sharing]

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl p-3.5 transition-all duration-200 hover:bg-orbit-surface border border-orbit-border hover:border-orbit-accent/20 hover:shadow-sm"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: config.color,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
          style={{ background: config.bg }}
        >
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate tracking-tight">{event.title}</h3>
            {event.reminder && (
              <Bell size={12} className="text-zinc-500 shrink-0" aria-label="Reminder set" />
            )}
          </div>
          {!compact && (
            <>
              <p className="text-xs text-zinc-500 mt-1 font-medium tabular-nums">
                {formatTimeRange(event.start, event.end)}
              </p>
              {event.location && (
                <p className="text-xs text-zinc-600 flex items-center gap-1 mt-1">
                  <MapPin size={11} className="shrink-0" />
                  <span className="truncate">{event.location}</span>
                </p>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge variant="default" size="sm">
            {config.label}
          </Badge>
          {event.sharing !== 'friends' && event.sharing !== 'public' && (
            <span className="text-[10px] text-zinc-600" title={sharing.label}>
              {sharing.label}
            </span>
          )}
        </div>
      </div>
      {event.source === 'ai' && !compact && (
        <div className="mt-2 ml-11">
          <Badge variant="accent" size="sm">
            AI suggested
          </Badge>
        </div>
      )}
    </button>
  )
}

export function EventTypeBadge({ type }: { type: EventType }) {
  const config = EVENT_TYPE_CONFIG[type]
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ color: config.color, background: config.bg }}
    >
      {config.emoji} {config.label}
    </span>
  )
}

export function SharingBadge({ level }: { level: SharingLevel }) {
  const s = SHARING_LABELS[level]
  return (
    <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
      {s.label}
    </span>
  )
}
