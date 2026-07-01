import { useState } from 'react'
import { useApp } from '../../context/AppContext'

function SnapGhostIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.2.5 2.3 1.3 3.1-.8.3-1.5.7-2.1 1.2-1.2 1.1-1.7 2.6-1.7 4.2 0 .8.1 1.5.3 2.2-.5.1-1 .3-1.4.5-.8.4-1.2 1-1.2 1.7 0 .5.2 1 .6 1.3.4.3 1 .5 1.6.5.3 0 .6 0 .9-.1.4 1.2 1.2 2.2 2.2 2.8 1.2.7 2.6 1 4 1s2.8-.3 4-1c1-.6 1.8-1.6 2.2-2.8.3.1.6.1.9.1.6 0 1.2-.2 1.6-.5.4-.3.6-.8.6-1.3 0-.7-.4-1.3-1.2-1.7-.4-.2-.9-.4-1.4-.5.2-.7.3-1.4.3-2.2 0-1.6-.5-3.1-1.7-4.2-.6-.5-1.3-.9-2.1-1.2.8-.8 1.3-1.9 1.3-3.1C16.5 4 14.5 2 12 2z" />
    </svg>
  )
}

interface WelcomeStepProps {
  onEmailContinue: () => void
}

export function WelcomeStep({ onEmailContinue }: WelcomeStepProps) {
  const { dispatch } = useApp()
  const [loading, setLoading] = useState(false)

  const handleSnapchat = () => {
    setLoading(true)
    setTimeout(() => {
      dispatch({
        type: 'CONNECT_SNAPCHAT',
        profile: {
          name: 'Maya Chen',
          username: 'maya_chen',
          snapUsername: 'maya_chen',
          connectedWithSnapchat: true,
        },
        friendIds: ['f2', 'f3', 'f4'],
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 animate-slide-up">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orbit-accent mb-4">
          <span className="text-2xl font-bold text-orbit-bg">O</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Orbit</h1>
        <p className="text-zinc-500 mt-2 text-sm max-w-xs mx-auto">
          The student calendar built for you and your crew
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={handleSnapchat}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-opacity disabled:opacity-70"
          style={{ background: '#FFFC00', color: '#000' }}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <SnapGhostIcon />
              Continue with Snapchat
            </>
          )}
        </button>

        <button
          onClick={onEmailContinue}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-medium btn-secondary"
        >
          Continue with email
        </button>

        <p className="text-center text-xs text-zinc-600 pt-2">
          By continuing, you agree to Orbit's Terms & Privacy Policy
        </p>
      </div>

      {loading && (
        <p className="text-sm text-zinc-500 mt-6 animate-pulse">
          Importing your Snap profile & friends...
        </p>
      )}
    </div>
  )
}

export function SnapchatBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#FFFC0020', color: '#FFFC00' }}>
      <SnapGhostIcon />
      Connected
    </span>
  )
}
