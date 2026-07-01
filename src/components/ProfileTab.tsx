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
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { SectionHeader } from './ui/SectionHeader'

const DEMO_BADGES = [
  { id: 'early-bird', label: 'Early bird', desc: 'Opens Orbit before 7 AM', icon: '🌅' },
  { id: 'planner-pro', label: 'Planner pro', desc: '5+ events added this week', icon: '📋' },
  { id: 'streak-7', label: '7-day streak', desc: 'Used Orbit 7 days in a row', icon: '🔥' },
  { id: 'social', label: 'Social butterfly', desc: '3+ friends on Orbit', icon: '👥' },
]

function StatCell({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 text-center py-4 px-2">
      <p className="text-xl font-bold tabular-nums tracking-tight">{value}</p>
      <p className="text-[11px] text-zinc-500 mt-1 font-medium">{label}</p>
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
    <div className="animate-orbit-slide-up pb-4 -mx-4">
      {/* Cover gradient header */}
      <div className="relative mb-16">
        <div className="orbit-profile-cover h-36 rounded-b-3xl" />
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <button
            onClick={() => setShowBitmojiBuilder(true)}
            className="rounded-full ring-[3px] ring-orbit-bg shadow-lg hover:ring-orbit-accent/50 transition-all overflow-hidden"
            aria-label="Edit avatar"
          >
            <BitmojiAvatar config={bitmoji} size={96} />
          </button>
        </div>
      </div>

      {/* Identity */}
      <div className="flex flex-col items-center px-4 pb-5">
        <h2 className="text-xl font-bold tracking-tight">{profile.name}</h2>
        <p className="text-sm text-zinc-500 mt-0.5">@{profile.username ?? 'student'}</p>
        {profile.connectedWithSnapchat && (
          <div className="mt-2">
            <SnapchatBadge />
          </div>
        )}
        {school && (
          <p className="text-sm text-zinc-400 mt-2">
            {school.name}
            {profile.gradeYear && ` · ${profile.gradeYear}`}
          </p>
        )}
        {profile.classYear && (
          <p className="text-xs text-zinc-500 mt-0.5">{profile.classYear}</p>
        )}
      </div>

      {/* Stats row */}
      <div className="px-4 mb-5">
        <Card padding="none" className="flex divide-x divide-orbit-border overflow-hidden">
          <StatCell value={friends.length} label="Friends" />
          <StatCell value={stats.eventsThisWeek} label="This week" />
          <StatCell value={stats.tasksCompleted} label="Done" />
          <StatCell value={profile.streakDays ?? 0} label="Day streak" />
        </Card>
      </div>

      {/* Quick actions */}
      <div className="px-4 flex gap-2 mb-6">
        <Button variant="primary" fullWidth size="md" onClick={() => setShowBitmojiBuilder(true)}>
          <Pencil size={15} /> Edit Bitmoji
        </Button>
        <Button variant="secondary" fullWidth size="md">
          <Share2 size={15} /> Share
        </Button>
      </div>

      <div className="px-4 space-y-6">
        {/* School info */}
        {school && (
          <section>
            <SectionHeader title="School" />
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold tracking-tight">{school.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {school.city}, {school.state}
                  </p>
                </div>
                <Badge variant="default">{rotationLabel}</Badge>
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
            </Card>
          </section>
        )}

        {/* My week at a glance */}
        <section>
          <SectionHeader title="My week at a glance" />
          <div className="grid grid-cols-2 gap-3">
            <Card padding="sm" className="!rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-orbit-accent/10 flex items-center justify-center">
                  <Calendar size={14} className="text-accent" />
                </div>
                <span className="text-xs text-zinc-500 font-medium">Today</span>
              </div>
              <p className="text-2xl font-bold tabular-nums">{stats.todayEvents}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">events scheduled</p>
            </Card>
            <Card padding="sm" className="!rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-warning-muted)] flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-[var(--color-warning)]" />
                </div>
                <span className="text-xs text-zinc-500 font-medium">Due soon</span>
              </div>
              <p className="text-2xl font-bold tabular-nums">{stats.upcomingAssignments}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">assignments & exams</p>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section>
          <SectionHeader title="Badges" />
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
            {DEMO_BADGES.map((badge) => (
              <Card key={badge.id} padding="sm" className="shrink-0 w-28 !rounded-xl text-center">
                <span className="text-2xl">{badge.icon}</span>
                <p className="text-xs font-semibold mt-2">{badge.label}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{badge.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* About */}
        {(birthdayFormatted || profile.classYear) && (
          <section>
            <SectionHeader title="About" />
            <Card padding="none" className="divide-y divide-orbit-border overflow-hidden">
              {birthdayFormatted && (
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-sm text-zinc-400">Birthday</span>
                  <span className="text-sm font-medium">{birthdayFormatted}</span>
                </div>
              )}
              {profile.classYear && (
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-sm text-zinc-400">Graduation</span>
                  <span className="text-sm font-medium">{profile.classYear}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm text-zinc-400 flex items-center gap-1.5">
                  <Flame size={14} className="text-accent" /> Orbit streak
                </span>
                <span className="text-sm font-semibold">{profile.streakDays ?? 0} days</span>
              </div>
            </Card>
          </section>
        )}

        {/* Friends */}
        <section>
          <SectionHeader
            title="Friends"
            action={
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Users size={12} /> {friends.length} connected
              </span>
            }
          />
          <Card>
            <FriendsList />
          </Card>
        </section>

        {/* Privacy */}
        <section>
          <SectionHeader title="Privacy & sharing" />
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-orbit-accent/10 flex items-center justify-center shrink-0">
                <Shield size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">Private by default</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  New events are only visible to you until you change sharing.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-orbit-border space-y-2">
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
            <button className="w-full flex items-center justify-between text-sm text-zinc-400 hover:text-zinc-200 pt-3 mt-3 border-t border-orbit-border transition-colors">
              Manage sharing settings
              <ChevronRight size={16} />
            </button>
          </Card>
        </section>

        {/* Settings */}
        <section>
          <SectionHeader title="Settings" />
          <Card padding="none" className="overflow-hidden">
            <AppearanceSettingsPanel />
          </Card>
        </section>

        <button
          onClick={resetDemo}
          className="w-full py-3 text-sm text-zinc-600 hover:text-zinc-400 flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={14} /> Reset demo data
        </button>
      </div>

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
