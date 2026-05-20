import { useState, useEffect, useCallback, useRef } from 'react'
import { Toolbar, PanelVisibility } from './components/Toolbar'
import { InputPanel } from './components/InputPanel'
import { CodePanel } from './components/CodePanel'
import { PreviewPanel } from './components/PreviewPanel'
import { ResizeHandle } from './components/ResizeHandle'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useClipboard } from './hooks/useClipboard'
import { cleanHtml, formatHtml } from './lib/cleaner'
import { CleaningOptions as CleaningOptionsType, PresetName, presets } from './lib/presets'

interface PanelWidths {
  input: number
  code: number
  preview: number
}

function App() {
  // Persisted state
  const [preset, setPreset] = useLocalStorage<PresetName>('html-cleaner-preset', 'medium')
  const [options, setOptions] = useLocalStorage<CleaningOptionsType>(
    'html-cleaner-options',
    presets.medium
  )
  const [panelVisibility, setPanelVisibility] = useLocalStorage<PanelVisibility>(
    'html-cleaner-panels',
    { input: true, code: true, preview: true }
  )
  const [panelWidths, setPanelWidths] = useLocalStorage<PanelWidths>(
    'html-cleaner-panel-widths',
    { input: 33.33, code: 33.33, preview: 33.34 }
  )

  // Local state
  const [inputHtml, setInputHtml] = useState('')
  const [rawHtml, setRawHtml] = useState('')
  const [cleanedHtml, setCleanedHtml] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Clipboard hook
  const { copyToClipboard, copied } = useClipboard()

  // Handle paste from input panel
  const handlePaste = useCallback((html: string, _text: string) => {
    setInputHtml(html)
  }, [])

  // Handle preset change - also update options to match preset
  const handlePresetChange = useCallback((newPreset: PresetName) => {
    setPreset(newPreset)
    setOptions(presets[newPreset])
  }, [setPreset, setOptions])

  // Clean HTML when input or options change
  useEffect(() => {
    if (!inputHtml.trim()) {
      setRawHtml('')
      setCleanedHtml('')
      return
    }

    const processHtml = async () => {
      setIsProcessing(true)
      try {
        // Format raw HTML for display
        const formattedRaw = await formatHtml(inputHtml)
        setRawHtml(formattedRaw)

        // Clean HTML
        const result = await cleanHtml(inputHtml, options, preset)
        setCleanedHtml(result)
      } catch (error) {
        console.error('Error cleaning HTML:', error)
        setCleanedHtml('<!-- Error processing HTML -->')
      } finally {
        setIsProcessing(false)
      }
    }

    // Debounce processing
    const timeoutId = setTimeout(processHtml, 100)
    return () => clearTimeout(timeoutId)
  }, [inputHtml, options, preset])

  // Handle copy
  const handleCopy = useCallback(() => {
    copyToClipboard(cleanedHtml)
  }, [copyToClipboard, cleanedHtml])

  // Handle clear
  const handleClear = useCallback(() => {
    setInputHtml('')
    setRawHtml('')
    setCleanedHtml('')
  }, [])

  const hasContent = inputHtml.trim().length > 0

  // Calculate widths for visible panels, distributing hidden panel space proportionally
  const getVisibleWidths = useCallback(() => {
    const totalHiddenWidth = (['input', 'code', 'preview'] as const)
      .filter(p => !panelVisibility[p])
      .reduce((sum, p) => sum + panelWidths[p], 0)

    const visibleKeys = (['input', 'code', 'preview'] as const).filter(p => panelVisibility[p])
    const totalVisibleWidth = visibleKeys.reduce((sum, p) => sum + panelWidths[p], 0)

    return visibleKeys.reduce((acc, p) => {
      const proportion = panelWidths[p] / totalVisibleWidth
      acc[p] = panelWidths[p] + (totalHiddenWidth * proportion)
      return acc
    }, {} as Partial<PanelWidths>)
  }, [panelVisibility, panelWidths])

  const handleResizeStart = useCallback(() => {
    setIsResizing(true)
  }, [])

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleResize = useCallback((leftPanel: keyof PanelWidths, rightPanel: keyof PanelWidths) => (delta: number) => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const deltaPercent = (delta / containerWidth) * 100

    setPanelWidths(prev => {
      const newLeftWidth = Math.max(10, Math.min(80, prev[leftPanel] + deltaPercent))
      const newRightWidth = Math.max(10, Math.min(80, prev[rightPanel] - deltaPercent))

      return {
        ...prev,
        [leftPanel]: newLeftWidth,
        [rightPanel]: newRightWidth,
      }
    })
  }, [setPanelWidths])

  // Toggle panel visibility (ensure at least one stays visible)
  const togglePanel = useCallback((panel: keyof PanelVisibility) => {
    setPanelVisibility(prev => {
      const newVisibility = { ...prev, [panel]: !prev[panel] }
      const visibleCount = Object.values(newVisibility).filter(Boolean).length
      if (visibleCount === 0) return prev
      return newVisibility
    })
  }, [setPanelVisibility])

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Toolbar
        preset={preset}
        options={options}
        onPresetChange={handlePresetChange}
        onOptionsChange={setOptions}
        panelVisibility={panelVisibility}
        onPanelVisibilityChange={setPanelVisibility}
      />

      <div ref={containerRef} className="flex-1 min-h-0 flex" style={{ backgroundColor: 'var(--color-border)' }}>
        {panelVisibility.input && (
          <>
            <div
              className="relative overflow-hidden h-full"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                flex: `0 1 ${getVisibleWidths().input}%`,
                minWidth: 0,
                pointerEvents: isResizing ? 'none' : 'auto',
              }}
            >
              <InputPanel onPaste={handlePaste} content={inputHtml} onClose={() => togglePanel('input')} onClear={handleClear} hasContent={hasContent} />
            </div>
            {(panelVisibility.code || panelVisibility.preview) && (
              <ResizeHandle
                onResize={handleResize('input', panelVisibility.code ? 'code' : 'preview')}
                onResizeStart={handleResizeStart}
                onResizeEnd={handleResizeEnd}
              />
            )}
          </>
        )}

        {panelVisibility.code && (
          <>
            <div
              className="overflow-hidden h-full"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                flex: `0 1 ${getVisibleWidths().code}%`,
                minWidth: 0,
                pointerEvents: isResizing ? 'none' : 'auto',
              }}
            >
              <CodePanel rawCode={rawHtml} cleanCode={cleanedHtml} loading={isProcessing} onClose={() => togglePanel('code')} />
            </div>
            {panelVisibility.preview && (
              <ResizeHandle
                onResize={handleResize('code', 'preview')}
                onResizeStart={handleResizeStart}
                onResizeEnd={handleResizeEnd}
              />
            )}
          </>
        )}

        {panelVisibility.preview && (
          <div
            className="overflow-hidden h-full"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              flex: `0 1 ${getVisibleWidths().preview}%`,
              minWidth: 0,
              pointerEvents: isResizing ? 'none' : 'auto',
            }}
          >
            <PreviewPanel html={cleanedHtml} onClose={() => togglePanel('preview')} onCopy={handleCopy} copied={copied} hasContent={hasContent} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
