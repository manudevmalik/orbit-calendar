import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { parseNaturalLanguage } from '../lib/utils'
import type { RecurrenceRule } from '../types'

const RECURRENCE_OPTIONS: { id: RecurrenceRule; label: string }[] = [
  { id: 'none', label: 'Once' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'mwf', label: 'MWF' },
]

export function HomeNaturalLanguageBar() {
  const { state, dispatch } = useApp()
  const [input, setInput] = useState('')
  const [recurrence, setRecurrence] = useState<RecurrenceRule>('none')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setTimeout(() => {
      const result = parseNaturalLanguage(input, state.profile.schoolId)
      if (result.success && result.reviewItem) {
        dispatch({
          type: 'ADD_REVIEW',
          item: { ...result.reviewItem, recurrence },
        })
        setMessage('Added to review queue')
        setInput('')
      } else {
        setMessage(result.message)
      }
      setLoading(false)
      setTimeout(() => setMessage(''), 3000)
    }, 500)
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bio lab every Tuesday 3rd period"
          className="w-full pl-4 pr-16 py-3 rounded-xl bg-orbit-surface-2 border border-orbit-border focus:border-orbit-accent focus:outline-none text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold btn-primary disabled:opacity-40"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        </button>
      </form>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-zinc-500">Repeats:</span>
        {RECURRENCE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setRecurrence(opt.id)}
            className={`text-[10px] px-2 py-0.5 rounded-md transition-colors ${
              recurrence === opt.id
                ? 'bg-orbit-accent/15 text-accent'
                : 'bg-orbit-surface text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {message && <p className="text-xs text-green-500">{message}</p>}
    </div>
  )
}
