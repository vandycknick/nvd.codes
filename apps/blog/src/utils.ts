import {
  AnyRouter,
  inferRouterContext,
  resolveHTTPResponse,
} from "@trpc/server"
import { Middleware } from "koa"

export const createKoaMiddleware =
  <TRouter extends AnyRouter>({
    router,
    createContext,
  }: {
    router: TRouter
    createContext: () => Promise<inferRouterContext<TRouter>>
  }): Middleware =>
  async (context) => {
    const endpoint = context.request.path.substring(1) ?? ""

    const request = {
      method: context.request.method,
      query: new URLSearchParams(context.request.querystring),
      headers: context.request.headers,
      body: context.body,
    }

    const response = await resolveHTTPResponse({
      createContext,
      req: request,
      path: endpoint,
      router,
    })

    const headers = response.headers ?? {}

    Object.keys(headers).forEach((header) => {
      const value = headers[header]

      if (value !== undefined) {
        context.set(header, value)
      }
    })

    context.response.status = response.status
    context.response.body = response.body
  }
