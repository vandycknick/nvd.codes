// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../next-env.d.ts" />

import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import next from "next"

import { purgePostsCache } from "services/getAllPosts"

const port = 3000
const app = next({ dev: true })
const handle = app.getRequestHandler()

async function main(): Promise<void> {
  const server = express()
  const apiProxy = createProxyMiddleware({
    target: "http://0.0.0.0:7071",
  })

  await purgePostsCache()
  await app.prepare()

  server.use("/api", apiProxy)

  server.all("*", (req, res) => handle(req, res))

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`)
  })
}

main()
