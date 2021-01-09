type Functor = (...args: unknown[]) => unknown

// Overloads stolen from: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d6194f0cc57d1bf1c86d00cf9a1f4c6207f2bf12/types/ramda/index.d.ts#L1420
export function pipe<T1>(fn0: () => T1): () => T1
export function pipe<V0, T1>(fn0: (x0: V0) => T1): (x0: V0) => T1

export function pipe<T1, T2>(fn0: () => T1, fn1: (x: T1) => T2): () => T2
export function pipe<V0, T1, T2>(
  fn0: (x0: V0) => T1,
  fn1: (x: T1) => T2,
): (x0: V0) => T2

export function pipe<T1, T2, T3>(
  fn0: () => T1,
  fn1: (x: T1) => T2,
  fn2: (x: T2) => T3,
): () => T3
export function pipe<V0, T1, T2, T3>(
  fn0: (x: V0) => T1,
  fn1: (x: T1) => T2,
  fn2: (x: T2) => T3,
): (x: V0) => T3

export function pipe(...fns: Functor[]) {
  return (v: unknown) => fns.reduce((v, f) => f(v), v)
}
