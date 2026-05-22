import { CleaningOptions, optionLabels } from '../lib/presets'

interface Props {
  options: CleaningOptions
  onToggle: (key: keyof CleaningOptions) => void
  onReset: () => void
}

const OPTION_GROUPS: { label: string; keys: (keyof CleaningOptions)[] }[] = [
  {
    label: 'Remove',
    keys: [
      'removeStyles', 'removeClasses', 'removeIds', 'removeEmptyTags',
      'removeComments', 'removeSpanWrappers', 'removeImages',
    ],
  },
  {
    label: 'Convert',
    keys: ['convertBoldItalic', 'convertImagesToAlt'],
  },
  {
    label: 'Clean',
    keys: ['cleanTables', 'cleanLists', 'normalizeWhitespace'],
  },
]

export function SettingsSidebar({ options, onToggle, onReset }: Props) {
  const enabledCount = Object.values(options).filter(Boolean).length

  return (
    <aside className="w-64 shrink-0 border-l border-th bg-th-surface flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-th">
        <div>
          <span className="text-sm font-medium">Options</span>
          <span className="ml-2 text-xs text-th-muted">{enabledCount} active</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-th-muted hover:text-th transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {OPTION_GROUPS.map(group => (
          <div key={group.label} className="border-b border-th">
            <div className="px-4 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-th-muted">
                {group.label}
              </span>
            </div>
            {group.keys.map(key => (
              <label
                key={key}
                onClick={() => onToggle(key)}
                className="flex items-center justify-between px-4 py-1.5 hover:bg-th-surface2 cursor-pointer group"
              >
                <span className="text-xs text-th-secondary group-hover:text-th transition-colors">
                  {optionLabels[key]}
                </span>
                <div className={`relative w-8 h-4 rounded-full transition-colors cursor-pointer shrink-0 ml-3 ${
                  options[key] ? 'bg-accent' : 'bg-th-surface3'
                }`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                    options[key] ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </div>
              </label>
            ))}
          </div>
        ))}
      </div>
    </aside>
  )
}
