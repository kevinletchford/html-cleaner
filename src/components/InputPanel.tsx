import { useRef } from 'react'

interface InputPanelProps {
  onPaste: (html: string, text: string) => void
  content: string
  onClose?: () => void
  onClear?: () => void
  hasContent?: boolean
}

function PanelLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="3" x2="9" y2="21"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
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

function ClipboardIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  )
}

export function InputPanel({ onPaste, content, onClose, onClear, hasContent }: InputPanelProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault()
    const clipboardData = event.clipboardData
    const html = clipboardData.getData('text/html') || ''
    const text = clipboardData.getData('text/plain') || ''
    const inputHtml = html || `<p>${text}</p>`
    onPaste(inputHtml, text)
  }

  const isEmpty = !content.trim()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 h-10 px-3 flex items-center justify-between border-b border-th bg-th-surface text-th-muted">
        <div className="flex items-center gap-2">
          <PanelLeftIcon />
          <span className="text-xs font-medium">Input</span>
        </div>
        <div className="flex items-center gap-1">
          {onClear && (
            <button
              onClick={onClear}
              disabled={!hasContent}
              className="p-1 rounded hover:bg-th-surface2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Clear content"
            >
              <TrashIcon />
            </button>
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

      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        className="flex-1 p-4 overflow-y-auto focus:outline-none input-content min-h-0 bg-th-bg text-th"
        dangerouslySetInnerHTML={{ __html: content }}
        suppressContentEditableWarning
      />

      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center max-w-xs">
            <div className="w-16 h-16 rounded-2xl bg-th-surface border border-th flex items-center justify-center mx-auto mb-6 text-th-muted">
              <ClipboardIcon />
            </div>
            <h2 className="text-base font-semibold mb-2 text-th">Paste your content here</h2>
            <p className="text-sm text-th-muted">Press Ctrl+V or Cmd+V to paste HTML or rich text.</p>
          </div>
        </div>
      )}
    </div>
  )
}
