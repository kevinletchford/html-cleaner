import { useState } from 'react'
import { Settings, ChevronDown, ChevronUp } from 'lucide-react'
import { CleaningOptions as CleaningOptionsType, PresetName, optionLabels } from '../lib/presets'

interface CleaningOptionsProps {
  preset: PresetName
  options: CleaningOptionsType
  onPresetChange: (preset: PresetName) => void
  onOptionsChange: (options: CleaningOptionsType) => void
}

const presetDescriptions: Record<PresetName, string> = {
  light: 'Remove Word/Docs metadata only',
  medium: 'Remove styles, classes, clean structure',
  aggressive: 'Strip to semantic HTML only',
}

export function CleaningOptions({
  preset,
  options,
  onPresetChange,
  onOptionsChange,
}: CleaningOptionsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handlePresetClick = (newPreset: PresetName) => {
    onPresetChange(newPreset)
  }

  const handleOptionToggle = (key: keyof CleaningOptionsType) => {
    onOptionsChange({
      ...options,
      [key]: !options[key],
    })
  }

  return (
    <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Preset:</span>
          <div className="flex gap-1">
            {(['light', 'medium', 'aggressive'] as PresetName[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePresetClick(p)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  preset === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title={presetDescriptions[p]}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Advanced
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Object.keys(optionLabels) as (keyof CleaningOptionsType)[]).map((key) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => handleOptionToggle(key)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="select-none">{optionLabels[key]}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
