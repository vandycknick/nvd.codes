import { useCallback, useEffect, useRef } from "react"

export function useDebounced<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number = 500,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debounced = useCallback(
    (...args: TArgs) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debounced
}
