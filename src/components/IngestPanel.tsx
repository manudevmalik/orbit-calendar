import { useState } from 'react'
import { Sparkles, Check, X, FileImage, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { parseNaturalLanguage } from '../lib/utils'
import { EventTypeBadge } from './EventCard'
import { formatTimeRange, formatDateShort } from '../lib/utils'
import type { RecurrenceRule } from '../types'

const RECURRENCE_OPTIONS: { id: RecurrenceRule; label: string }[] = [
  { id: 'none', label: 'Once' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'mwf', label: 'MWF' },
]

export function NaturalLanguageAdd() {
  const { state, dispatch } = useApp()
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [recurrence, setRecurrence] = useState<RecurrenceRule>('none')

  const examples = [
    'Bio lab every Tuesday 3rd period',
    'Soccer practice every Monday 5th period',
    'History essay due Friday',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const result = parseNaturalLanguage(input, state.profile.schoolId)
      setMessage(result.message)
      if (result.success && result.reviewItem) {
        dispatch({ type: 'ADD_REVIEW', item: { ...result.reviewItem, recurrence } })
        setInput('')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-accent" />
        <h3 className="font-semibold">Talk to Orbit</h3>
      </div>
      <p className="text-sm text-zinc-400">Describe an event in plain English — AI will structure it for you.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Try "Bio lab every Tuesday 3rd period"'
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-orbit-surface-2 border border-orbit-border focus:border-orbit-accent focus:outline-none resize-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-full py-3 rounded-xl font-semibold btn-primary disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'Parsing...' : 'Add with AI'}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">Repeats:</span>
        {RECURRENCE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setRecurrence(opt.id)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              recurrence === opt.id
                ? 'bg-orbit-accent/15 text-accent'
                : 'bg-orbit-surface-2 text-zinc-400 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {message && (
        <p className={`text-sm p-3 rounded-xl ${message.includes('Got it') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => setInput(ex)}
            className="text-xs px-3 py-1.5 rounded-full bg-orbit-surface-2 text-zinc-400 hover:text-white hover:bg-orbit-surface transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}

export function PhotoImport() {
  const { dispatch } = useApp()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleImport = () => {
    setLoading(true)
    setTimeout(() => {
      dispatch({ type: 'IMPORT_SAMPLE' })
      setLoading(false)
      setDone(true)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileImage size={20} className="text-zinc-400" />
        <h3 className="font-semibold">Import syllabus</h3>
      </div>
      <p className="text-sm text-zinc-400">Snap a photo or upload a PDF — we'll extract deadlines and events.</p>

      <div
        onClick={!loading && !done ? handleImport : undefined}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          done ? 'border-green-500/50 bg-green-500/5' : 'border-orbit-border hover:border-zinc-600 cursor-pointer'
        }`}
      >
        {loading ? (
          <div className="space-y-2">
            <Loader2 size={32} className="mx-auto animate-spin text-accent" />
            <p className="text-sm text-zinc-400">Scanning syllabus...</p>
            <p className="text-xs text-zinc-500">Detecting dates, assignments, exam blocks</p>
          </div>
        ) : done ? (
          <div className="space-y-2">
            <Check size={32} className="mx-auto text-green-400" />
            <p className="font-semibold text-green-400">5 events found!</p>
            <p className="text-sm text-zinc-400">Check the review queue below</p>
          </div>
        ) : (
          <div className="space-y-2">
            <FileImage size={32} className="mx-auto text-zinc-500" />
            <p className="font-medium">Tap to simulate photo import</p>
            <p className="text-xs text-zinc-500">Demo: parses sample syllabus data</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function ReviewQueue() {
  const { state, dispatch } = useApp()
  const items = state.reviewQueue

  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-zinc-500 text-sm">
        Review queue is empty
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          Review queue
          <span className="text-xs px-2 py-0.5 rounded-full bg-orbit-accent/15 text-accent">{items.length}</span>
        </h3>
        <button
          onClick={() => dispatch({ type: 'APPROVE_ALL_REVIEWS' })}
          className="text-xs text-accent font-medium hover:opacity-80"
        >
          Approve all
        </button>
      </div>
      <p className="text-xs text-zinc-500">AI-suggested events need your OK before publishing.</p>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-orbit-surface-2 border border-orbit-border animate-slide-up">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {formatDateShort(item.start)} · {formatTimeRange(item.start, item.end)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <EventTypeBadge type={item.type} />
                  <span className="text-[10px] text-zinc-500">
                    {Math.round(item.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-2 italic">"{item.reason}"</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => dispatch({ type: 'APPROVE_REVIEW', id: item.id })}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 flex items-center justify-center gap-1"
              >
                <Check size={16} /> Approve
              </button>
              <button
                onClick={() => dispatch({ type: 'REJECT_REVIEW', id: item.id })}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-1"
              >
                <X size={16} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
