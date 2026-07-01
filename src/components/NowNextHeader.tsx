import { useApp } from '../context/AppContext'
import { getSchoolPeriods } from '../data/schools'
import { formatCountdown, getCurrentAndNextPeriod } from '../lib/utils'

export function NowNextHeader() {
  const { state } = useApp()
  const schoolId = state.profile.schoolId
  if (!schoolId) return null

  const rotation = state.profile.scheduleRotation ?? 'regular'
  const periods = getSchoolPeriods(schoolId, rotation)
  const { current, next, minutesLeft } = getCurrentAndNextPeriod(periods)

  if (!current && !next) return null

  return (
    <div className="px-4 py-2 border-b border-orbit-border">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3 text-sm">
        {current ? (
          <div className="min-w-0">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Now</p>
            <p className="font-medium truncate">{current.name}</p>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Between periods</p>
            <p className="font-medium text-zinc-400">Free block</p>
          </div>
        )}
        {current && (
          <div className="shrink-0 text-center px-3 py-1 rounded-lg bg-orbit-surface-2 border border-orbit-border">
            <p className="text-[10px] text-zinc-500">ends in</p>
            <p className="font-semibold text-accent text-sm">{formatCountdown(minutesLeft)}</p>
          </div>
        )}
        {next && (
          <div className="min-w-0 text-right">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Next</p>
            <p className="font-medium truncate">{next.name}</p>
            <p className="text-[10px] text-zinc-500">@ {next.start}</p>
          </div>
        )}
      </div>
    </div>
  )
}
