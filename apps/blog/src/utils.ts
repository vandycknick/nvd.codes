import {
  AnyRouter,
  CreateContextFn,
  CreateContextFnOptions,
  requestHandler,
} from "@trpc/server"
import { Middleware } from "koa"
import { IncomingMessage, ServerResponse } from "http"

export const getEnvVar = (key: string, defaultz?: string): string => {
  const result = process.env[key]

  if (result == undefined && defaultz != undefined) {
    return defaultz
  } else if (result != undefined) {
    return result
  }

  throw new Error(`Required environment variable '${key}' is not defined!`)
}

export const getEnvVarAsInt = (key: string, defaultz: number): number => {
  const result = getEnvVar(key, "")

  if (result == "") {
    return defaultz
  }

  return parseInt(result, 10)
}

export const getOptionalEnvVar = (key: string, defaultz: string) => {
  const result = process.env[key]

  if (result != undefined) {
    return result
  }

  return defaultz
}

export type CreateKoaContextOptions = CreateContextFnOptions<
  IncomingMessage,
  ServerResponse
>

export type CreateKoaContextFn<TRouter extends AnyRouter> = CreateContextFn<
  TRouter,
  IncomingMessage,
  ServerResponse
>

export const createKoaMiddleware =
  <TRouter extends AnyRouter>({
    router,
    createContext,
  }: {
    router: TRouter
    createContext: CreateKoaContextFn<TRouter>
  }): Middleware =>
  async (context) => {
    const endpoint = context.request.path.substr(1) ?? ""

    await requestHandler<
      TRouter,
      CreateKoaContextFn<TRouter>,
      IncomingMessage,
      ServerResponse
    >({
      createContext,
      req: context.req,
      res: context.res,
      path: endpoint,
      router,
    })
  }

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
