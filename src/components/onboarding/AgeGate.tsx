import { useState } from 'react'
import { Rocket } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Button } from '../ui/Button'
import { OnboardingShell } from './OnboardingProgress'

export function AgeGate() {
  const { dispatch } = useApp()
  const [birthYear, setBirthYear] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const year = parseInt(birthYear)
    const age = new Date().getFullYear() - year
    if (isNaN(year) || age < 13) {
      setError('You must be 13 or older to use Orbit.')
      return
    }
    if (!name.trim()) {
      setError('What should friends call you?')
      return
    }
    dispatch({ type: 'VERIFY_AGE', name: name.trim() })
  }

  return (
    <OnboardingShell step={0} total={4}>
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-md"
          style={{ background: 'linear-gradient(135deg, var(--color-orbit-accent), #f97316)' }}
        >
          <span className="text-2xl font-bold text-orbit-bg">O</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Orbit</h1>
        <p className="text-zinc-500 mt-2 text-sm">Student calendar for you and your crew</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-4 flex-1">
        <div>
          <label className="block text-sm text-zinc-500 mb-1.5 font-medium">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maya, Alex, Jordan..."
            className="w-full px-4 py-3.5 rounded-2xl bg-orbit-surface-2 border border-orbit-border focus:border-orbit-accent focus:outline-none focus:ring-2 focus:ring-orbit-accent/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-500 mb-1.5 font-medium">Birth year</label>
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="2009"
            min="1990"
            max="2015"
            className="w-full px-4 py-3.5 rounded-2xl bg-orbit-surface-2 border border-orbit-border focus:border-orbit-accent focus:outline-none focus:ring-2 focus:ring-orbit-accent/20 transition-all"
          />
          <p className="text-xs text-zinc-600 mt-1">Must be 13+ to join</p>
        </div>
        {error && <p className="text-[var(--color-danger)] text-sm font-medium">{error}</p>}
        <Button type="submit" fullWidth size="lg" className="mt-2">
          Continue <Rocket size={18} />
        </Button>
      </form>
    </OnboardingShell>
  )
}
