import { useState, CSSProperties } from 'react'
import Editor from '@monaco-editor/react'
import { Code2, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

interface CodePanelProps {
  rawCode: string
  cleanCode: string
  loading?: boolean
  onClose?: () => void
}

type ViewMode = 'clean' | 'raw'

const buttonActive: CSSProperties = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
}

const buttonInactive: CSSProperties = {
  backgroundColor: 'var(--color-bg-button)',
  color: 'var(--color-text-primary)',
}

export function CodePanel({ rawCode, cleanCode, loading, onClose }: CodePanelProps) {
  const { theme } = useTheme()
  const [viewMode, setViewMode] = useState<ViewMode>('clean')

  const code = viewMode === 'clean' ? cleanCode : rawCode

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-shrink-0 h-10 px-3 flex items-center justify-between text-sm font-medium border-b"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
      >
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('clean')}
              className="px-2 py-1 text-xs rounded transition-colors"
              style={viewMode === 'clean' ? buttonActive : buttonInactive}
            >
              Clean
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className="px-2 py-1 text-xs rounded transition-colors"
              style={viewMode === 'raw' ? buttonActive : buttonInactive}
            >
              Raw
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-blue-500 animate-pulse">Processing...</span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Close panel"
            >
              <X className="w-4 h-4" />
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
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
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
