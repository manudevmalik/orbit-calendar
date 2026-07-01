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
import { Avatar } from './ui/Avatar'
import { Badge, StatusPill } from './ui/Badge'
import { Card } from './ui/Card'
import { SectionHeader } from './ui/SectionHeader'

function statusToPill(status: ReturnType<typeof getFriendLiveStatus>): 'free' | 'busy' | 'class' | 'away' {
  if (status === 'free') return 'free'
  if (status === 'busy') return 'busy'
  if (status === 'in-class') return 'class'
  return 'away'
}

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
      className={`shrink-0 w-[80px] flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all duration-200 border ${
        selected
          ? 'border-orbit-accent bg-orbit-accent/8 shadow-sm scale-[1.02]'
          : 'border-orbit-border bg-orbit-surface-2 hover:bg-orbit-surface hover:border-orbit-accent/20'
      }`}
    >
      <Avatar
        size="md"
        color={friend.color}
        online
        onlineColor={statusColor}
        ring={selected}
      >
        {friend.avatar}
      </Avatar>
      <span className="text-xs font-semibold truncate w-full text-center">{friend.name.split(' ')[0]}</span>
      <StatusPill status={statusToPill(status)} label={getStatusLabel(status)} />
    </button>
  )
}

function AvailabilityOverlay({ friend, onClose }: { friend: Friend; onClose: () => void }) {
  const blocks = generateFriendAvailability(friend, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-orbit-slide-up">
      <div className="w-full max-w-lg orbit-modal-sheet p-5 pb-8 safe-area-bottom">
        <div className="w-10 h-1 rounded-full bg-orbit-border mx-auto mb-4" />
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Avatar size="md" color={friend.color} ring>
              {friend.avatar}
            </Avatar>
            <div>
              <p className="font-bold tracking-tight">{friend.name}</p>
              <p className="text-xs text-zinc-500">Today's availability</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-orbit-surface-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {blocks.map((b, i) => {
            const isFree = b.title?.toLowerCase().includes('free') || b.title?.toLowerCase().includes('available')
            return (
              <div
                key={i}
                className="orbit-card p-3 !rounded-xl"
                style={{ background: isFree ? `${friend.color}10` : undefined }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      {b.sharing === 'busy' && !isFree ? 'Busy' : b.title ?? 'Block'}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5 tabular-nums">{formatTimeRange(b.start, b.end)}</p>
                  </div>
                  {isFree ? (
                    <Badge variant="success" dot>Free</Badge>
                  ) : b.sharing === 'busy' ? (
                    <Lock size={14} className="text-zinc-500" />
                  ) : (
                    <Calendar size={14} className="text-zinc-500" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-zinc-600 mt-5 text-center">
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
      <Card variant="default" className="text-center">
        <div className="orbit-empty-state py-6">
          <span className="text-3xl mb-2">👋</span>
          <p className="text-sm font-medium text-zinc-400">Add friends to see Cal Compare</p>
          <p className="text-xs text-zinc-600 mt-1">See who's in class, free, or busy right now</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div>
        <SectionHeader
          title="Cal Compare"
          subtitle="See who's free right now"
          action={<Badge variant="success" dot size="sm">Live</Badge>}
        />
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
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
