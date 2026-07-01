import { useState } from 'react'
import { Calendar, Lock, X } from 'lucide-react'
import { format } from 'date-fns'
import { useApp } from '../context/AppContext'
import { DEMO_FRIENDS, generateFriendAvailability } from '../data/demoData'
import {
  formatTimeRange,
  getFriendLiveStatus,
  getStatusColor,
  getStatusLabel,
} from '../lib/utils'
import type { Friend } from '../types'

function FriendCard({
  friend,
  selected,
  onSelect,
}: {
  friend: Friend
  selected: boolean
  onSelect: () => void
}) {
  const blocks = generateFriendAvailability(friend, 0)
  const status = getFriendLiveStatus(blocks)
  const statusColor = getStatusColor(status)

  return (
    <button
      onClick={onSelect}
      className={`shrink-0 w-[72px] flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border ${
        selected ? 'border-orbit-accent bg-orbit-surface' : 'border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface'
      }`}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl relative"
        style={{ background: friend.color + '25' }}
      >
        {friend.avatar}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-orbit-surface-2"
          style={{ background: statusColor }}
        />
      </div>
      <span className="text-xs font-medium truncate w-full text-center">{friend.name.split(' ')[0]}</span>
      <span className="text-[10px] font-medium" style={{ color: statusColor }}>
        {getStatusLabel(status)}
      </span>
    </button>
  )
}

function AvailabilityOverlay({ friend, onClose }: { friend: Friend; onClose: () => void }) {
  const blocks = generateFriendAvailability(friend, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 animate-slide-up">
      <div className="w-full max-w-lg rounded-t-2xl bg-orbit-surface border border-orbit-border p-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: friend.color + '25' }}
            >
              {friend.avatar}
            </div>
            <div>
              <p className="font-semibold">{friend.name}</p>
              <p className="text-xs text-zinc-500">Today's availability</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-orbit-surface-2">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {blocks.map((b, i) => {
            const isFree = b.title?.toLowerCase().includes('free') || b.title?.toLowerCase().includes('available')
            return (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-orbit-border"
                style={{ background: isFree ? friend.color + '10' : 'transparent' }}
              >
                <div>
                  <p className="text-sm font-medium">
                    {b.sharing === 'busy' && !isFree ? 'Busy' : b.title ?? 'Block'}
                  </p>
                  <p className="text-xs text-zinc-500">{formatTimeRange(b.start, b.end)}</p>
                </div>
                {isFree ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/15 text-green-400 font-medium">Free</span>
                ) : b.sharing === 'busy' ? (
                  <Lock size={14} className="text-zinc-500" />
                ) : (
                  <Calendar size={14} className="text-zinc-500" />
                )}
              </div>
            )
          })}
        </div>

        <p className="text-xs text-zinc-600 mt-4 text-center">
          Titles hidden unless shared · {format(new Date(), 'EEEE, MMM d')}
        </p>
      </div>
    </div>
  )
}

export function CalCompareCarousel() {
  const { state } = useApp()
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const friends = DEMO_FRIENDS.filter((f) => state.profile.friendIds.includes(f.id))

  if (friends.length === 0) {
    return (
      <div className="card p-4 text-center">
        <p className="text-sm text-zinc-400">Add friends to see Cal Compare</p>
        <p className="text-xs text-zinc-600 mt-1">See who's in class, free, or busy right now</p>
      </div>
    )
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">Cal Compare</h3>
          <span className="text-[10px] text-zinc-600 uppercase tracking-wide">Live now</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {friends.map((f) => (
            <FriendCard
              key={f.id}
              friend={f}
              selected={selectedFriend?.id === f.id}
              onSelect={() => setSelectedFriend(f)}
            />
          ))}
        </div>
      </div>

      {selectedFriend && (
        <AvailabilityOverlay friend={selectedFriend} onClose={() => setSelectedFriend(null)} />
      )}
    </>
  )
}
