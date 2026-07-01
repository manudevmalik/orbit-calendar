interface SaturnLogoProps {
  size?: number
  showLabel?: boolean
}

export function SaturnLogo({ size = 20, showLabel = false }: SaturnLogoProps) {
  return (
    <div className="flex items-center gap-1.5" title="Powered by Saturn">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="16" cy="16" r="7" fill="#6366f1" />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="4"
          stroke="#818cf8"
          strokeWidth="2"
          transform="rotate(-20 16 16)"
          fill="none"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="4"
          stroke="#a5b4fc"
          strokeWidth="1"
          strokeOpacity="0.5"
          transform="rotate(-20 16 16)"
          fill="none"
        />
      </svg>
      {showLabel && (
        <span className="text-[10px] font-medium text-zinc-500 tracking-wide uppercase">
          Saturn
        </span>
      )}
    </div>
  )
}

export function AppBrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="font-bold text-lg tracking-tight">Orbit</span>
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-orbit-surface-2 border border-orbit-border">
        <SaturnLogo size={14} />
        <span className="text-[9px] text-zinc-500 font-medium">Saturn</span>
      </div>
    </div>
  )
}
