import { addDays, parseISO, startOfDay } from 'date-fns'
import { Check, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { EVENT_TYPE_CONFIG } from '../data/constants'
import { formatDateShort } from '../lib/utils'
import { Badge } from './ui/Badge'
import { Card } from './ui/Card'
import { SectionHeader } from './ui/SectionHeader'

export function TasksWidget() {
  const { state, dispatch } = useApp()
  const today = startOfDay(new Date())

  const dueTasks = state.events
    .filter(
      (e) =>
        (e.type === 'assignment' || e.type === 'exam') &&
        !e.completed &&
        parseISO(e.start) <= addDays(today, 7),
    )
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 6)

  if (dueTasks.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-success-muted)] flex items-center justify-center">
            <CheckCircle2 size={20} className="text-[var(--color-success)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Tasks</h3>
            <p className="text-sm text-zinc-500 mt-0.5">All caught up for the next 7 days</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="none">
      <div className="p-4 pb-2">
        <SectionHeader
          title="Tasks"
          subtitle={`${dueTasks.length} due this week`}
          action={<Badge variant="warning" size="sm">{dueTasks.length}</Badge>}
        />
      </div>
      <div className="px-2 pb-2">
        {dueTasks.map((task) => {
          const config = EVENT_TYPE_CONFIG[task.type]
          const isOverdue = parseISO(task.start) < today
          return (
            <div
              key={task.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orbit-surface transition-colors group"
            >
              <button
                onClick={() => dispatch({ type: 'COMPLETE_TASK', id: task.id })}
                className="shrink-0 w-5 h-5 rounded-md border-2 border-zinc-600 group-hover:border-orbit-accent flex items-center justify-center transition-all duration-200"
                aria-label={`Complete ${task.title}`}
              >
                {task.completed && <Check size={12} className="text-[var(--color-success)]" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-zinc-500">{config.label}</span>
                  <span className="text-zinc-700">·</span>
                  <span className={`text-xs tabular-nums ${isOverdue ? 'text-[var(--color-danger)] font-medium' : 'text-zinc-500'}`}>
                    {formatDateShort(task.start)}
                  </span>
                </div>
              </div>
              <span className="text-base shrink-0">{config.emoji}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
