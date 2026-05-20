import { useCallback, useState } from 'react'

interface ClipboardResult {
  html: string
  text: string
}

export function useClipboard() {
  const [copied, setCopied] = useState(false)

  const handlePaste = useCallback((event: React.ClipboardEvent): ClipboardResult => {
    const clipboardData = event.clipboardData

    const html = clipboardData.getData('text/html') || ''
    const text = clipboardData.getData('text/plain') || ''

    return { html, text }
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }, [])

  return { handlePaste, copyToClipboard, copied }
}
