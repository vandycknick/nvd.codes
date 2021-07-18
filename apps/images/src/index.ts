import Koa from "koa"
import Router from "@koa/router"
import loggerMiddleware from "koa-bunyan-logger"
import { createLogger } from "bunyan"

import { getConfig } from "./config"
import imageOptimizer from "./controllers/imageOptimizer"
import { getHealth } from "./controllers/getHealth"

const app = new Koa()
const router = new Router()
const config = getConfig()
const logger = createLogger({
  name: "app",
  level: config.logLevel,
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

router.get("/health", async (ctx) => {
  const result = await getHealth(ctx)
  ctx.set(result.headers ?? {})
  ctx.status = result.status
  ctx.body = result.body
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx) => {
  const result = await imageOptimizer(ctx)

  ctx.set(result.headers ?? {})
  ctx.status = result.status
  ctx.body = result.body
})

app.listen(config.port, () =>
  logger.info(`Server listening on ${config.port}!`),
)
