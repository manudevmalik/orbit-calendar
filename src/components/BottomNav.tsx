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
    <nav className="orbit-floating-nav">
      <div className="flex items-center justify-around py-2 px-2 safe-area-bottom">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-accent bg-orbit-accent/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-orbit-surface/50'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-accent' : ''}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-orbit-accent" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
