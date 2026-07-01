import { format, parseISO, isSameDay, addDays } from 'date-fns'
import type { CalendarEvent, Friend } from '../types'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const STORAGE_KEY = 'orbit-myai-chat'

export function loadChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getWelcomeMessages()
    const msgs = JSON.parse(raw) as ChatMessage[]
    return msgs.length > 0 ? msgs : getWelcomeMessages()
  } catch {
    return getWelcomeMessages()
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // quota exceeded
  }
}

function getWelcomeMessages(): ChatMessage[] {
  return [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: "Hey! I'm Orbit AI ✨ Your calendar buddy. Ask me about your schedule, free time, homework, or friends!",
      timestamp: new Date().toISOString(),
    },
  ]
}

export function generateAIResponse(
  input: string,
  events: CalendarEvent[],
  friends: Friend[],
  userName: string,
): string {
  const q = input.toLowerCase().trim()
  const today = new Date()

  const todayEvents = events
    .filter((e) => isSameDay(parseISO(e.start), today))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  const upcomingTasks = events
    .filter((e) => (e.type === 'assignment' || e.type === 'exam') && !e.completed && parseISO(e.start) >= today)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5)

  const freeFriends = friends.filter((f) => f.id).slice(0, 3)

  if (/^(hi|hey|hello|sup|yo|what'?s up)/.test(q)) {
    return `Hey ${userName.split(' ')[0] || 'there'}! 👋 What can I help with today? Try "what's free today?" or "homework due soon"`
  }

  if (/free|available|open|gap/.test(q) && /today|now/.test(q)) {
    if (todayEvents.length === 0) return "You're wide open today! Perfect day to catch up on homework or hang with friends 🎉"
    const gaps: string[] = []
    for (let i = 0; i < todayEvents.length - 1; i++) {
      const end = parseISO(todayEvents[i].end)
      const nextStart = parseISO(todayEvents[i + 1].start)
      const diffMin = (nextStart.getTime() - end.getTime()) / 60000
      if (diffMin >= 30) {
        gaps.push(`${format(end, 'h:mm a')} – ${format(nextStart, 'h:mm a')} (${Math.round(diffMin)} min)`)
      }
    }
    if (gaps.length === 0) {
      const last = todayEvents[todayEvents.length - 1]
      return `After ${format(parseISO(last.end), 'h:mm a')} you're free! Before that, you've got ${todayEvents.length} thing${todayEvents.length > 1 ? 's' : ''} on the calendar.`
    }
    return `You've got open time today:\n${gaps.map((g) => `• ${g}`).join('\n')}\nWant me to help plan something?`
  }

  if (/schedule|today|what('s| is) (on|happening)/.test(q)) {
    if (todayEvents.length === 0) return "Nothing on the calendar today — enjoy the free day! ☀️"
    const list = todayEvents.map((e) => `• ${format(parseISO(e.start), 'h:mm a')} — ${e.title}`).join('\n')
    return `Here's your day:\n${list}`
  }

  if (/homework|assignment|due|deadline|exam|test/.test(q)) {
    if (upcomingTasks.length === 0) return "No upcoming assignments or exams on your calendar. You're caught up! 🙌"
    const list = upcomingTasks.map((e) => {
      const d = parseISO(e.start)
      const days = Math.ceil((d.getTime() - today.getTime()) / 86400000)
      const when = days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`
      return `• ${e.title} — due ${when} (${format(d, 'MMM d')})`
    }).join('\n')
    return `Heads up on what's coming:\n${list}\nWant me to block study time?`
  }

  if (/friend|who('s| is) free|hang out|plan/.test(q)) {
    if (freeFriends.length === 0) return "Add some friends on Orbit and I can help you find time to hang! Check Cal Compare on Home."
    const names = freeFriends.map((f) => f.name.split(' ')[0]).join(', ')
    return `${names} might be around after school — check Cal Compare on Home for live status! Tap "Plan together" to find overlap slots.`
  }

  if (/add|create|schedule|remind/.test(q)) {
    const match = q.match(/(?:add|create|schedule)\s+(.+)/)
    if (match) {
      return `Got it! Head to the Add tab and type "${match[1]}" in the natural language bar — I'll parse it into an event for you to review. 📝`
    }
    return 'To add something, go to Add → type naturally like "Bio lab Tuesday 3pm" or snap a photo of your syllabus!'
  }

  if (/tomorrow|next day/.test(q)) {
    const tomorrow = addDays(today, 1)
    const tomorrowEvents = events.filter((e) => isSameDay(parseISO(e.start), tomorrow))
    if (tomorrowEvents.length === 0) return `${format(tomorrow, 'EEEE')} looks clear so far!`
    const list = tomorrowEvents.map((e) => `• ${format(parseISO(e.start), 'h:mm a')} — ${e.title}`).join('\n')
    return `${format(tomorrow, 'EEEE')} preview:\n${list}`
  }

  if (/week|this week/.test(q)) {
    const weekEvents = events.filter((e) => {
      const d = parseISO(e.start)
      return d >= today && d <= addDays(today, 7)
    })
    return `You've got ${weekEvents.length} events this week. ${upcomingTasks.length} assignments/exams coming up. Ask "homework due soon" for details!`
  }

  if (/help|what can you/.test(q)) {
    return "I can help with:\n• Today's schedule\n• Free time / gaps\n• Homework & exams\n• Friend availability\n• Adding events\n\nJust ask naturally!"
  }

  if (/thank/.test(q)) {
    return "Anytime! You've got this 💪"
  }

  return "Hmm, I'm not sure about that one! Try asking about your schedule, free time, homework, or friends. Or say \"help\" for ideas 😊"
}
