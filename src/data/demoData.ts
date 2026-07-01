import { addDays, setHours, setMinutes, startOfWeek } from 'date-fns'
import { v4 as uuid } from 'uuid'
import type { CalendarEvent, Friend, ReviewItem } from '../types'
import { getSchoolById } from './schools'
import { DEMO_FRIENDS, IMPORT_SAMPLE_EVENTS } from './constants'

function makeDate(daysOffset: number, hour: number, minute: number): Date {
  const d = addDays(new Date(), daysOffset)
  return setMinutes(setHours(d, hour), minute)
}

function periodToEvent(
  dayOffset: number,
  periodIndex: number,
  title: string,
  type: CalendarEvent['type'],
  schoolId: string,
  sharing: CalendarEvent['sharing'] = 'busy',
): CalendarEvent {
  const school = getSchoolById(schoolId)!
  const period = school.periods[periodIndex]
  const [sh, sm] = period.start.split(':').map(Number)
  const [eh, em] = period.end.split(':').map(Number)
  const start = makeDate(dayOffset, sh, sm)
  const end = makeDate(dayOffset, eh, em)
  return {
    id: uuid(),
    title,
    type,
    start: start.toISOString(),
    end: end.toISOString(),
    location: `Room ${200 + periodIndex}`,
    reminder: type === 'class' ? 10 : 60,
    sharing,
    source: 'school',
  }
}

export function generateDemoEvents(schoolId = 'lincoln-hs'): CalendarEvent[] {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const dayOffset = (dow: number) => {
    const target = addDays(weekStart, dow)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)
    return Math.round((target.getTime() - today.setHours(0, 0, 0, 0)) / 86400000)
  }

  const events: CalendarEvent[] = [
    // Mon
    periodToEvent(dayOffset(0), 0, 'English Literature', 'class', schoolId),
    periodToEvent(dayOffset(0), 2, 'AP Chemistry', 'class', schoolId),
    periodToEvent(dayOffset(0), 5, 'Volleyball Practice', 'practice', schoolId, 'friends'),
    // Tue
    periodToEvent(dayOffset(1), 1, 'Algebra II', 'class', schoolId),
    periodToEvent(dayOffset(1), 3, 'Bio Lab', 'class', schoolId),
    {
      id: uuid(),
      title: 'Study Group — Chem',
      type: 'focus',
      start: makeDate(dayOffset(1), 16, 0).toISOString(),
      end: makeDate(dayOffset(1), 17, 30).toISOString(),
      sharing: 'private',
      reminder: 15,
      source: 'user',
    },
    // Wed
    periodToEvent(dayOffset(2), 0, 'US History', 'class', schoolId),
    periodToEvent(dayOffset(2), 4, 'Spanish III', 'class', schoolId),
    {
      id: uuid(),
      title: 'Therapy Session',
      type: 'personal',
      start: makeDate(dayOffset(2), 17, 0).toISOString(),
      end: makeDate(dayOffset(2), 18, 0).toISOString(),
      sharing: 'busy',
      reminder: 30,
      source: 'user',
    },
    // Thu
    periodToEvent(dayOffset(3), 2, 'Physics', 'class', schoolId),
    periodToEvent(dayOffset(3), 6, 'Art Studio', 'class', schoolId),
    {
      id: uuid(),
      title: 'Game Night 🎮',
      type: 'social',
      start: makeDate(dayOffset(3), 19, 0).toISOString(),
      end: makeDate(dayOffset(3), 22, 0).toISOString(),
      sharing: 'friends',
      reminder: 60,
      source: 'user',
    },
    // Fri
    periodToEvent(dayOffset(4), 1, 'AP Biology', 'class', schoolId),
    periodToEvent(dayOffset(4), 3, 'Gym', 'class', schoolId),
    {
      id: uuid(),
      title: 'Calc Quiz',
      type: 'exam',
      start: makeDate(dayOffset(4), 9, 50).toISOString(),
      end: makeDate(dayOffset(4), 10, 40).toISOString(),
      location: 'Room 205',
      sharing: 'private',
      reminder: 120,
      source: 'user',
    },
    // Assignments
    {
      id: uuid(),
      title: 'Read Ch. 7 — Gatsby',
      type: 'assignment',
      start: makeDate(dayOffset(0), 23, 59).toISOString(),
      end: makeDate(dayOffset(1), 0, 0).toISOString(),
      sharing: 'private',
      reminder: 1440,
      source: 'user',
    },
    {
      id: uuid(),
      title: 'Lab Report Draft',
      type: 'assignment',
      start: makeDate(dayOffset(2), 23, 59).toISOString(),
      end: makeDate(dayOffset(3), 0, 0).toISOString(),
      sharing: 'private',
      reminder: 480,
      source: 'ai',
    },
    // Today extras
    {
      id: uuid(),
      title: 'Coffee with Alex',
      type: 'social',
      start: makeDate(0, 15, 30).toISOString(),
      end: makeDate(0, 16, 30).toISOString(),
      sharing: 'friends',
      reminder: 30,
      source: 'user',
    },
    {
      id: uuid(),
      title: 'SAT Prep Block',
      type: 'focus',
      start: makeDate(0, 18, 0).toISOString(),
      end: makeDate(0, 19, 30).toISOString(),
      sharing: 'private',
      reminder: 15,
      source: 'user',
    },
  ]

  return events
}

export function generateFriendAvailability(friend: Friend, dayOffset: number) {
  const blocks = [
    { start: makeDate(dayOffset, 8, 0), end: makeDate(dayOffset, 15, 0), sharing: 'busy' as const, title: 'School' },
    { start: makeDate(dayOffset, 16, 0), end: makeDate(dayOffset, 17, 30), sharing: 'friends' as const, title: 'Soccer practice' },
    { start: makeDate(dayOffset, 19, 0), end: makeDate(dayOffset, 21, 0), sharing: 'friends' as const, title: 'Free time ✨' },
  ]

  // Vary per friend
  if (friend.id === 'f1') {
    blocks[1] = { start: makeDate(dayOffset, 15, 30), end: makeDate(dayOffset, 17, 0), sharing: 'friends', title: 'Debate club' }
    blocks[2] = { start: makeDate(dayOffset, 17, 30), end: makeDate(dayOffset, 20, 0), sharing: 'friends', title: 'Free!' }
  }
  if (friend.id === 'f2') {
    blocks[1] = { start: makeDate(dayOffset, 16, 30), end: makeDate(dayOffset, 18, 0), sharing: 'busy', title: 'Band rehearsal' }
    blocks[2] = { start: makeDate(dayOffset, 18, 30), end: makeDate(dayOffset, 22, 0), sharing: 'friends', title: 'Available' }
  }
  if (friend.id === 'f3') {
    blocks[2] = { start: makeDate(dayOffset, 15, 0), end: makeDate(dayOffset, 22, 0), sharing: 'friends', title: 'Free after school!' }
  }

  return blocks.map((b) => ({
    ...b,
    start: b.start.toISOString(),
    end: b.end.toISOString(),
  }))
}

export function generateImportReviewItems(): ReviewItem[] {
  return IMPORT_SAMPLE_EVENTS.map((e) => {
    const start = makeDate(e.daysFromNow, e.hour, e.minute)
    const end = new Date(start.getTime() + e.duration * 60000)
    return {
      id: uuid(),
      title: e.title,
      type: e.type,
      start: start.toISOString(),
      end: end.toISOString(),
      confidence: e.confidence,
      reason: e.reason,
      location: e.location,
    }
  })
}

export { DEMO_FRIENDS }
