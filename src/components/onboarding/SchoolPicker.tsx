import { useState } from 'react'
import { Search, Check, Clock } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { searchSchools, getSchoolById } from '../../data/schools'
import type { ScheduleRotation } from '../../types'

export function SchoolPicker() {
  const { dispatch } = useApp()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showRotation, setShowRotation] = useState(false)
  const [rotation, setRotation] = useState<ScheduleRotation>('regular')

  const results = searchSchools(query)
  const school = selected ? getSchoolById(selected) : null
  const variants = school?.scheduleVariants ?? []

  const handlePreview = () => {
    if (!selected) return
    setShowPreview(true)
  }

  const handleConfirmSchedule = () => {
    if (!selected) return
    setShowRotation(true)
  }

  const handleFinalConfirm = () => {
    if (!selected) return
    dispatch({ type: 'SET_SCHOOL', schoolId: selected })
    dispatch({ type: 'SET_SCHEDULE_ROTATION', rotation })
  }

  if (showRotation && school) {
    return (
      <div className="min-h-full flex flex-col p-6 animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Today's schedule type</h2>
        <p className="text-zinc-500 mb-2">{school.name}</p>
        <p className="text-sm text-zinc-400 mb-6">
          {school.userCount ?? 47} classmates at {school.name.split(' ')[0]} use Orbit (demo)
        </p>

        <div className="flex-1 space-y-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setRotation(v.id)}
              className={`w-full text-left p-4 rounded-xl transition-all border ${
                rotation === v.id
                  ? 'border-orbit-accent bg-orbit-accent/10'
                  : 'border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{v.label}</p>
                  <p className="text-xs text-zinc-500">{v.periods.length} periods</p>
                </div>
                {rotation === v.id && <Check size={20} className="text-accent" />}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleFinalConfirm}
          className="mt-6 w-full py-3.5 rounded-xl font-semibold btn-primary"
        >
          Continue
        </button>
      </div>
    )
  }

  if (showPreview && school) {
    const activePeriods = variants.find((v) => v.id === 'regular')?.periods ?? school.periods
    return (
      <div className="min-h-full flex flex-col p-6 animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Schedule preview</h2>
        <p className="text-zinc-500 mb-6">{school.name} · {school.city}, {school.state}</p>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {activePeriods.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between p-3 rounded-xl card"
            >
              <span className="font-medium text-sm">{p.name}</span>
              <span className="text-sm text-zinc-500 flex items-center gap-1">
                <Clock size={14} /> {p.start} – {p.end}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={handleConfirmSchedule}
            className="w-full py-3.5 rounded-xl font-semibold btn-primary"
          >
            Confirm schedule
          </button>
          <button
            onClick={() => setShowPreview(false)}
            className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-300"
          >
            Pick a different school
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col p-6 animate-slide-up">
      <h2 className="text-2xl font-bold mb-1">Find your school</h2>
      <p className="text-zinc-500 mb-6">We'll auto-fill your bell schedule</p>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search schools..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-orbit-surface-2 border border-orbit-border focus:border-orbit-accent focus:outline-none"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {results.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={`w-full text-left p-4 rounded-xl transition-all border ${
              selected === s.id
                ? 'border-orbit-accent bg-orbit-accent/10'
                : 'border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-zinc-500">{s.city}, {s.state}</p>
                {s.userCount && (
                  <p className="text-xs text-accent mt-0.5">{s.userCount} students on Orbit</p>
                )}
              </div>
              {selected === s.id && <Check size={20} className="text-accent" />}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handlePreview}
        disabled={!selected}
        className="mt-4 w-full py-3.5 rounded-xl font-semibold btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  )
}
