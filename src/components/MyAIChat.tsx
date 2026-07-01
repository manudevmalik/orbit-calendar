import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, X } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { useApp } from '../context/AppContext'
import { DEMO_FRIENDS } from '../data/demoData'
import {
  generateAIResponse,
  loadChatHistory,
  saveChatHistory,
  type ChatMessage,
} from '../lib/myAI'

function OrbitAIAvatar({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <defs>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#aiGrad)" />
      <ellipse cx="24" cy="28" rx="14" ry="10" fill="#fff" opacity="0.9" />
      <circle cx="18" cy="22" r="3" fill="#1a1a1a" />
      <circle cx="30" cy="22" r="3" fill="#1a1a1a" />
      <circle cx="19" cy="21" r="1" fill="#fff" />
      <circle cx="31" cy="21" r="1" fill="#fff" />
      <path d="M 18 30 Q 24 34 30 30" stroke="#6366f1" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="10" r="4" fill="#FFFC00" opacity="0.9" />
    </svg>
  )
}

interface MyAIChatProps {
  onClose: () => void
}

export function MyAIChat({ onClose }: MyAIChatProps) {
  const { state } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory())
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const friends = DEMO_FRIENDS.filter((f) => state.profile.friendIds.includes(f.id))

  useEffect(() => {
    saveChatHistory(messages)
  }, [messages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    const text = input.trim()
    if (!text || typing) return

    const userMsg: ChatMessage = {
      id: uuid(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const reply = generateAIResponse(text, state.events, friends, state.profile.name)
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
        },
      ])
      setTyping(false)
    }, 600 + Math.random() * 400)
  }

  const suggestions = ["What's free today?", 'Homework due soon', "Today's schedule", 'Who can hang out?']

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-orbit-bg max-w-lg mx-auto">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-orbit-border app-header">
        <OrbitAIAvatar size={40} />
        <div className="flex-1">
          <h2 className="font-bold text-base">My AI</h2>
          <p className="text-xs text-zinc-500">Your calendar buddy</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-orbit-surface-2">
          <X size={20} className="text-zinc-400" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && <OrbitAIAvatar size={28} />}
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-orbit-accent text-orbit-bg rounded-br-md'
                  : 'bg-orbit-surface-2 border border-orbit-border rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2 items-center">
            <OrbitAIAvatar size={28} />
            <div className="px-4 py-3 rounded-2xl bg-orbit-surface-2 border border-orbit-border rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-orbit-surface-2 border border-orbit-border text-zinc-400 hover:text-zinc-200"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 border-t border-orbit-border safe-area-bottom">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask about your schedule..."
            className="flex-1 px-4 py-3 rounded-xl bg-orbit-surface-2 border border-orbit-border focus:border-orbit-accent focus:outline-none text-sm"
          />
          <button
            onClick={send}
            disabled={!input.trim() || typing}
            className="p-3 rounded-xl btn-primary disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function MyAIFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 pl-2 pr-4 py-2 rounded-full shadow-lg border border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface transition-colors max-w-[calc(100vw-2rem)]"
      style={{ marginLeft: 'auto', marginRight: 'max(1rem, calc(50% - 16rem))' }}
      aria-label="Open My AI"
    >
      <Sparkles size={18} className="text-accent" />
      <span className="text-sm font-medium">My AI</span>
    </button>
  )
}
