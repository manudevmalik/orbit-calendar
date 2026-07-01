import { Check, SkipForward } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { DEMO_FRIENDS } from '../../data/demoData'
import { getSchoolById } from '../../data/schools'

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

  return (
    <div className="min-h-full flex flex-col p-6 animate-slide-up">
      <h2 className="text-2xl font-bold mb-1">Add friends</h2>
      {school && (
        <p className="text-sm text-zinc-400 mb-2">
          {school.userCount ?? 47} classmates at {school.name} use Orbit
        </p>
      )}
      <p className="text-zinc-500 mb-6">See when friends are free and plan together</p>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {schoolFriends.length > 0 && (
          <>
            <p className="text-xs text-zinc-600 uppercase tracking-wide">From your school</p>
            {schoolFriends.map((f) => {
              const isSelected = selected.includes(f.id)
              return (
                <button
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
                    isSelected
                      ? 'border-orbit-accent bg-orbit-accent/10'
                      : 'border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: f.color + '25' }}
                  >
                    {f.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{f.name}</p>
                    <p className="text-sm text-zinc-500">@{f.username}</p>
                  </div>
                  {isSelected ? (
                    <Check size={22} className="text-accent" />
                  ) : (
                    <span className="text-sm text-accent font-medium">Add</span>
                  )}
                </button>
              )
            })}
          </>
        )}

        {otherFriends.length > 0 && (
          <>
            <p className="text-xs text-zinc-600 uppercase tracking-wide pt-2">Other suggestions</p>
            {otherFriends.map((f) => {
              const isSelected = selected.includes(f.id)
              return (
                <button
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
                    isSelected
                      ? 'border-orbit-accent bg-orbit-accent/10'
                      : 'border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: f.color + '25' }}
                  >
                    {f.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{f.name}</p>
                    <p className="text-sm text-zinc-500">@{f.username}</p>
                  </div>
                  {isSelected ? (
                    <Check size={22} className="text-accent" />
                  ) : (
                    <span className="text-sm text-accent font-medium">Add</span>
                  )}
                </button>
              )
            })}
          </>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={finish}
          className="w-full py-3.5 rounded-xl font-semibold btn-primary"
        >
          {selected.length > 0 ? `Start with ${selected.length} friend${selected.length > 1 ? 's' : ''}` : 'Finish setup'}
        </button>
        <button
          onClick={finish}
          className="w-full py-2 text-sm text-zinc-500 flex items-center justify-center gap-1 hover:text-zinc-300"
        >
          Skip for now <SkipForward size={14} />
        </button>
      </div>
    </div>
  )
}
