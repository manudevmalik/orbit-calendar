export interface BitmojiConfig {
  skinTone: string
  hairStyle: 'short' | 'medium' | 'long' | 'curly' | 'buzz'
  hairColor: string
  expression: 'smile' | 'grin' | 'wink' | 'cool' | 'surprised'
  outfitColor: string
  accessory: 'none' | 'glasses' | 'cap' | 'headphones' | 'earrings'
}

export const DEFAULT_BITMOJI: BitmojiConfig = {
  skinTone: '#f5c9a8',
  hairStyle: 'medium',
  hairColor: '#3d2314',
  expression: 'smile',
  outfitColor: '#6366f1',
  accessory: 'none',
}

export const SKIN_TONES = ['#fce4d6', '#f5c9a8', '#d4a574', '#a0724a', '#6b4423', '#3d2314']
export const HAIR_COLORS = ['#1a1a1a', '#3d2314', '#8b4513', '#d4a017', '#e8b923', '#c084fc', '#ef4444']
export const OUTFIT_COLORS = ['#6366f1', '#38bdf8', '#34d399', '#fb923c', '#f472b6', '#FFFC00', '#ef4444', '#171717']

interface BitmojiAvatarProps {
  config: BitmojiConfig
  size?: number
  className?: string
}

export function BitmojiAvatar({ config, size = 96, className = '' }: BitmojiAvatarProps) {
  const hairPaths: Record<BitmojiConfig['hairStyle'], string> = {
    short: 'M 35 28 Q 50 12 65 28 L 62 38 Q 50 32 38 38 Z',
    medium: 'M 30 30 Q 50 8 70 30 L 68 45 Q 50 38 32 45 Z',
    long: 'M 28 32 Q 50 6 72 32 L 70 55 Q 50 48 30 55 Z',
    curly: 'M 32 30 Q 40 15 50 28 Q 60 12 68 30 Q 72 40 65 48 Q 50 42 35 48 Q 28 40 32 30 Z',
    buzz: 'M 38 32 Q 50 22 62 32 L 60 36 Q 50 30 40 36 Z',
  }

  const eyeY = config.expression === 'surprised' ? 44 : 46
  const mouthPath =
    config.expression === 'grin'
      ? 'M 42 58 Q 50 68 58 58'
      : config.expression === 'wink'
        ? 'M 44 58 Q 50 62 56 58'
        : config.expression === 'cool'
          ? 'M 44 58 L 56 58'
          : config.expression === 'surprised'
            ? 'M 46 58 Q 50 64 54 58'
            : 'M 44 58 Q 50 64 56 58'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Your avatar"
    >
      <rect width="100" height="100" rx="50" fill={config.outfitColor} />
      <ellipse cx="50" cy="78" rx="28" ry="22" fill={config.outfitColor} />
      <circle cx="50" cy="48" r="22" fill={config.skinTone} />
      <path d={hairPaths[config.hairStyle]} fill={config.hairColor} />
      {config.expression === 'wink' ? (
        <>
          <circle cx="42" cy={eyeY} r="2.5" fill="#1a1a1a" />
          <path d="M 54 44 Q 58 46 54 48" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
        </>
      ) : config.expression === 'cool' ? (
        <>
          <rect x="36" y="42" width="10" height="3" rx="1" fill="#1a1a1a" />
          <rect x="54" y="42" width="10" height="3" rx="1" fill="#1a1a1a" />
        </>
      ) : (
        <>
          <circle cx="42" cy={eyeY} r={config.expression === 'surprised' ? 3 : 2.5} fill="#1a1a1a" />
          <circle cx="58" cy={eyeY} r={config.expression === 'surprised' ? 3 : 2.5} fill="#1a1a1a" />
        </>
      )}
      <path d={mouthPath} stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {config.accessory === 'glasses' && (
        <>
          <circle cx="42" cy={eyeY} r="7" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
          <circle cx="58" cy={eyeY} r="7" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
          <line x1="49" y1={eyeY} x2="51" y2={eyeY} stroke="#1a1a1a" strokeWidth="1.5" />
        </>
      )}
      {config.accessory === 'cap' && (
        <path d="M 28 32 Q 50 18 72 32 L 75 36 Q 50 28 25 36 Z" fill="#ef4444" />
      )}
      {config.accessory === 'headphones' && (
        <>
          <path d="M 30 46 Q 30 28 50 26 Q 70 28 70 46" stroke="#374151" strokeWidth="3" fill="none" />
          <rect x="26" y="42" width="8" height="14" rx="3" fill="#374151" />
          <rect x="66" y="42" width="8" height="14" rx="3" fill="#374151" />
        </>
      )}
      {config.accessory === 'earrings' && (
        <>
          <circle cx="28" cy="52" r="2" fill="#FFFC00" />
          <circle cx="72" cy="52" r="2" fill="#FFFC00" />
        </>
      )}
    </svg>
  )
}
