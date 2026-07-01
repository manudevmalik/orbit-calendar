import { Check, SkipForward } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { DEMO_FRIENDS } from '../../data/demoData'
import { getSchoolById } from '../../data/schools'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { OnboardingShell } from './OnboardingProgress'

export function FriendsStep() {
  const { state, dispatch } = useApp()
  const selected = state.profile.friendIds
  const school = state.profile.schoolId ? getSchoolById(state.profile.schoolId) : null

  const schoolFriends = DEMO_FRIENDS.filter(
    (f) => !school || f.schoolId === school.id,
  )
  const otherFriends = DEMO_FRIENDS.filter(
    (f) => school && f.schoolId !== school.id,
  )

  const toggle = (id: string) => {
    if (selected.includes(id)) return
    dispatch({ type: 'ADD_FRIEND', friendId: id })
  }

  const finish = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' })
  }

  const FriendRow = ({ f }: { f: typeof DEMO_FRIENDS[0] }) => {
    const isSelected = selected.includes(f.id)
    return (
      <button
        onClick={() => toggle(f.id)}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
          isSelected
            ? 'border-orbit-accent bg-orbit-accent/10 ring-1 ring-orbit-accent/20'
            : 'border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface hover:border-orbit-accent/20'
        }`}
      >
        <Avatar size="md" color={f.color} ring={isSelected}>
          {f.avatar}
        </Avatar>
        <div className="flex-1 text-left">
          <p className="font-semibold">{f.name}</p>
          <p className="text-sm text-zinc-500">@{f.username}</p>
        </div>
        {isSelected ? (
          <Check size={22} className="text-accent" />
        ) : (
          <span className="text-sm text-accent font-semibold">Add</span>
        )}
      </button>
    )
  }

  return (
    <OnboardingShell step={3} total={4}>
      <h2 className="text-2xl font-bold tracking-tight mb-1">Add friends</h2>
      {school && (
        <p className="text-sm text-zinc-400 mb-2">
          {school.userCount ?? 47} classmates at {school.name} use Orbit
        </p>
      )}
      <p className="text-zinc-500 mb-6">See when friends are free and plan together</p>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {schoolFriends.length > 0 && (
          <>
            <p className="orbit-section-label">From your school</p>
            {schoolFriends.map((f) => (
              <FriendRow key={f.id} f={f} />
            ))}
          </>
        )}

        {otherFriends.length > 0 && (
          <>
            <p className="orbit-section-label pt-2">Other suggestions</p>
            {otherFriends.map((f) => (
              <FriendRow key={f.id} f={f} />
            ))}
          </>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <Button fullWidth size="lg" onClick={finish}>
          {selected.length > 0 ? `Start with ${selected.length} friend${selected.length > 1 ? 's' : ''}` : 'Finish setup'}
        </Button>
        <button
          onClick={finish}
          className="w-full py-2 text-sm text-zinc-500 flex items-center justify-center gap-1 hover:text-zinc-300 transition-colors"
        >
          Skip for now <SkipForward size={14} />
        </button>
      </div>
    </OnboardingShell>
  )
}
