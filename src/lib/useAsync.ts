import { useCallback, useState } from "react"

export const useAsync = <
  TArgs extends unknown[], // variadic argument types
  TResult,
>(
  asyncFn: (...args: TArgs) => Promise<TResult>,
) => {
  const [state, setState] = useState<{
    status: "idle" | "pending" | "success" | "error"
    value: TResult | null
    error: Error | null
    loading: boolean
  }>({
    status: "idle",
    value: null,
    error: null,
    loading: false,
  })

  const refetch = useCallback(
    async (...args: TArgs) => {
      setState({
        status: "pending",
        value: null,
        error: null,
        loading: true,
      })

      return asyncFn(...args)
        .then((response) => {
          setState({
            status: "success",
            value: response,
            error: null,
            loading: false,
          })
        })
        .catch((error) => {
          setState({
            status: "error",
            value: null,
            error: error,
            loading: false,
          })
        })
    },
    [asyncFn],
  )

  const reset = useCallback(
    () =>
      setState({
        status: "idle",
        value: null,
        error: null,
        loading: false,
      }),
    [],
  )

  // state values
  const { status, value, error, loading } = state

  return { refetch, status, value, error, loading, reset }
}
