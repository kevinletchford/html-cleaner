import { useTheme } from '../hooks/useTheme'

interface PreviewPanelProps {
  html: string
  onClose?: () => void
  onCopy?: () => void
  copied?: boolean
  hasContent?: boolean
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 12 4 18"/>
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

export function PreviewPanel({ html, onClose, onCopy, copied, hasContent }: PreviewPanelProps) {
  const { theme } = useTheme()

  const isDark = theme === 'dark'
  const bgColor = isDark ? '#2c2c2c' : '#ffffff'
  const textColor = isDark ? '#ffffff' : '#1a1a1a'
  const borderColor = isDark ? '#3c3c3c' : '#e0e0e0'
  const mutedColor = isDark ? '#8c8c8c' : '#6e6e6e'
  const secondaryBg = isDark ? '#383838' : '#f0f0f0'

  const iframeContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      background: ${bgColor};
      color: ${textColor};
    }
    p { margin: 0 0 1em 0; }
    h1, h2, h3, h4, h5, h6 { margin: 1em 0 0.5em 0; }
    ul, ol { margin: 0 0 1em 1.5em; padding: 0; }
    li { margin-bottom: 0.25em; }
    table { border-collapse: collapse; width: 100%; max-width: 100%; margin-bottom: 1em; }
    th, td { border: 1px solid ${borderColor}; padding: 8px 12px; text-align: left; }
    th { background: ${secondaryBg}; font-weight: 600; }
    a { color: #0d99ff; }
    blockquote { border-left: 4px solid ${borderColor}; padding-left: 1em; margin-left: 0; color: ${mutedColor}; }
    pre, code { background: ${secondaryBg}; padding: 0.2em 0.4em; border-radius: 4px; font-family: 'JetBrains Mono', ui-monospace, monospace; }
    pre { padding: 1em; overflow-x: auto; }
    pre code { padding: 0; background: none; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>${html}</body>
</html>
`

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 h-10 px-3 flex items-center justify-between border-b border-th bg-th-surface text-th-muted">
        <div className="flex items-center gap-2">
          <EyeIcon />
          <span className="text-xs font-medium">Preview</span>
        </div>
        <div className="flex items-center gap-1">
          {onCopy && (
            <button
              onClick={onCopy}
              disabled={!hasContent}
              className={`p-1 rounded hover:bg-th-surface2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                copied ? 'text-success' : ''
              }`}
              title={copied ? 'Copied!' : 'Copy cleaned HTML'}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
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

      <iframe
        className="flex-1 min-h-0 w-full border-0"
        srcDoc={iframeContent}
        title="HTML Preview"
        sandbox="allow-same-origin"
      />
    </div>
  )
}
