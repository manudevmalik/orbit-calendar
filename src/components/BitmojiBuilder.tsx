import { useState } from 'react'
import { X } from 'lucide-react'
import {
  BitmojiAvatar,
  DEFAULT_BITMOJI,
  HAIR_COLORS,
  OUTFIT_COLORS,
  SKIN_TONES,
  type BitmojiConfig,
} from './BitmojiAvatar'
import { Button } from './ui/Button'

interface BitmojiBuilderProps {
  initial: BitmojiConfig
  onSave: (config: BitmojiConfig) => void
  onClose: () => void
}

function SwatchRow({
  colors,
  selected,
  onSelect,
}: {
  colors: string[]
  selected: string
  onSelect: (c: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
            selected === c ? 'border-white scale-110 shadow-md' : 'border-transparent'
          }`}
          style={{ background: c }}
          aria-label={`Color ${c}`}
        />
      ))}
    </div>
  )
}

function OptionPills<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: readonly T[]
  selected: T
  onSelect: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
            selected === opt
              ? 'bg-orbit-accent text-orbit-bg shadow-sm'
              : 'bg-orbit-surface-2 text-zinc-400 border border-orbit-border hover:border-orbit-accent/30'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function BitmojiBuilder({ initial, onSave, onClose }: BitmojiBuilderProps) {
  const [config, setConfig] = useState<BitmojiConfig>(initial)

  const update = <K extends keyof BitmojiConfig>(key: K, value: BitmojiConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[92vh] overflow-hidden rounded-t-3xl orbit-modal-sheet animate-orbit-slide-up safe-area-bottom flex flex-col">
        <div className="w-10 h-1 rounded-full bg-orbit-border mx-auto mt-3 mb-2 shrink-0" />
        <div className="flex items-center justify-between px-5 pb-3 shrink-0">
          <h2 className="text-lg font-bold tracking-tight">Edit your avatar</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-orbit-surface-2 transition-colors">
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        {/* Preview panel */}
        <div
          className="mx-5 mb-4 p-6 rounded-2xl flex justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-orbit-accent) 15%, var(--color-orbit-surface-2)), var(--color-orbit-surface-2))',
          }}
        >
          <div className="rounded-full ring-4 ring-orbit-accent/30 shadow-lg overflow-hidden">
            <BitmojiAvatar config={config} size={120} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 space-y-5 pb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wide">Skin tone</p>
            <SwatchRow colors={SKIN_TONES} selected={config.skinTone} onSelect={(c) => update('skinTone', c)} />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wide">Hair style</p>
            <OptionPills
              options={['short', 'medium', 'long', 'curly', 'buzz'] as const}
              selected={config.hairStyle}
              onSelect={(v) => update('hairStyle', v)}
            />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wide">Hair color</p>
            <SwatchRow colors={HAIR_COLORS} selected={config.hairColor} onSelect={(c) => update('hairColor', c)} />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wide">Expression</p>
            <OptionPills
              options={['smile', 'grin', 'wink', 'cool', 'surprised'] as const}
              selected={config.expression}
              onSelect={(v) => update('expression', v)}
            />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wide">Outfit color</p>
            <SwatchRow colors={OUTFIT_COLORS} selected={config.outfitColor} onSelect={(c) => update('outfitColor', c)} />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-wide">Accessory</p>
            <OptionPills
              options={['none', 'glasses', 'cap', 'headphones', 'earrings'] as const}
              selected={config.accessory}
              onSelect={(v) => update('accessory', v)}
            />
          </div>
        </div>

        <div className="px-5 pb-6 pt-2 shrink-0 border-t border-orbit-border">
          <Button fullWidth size="lg" onClick={() => onSave(config)}>
            Save avatar
          </Button>
        </div>
      </div>
    </div>
  )
}

export { DEFAULT_BITMOJI, type BitmojiConfig }
