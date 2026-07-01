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
          className={`w-8 h-8 rounded-full border-2 transition-transform ${
            selected === c ? 'border-white scale-110' : 'border-transparent'
          }`}
          style={{ background: c }}
          aria-label={`Color ${c}`}
        />
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl bg-orbit-surface border border-orbit-border p-5 pb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Edit your avatar</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-orbit-surface-2">
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="rounded-full ring-4 ring-orbit-accent/30 overflow-hidden">
            <BitmojiAvatar config={config} size={120} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-zinc-500 mb-2 font-medium">Skin tone</p>
            <SwatchRow colors={SKIN_TONES} selected={config.skinTone} onSelect={(c) => update('skinTone', c)} />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-medium">Hair style</p>
            <div className="flex flex-wrap gap-2">
              {(['short', 'medium', 'long', 'curly', 'buzz'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => update('hairStyle', s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                    config.hairStyle === s
                      ? 'bg-orbit-accent text-orbit-bg'
                      : 'bg-orbit-surface-2 text-zinc-400 border border-orbit-border'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-medium">Hair color</p>
            <SwatchRow colors={HAIR_COLORS} selected={config.hairColor} onSelect={(c) => update('hairColor', c)} />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-medium">Expression</p>
            <div className="flex flex-wrap gap-2">
              {(['smile', 'grin', 'wink', 'cool', 'surprised'] as const).map((e) => (
                <button
                  key={e}
                  onClick={() => update('expression', e)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                    config.expression === e
                      ? 'bg-orbit-accent text-orbit-bg'
                      : 'bg-orbit-surface-2 text-zinc-400 border border-orbit-border'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-medium">Outfit color</p>
            <SwatchRow colors={OUTFIT_COLORS} selected={config.outfitColor} onSelect={(c) => update('outfitColor', c)} />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2 font-medium">Accessory</p>
            <div className="flex flex-wrap gap-2">
              {(['none', 'glasses', 'cap', 'headphones', 'earrings'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => update('accessory', a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                    config.accessory === a
                      ? 'bg-orbit-accent text-orbit-bg'
                      : 'bg-orbit-surface-2 text-zinc-400 border border-orbit-border'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onSave(config)}
          className="w-full mt-6 py-3 rounded-xl btn-primary font-semibold"
        >
          Save avatar
        </button>
      </div>
    </div>
  )
}

export { DEFAULT_BITMOJI, type BitmojiConfig }
