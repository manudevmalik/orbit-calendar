interface OnboardingProgressProps {
  step: number
  total: number
}

export function OnboardingProgress({ step, total }: OnboardingProgressProps) {
  return (
    <div className="orbit-progress-dots mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="orbit-progress-dot"
          data-active={i === step ? 'true' : undefined}
          data-complete={i < step ? 'true' : undefined}
        />
      ))}
    </div>
  )
}

export function OnboardingShell({
  step,
  total,
  children,
}: {
  step: number
  total: number
  children: React.ReactNode
}) {
  return (
    <div className="min-h-full flex flex-col p-6 safe-area-top safe-area-bottom animate-orbit-slide-up">
      <OnboardingProgress step={step} total={total} />
      {children}
    </div>
  )
}
