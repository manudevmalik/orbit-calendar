import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  onSeeAll?: () => void
  seeAllLabel?: string
}

export function SectionHeader({
  title,
  subtitle,
  action,
  onSeeAll,
  seeAllLabel = 'See all',
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
      {onSeeAll && !action && (
        <button
          onClick={onSeeAll}
          className="text-xs font-medium text-accent flex items-center gap-0.5 hover:opacity-80 transition-opacity"
        >
          {seeAllLabel}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}
