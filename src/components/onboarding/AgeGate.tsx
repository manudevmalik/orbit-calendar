import { useState } from 'react'
import { Rocket } from 'lucide-react'
import { useApp } from '../../context/AppContext'

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
    <div className="min-h-full flex flex-col items-center justify-center p-6 animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orbit-accent mb-4">
          <span className="text-2xl font-bold text-orbit-bg">O</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Orbit</h1>
        <p className="text-zinc-500 mt-2 text-sm">Student calendar for you and your crew</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm text-zinc-500 mb-1.5">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maya, Alex, Jordan..."
            className="w-full px-4 py-3 rounded-xl bg-orbit-surface-2 border border-orbit-border focus:border-orbit-accent focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-500 mb-1.5">Birth year</label>
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="2009"
            min="1990"
            max="2015"
            className="w-full px-4 py-3 rounded-xl bg-orbit-surface-2 border border-orbit-border focus:border-orbit-accent focus:outline-none transition-colors"
          />
          <p className="text-xs text-zinc-600 mt-1">Must be 13+ to join</p>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-semibold btn-primary flex items-center justify-center gap-2"
        >
          Continue <Rocket size={18} />
        </button>
      </form>
    </div>
  )
}
