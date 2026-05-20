import { useCallback, useEffect, useRef } from 'react'

interface ResizeHandleProps {
  onResize: (delta: number) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

export function ResizeHandle({ onResize, onResizeStart, onResizeEnd }: ResizeHandleProps) {
  const isDragging = useRef(false)
  const lastX = useRef(0)

  // Use refs to avoid stale closures and infinite loops
  const onResizeRef = useRef(onResize)
  const onResizeStartRef = useRef(onResizeStart)
  const onResizeEndRef = useRef(onResizeEnd)

  // Update refs when props change
  onResizeRef.current = onResize
  onResizeStartRef.current = onResizeStart
  onResizeEndRef.current = onResizeEnd

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    lastX.current = e.clientX
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    onResizeStartRef.current?.()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const delta = e.clientX - lastX.current
      lastX.current = e.clientX
      onResizeRef.current(delta)
    }

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        onResizeEndRef.current?.()
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div
      className="resize-handle flex-shrink-0 w-1 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
      style={{ backgroundColor: 'var(--color-border)' }}
      onMouseDown={handleMouseDown}
    />
  )
}
