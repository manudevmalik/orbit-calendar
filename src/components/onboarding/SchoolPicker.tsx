import { useState } from 'react'
import { Search, Check, Clock } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { searchSchools, getSchoolById } from '../../data/schools'
import type { ScheduleRotation } from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { OnboardingShell } from './OnboardingProgress'

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
      <OnboardingShell step={2} total={4}>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Today's schedule type</h2>
        <p className="text-zinc-500 mb-2">{school.name}</p>
        <p className="text-sm text-zinc-400 mb-6">
          {school.userCount ?? 47} classmates at {school.name.split(' ')[0]} use Orbit (demo)
        </p>

        <div className="flex-1 space-y-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setRotation(v.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${
                rotation === v.id
                  ? 'border-orbit-accent bg-orbit-accent/10 ring-1 ring-orbit-accent/20'
                  : 'border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface hover:border-orbit-accent/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{v.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{v.periods.length} periods</p>
                </div>
                {rotation === v.id && <Check size={20} className="text-accent" />}
              </div>
            </button>
          ))}
        </div>

        <Button fullWidth size="lg" onClick={handleFinalConfirm} className="mt-6">
          Continue
        </Button>
      </OnboardingShell>
    )
  }

  if (showPreview && school) {
    const activePeriods = variants.find((v) => v.id === 'regular')?.periods ?? school.periods
    return (
      <OnboardingShell step={2} total={4}>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Schedule preview</h2>
        <p className="text-zinc-500 mb-6">{school.name} · {school.city}, {school.state}</p>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {activePeriods.map((p) => (
            <Card key={p.name} padding="sm" className="!rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{p.name}</span>
                <span className="text-sm text-zinc-500 flex items-center gap-1 tabular-nums">
                  <Clock size={14} /> {p.start} – {p.end}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <Button fullWidth size="lg" onClick={handleConfirmSchedule}>
            Confirm schedule
          </Button>
          <button
            onClick={() => setShowPreview(false)}
            className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Pick a different school
          </button>
        </div>
      </OnboardingShell>
    )
  }

  return (
    <OnboardingShell step={1} total={4}>
      <h2 className="text-2xl font-bold tracking-tight mb-1">Find your school</h2>
      <p className="text-zinc-500 mb-6">We'll auto-fill your bell schedule</p>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search schools..."
          className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-orbit-surface-2 border border-orbit-border focus:border-orbit-accent focus:outline-none focus:ring-2 focus:ring-orbit-accent/20 transition-all"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {results.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={`w-full text-left p-4 rounded-2xl transition-all border ${
              selected === s.id
                ? 'border-orbit-accent bg-orbit-accent/10 ring-1 ring-orbit-accent/20'
                : 'border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface hover:border-orbit-accent/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-zinc-500">{s.city}, {s.state}</p>
                {s.userCount && (
                  <p className="text-xs text-accent mt-1 font-medium">{s.userCount} students on Orbit</p>
                )}
              </div>
              {selected === s.id && <Check size={20} className="text-accent" />}
            </div>
          </button>
        ))}
      </div>

      <Button
        fullWidth
        size="lg"
        onClick={handlePreview}
        disabled={!selected}
        className="mt-4"
      >
        Continue
      </Button>
    </OnboardingShell>
  )
}
