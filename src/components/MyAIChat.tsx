import { useEffect, useRef, useState } from 'react'
import { ArrowUp, X } from 'lucide-react'
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
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, var(--color-orbit-accent) 0%, #f97316 100%)',
      }}
    >
      <span style={{ fontSize: size * 0.45 }}>🪐</span>
    </div>
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
    <div className="fixed inset-0 z-50 flex flex-col bg-orbit-bg max-w-lg mx-auto animate-orbit-scale-in">
      <header className="flex items-center gap-3 px-4 py-3 orbit-sticky-header safe-area-top">
        <OrbitAIAvatar size={40} />
        <div className="flex-1">
          <h2 className="font-bold text-base tracking-tight">My AI</h2>
          <p className="text-xs text-zinc-500">Your calendar buddy</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-orbit-surface-2 transition-colors">
          <X size={20} className="text-zinc-400" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="orbit-empty-state py-8">
            <OrbitAIAvatar size={56} />
            <p className="text-sm font-semibold mt-4">Hey {state.profile.name || 'there'}!</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
              Ask me about your schedule, homework, or when friends are free
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && <OrbitAIAvatar size={28} />}
            <div
              className={`max-w-[80%] px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed ${
                msg.role === 'user' ? 'orbit-chat-bubble-user' : 'orbit-chat-bubble-ai'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2.5 items-end">
            <OrbitAIAvatar size={28} />
            <div className="orbit-chat-bubble-ai px-4 py-3">
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
              className="shrink-0 text-xs px-3.5 py-2 rounded-full bg-orbit-surface-2 border border-orbit-border text-zinc-400 hover:text-zinc-200 hover:border-orbit-accent/30 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 safe-area-bottom">
        <div className="orbit-input-bar flex items-center gap-2 px-2 py-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask about your schedule..."
            className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
          />
          <button
            onClick={send}
            disabled={!input.trim() || typing}
            className="w-9 h-9 rounded-full orbit-btn-primary flex items-center justify-center disabled:opacity-40 shrink-0"
            aria-label="Send"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
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
      className="orbit-fab-my-ai flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full border border-orbit-border bg-orbit-surface-2/95 backdrop-blur-md hover:bg-orbit-surface transition-all hover:scale-[1.02]"
      aria-label="Open My AI"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, var(--color-orbit-accent), #f97316)' }}
      >
        <span className="text-sm">🪐</span>
      </div>
      <span className="text-sm font-semibold">My AI</span>
    </button>
  )
}
