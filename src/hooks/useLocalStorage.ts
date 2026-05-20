import { useState, useCallback, useRef } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Use ref to store initialValue to avoid dependency issues
  const initialValueRef = useRef(initialValue)

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValueRef.current
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValueRef.current
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValueRef.current
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      try {
        const valueToStore = value instanceof Function ? value(prev) : value

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }

        return valueToStore
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
        return prev
      }
    })
  }, [key])

  return [storedValue, setValue]
}
