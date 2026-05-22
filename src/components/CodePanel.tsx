import { useState } from 'react'
import Editor, { type BeforeMount } from '@monaco-editor/react'
import { useTheme } from '../hooks/useTheme'

type ViewMode = 'clean' | 'raw'

const LIGHT_THEME = 'hc-light'
const DARK_THEME = 'hc-dark'

const defineThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme(LIGHT_THEME, {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: { 'editor.background': '#ffffff' },
  })
  monaco.editor.defineTheme(DARK_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: { 'editor.background': '#2c2c2c' },
  })
}

interface CodePanelProps {
  rawCode: string
  cleanCode: string
  loading?: boolean
  onClose?: () => void
}

function CodeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

export function CodePanel({ rawCode, cleanCode, loading, onClose }: CodePanelProps) {
  const { theme } = useTheme()
  const [viewMode, setViewMode] = useState<ViewMode>('clean')

  const code = viewMode === 'clean' ? cleanCode : rawCode

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 h-10 px-3 flex items-center justify-between border-b border-th bg-th-surface text-th-muted">
        <div className="flex items-center gap-2">
          <CodeIcon />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('clean')}
              className={`h-6 px-2 text-xs rounded transition-colors ${
                viewMode === 'clean' ? 'bg-accent text-white' : 'bg-th-surface2 text-th hover:bg-th-surface3'
              }`}
            >
              Clean
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`h-6 px-2 text-xs rounded transition-colors ${
                viewMode === 'raw' ? 'bg-accent text-white' : 'bg-th-surface2 text-th hover:bg-th-surface3'
              }`}
            >
              Raw
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-th-muted animate-pulse">Processing…</span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-th-surface2 transition-colors"
              title="Close panel"
            >
              <XIcon />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          key={`${theme}-${viewMode}`}
          height="100%"
          language="html"
          value={code}
          theme={theme === 'dark' ? DARK_THEME : LIGHT_THEME}
          beforeMount={defineThemes}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: 'on',
            renderLineHighlight: 'none',
            selectionHighlight: false,
            occurrencesHighlight: 'off',
            folding: true,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}
