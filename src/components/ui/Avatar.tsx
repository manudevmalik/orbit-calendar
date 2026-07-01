import type { ReactNode } from 'react'

interface AvatarProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  ring?: boolean
  online?: boolean
  onlineColor?: string
  className?: string
}

const sizeMap = {
  sm: { box: 'w-9 h-9 text-base', ring: 'ring-2', dot: 'w-2.5 h-2.5 border-[1.5px]' },
  md: { box: 'w-12 h-12 text-2xl', ring: 'ring-2', dot: 'w-3 h-3 border-2' },
  lg: { box: 'w-16 h-16 text-3xl', ring: 'ring-[3px]', dot: 'w-3.5 h-3.5 border-2' },
  xl: { box: 'w-24 h-24 text-4xl', ring: 'ring-[3px]', dot: 'w-4 h-4 border-[3px]' },
}

export function Avatar({
  children,
  size = 'md',
  color,
  ring = false,
  online,
  onlineColor = 'var(--color-success)',
  className = '',
}: AvatarProps) {
  const s = sizeMap[size]
  return (
    <div
      className={[
        s.box,
        'rounded-full flex items-center justify-center relative shrink-0',
        ring ? `${s.ring} ring-orbit-accent shadow-md` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ background: color ? `${color}28` : 'var(--color-orbit-surface-2)' }}
    >
      {children}
      {online !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${s.dot} rounded-full border-orbit-surface-2`}
          style={{ background: online ? onlineColor : 'var(--color-text-muted)' }}
        />
      )}
    </div>
  )
}

export function AvatarInitials({ name, size = 'md', color }: { name: string; size?: AvatarProps['size']; color?: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const hue = color ?? `hsl(${(name.charCodeAt(0) * 7) % 360}, 65%, 55%)`
  return (
    <Avatar size={size} color={hue}>
      <span className="font-semibold text-sm" style={{ color: hue }}>
        {initials}
      </span>
    </Avatar>
  )
}
