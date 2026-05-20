import { useRef } from 'react'
import { ClipboardPaste, PanelLeft, X, Trash2 } from 'lucide-react'

interface InputPanelProps {
  onPaste: (html: string, text: string) => void
  content: string
  onClose?: () => void
  onClear?: () => void
  hasContent?: boolean
}

export function InputPanel({ onPaste, content, onClose, onClear, hasContent }: InputPanelProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault()
    const clipboardData = event.clipboardData

    const html = clipboardData.getData('text/html') || ''
    const text = clipboardData.getData('text/plain') || ''

    // Use HTML if available, otherwise use plain text wrapped in a paragraph
    const inputHtml = html || `<p>${text}</p>`

    onPaste(inputHtml, text)
  }

  const isEmpty = !content.trim()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex-shrink-0 h-10 px-3 flex items-center justify-between text-sm font-medium border-b"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
      >
        <div className="flex items-center gap-2">
          <PanelLeft className="w-4 h-4" />
          <span>Input</span>
        </div>
        <div className="flex items-center gap-1">
          {onClear && (
            <button
              onClick={onClear}
              disabled={!hasContent}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Clear content"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
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

      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        className="flex-1 p-4 overflow-y-auto focus:outline-none input-content min-h-0"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
        suppressContentEditableWarning
      />

      {isEmpty && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ClipboardPaste className="w-12 h-12 mb-3" />
          <p className="text-lg font-medium">Paste your content here</p>
          <p className="text-sm mt-1">Ctrl+V / Cmd+V</p>
        </div>
      )}
    </div>
  )
}
