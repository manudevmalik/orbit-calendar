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
    <div className="px-4 py-2.5 border-b border-orbit-border/60">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3 text-sm">
        {current ? (
          <div className="min-w-0">
            <p className="orbit-section-label">Now</p>
            <p className="font-semibold truncate tracking-tight">{current.name}</p>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="orbit-section-label">Between periods</p>
            <p className="font-semibold text-zinc-400">Free block</p>
          </div>
        )}
        {current && (
          <div className="shrink-0 text-center px-3 py-1.5 rounded-xl bg-orbit-accent/10 border border-orbit-accent/20">
            <p className="text-[10px] text-zinc-500 font-medium">ends in</p>
            <p className="font-bold text-accent text-sm tabular-nums">{formatCountdown(minutesLeft)}</p>
          </div>
        )}
        {next && (
          <div className="min-w-0 text-right">
            <p className="orbit-section-label">Next</p>
            <p className="font-semibold truncate tracking-tight">{next.name}</p>
            <p className="text-[10px] text-zinc-500 tabular-nums">@ {next.start}</p>
          </div>
        )}
      </div>
    </div>
  )
}
