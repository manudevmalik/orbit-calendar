import { format, addDays, startOfWeek, nextDay, type Day } from 'date-fns'
import type { EventType, ReviewItem } from '../types'
import { getSchoolById } from '../data/schools'
import { v4 as uuid } from 'uuid'

const DAY_MAP: Record<string, Day> = {
  sunday: 0, sun: 0,
  monday: 1, mon: 1,
  tuesday: 2, tue: 2, tues: 2,
  wednesday: 3, wed: 3,
  thursday: 4, thu: 4, thurs: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6,
}

const PERIOD_MAP: Record<string, number> = {
  '1st': 0, 'first': 0, 'period 1': 0, '1': 0,
  '2nd': 1, 'second': 1, 'period 2': 1, '2': 1,
  '3rd': 2, 'third': 2, 'period 3': 2, '3': 2,
  '4th': 3, 'fourth': 3, 'period 4': 3, '4': 3,
  '5th': 4, 'fifth': 4, 'period 5': 4, '5': 4,
  '6th': 5, 'sixth': 5, 'period 6': 5, '6': 5,
  '7th': 6, 'seventh': 6, 'period 7': 6, '7': 6,
}

const TYPE_KEYWORDS: Record<string, EventType> = {
  class: 'class', lecture: 'class', lab: 'class',
  assignment: 'assignment', homework: 'assignment', hw: 'assignment', due: 'assignment',
  exam: 'exam', test: 'exam', quiz: 'exam', midterm: 'exam', final: 'exam',
  practice: 'practice', sport: 'practice', soccer: 'practice', volleyball: 'practice',
  social: 'social', hangout: 'social', party: 'social',
  personal: 'personal',
  focus: 'focus', study: 'focus',
}

export interface ParseResult {
  success: boolean
  reviewItem?: ReviewItem
  message: string
}

export function parseNaturalLanguage(input: string, schoolId?: string): ParseResult {
  const text = input.toLowerCase().trim()
  if (!text) return { success: false, message: 'Say something like "Bio lab every Tuesday 3rd period"' }

  // Detect event type
  let type: EventType = 'class'
  for (const [kw, t] of Object.entries(TYPE_KEYWORDS)) {
    if (text.includes(kw)) { type = t; break }
  }

  // Detect day
  let targetDay: Day | null = null
  for (const [name, day] of Object.entries(DAY_MAP)) {
    if (text.includes(name)) { targetDay = day; break }
  }

  // Detect period
  let periodIndex: number | null = null
  for (const [name, idx] of Object.entries(PERIOD_MAP)) {
    if (text.includes(name)) { periodIndex = idx; break }
  }

  // Extract title — words before "every" or day name
  let title = input
  const everyIdx = text.indexOf(' every ')
  if (everyIdx > 0) title = input.slice(0, everyIdx).trim()
  else {
    for (const name of Object.keys(DAY_MAP)) {
      const idx = text.indexOf(' ' + name)
      if (idx > 0) { title = input.slice(0, idx).trim(); break }
    }
  }
  title = title.replace(/^(add|create|schedule)\s+/i, '').trim()
  if (!title) title = 'New Event'

  // Build dates
  const now = new Date()
  let start: Date
  let end: Date

  if (schoolId && periodIndex !== null && targetDay !== null) {
    const school = getSchoolById(schoolId)
    if (school && school.periods[periodIndex]) {
      const period = school.periods[periodIndex]
      const [sh, sm] = period.start.split(':').map(Number)
      const [eh, em] = period.end.split(':').map(Number)
      const base = targetDay >= now.getDay()
        ? nextDay(now, targetDay)
        : addDays(nextDay(startOfWeek(now), targetDay), 7)
      start = new Date(base)
      start.setHours(sh, sm, 0, 0)
      end = new Date(base)
      end.setHours(eh, em, 0, 0)
    } else {
      return { success: false, message: "Couldn't match that period to your school schedule." }
    }
  } else if (targetDay !== null) {
    const base = nextDay(now, targetDay)
    start = new Date(base)
    start.setHours(15, 0, 0, 0)
    end = new Date(base)
    end.setHours(16, 0, 0, 0)
  } else {
    start = new Date(now)
    start.setHours(start.getHours() + 1, 0, 0, 0)
    end = new Date(start)
    end.setHours(end.getHours() + 1)
  }

  const reviewItem: ReviewItem = {
    id: uuid(),
    title: title.charAt(0).toUpperCase() + title.slice(1),
    type,
    start: start.toISOString(),
    end: end.toISOString(),
    confidence: periodIndex !== null && targetDay !== null ? 0.94 : 0.72,
    reason: periodIndex !== null && targetDay !== null
      ? `Matched "${format(start, 'EEEE')} ${periodIndex + 1}${['st','nd','rd','th'][Math.min(periodIndex,3)]} period" to your bell schedule`
      : 'Parsed from natural language — please confirm time',
    location: periodIndex !== null ? `Room ${200 + periodIndex}` : undefined,
  }

  return {
    success: true,
    reviewItem,
    message: `Got it! "${reviewItem.title}" on ${format(start, 'EEEE, MMM d')} at ${format(start, 'h:mm a')}. Added to review queue.`,
  }
}

export function formatTimeRange(start: string, end: string): string {
  return `${format(new Date(start), 'h:mm a')} – ${format(new Date(end), 'h:mm a')}`
}

export function formatDateShort(d: string | Date): string {
  return format(typeof d === 'string' ? new Date(d) : d, 'EEE, MMM d')
}

export function formatDateLong(d: string | Date): string {
  return format(typeof d === 'string' ? new Date(d) : d, 'EEEE, MMMM d')
}

export function isSameDay(a: Date, b: Date): boolean {
  return format(a, 'yyyy-MM-dd') === format(b, 'yyyy-MM-dd')
}

export function getMinutesUntil(iso: string): number {
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 60000))
}

export function formatCountdown(minutes: number): string {
  if (minutes <= 0) return 'now'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function findFreeSlots(
  userBusy: { start: string; end: string }[],
  friendFree: { start: string; end: string }[][],
  date: Date,
): { start: string; end: string; friends: string[] }[] {
  // Simple overlap: 3-6pm window minus user busy
  const slots: { start: string; end: string; friends: string[] }[] = []
  const dayStr = format(date, 'yyyy-MM-dd')

  const candidates = [
    { h: 15, m: 0, dur: 60 },
    { h: 16, m: 0, dur: 60 },
    { h: 17, m: 0, dur: 90 },
    { h: 18, m: 0, dur: 120 },
  ]

  for (const c of candidates) {
    const start = new Date(`${dayStr}T${String(c.h).padStart(2,'0')}:${String(c.m).padStart(2,'0')}:00`)
    const end = new Date(start.getTime() + c.dur * 60000)

    const userConflict = userBusy.some((b) => {
      const bs = new Date(b.start), be = new Date(b.end)
      return start < be && end > bs
    })
    if (userConflict) continue

    const availableFriends: string[] = []
    friendFree.forEach((blocks, i) => {
      const free = blocks.some((b) => {
        const bs = new Date(b.start), be = new Date(b.end)
        return start >= bs && end <= be
      })
      if (free) availableFriends.push(String(i))
    })

    if (availableFriends.length > 0) {
      slots.push({ start: start.toISOString(), end: end.toISOString(), friends: availableFriends })
    }
  }

  return slots.slice(0, 3)
}

export function getFriendLiveStatus(
  blocks: { start: string; end: string; sharing: string; title?: string }[],
  now = new Date(),
): 'in-class' | 'free' | 'busy' {
  for (const block of blocks) {
    const start = new Date(block.start)
    const end = new Date(block.end)
    if (now >= start && now < end) {
      const title = block.title?.toLowerCase() ?? ''
      if (title.includes('school') || (block.sharing === 'busy' && !title.includes('free') && !title.includes('available'))) {
        return title.includes('school') ? 'in-class' : 'busy'
      }
      if (title.includes('free') || title.includes('available')) return 'free'
      return 'busy'
    }
  }
  const hour = now.getHours()
  if (hour >= 8 && hour < 15) return 'in-class'
  return 'free'
}

export function getStatusLabel(status: 'in-class' | 'free' | 'busy'): string {
  if (status === 'in-class') return 'In class'
  if (status === 'free') return 'Free'
  return 'Busy'
}

export function getStatusColor(status: 'in-class' | 'free' | 'busy'): string {
  if (status === 'in-class') return '#a1a1aa'
  if (status === 'free') return '#34d399'
  return '#f87171'
}

export interface TimeGap {
  start: string
  end: string
  durationMinutes: number
}

export function computeFreeGaps(
  events: { start: string; end: string }[],
  date: Date,
  dayStart = 7,
  dayEnd = 21,
): TimeGap[] {
  const dayStr = format(date, 'yyyy-MM-dd')
  const dayStartTime = new Date(`${dayStr}T${String(dayStart).padStart(2, '0')}:00:00`)
  const dayEndTime = new Date(`${dayStr}T${String(dayEnd).padStart(2, '0')}:00:00`)

  const sorted = [...events]
    .map((e) => ({ start: new Date(e.start), end: new Date(e.end) }))
    .filter((e) => e.end > dayStartTime && e.start < dayEndTime)
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  const gaps: TimeGap[] = []
  let cursor = dayStartTime

  for (const event of sorted) {
    const gapStart = cursor
    const gapEnd = event.start < dayStartTime ? dayStartTime : event.start
    if (gapEnd > gapStart) {
      const durationMinutes = Math.round((gapEnd.getTime() - gapStart.getTime()) / 60000)
      if (durationMinutes >= 15) {
        gaps.push({
          start: gapStart.toISOString(),
          end: gapEnd.toISOString(),
          durationMinutes,
        })
      }
    }
    if (event.end > cursor) cursor = event.end
  }

  if (cursor < dayEndTime) {
    const durationMinutes = Math.round((dayEndTime.getTime() - cursor.getTime()) / 60000)
    if (durationMinutes >= 15) {
      gaps.push({
        start: cursor.toISOString(),
        end: dayEndTime.toISOString(),
        durationMinutes,
      })
    }
  }

  return gaps
}

export function getCurrentAndNextPeriod(
  periods: { name: string; start: string; end: string }[],
  now = new Date(),
): { current: { name: string; end: string } | null; next: { name: string; start: string } | null; minutesLeft: number } {
  const dayStr = format(now, 'yyyy-MM-dd')
  let current: { name: string; end: string } | null = null
  let next: { name: string; start: string } | null = null
  let minutesLeft = 0

  for (let i = 0; i < periods.length; i++) {
    const p = periods[i]
    const start = new Date(`${dayStr}T${p.start}:00`)
    const end = new Date(`${dayStr}T${p.end}:00`)

    if (now >= start && now < end) {
      current = { name: p.name, end: p.end }
      minutesLeft = Math.max(0, Math.round((end.getTime() - now.getTime()) / 60000))
      if (i + 1 < periods.length) {
        next = { name: periods[i + 1].name, start: periods[i + 1].start }
      }
      break
    }

    if (now < start && !next) {
      next = { name: p.name, start: p.start }
    }
  }

  return { current, next, minutesLeft }
}
