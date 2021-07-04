import Koa from "koa"
import { router } from "./routes"

const app = new Koa()

app.use(router.routes()).use(router.allowedMethods())

// eslint-disable-next-line no-console
app.listen(3000, () => console.log("Server listening on 3000."))
