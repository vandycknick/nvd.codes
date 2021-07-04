import Router from "koa-router"
import getActivities from "./controllers/getActivities"
import getComments from "./controllers/getComments"

const router = new Router()

router.get("/comments/:slug", async (ctx) => {
  const response = await getComments(ctx)
  ctx.set(response.headers ?? {})
  ctx.status = response.status
  ctx.body = response.body
})

router.get("/project/activities", async (ctx) => {
  const response = await getActivities(ctx)
  ctx.set(response.headers ?? {})
  ctx.status = response.status
  ctx.body = response.body
})

router.get("/health", async (ctx) => {
  ctx.status = 200
  ctx.body = "Ok"
})

export { router }
