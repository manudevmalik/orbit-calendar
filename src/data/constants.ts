import type { EventType, SharingLevel } from '../types'

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; emoji: string; color: string; bg: string }
> = {
  class: { label: 'Class', emoji: '📚', color: '#a1a1aa', bg: 'rgba(161,161,170,0.1)' },
  assignment: { label: 'Assignment', emoji: '📝', color: '#e8b923', bg: 'rgba(232,185,35,0.1)' },
  exam: { label: 'Exam', emoji: '🎯', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  practice: { label: 'Practice', emoji: '⚽', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  social: { label: 'Social', emoji: '🎉', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  personal: { label: 'Personal', emoji: '✨', color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
  focus: { label: 'Focus', emoji: '🧠', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
}

export const SHARING_LABELS: Record<SharingLevel, { label: string; icon: string }> = {
  private: { label: 'Private', icon: '🔒' },
  busy: { label: 'Busy only', icon: '👀' },
  friends: { label: 'Friends see details', icon: '👯' },
  public: { label: 'Public', icon: '🌍' },
}

export const DEMO_FRIENDS = [
  { id: 'f1', username: 'maya_j', name: 'Maya', avatar: '🦋', color: '#e8b923', schoolId: 'lincoln-hs' },
  { id: 'f2', username: 'alex_r', name: 'Alex', avatar: '🎸', color: '#60a5fa', schoolId: 'lincoln-hs' },
  { id: 'f3', username: 'jordan_k', name: 'Jordan', avatar: '🌟', color: '#34d399', schoolId: 'lincoln-hs' },
  { id: 'f4', username: 'sam_t', name: 'Sam', avatar: '🎮', color: '#f97316', schoolId: 'westview-hs' },
  { id: 'f5', username: 'riley_p', name: 'Riley', avatar: '🎨', color: '#c084fc', schoolId: 'lincoln-hs' },
]

export const IMPORT_SAMPLE_EVENTS = [
  {
    title: 'AP Biology Lab Report',
    type: 'assignment' as EventType,
    daysFromNow: 5,
    hour: 23,
    minute: 59,
    duration: 60,
    confidence: 0.92,
    reason: 'Detected "Due" date in syllabus section 3.2',
    location: undefined,
  },
  {
    title: 'History Essay — Civil War',
    type: 'assignment' as EventType,
    daysFromNow: 8,
    hour: 23,
    minute: 59,
    duration: 60,
    confidence: 0.88,
    reason: 'Found deadline in course schedule table',
    location: undefined,
  },
  {
    title: 'Midterm — Chemistry',
    type: 'exam' as EventType,
    daysFromNow: 12,
    hour: 9,
    minute: 0,
    duration: 90,
    confidence: 0.95,
    reason: 'Exam date highlighted in syllabus header',
    location: 'Room 204',
  },
  {
    title: 'Debate Club Meeting',
    type: 'practice' as EventType,
    daysFromNow: 3,
    hour: 15,
    minute: 30,
    duration: 60,
    confidence: 0.78,
    reason: 'Recurring activity listed under extracurriculars',
    location: 'Room 112',
  },
  {
    title: 'Spanish Oral Presentation',
    type: 'exam' as EventType,
    daysFromNow: 6,
    hour: 10,
    minute: 30,
    duration: 45,
    confidence: 0.85,
    reason: 'Presentation date in unit 4 outline',
    location: 'Room 301',
  },
]
