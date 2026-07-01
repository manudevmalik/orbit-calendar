import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'snap'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const sizeMap = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3.5 text-base',
}

const variantMap = {
  primary: 'orbit-btn-primary',
  secondary: 'orbit-btn-secondary',
  ghost: 'bg-transparent text-zinc-400 hover:text-zinc-200 transition-colors',
  snap: 'orbit-btn-snap',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        variantMap[variant],
        sizeMap[size],
        fullWidth ? 'w-full' : '',
        'inline-flex items-center justify-center gap-2 font-semibold',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
