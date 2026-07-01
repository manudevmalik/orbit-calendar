import type { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'hero' | 'elevated' | 'ghost'
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  style?: CSSProperties
  onClick?: () => void
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

const variantMap = {
  default: 'orbit-card',
  hero: 'orbit-card-hero',
  elevated: 'orbit-card shadow-md',
  ghost: 'bg-transparent border border-orbit-border/50 rounded-2xl',
}

export function Card({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  padding = 'md',
  style,
  onClick,
}: CardProps) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      style={style}
      className={[
        variantMap[variant],
        paddingMap[padding],
        interactive || onClick ? 'orbit-card-interactive cursor-pointer text-left w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  )
}
