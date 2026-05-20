import { useState, CSSProperties } from 'react'
import { Settings, Sun, Moon, PanelLeft, Code2, Eye } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { CleaningOptions as CleaningOptionsType, PresetName, optionLabels } from '../lib/presets'

export interface PanelVisibility {
  input: boolean
  code: boolean
  preview: boolean
}

const buttonPrimary: CSSProperties = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
}

const buttonSecondary: CSSProperties = {
  backgroundColor: 'var(--color-bg-button)',
  color: 'var(--color-text-primary)',
}

interface ToolbarProps {
  preset: PresetName
  options: CleaningOptionsType
  onPresetChange: (preset: PresetName) => void
  onOptionsChange: (options: CleaningOptionsType) => void
  panelVisibility: PanelVisibility
  onPanelVisibilityChange: (visibility: PanelVisibility) => void
}

const presetStops: { name: PresetName; label: string; tooltip: string }[] = [
  {
    name: 'light',
    label: 'Light',
    tooltip: 'Light: Removes Word/Google Docs metadata and comments. Preserves all styles, classes, and formatting.',
  },
  {
    name: 'medium',
    label: 'Medium',
    tooltip: 'Medium: Removes styles, classes, IDs, empty tags, and span wrappers. Cleans tables and lists. Converts <b> to <strong>.',
  },
  {
    name: 'aggressive',
    label: 'Aggressive',
    tooltip: 'Aggressive: Same as Medium, but also strips HTML5 semantic tags (article, section, nav, aside, etc.) leaving only core elements.',
  },
]

export function Toolbar({
  preset,
  options,
  onPresetChange,
  onOptionsChange,
  panelVisibility,
  onPanelVisibilityChange,
}: ToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const togglePanel = (panel: keyof PanelVisibility) => {
    // Ensure at least one panel remains visible
    const newVisibility = { ...panelVisibility, [panel]: !panelVisibility[panel] }
    const visibleCount = Object.values(newVisibility).filter(Boolean).length
    if (visibleCount === 0) return
    onPanelVisibilityChange(newVisibility)
  }

  const handleOptionToggle = (key: keyof CleaningOptionsType) => {
    onOptionsChange({
      ...options,
      [key]: !options[key],
    })
  }

  return (
    <div
      className="flex-shrink-0 border-b"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Main toolbar row */}
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        {/* Left: Intensity slider and Settings */}
        <div className="flex items-center gap-3">
          {/* Slider container */}
          <div
            className="flex items-center gap-3 px-3 py-1.5 rounded"
            style={{ backgroundColor: 'var(--color-bg-button)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Intensity
            </span>
            <div className="relative flex items-center" style={{ width: '44px' }}>
              {/* Track background */}
              <div
                className="absolute h-0.5 rounded-full"
                style={{
                  backgroundColor: 'var(--color-border)',
                  left: '4px',
                  right: '4px',
                }}
              />
              {/* Filled track */}
              <div
                className="absolute h-0.5 rounded-full transition-all"
                style={{
                  backgroundColor: '#2563eb',
                  left: '4px',
                  width: preset === 'light' ? '0%' : preset === 'medium' ? 'calc(50% - 4px)' : 'calc(100% - 8px)',
                }}
              />
              {/* Stops */}
              <div className="relative flex justify-between w-full">
                {presetStops.map((stop, index) => {
                  const isPast = presetStops.findIndex(s => s.name === preset) >= index
                  return (
                    <button
                      key={stop.name}
                      onClick={() => onPresetChange(stop.name)}
                      className="tooltip tooltip-wrap tooltip-left relative z-10 transition-all hover:scale-110"
                      data-tooltip={stop.tooltip}
                    >
                      {/* Greyed out background dot (always visible) */}
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: 'var(--color-text-secondary)',
                        }}
                      />
                      {/* Blue overlay dot (when active) */}
                      {isPast && (
                        <div
                          className="absolute inset-0 w-2 h-2 rounded-full transition-all"
                          style={{
                            backgroundColor: '#2563eb',
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Settings button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center px-2.5 py-1.5 text-sm font-medium transition-colors rounded"
            style={showAdvanced ? buttonPrimary : buttonSecondary}
            title="Advanced options"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Panel visibility toggles - grouped */}
          <div
            className="flex items-center rounded"
            style={{ backgroundColor: 'var(--color-bg-button)' }}
          >
            <button
              onClick={() => togglePanel('input')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium transition-colors border-r rounded-l"
              style={{
                ...(panelVisibility.input ? buttonPrimary : { color: 'var(--color-text-secondary)' }),
                borderColor: 'var(--color-border)',
              }}
              title="Toggle Input panel"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => togglePanel('code')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium transition-colors border-r"
              style={{
                ...(panelVisibility.code ? buttonPrimary : { color: 'var(--color-text-secondary)' }),
                borderColor: 'var(--color-border)',
              }}
              title="Toggle Code panel"
            >
              <Code2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => togglePanel('preview')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium transition-colors rounded-r"
              style={panelVisibility.preview ? buttonPrimary : { color: 'var(--color-text-secondary)' }}
              title="Toggle Preview panel"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6" style={{ backgroundColor: 'var(--color-border)' }} />

          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded transition-colors"
            style={buttonSecondary}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Advanced options row */}
      {showAdvanced && (
        <div
          className="px-4 py-3 border-t"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2">
            {(Object.keys(optionLabels) as (keyof CleaningOptionsType)[]).map((key) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm cursor-pointer"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() => handleOptionToggle(key)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  style={{ borderColor: 'var(--color-border)' }}
                />
                <span className="select-none">{optionLabels[key]}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
