export * from "./env"
export * from "./memoize"
export * from "./noop"

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)
