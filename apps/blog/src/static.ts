import { basename, resolve, join } from "node:path"
import serve from "koa-static"
import mount from "koa-mount"

import { getConfig } from "./config"

export const servePostsDirectory = () => {
  const config = getConfig()
  const absolutePath = resolve(config.postsDirectory)
  const path = join("/", basename(absolutePath))

  return mount(path, serve(absolutePath))
}
