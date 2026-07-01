import { useMemo, useState } from 'react'
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Flame,
  Lock,
  Pencil,
  RotateCcw,
  Share2,
  Shield,
  Users,
  Zap,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { FriendsList } from './SocialPanel'
import { getSchoolById } from '../data/schools'
import { DEMO_FRIENDS } from '../data/demoData'
import { clearState } from '../lib/storage'
import { SHARING_LABELS } from '../data/constants'
import { BitmojiAvatar } from './BitmojiAvatar'
import { BitmojiBuilder, DEFAULT_BITMOJI } from './BitmojiBuilder'
import { AppearanceSettingsPanel } from './AppearanceSettings'
import { SnapchatBadge } from './onboarding/WelcomeStep'

const DEMO_BADGES = [
  { id: 'early-bird', label: 'Early bird', desc: 'Opens Orbit before 7 AM', icon: '🌅' },
  { id: 'planner-pro', label: 'Planner pro', desc: '5+ events added this week', icon: '📋' },
  { id: 'streak-7', label: '7-day streak', desc: 'Used Orbit 7 days in a row', icon: '🔥' },
  { id: 'social', label: 'Social butterfly', desc: '3+ friends on Orbit', icon: '👥' },
]

function StatCell({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 text-center py-3">
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-zinc-500 mt-0.5">{label}</p>
    </div>
  )
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
      {action}
    </div>
  )
}

export function ProfileTab() {
  const { state, dispatch } = useApp()
  const profile = state.profile
  const [showBitmojiBuilder, setShowBitmojiBuilder] = useState(false)
  const school = profile.schoolId ? getSchoolById(profile.schoolId) : null
  const friends = DEMO_FRIENDS.filter((f) => profile.friendIds.includes(f.id))
  const rotation = profile.scheduleRotation ?? 'regular'
  const rotationLabel = school?.scheduleVariants?.find((v) => v.id === rotation)?.label ?? 'Regular'

  const stats = useMemo(() => {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

    const eventsThisWeek = state.events.filter((e) => {
      const start = parseISO(e.start)
      return isWithinInterval(start, { start: weekStart, end: weekEnd })
    }).length

    const tasksCompleted = state.events.filter(
      (e) => (e.type === 'assignment' || e.type === 'exam') && e.completed,
    ).length

    const todayEvents = state.events.filter(
      (e) => format(parseISO(e.start), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd'),
    ).length

    const upcomingAssignments = state.events.filter(
      (e) =>
        (e.type === 'assignment' || e.type === 'exam') &&
        !e.completed &&
        parseISO(e.start) >= now,
    ).length

    return { eventsThisWeek, tasksCompleted, todayEvents, upcomingAssignments }
  }, [state.events])

  const birthdayFormatted = profile.birthday
    ? format(parseISO(profile.birthday), 'MMMM d')
    : null

  const resetDemo = () => {
    clearState()
    window.location.reload()
  }

  const bitmoji = profile.bitmoji ?? DEFAULT_BITMOJI

  return (
    <div className="animate-slide-up pb-4">
      {/* Hero — avatar + identity */}
      <div className="flex flex-col items-center pt-2 pb-5">
        <button
          onClick={() => setShowBitmojiBuilder(true)}
          className="rounded-full ring-2 ring-orbit-border hover:ring-orbit-accent/50 transition-all mb-3 overflow-hidden"
          aria-label="Edit avatar"
        >
          <BitmojiAvatar config={bitmoji} size={96} />
        </button>
        <h2 className="text-xl font-bold tracking-tight">{profile.name}</h2>
        <p className="text-sm text-zinc-500 mt-0.5">@{profile.username ?? 'student'}</p>
        {profile.connectedWithSnapchat && (
          <div className="mt-2">
            <SnapchatBadge />
          </div>
        )}
        {school && (
          <p className="text-sm text-zinc-400 mt-1">
            {school.name}
            {profile.gradeYear && ` · ${profile.gradeYear}`}
          </p>
        )}
        {profile.classYear && (
          <p className="text-xs text-zinc-500 mt-0.5">{profile.classYear}</p>
        )}
      </div>

      {/* Stats row — Snap score style */}
      <div className="card flex divide-x divide-orbit-border mb-4">
        <StatCell value={friends.length} label="Friends" />
        <StatCell value={stats.eventsThisWeek} label="This week" />
        <StatCell value={stats.tasksCompleted} label="Done" />
        <StatCell value={profile.streakDays ?? 0} label="Day streak" />
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setShowBitmojiBuilder(true)}
          className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5"
        >
          <Pencil size={15} /> Edit Bitmoji
        </button>
        <button className="btn-secondary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5">
          <Share2 size={15} /> Share schedule
        </button>
      </div>

      {/* School info card */}
      {school && (
        <section className="mb-5">
          <SectionHeader title="School" />
          <div className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{school.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {school.city}, {school.state}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-orbit-surface border border-orbit-border text-zinc-400">
                {rotationLabel}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-orbit-border flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-accent" />
                A/B schedule
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={13} className="text-accent" />
                Today: {rotationLabel}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* My week at a glance */}
      <section className="mb-5">
        <SectionHeader title="My week at a glance" />
        <div className="grid grid-cols-2 gap-2">
          <div className="card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-zinc-500" />
              <span className="text-xs text-zinc-500">Today</span>
            </div>
            <p className="text-xl font-semibold">{stats.todayEvents}</p>
            <p className="text-[11px] text-zinc-500">events scheduled</p>
          </div>
          <div className="card p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={14} className="text-zinc-500" />
              <span className="text-xs text-zinc-500">Due soon</span>
            </div>
            <p className="text-xl font-semibold">{stats.upcomingAssignments}</p>
            <p className="text-[11px] text-zinc-500">assignments & exams</p>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-5">
        <SectionHeader title="Badges" />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {DEMO_BADGES.map((badge) => (
            <div
              key={badge.id}
              className="shrink-0 w-28 card p-3 text-center"
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-xs font-medium mt-1.5">{badge.label}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Personal info */}
      {(birthdayFormatted || profile.classYear) && (
        <section className="mb-5">
          <SectionHeader title="About" />
          <div className="card divide-y divide-orbit-border">
            {birthdayFormatted && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-zinc-400">Birthday</span>
                <span className="text-sm">{birthdayFormatted}</span>
              </div>
            )}
            {profile.classYear && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-zinc-400">Graduation</span>
                <span className="text-sm">{profile.classYear}</span>
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-zinc-400 flex items-center gap-1.5">
                <Flame size={14} className="text-accent" /> Orbit streak
              </span>
              <span className="text-sm font-medium">{profile.streakDays ?? 0} days</span>
            </div>
          </div>
        </section>
      )}

      {/* Friends management */}
      <section className="mb-5">
        <SectionHeader
          title="Friends"
          action={
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Users size={12} /> {friends.length} connected
            </span>
          }
        />
        <div className="card p-4">
          <FriendsList />
        </div>
      </section>

      {/* Privacy & sharing */}
      <section className="mb-5">
        <SectionHeader title="Privacy & sharing" />
        <div className="card p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Private by default</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                New events are only visible to you until you change sharing.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-orbit-border space-y-2">
            {(Object.entries(SHARING_LABELS) as [keyof typeof SHARING_LABELS, typeof SHARING_LABELS[keyof typeof SHARING_LABELS]][]).map(
              ([key, { label }]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Lock size={11} /> {label}
                  </span>
                  <span className="text-zinc-600">
                    {key === 'private' ? 'Default' : ''}
                  </span>
                </div>
              ),
            )}
          </div>
          <button className="w-full flex items-center justify-between text-sm text-zinc-400 hover:text-zinc-200 pt-2">
            Manage sharing settings
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Settings */}
      <section className="mb-5">
        <SectionHeader title="Settings" />
        <div className="card overflow-hidden">
          <AppearanceSettingsPanel />
        </div>
      </section>

      {/* Reset */}
      <button
        onClick={resetDemo}
        className="w-full py-3 text-sm text-zinc-600 hover:text-zinc-400 flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} /> Reset demo data
      </button>

      {showBitmojiBuilder && (
        <BitmojiBuilder
          initial={bitmoji}
          onSave={(config) => {
            dispatch({ type: 'UPDATE_BITMOJI', bitmoji: config })
            setShowBitmojiBuilder(false)
          }}
          onClose={() => setShowBitmojiBuilder(false)}
        />
      )}
    </div>
  )
}
