import Koa from "koa"
import loggerMiddleware from "koa-bunyan-logger"
import { createLogger } from "bunyan"

import { getConfig } from "./config"
import imageOptimizer from "./controllers/imageOptimizer"

const app = new Koa()
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

app.use(async (context) => {
  const result = await imageOptimizer(context)

  context.set(result.headers ?? {})
  context.status = result.status
  context.body = result.body
})

app.listen(config.port, () =>
  logger.info(`Server listening on ${config.port}!`),
)
