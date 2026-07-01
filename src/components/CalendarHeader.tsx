import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import type { CalendarView } from '../types'

interface CalendarHeaderProps {
  selectedDate: string
  view: CalendarView
  onDateChange: (date: string) => void
  onViewChange: (view: CalendarView) => void
}

const VIEWS: { id: CalendarView; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'agenda', label: 'Agenda' },
]

export function CalendarHeader({ selectedDate, view, onDateChange, onViewChange }: CalendarHeaderProps) {
  const date = new Date(selectedDate + 'T12:00:00')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onDateChange(format(subDays(date, view === 'week' ? 7 : 1), 'yyyy-MM-dd'))}
          className="p-2.5 rounded-xl hover:bg-orbit-surface-2 transition-colors border border-transparent hover:border-orbit-border"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg tracking-tight">
            {view === 'day' ? format(date, 'EEEE') : view === 'week' ? 'This Week' : 'Agenda'}
          </h2>
          <p className="text-sm text-zinc-400 tabular-nums">{format(date, 'MMMM d, yyyy')}</p>
        </div>
        <button
          onClick={() => onDateChange(format(addDays(date, view === 'week' ? 7 : 1), 'yyyy-MM-dd'))}
          className="p-2.5 rounded-xl hover:bg-orbit-surface-2 transition-colors border border-transparent hover:border-orbit-border"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="orbit-segmented">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            className="orbit-segmented-item"
            data-active={view === v.id ? 'true' : undefined}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}
