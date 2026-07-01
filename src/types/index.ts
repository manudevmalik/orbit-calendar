export type EventType =
  | 'class'
  | 'assignment'
  | 'exam'
  | 'practice'
  | 'social'
  | 'personal'
  | 'focus'

export type SharingLevel = 'private' | 'busy' | 'friends' | 'public'

export type CalendarView = 'day' | 'week' | 'agenda'

export type AppTab = 'home' | 'calendar' | 'add' | 'profile'

export type ScheduleRotation = 'regular' | 'a-day' | 'b-day' | 'early-dismissal'

export type DayViewMode = 'list' | 'gaps'

export type RecurrenceRule = 'none' | 'daily' | 'weekly' | 'mwf'

export type FriendLiveStatus = 'in-class' | 'free' | 'busy'

export interface CalendarEvent {
  id: string
  title: string
  type: EventType
  start: string
  end: string
  location?: string
  reminder?: number
  sharing: SharingLevel
  notes?: string
  source?: 'user' | 'ai' | 'school' | 'import'
  recurrence?: RecurrenceRule
  completed?: boolean
}

export interface ReviewItem {
  id: string
  title: string
  type: EventType
  start: string
  end: string
  confidence: number
  reason: string
  location?: string
  recurrence?: RecurrenceRule
}

export interface Friend {
  id: string
  username: string
  name: string
  avatar: string
  color: string
  schoolId?: string
}

export interface AvailabilityBlock {
  start: string
  end: string
  sharing: SharingLevel
  title?: string
}

export interface SchoolScheduleVariant {
  id: ScheduleRotation
  label: string
  periods: { name: string; start: string; end: string }[]
}

export interface School {
  id: string
  name: string
  city: string
  state: string
  periods: { name: string; start: string; end: string }[]
  scheduleVariants?: SchoolScheduleVariant[]
  userCount?: number
}

export interface BitmojiConfig {
  skinTone: string
  hairStyle: 'short' | 'medium' | 'long' | 'curly' | 'buzz'
  hairColor: string
  expression: 'smile' | 'grin' | 'wink' | 'cool' | 'surprised'
  outfitColor: string
  accessory: 'none' | 'glasses' | 'cap' | 'headphones' | 'earrings'
}

export interface UserProfile {
  name: string
  username?: string
  snapUsername?: string
  connectedWithSnapchat?: boolean
  bitmoji?: BitmojiConfig
  ageVerified: boolean
  schoolId?: string
  scheduleRotation?: ScheduleRotation
  gradeYear?: string
  classYear?: string
  birthday?: string
  streakDays?: number
  onboardingComplete: boolean
  friendIds: string[]
  welcomeComplete?: boolean
}

export interface AppState {
  profile: UserProfile
  events: CalendarEvent[]
  reviewQueue: ReviewItem[]
  currentView: CalendarView
  activeTab: AppTab
  selectedDate: string
  dayViewMode: DayViewMode
}
