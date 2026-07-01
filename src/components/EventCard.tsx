import { EVENT_TYPE_CONFIG, SHARING_LABELS } from '../data/constants'
import type { CalendarEvent, EventType, SharingLevel } from '../types'
import { formatTimeRange } from '../lib/utils'
import { Bell, MapPin } from 'lucide-react'

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
      className="w-full text-left rounded-xl p-3 transition-colors hover:bg-orbit-surface border border-orbit-border"
      style={{ borderLeftWidth: 3, borderLeftColor: config.color }}
    >
      <div className="flex items-start gap-2">
        <div
          className="w-2 h-2 rounded-full shrink-0 mt-1.5"
          style={{ background: config.color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">{event.title}</h3>
            {event.reminder && (
              <Bell size={12} className="text-zinc-500 shrink-0" aria-label="Reminder set" />
            )}
          </div>
          {!compact && (
            <>
              <p className="text-xs text-zinc-500 mt-0.5">
                {formatTimeRange(event.start, event.end)}
              </p>
              {event.location && (
                <p className="text-xs text-zinc-600 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} /> {event.location}
                </p>
              )}
            </>
          )}
        </div>
        {event.sharing !== 'friends' && event.sharing !== 'public' && (
          <span className="text-[10px] text-zinc-600 shrink-0" title={sharing.label}>
            {sharing.label}
          </span>
        )}
      </div>
      {event.source === 'ai' && !compact && (
        <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-md bg-orbit-surface text-zinc-500">
          AI suggested
        </span>
      )}
    </button>
  )
}

export function EventTypeBadge({ type }: { type: EventType }) {
  const config = EVENT_TYPE_CONFIG[type]
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border border-orbit-border"
      style={{ color: config.color }}
    >
      {config.label}
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
