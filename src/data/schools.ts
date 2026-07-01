import type { ScheduleRotation, School, SchoolScheduleVariant } from '../types'

function makeVariants(
  regular: { name: string; start: string; end: string }[],
): SchoolScheduleVariant[] {
  const earlyDismissal = regular
    .filter((p) => !p.name.toLowerCase().includes('lunch'))
    .slice(0, 5)
    .map((p) => ({
      ...p,
      end: p.end
        .split(':')
        .map((v, i) => (i === 0 ? String(Math.max(7, parseInt(v) - 1)) : v))
        .join(':'),
    }))

  const aDay = regular.filter((_, i) => i % 2 === 0 || regular[i].name.toLowerCase().includes('lunch'))
  const bDay = regular.filter((_, i) => i % 2 === 1 || regular[i].name.toLowerCase().includes('lunch'))

  return [
    { id: 'regular', label: 'Regular', periods: regular },
    { id: 'a-day', label: 'A Day', periods: aDay.length > 2 ? aDay : regular },
    { id: 'b-day', label: 'B Day', periods: bDay.length > 2 ? bDay : regular },
    { id: 'early-dismissal', label: 'Early Dismissal', periods: earlyDismissal },
  ]
}

export const SCHOOLS: School[] = [
  {
    id: 'lincoln-hs',
    name: 'Lincoln High School',
    city: 'Portland',
    state: 'OR',
    userCount: 47,
    periods: [
      { name: 'Period 1', start: '08:00', end: '08:50' },
      { name: 'Period 2', start: '08:55', end: '09:45' },
      { name: 'Period 3', start: '09:50', end: '10:40' },
      { name: 'Period 4', start: '10:45', end: '11:35' },
      { name: 'Lunch', start: '11:35', end: '12:15' },
      { name: 'Period 5', start: '12:20', end: '13:10' },
      { name: 'Period 6', start: '13:15', end: '14:05' },
      { name: 'Period 7', start: '14:10', end: '15:00' },
    ],
  },
  {
    id: 'westview-hs',
    name: 'Westview High School',
    city: 'Beaverton',
    state: 'OR',
    userCount: 62,
    periods: [
      { name: 'Block A', start: '07:45', end: '09:15' },
      { name: 'Block B', start: '09:25', end: '10:55' },
      { name: 'Block C', start: '11:05', end: '12:35' },
      { name: 'Lunch', start: '12:35', end: '13:05' },
      { name: 'Block D', start: '13:10', end: '14:40' },
    ],
  },
  {
    id: 'sunrise-ms',
    name: 'Sunrise Middle School',
    city: 'Austin',
    state: 'TX',
    userCount: 31,
    periods: [
      { name: 'Period 1', start: '08:30', end: '09:15' },
      { name: 'Period 2', start: '09:20', end: '10:05' },
      { name: 'Period 3', start: '10:10', end: '10:55' },
      { name: 'Period 4', start: '11:00', end: '11:45' },
      { name: 'Lunch', start: '11:45', end: '12:25' },
      { name: 'Period 5', start: '12:30', end: '13:15' },
      { name: 'Period 6', start: '13:20', end: '14:05' },
      { name: 'Period 7', start: '14:10', end: '14:55' },
    ],
  },
  {
    id: 'jefferson-hs',
    name: 'Jefferson High School',
    city: 'Brooklyn',
    state: 'NY',
    userCount: 89,
    periods: [
      { name: 'Period 1', start: '08:00', end: '08:45' },
      { name: 'Period 2', start: '08:50', end: '09:35' },
      { name: 'Period 3', start: '09:40', end: '10:25' },
      { name: 'Period 4', start: '10:30', end: '11:15' },
      { name: 'Period 5', start: '11:20', end: '12:05' },
      { name: 'Lunch', start: '12:05', end: '12:45' },
      { name: 'Period 6', start: '12:50', end: '13:35' },
      { name: 'Period 7', start: '13:40', end: '14:25' },
      { name: 'Period 8', start: '14:30', end: '15:15' },
    ],
  },
  {
    id: 'oak-ridge-hs',
    name: 'Oak Ridge High School',
    city: 'San Jose',
    state: 'CA',
    userCount: 54,
    periods: [
      { name: 'Period 0', start: '07:30', end: '08:20' },
      { name: 'Period 1', start: '08:25', end: '09:15' },
      { name: 'Period 2', start: '09:20', end: '10:10' },
      { name: 'Period 3', start: '10:15', end: '11:05' },
      { name: 'Period 4', start: '11:10', end: '12:00' },
      { name: 'Lunch', start: '12:00', end: '12:40' },
      { name: 'Period 5', start: '12:45', end: '13:35' },
      { name: 'Period 6', start: '13:40', end: '14:30' },
    ],
  },
].map((school) => ({
  ...school,
  scheduleVariants: makeVariants(school.periods),
}))

export function getSchoolById(id: string): School | undefined {
  return SCHOOLS.find((s) => s.id === id)
}

export function getSchoolPeriods(schoolId: string, rotation: ScheduleRotation = 'regular') {
  const school = getSchoolById(schoolId)
  if (!school) return []
  const variant = school.scheduleVariants?.find((v) => v.id === rotation)
  return variant?.periods ?? school.periods
}

export function searchSchools(query: string): School[] {
  const q = query.toLowerCase().trim()
  if (!q) return SCHOOLS
  return SCHOOLS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q),
  )
}
