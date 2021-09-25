// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./lib.d.ts" />
import Koa from "koa"
import { createLogger } from "bunyan"
import loggerMiddleware from "koa-bunyan-logger"
import Router from "@koa/router"
import bodyParser from "koa-bodyparser"
import { createBlogRouter } from "@nvd.codes/contracts"

import { createKoaMiddleware } from "./utils"
import { createContext } from "./context"
import { getHealth } from "./controllers/getHealth"
import { getPostBySlug } from "./controllers/getPostBySlug"
import { syncPosts } from "./controllers/syncPosts"
import { listPosts } from "./controllers/listPosts"
import { getConfig } from "./config"

const router = new Router()
const app = new Koa()
const config = getConfig()
const logger = createLogger({
  name: "app",
  level: "info",
})

app.use(loggerMiddleware(logger))
app.use(loggerMiddleware.requestIdContext())

app.use(async (ctx, next) => {
  const logger = ctx.log
  await next()
  logger.info({
    request: ctx.request,
    response: ctx.response,
  })
})

//TODO: Required for non trpc endpoints. Because otherwise they don't work before executing a trpc call.
app.use(async (_, next) => {
  await createContext()
  await next()
})

router.get("/health", async (ctx) => {
  const result = await getHealth(ctx)
  ctx.set(result.headers ?? {})
  ctx.status = result.status
  ctx.body = result.body
})

router.post("/blog/sync", bodyParser(), async (ctx) => {
  const result = await syncPosts(ctx)
  ctx.set(result.headers ?? {})
  ctx.status = result.status
  ctx.body = result.body
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(
  createKoaMiddleware({
    router: createBlogRouter({
      getPostBySlug,
      listPosts,
    }),
    createContext,
  }),
)

app.listen(config.port, () => logger.info(`Server listening on ${config.port}`))
