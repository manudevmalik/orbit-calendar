import { Home, Calendar, PlusCircle, User } from 'lucide-react'
import type { AppTab } from '../types'

interface BottomNavProps {
  active: AppTab
  onChange: (tab: AppTab) => void
}

const TABS: { id: AppTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'add', label: 'Add', icon: PlusCircle },
  { id: 'profile', label: 'Profile', icon: User },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="orbit-tab-bar" aria-label="Main navigation">
      <div className="flex items-stretch justify-around">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`relative flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-200 ${
                isActive ? 'text-accent' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-accent' : ''}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-orbit-accent" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
