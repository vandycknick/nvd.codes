// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./lib.d.ts" />
import Koa from "koa"
import { createLogger } from "bunyan"
import loggerMiddleware from "koa-bunyan-logger"
import Router from "@koa/router"
import bodyParser from "koa-bodyparser"
import { createBlogRouter } from "@nvd.codes/contracts"

import { createKoaMiddleware } from "./utils"
import { AppContext, createContext } from "./context"
import { getHealth } from "./controllers/getHealth"
import { getPostBySlug } from "./controllers/getPostBySlug"
import { syncPosts } from "./controllers/syncPosts"
import { listPosts } from "./controllers/listPosts"

const router = new Router()
const app = new Koa()
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

//TODO: FIX THIS
app.use(async (ctx, next) => {
  await createContext(ctx)
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
    router: createBlogRouter<AppContext>({
      getPostBySlug,
      listPosts,
    }),
    createContext,
  }),
)

app.listen(3000, () => logger.info("Server listening on 3000"))
