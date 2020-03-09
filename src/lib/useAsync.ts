import { useState, useCallback, useEffect } from "react"

interface UseAsyncResult<T> {
  pending: boolean
  value?: T
  error?: Error
}

const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
): UseAsyncResult<T> => {
  const [pending, setPending] = useState(false)
  const [value, setValue] = useState<T | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)

  const execute = useCallback(() => {
    setPending(true)
    setValue(undefined)
    setError(undefined)

    return asyncFunction()
      .then(response => setValue(response))
      .catch(error => setError(error))
      .finally(() => setPending(false))
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { pending, value, error }
}

export default useAsync
