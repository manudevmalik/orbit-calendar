import { useState } from 'react'
import { Send, X, MessageCircle, Camera } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useApp } from '../context/AppContext'
import { DEMO_FRIENDS, generateFriendAvailability } from '../data/demoData'
import { findFreeSlots, formatTimeRange } from '../lib/utils'
import { v4 as uuid } from 'uuid'

export function FriendsList() {
  const { state, dispatch } = useApp()
  const friends = DEMO_FRIENDS.filter((f) => state.profile.friendIds.includes(f.id))
  const schoolId = state.profile.schoolId
  const available = DEMO_FRIENDS.filter(
    (f) =>
      !state.profile.friendIds.includes(f.id) &&
      (!schoolId || f.schoolId === schoolId),
  )

  return (
    <div className="space-y-4">
      {friends.length === 0 ? (
        <p className="text-sm text-zinc-500">No friends yet — add some below</p>
      ) : (
        <div className="space-y-2">
          {friends.map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-orbit-surface border border-orbit-border">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: f.color + '25' }}
              >
                {f.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{f.name}</p>
                <p className="text-xs text-zinc-500">@{f.username}</p>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_FRIEND', friendId: f.id })}
                className="text-xs text-zinc-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {available.length > 0 && (
        <>
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Suggested</p>
          <div className="space-y-2">
            {available.slice(0, 4).map((f) => (
              <button
                key={f.id}
                onClick={() => dispatch({ type: 'ADD_FRIEND', friendId: f.id })}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-orbit-surface border border-orbit-border hover:border-zinc-600 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: f.color + '25' }}
                >
                  {f.avatar}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{f.name}</p>
                  <p className="text-xs text-zinc-500">@{f.username}</p>
                </div>
                <span className="text-sm text-accent font-medium">Add</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function FriendOverlay() {
  const { state } = useApp()
  const friends = DEMO_FRIENDS.filter((f) => state.profile.friendIds.includes(f.id))

  if (friends.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm text-zinc-500">Mutual free time</h3>
      <div className="card p-4">
        <p className="text-sm font-medium">Overlap today</p>
        <p className="text-xs text-zinc-500 mt-1">
          {friends.length >= 2
            ? `${friends[0].name} & ${friends[1].name} are both free 5:30–7:00 PM`
            : 'Add more friends to see overlap'}
        </p>
      </div>
    </div>
  )
}

function ShareSheet({
  slotLabel,
  friends,
  onClose,
  onConfirm,
}: {
  slotLabel: string
  friends: string[]
  onClose: () => void
  onConfirm: (channel: 'imessage' | 'snap') => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
      <div className="w-full max-w-lg rounded-t-2xl bg-orbit-surface border border-orbit-border p-5 pb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold">Share proposal</p>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-orbit-surface-2">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-zinc-500 mb-4">
          Hang out {slotLabel} with {friends.join(', ')}?
        </p>
        <div className="space-y-2">
          <button
            onClick={() => onConfirm('imessage')}
            className="w-full flex items-center gap-3 p-4 rounded-xl card hover:bg-orbit-surface transition-colors"
          >
            <MessageCircle size={22} className="text-green-500" />
            <div className="text-left">
              <p className="font-medium text-sm">iMessage</p>
              <p className="text-xs text-zinc-500">Send to group chat</p>
            </div>
          </button>
          <button
            onClick={() => onConfirm('snap')}
            className="w-full flex items-center gap-3 p-4 rounded-xl card hover:bg-orbit-surface transition-colors"
          >
            <Camera size={22} className="text-accent" />
            <div className="text-left">
              <p className="font-medium text-sm">Snapchat</p>
              <p className="text-xs text-zinc-500">Share as Snap</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export function PlanTogether({ onClose }: { onClose?: () => void }) {
  const { state, dispatch } = useApp()
  const friends = DEMO_FRIENDS.filter((f) => state.profile.friendIds.includes(f.id))
  const [selected, setSelected] = useState<string[]>([])
  const [proposedSlot, setProposedSlot] = useState<string | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [created, setCreated] = useState(false)
  const [shareChannel, setShareChannel] = useState<string | null>(null)

  const toggleFriend = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const findSlots = () => {
    const today = new Date()
    const userBusy = state.events
      .filter((e) => format(parseISO(e.start), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'))
      .map((e) => ({ start: e.start, end: e.end }))

    const friendFree = selected.map((fid) => {
      const f = DEMO_FRIENDS.find((x) => x.id === fid)!
      return generateFriendAvailability(f, 0).filter(
        (b) => b.title?.includes('Free') || b.title?.includes('Available'),
      )
    })

    return findFreeSlots(userBusy, friendFree, today)
  }

  const slots = selected.length > 0 ? findSlots() : []

  const handlePropose = (slotStart: string) => {
    setProposedSlot(slotStart)
    setShowShare(true)
  }

  const createEvent = (channel: 'imessage' | 'snap') => {
    if (!proposedSlot) return
    const start = new Date(proposedSlot)
    const end = new Date(start.getTime() + 90 * 60000)
    const friendNames = selected
      .map((id) => DEMO_FRIENDS.find((f) => f.id === id)?.name)
      .filter(Boolean)
      .join(', ')

    dispatch({
      type: 'ADD_EVENT',
      event: {
        id: uuid(),
        title: `Hangout with ${friendNames}`,
        type: 'social',
        start: start.toISOString(),
        end: end.toISOString(),
        sharing: 'friends',
        reminder: 60,
        source: 'user',
      },
    })
    setShareChannel(channel === 'imessage' ? 'iMessage' : 'Snapchat')
    setShowShare(false)
    setCreated(true)
  }

  if (created) {
    return (
      <div className="card p-4 text-center animate-slide-up">
        <p className="font-semibold text-green-500">Proposed & shared</p>
        <p className="text-sm text-zinc-500 mt-1">
          Event created · Sent via {shareChannel}
        </p>
        {onClose && (
          <button onClick={onClose} className="mt-3 text-xs text-zinc-500 hover:text-zinc-300">
            Done
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {onClose && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Send size={18} /> Plan together
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-orbit-surface-2">
            <X size={18} />
          </button>
        </div>
      )}
      {!onClose && (
        <h3 className="font-semibold flex items-center gap-2">
          <Send size={18} /> Plan together
        </h3>
      )}
      <p className="text-sm text-zinc-500">Pick friends, choose a slot, propose in one tap</p>

      <div className="flex flex-wrap gap-2">
        {friends.map((f) => (
          <button
            key={f.id}
            onClick={() => toggleFriend(f.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
              selected.includes(f.id)
                ? 'border-orbit-accent bg-orbit-accent/10'
                : 'border-orbit-border opacity-70 hover:opacity-100'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {selected.length > 0 && slots.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-400">Top slots today</p>
          {slots.map((slot) => (
            <button
              key={slot.start}
              onClick={() => handlePropose(slot.start)}
              className="w-full p-3 rounded-xl text-left card hover:border-zinc-600 transition-colors"
            >
              <p className="font-medium text-sm">{formatTimeRange(slot.start, slot.end)}</p>
              <p className="text-xs text-zinc-500">
                {slot.friends.length} friend{slot.friends.length > 1 ? 's' : ''} available
              </p>
            </button>
          ))}
        </div>
      )}

      {selected.length > 0 && slots.length === 0 && (
        <p className="text-sm text-zinc-500 text-center py-4">No mutual free slots today — try fewer friends</p>
      )}

      {showShare && proposedSlot && (
        <ShareSheet
          slotLabel={formatTimeRange(proposedSlot, new Date(new Date(proposedSlot).getTime() + 5400000).toISOString())}
          friends={selected.map((id) => DEMO_FRIENDS.find((f) => f.id === id)?.name ?? '')}
          onClose={() => setShowShare(false)}
          onConfirm={createEvent}
        />
      )}
    </div>
  )
}
