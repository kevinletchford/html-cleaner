import { Eye, X, Copy, Check } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

interface PreviewPanelProps {
  html: string
  onClose?: () => void
  onCopy?: () => void
  copied?: boolean
  hasContent?: boolean
}

export function PreviewPanel({ html, onClose, onCopy, copied, hasContent }: PreviewPanelProps) {
  const { theme } = useTheme()

  const isDark = theme === 'dark'
  const bgColor = isDark ? '#1e1e1e' : '#ffffff'
  const textColor = isDark ? '#d4d4d4' : '#1f2937'
  const borderColor = isDark ? '#3c3c3c' : '#e5e7eb'
  const mutedColor = isDark ? '#808080' : '#6b7280'
  const secondaryBg = isDark ? '#252526' : '#f9fafb'

  const iframeContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
    a { color: #3b82f6; }
    blockquote { border-left: 4px solid ${borderColor}; padding-left: 1em; margin-left: 0; color: ${mutedColor}; }
    pre, code { background: ${secondaryBg}; padding: 0.2em 0.4em; border-radius: 4px; font-family: ui-monospace, monospace; }
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
      <div
        className="flex-shrink-0 h-10 px-3 flex items-center justify-between text-sm font-medium border-b"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </div>
        <div className="flex items-center gap-1">
          {onCopy && (
            <button
              onClick={onCopy}
              disabled={!hasContent}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title={copied ? 'Copied!' : 'Copy cleaned HTML'}
            >
              {copied ? <Check className="w-3.5 h-3.5" style={{ color: '#22c55e' }} /> : <Copy className="w-3.5 h-3.5" />}
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

      <iframe
        className="flex-1 min-h-0 w-full border-0"
        srcDoc={iframeContent}
        title="HTML Preview"
        sandbox="allow-same-origin"
      />
    </div>
  )
}
