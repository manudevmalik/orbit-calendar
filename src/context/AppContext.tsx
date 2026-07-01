import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import type {
  AppState,
  AppTab,
  BitmojiConfig,
  CalendarEvent,
  CalendarView,
  DayViewMode,
  ReviewItem,
  ScheduleRotation,
  SharingLevel,
  UserProfile,
} from '../types'
import { loadState, saveState } from '../lib/storage'
import { generateDemoEvents, generateImportReviewItems } from '../data/demoData'

type Action =
  | { type: 'SET_TAB'; tab: AppTab }
  | { type: 'SET_VIEW'; view: CalendarView }
  | { type: 'SET_DATE'; date: string }
  | { type: 'SET_DAY_VIEW_MODE'; mode: DayViewMode }
  | { type: 'VERIFY_AGE'; name: string }
  | { type: 'SET_SCHOOL'; schoolId: string }
  | { type: 'SET_SCHEDULE_ROTATION'; rotation: ScheduleRotation }
  | { type: 'ADD_FRIEND'; friendId: string }
  | { type: 'REMOVE_FRIEND'; friendId: string }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'ADD_EVENT'; event: CalendarEvent }
  | { type: 'UPDATE_EVENT'; event: CalendarEvent }
  | { type: 'DELETE_EVENT'; id: string }
  | { type: 'COMPLETE_TASK'; id: string }
  | { type: 'ADD_REVIEW'; item: ReviewItem }
  | { type: 'APPROVE_REVIEW'; id: string }
  | { type: 'REJECT_REVIEW'; id: string }
  | { type: 'APPROVE_ALL_REVIEWS' }
  | { type: 'IMPORT_SAMPLE' }
  | { type: 'RESET_DEMO' }
  | { type: 'COMPLETE_WELCOME' }
  | { type: 'CONNECT_SNAPCHAT'; profile: Partial<UserProfile>; friendIds: string[] }
  | { type: 'UPDATE_BITMOJI'; bitmoji: BitmojiConfig }

function slugifyUsername(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  return base || 'student'
}

function enrichProfile(profile: UserProfile): UserProfile {
  const birthYear = profile.birthday ? parseInt(profile.birthday.split('-')[0], 10) : 2008
  const gradYear = birthYear + 18
  return {
    ...profile,
    username: profile.username ?? slugifyUsername(profile.name),
    gradeYear: profile.gradeYear ?? 'Junior',
    classYear: profile.classYear ?? `Class of '${String(gradYear).slice(-2)}`,
    birthday: profile.birthday ?? '2008-03-14',
    streakDays: profile.streakDays ?? 12,
  }
}

function createInitialState(): AppState {
  const saved = loadState()
  if (saved?.profile?.onboardingComplete) {
    return {
      profile: enrichProfile(saved.profile!),
      events: saved.events ?? generateDemoEvents(saved.profile?.schoolId),
      reviewQueue: saved.reviewQueue ?? [],
      currentView: saved.currentView ?? 'day',
      activeTab: (saved.activeTab as string) === 'social' ? 'home' : (saved.activeTab ?? 'home'),
      selectedDate: saved.selectedDate ?? format(new Date(), 'yyyy-MM-dd'),
      dayViewMode: saved.dayViewMode ?? 'list',
    }
  }
  return {
    profile: {
      name: '',
      ageVerified: false,
      onboardingComplete: false,
      friendIds: [],
      welcomeComplete: false,
    },
    events: [],
    reviewQueue: [],
    currentView: 'day',
    activeTab: 'home',
    selectedDate: format(new Date(), 'yyyy-MM-dd'),
    dayViewMode: 'list',
  }
}

function expandRecurrence(event: CalendarEvent): CalendarEvent[] {
  if (!event.recurrence || event.recurrence === 'none') return [event]

  const events: CalendarEvent[] = [event]
  const baseStart = new Date(event.start)
  const baseEnd = new Date(event.end)
  const duration = baseEnd.getTime() - baseStart.getTime()

  const occurrences = event.recurrence === 'daily' ? 6 : event.recurrence === 'weekly' ? 3 : 4

  for (let i = 1; i <= occurrences; i++) {
    const nextStart = new Date(baseStart)
    if (event.recurrence === 'daily') {
      nextStart.setDate(nextStart.getDate() + i)
    } else if (event.recurrence === 'weekly') {
      nextStart.setDate(nextStart.getDate() + i * 7)
    } else if (event.recurrence === 'mwf') {
      nextStart.setDate(nextStart.getDate() + i * 2)
    }
    const nextEnd = new Date(nextStart.getTime() + duration)
    events.push({
      ...event,
      id: uuid(),
      start: nextStart.toISOString(),
      end: nextEnd.toISOString(),
    })
  }

  return events
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab }
    case 'SET_VIEW':
      return { ...state, currentView: action.view }
    case 'SET_DATE':
      return { ...state, selectedDate: action.date }
    case 'SET_DAY_VIEW_MODE':
      return { ...state, dayViewMode: action.mode }
    case 'VERIFY_AGE':
      return {
        ...state,
        profile: enrichProfile({
          ...state.profile,
          name: action.name,
          ageVerified: true,
          username: slugifyUsername(action.name),
        }),
      }
    case 'SET_SCHOOL': {
      const events = generateDemoEvents(action.schoolId)
      return {
        ...state,
        profile: { ...state.profile, schoolId: action.schoolId, scheduleRotation: 'regular' },
        events,
      }
    }
    case 'SET_SCHEDULE_ROTATION':
      return {
        ...state,
        profile: { ...state.profile, scheduleRotation: action.rotation },
      }
    case 'ADD_FRIEND':
      if (state.profile.friendIds.includes(action.friendId)) return state
      return {
        ...state,
        profile: { ...state.profile, friendIds: [...state.profile.friendIds, action.friendId] },
      }
    case 'REMOVE_FRIEND':
      return {
        ...state,
        profile: {
          ...state.profile,
          friendIds: state.profile.friendIds.filter((id) => id !== action.friendId),
        },
      }
    case 'COMPLETE_ONBOARDING':
      return { ...state, profile: enrichProfile({ ...state.profile, onboardingComplete: true }) }
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, ...expandRecurrence(action.event)] }
    case 'UPDATE_EVENT':
      return { ...state, events: state.events.map((e) => (e.id === action.event.id ? action.event : e)) }
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter((e) => e.id !== action.id) }
    case 'COMPLETE_TASK':
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.id ? { ...e, completed: true } : e,
        ),
      }
    case 'ADD_REVIEW':
      return { ...state, reviewQueue: [...state.reviewQueue, action.item] }
    case 'APPROVE_REVIEW': {
      const item = state.reviewQueue.find((r) => r.id === action.id)
      if (!item) return state
      const event: CalendarEvent = {
        id: uuid(),
        title: item.title,
        type: item.type,
        start: item.start,
        end: item.end,
        location: item.location,
        sharing: 'private',
        reminder: 60,
        source: 'ai',
        recurrence: item.recurrence,
      }
      return {
        ...state,
        events: [...state.events, ...expandRecurrence(event)],
        reviewQueue: state.reviewQueue.filter((r) => r.id !== action.id),
      }
    }
    case 'REJECT_REVIEW':
      return { ...state, reviewQueue: state.reviewQueue.filter((r) => r.id !== action.id) }
    case 'APPROVE_ALL_REVIEWS': {
      const newEvents = state.reviewQueue.flatMap((item) =>
        expandRecurrence({
          id: uuid(),
          title: item.title,
          type: item.type,
          start: item.start,
          end: item.end,
          location: item.location,
          sharing: 'private' as SharingLevel,
          reminder: 60,
          source: 'ai' as const,
          recurrence: item.recurrence,
        }),
      )
      return { ...state, events: [...state.events, ...newEvents], reviewQueue: [] }
    }
    case 'IMPORT_SAMPLE':
      return { ...state, reviewQueue: [...state.reviewQueue, ...generateImportReviewItems()] }
    case 'RESET_DEMO':
      return createInitialState()
    case 'COMPLETE_WELCOME':
      return { ...state, profile: { ...state.profile, welcomeComplete: true } }
    case 'CONNECT_SNAPCHAT':
      return {
        ...state,
        profile: enrichProfile({
          ...state.profile,
          ...action.profile,
          ageVerified: true,
          welcomeComplete: true,
          friendIds: [...new Set([...state.profile.friendIds, ...action.friendIds])],
        }),
      }
    case 'UPDATE_BITMOJI':
      return {
        ...state,
        profile: { ...state.profile, bitmoji: action.bitmoji },
      }
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  useEffect(() => {
    if (state.profile.onboardingComplete) {
      saveState(state)
    }
  }, [state])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function useProfile(): UserProfile {
  return useApp().state.profile
}
