export interface MemoizedFunction {
  cache: Map<unknown, unknown>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
): T & MemoizedFunction => {
  if (typeof func !== "function") {
    throw new TypeError("Expected a function!")
  }

  const memoized = Object.assign(
    (...args: unknown[]) => {
      const key = args[0]
      const cache = memoized.cache

      if (cache.has(key)) {
        return cache.get(key)
      }
      const result = func.apply(this, args)
      memoized.cache = cache.set(key, result) || cache
      return result
    },
    {
      cache: new Map<unknown, unknown>(),
    },
  )

  return memoized as T & MemoizedFunction
}
