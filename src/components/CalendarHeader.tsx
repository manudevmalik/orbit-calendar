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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onDateChange(format(subDays(date, view === 'week' ? 7 : 1), 'yyyy-MM-dd'))}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg">
            {view === 'day' ? format(date, 'EEEE') : view === 'week' ? 'This Week' : 'Agenda'}
          </h2>
          <p className="text-sm text-zinc-400">{format(date, 'MMMM d, yyyy')}</p>
        </div>
        <button
          onClick={() => onDateChange(format(addDays(date, view === 'week' ? 7 : 1), 'yyyy-MM-dd'))}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-orbit-surface-2">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              view === v.id
                ? 'bg-orbit-accent text-orbit-bg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}
