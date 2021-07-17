import {
  AnyRouter,
  CreateContextFn,
  CreateContextFnOptions,
  requestHandler,
} from "@trpc/server"
import { Middleware } from "koa"
import { IncomingMessage, ServerResponse } from "http"

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
