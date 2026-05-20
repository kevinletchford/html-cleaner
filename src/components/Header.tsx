import { Copy, Trash2, Check } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  onCopy: () => void
  onClear: () => void
  copied: boolean
  hasContent: boolean
}

export function Header({ onCopy, onClear, copied, hasContent }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        HTML Cleaner
      </h1>

      <div className="flex items-center gap-2">
        <button
          onClick={onCopy}
          disabled={!hasContent}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>

        <button
          onClick={onClear}
          disabled={!hasContent}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>

        <ThemeToggle />
      </div>
    </header>
  )
}
