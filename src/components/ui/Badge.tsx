import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'snap'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-orbit-surface border-orbit-border text-zinc-400',
  success: 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-transparent',
  warning: 'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-transparent',
  danger: 'bg-[var(--color-danger-muted)] text-[var(--color-danger)] border-transparent',
  info: 'bg-[var(--color-info-muted)] text-[var(--color-info)] border-transparent',
  accent: 'bg-orbit-accent/15 text-accent border-transparent',
  snap: 'border-transparent',
}

export function Badge({ children, variant = 'default', size = 'sm', dot, className = '' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={[
        'inline-flex items-center gap-1 font-semibold rounded-full border',
        sizeClass,
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={variant === 'snap' ? { background: '#FFFC0020', color: '#FFFC00' } : undefined}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{
            background:
              variant === 'success'
                ? 'var(--color-success)'
                : variant === 'warning'
                  ? 'var(--color-warning)'
                  : variant === 'danger'
                    ? 'var(--color-danger)'
                    : 'currentColor',
          }}
        />
      )}
      {children}
    </span>
  )
}

export function StatusPill({
  status,
  label,
}: {
  status: 'free' | 'busy' | 'class' | 'away'
  label: string
}) {
  const colors = {
    free: { bg: 'var(--color-success-muted)', text: 'var(--color-success)' },
    busy: { bg: 'var(--color-danger-muted)', text: 'var(--color-danger)' },
    class: { bg: 'var(--color-warning-muted)', text: 'var(--color-warning)' },
    away: { bg: 'var(--color-orbit-surface)', text: 'var(--color-text-tertiary)' },
  }
  const c = colors[status]
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}
    >
      {label}
    </span>
  )
}
