import Koa from "koa"
import { createLogger } from "bunyan"
import loggerMiddleware from "koa-bunyan-logger"

import { createContext } from "./context"
import { getConfig } from "./config"
import { blogRouter } from "./router"
import { createKoaMiddleware } from "./utils"
import { servePostsDirectory } from "./static"

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

app.use(servePostsDirectory())

app.use(
  createKoaMiddleware({
    router: blogRouter,
    createContext,
  }),
)

export const startServer = () => {
  const config = getConfig()
  app.listen(config.port, () =>
    logger.info(`Server listening on ${config.port}`),
  )
}
