import { addDays, parseISO, startOfDay } from 'date-fns'
import { Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { EVENT_TYPE_CONFIG } from '../data/constants'
import { formatDateShort } from '../lib/utils'

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
      <div className="card p-4">
        <h3 className="font-medium text-sm mb-1">Tasks</h3>
        <p className="text-sm text-zinc-500">All caught up for the next 7 days</p>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">Tasks</h3>
        <span className="text-[10px] text-zinc-500">Due ≤ 7 days</span>
      </div>
      <div className="space-y-1">
        {dueTasks.map((task) => {
          const config = EVENT_TYPE_CONFIG[task.type]
          return (
            <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-orbit-surface transition-colors">
              <button
                onClick={() => dispatch({ type: 'COMPLETE_TASK', id: task.id })}
                className="shrink-0 w-5 h-5 rounded border-2 border-zinc-600 hover:border-orbit-accent flex items-center justify-center transition-colors"
                aria-label={`Complete ${task.title}`}
              >
                {task.completed && <Check size={12} className="text-green-500" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <p className="text-xs text-zinc-500">
                  {config.label} · {formatDateShort(task.start)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
