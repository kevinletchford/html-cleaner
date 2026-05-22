import { useTheme } from '../hooks/useTheme'
import { PresetName } from '../lib/presets'

export interface PanelVisibility {
  input: boolean
  code: boolean
  preview: boolean
}

interface ToolbarProps {
  preset: PresetName
  onPresetChange: (preset: PresetName) => void
  panelVisibility: PanelVisibility
  onPanelVisibilityChange: (visibility: PanelVisibility) => void
  showSettings: boolean
  onToggleSettings: () => void
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

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14"/>
      <line x1="4" y1="10" x2="4" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12" y2="3"/>
      <line x1="20" y1="21" x2="20" y2="16"/>
      <line x1="20" y1="12" x2="20" y2="3"/>
      <line x1="1" y1="14" x2="7" y2="14"/>
      <line x1="9" y1="8" x2="15" y2="8"/>
      <line x1="17" y1="16" x2="23" y2="16"/>
    </svg>
  )
}

function PanelLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="3" x2="9" y2="21"/>
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

export function Toolbar({
  preset,
  onPresetChange,
  panelVisibility,
  onPanelVisibilityChange,
  showSettings,
  onToggleSettings,
}: ToolbarProps) {
  const { theme, toggleTheme } = useTheme()

  const togglePanel = (panel: keyof PanelVisibility) => {
    const newVisibility = { ...panelVisibility, [panel]: !panelVisibility[panel] }
    const visibleCount = Object.values(newVisibility).filter(Boolean).length
    if (visibleCount === 0) return
    onPanelVisibilityChange(newVisibility)
  }

  return (
    <div className="flex-shrink-0 border-b border-th bg-th-surface">
      <div className="flex items-center justify-between px-4 h-12 gap-4">
        {/* Left: branding + panel toggles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-semibold tracking-tight text-th">HTML Cleaner</span>
          </div>

          <div className="w-px h-5 bg-th-surface3" />

          <div className="flex items-center rounded overflow-hidden bg-th-bg">
            <button
              onClick={() => togglePanel('input')}
              className={`flex items-center px-2.5 h-7 transition-colors ${
                panelVisibility.input ? 'bg-accent text-white' : 'text-th-muted hover:bg-th-surface2'
              }`}
              title="Toggle Input panel"
            >
              <PanelLeftIcon />
            </button>
            <button
              onClick={() => togglePanel('code')}
              className={`flex items-center px-2.5 h-7 transition-colors ${
                panelVisibility.code ? 'bg-accent text-white' : 'text-th-muted hover:bg-th-surface2'
              }`}
              title="Toggle Code panel"
            >
              <CodeIcon />
            </button>
            <button
              onClick={() => togglePanel('preview')}
              className={`flex items-center px-2.5 h-7 transition-colors ${
                panelVisibility.preview ? 'bg-accent text-white' : 'text-th-muted hover:bg-th-surface2'
              }`}
              title="Toggle Preview panel"
            >
              <EyeIcon />
            </button>
          </div>

        </div>

        {/* Right: intensity slider + settings + theme */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 h-7 px-3 rounded bg-th-bg">
            <span className="text-xs font-medium text-th-muted">Intensity</span>
            <div className="relative flex items-center" style={{ width: '44px' }}>
              <div
                className="absolute h-0.5 rounded-full"
                style={{ backgroundColor: 'var(--t-border)', left: '4px', right: '4px' }}
              />
              <div
                className="absolute h-0.5 rounded-full transition-all"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  left: '4px',
                  width: preset === 'light' ? '0%' : preset === 'medium' ? 'calc(50% - 4px)' : 'calc(100% - 8px)',
                }}
              />
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
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--t-secondary)' }} />
                      {isPast && (
                        <div
                          className="absolute inset-0 w-2 h-2 rounded-full transition-all"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="w-px h-5 bg-th-surface3" />

          <button
            onClick={onToggleSettings}
            className={`h-7 w-7 flex items-center justify-center rounded transition-colors ${
              showSettings ? 'bg-accent text-white' : 'hover:bg-th-surface2 text-th-muted'
            }`}
            title="Settings"
          >
            <SlidersIcon />
          </button>

          <button
            onClick={toggleTheme}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-th-surface2 text-th-muted transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </div>
  )
}
