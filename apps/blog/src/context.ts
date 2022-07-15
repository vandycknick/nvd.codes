import { inferAsyncReturnType } from "@trpc/server"
import { createBlogEngine, Post } from "@nvd.codes/blog-engine"
import { memoize } from "@nvd.codes/utils"

import { watch } from "chokidar"

import { getConfig } from "./config"

const createBlogEngineWithCache = memoize(() => {
  const config = getConfig()
  const engine = createBlogEngine({
    directory: config.postsDirectory,
    ignoreDirs: config.postsIgnoreDirs,
  })
  let cache: Promise<Post[]> | undefined

  const watcher = watch(config.postsDirectory)

  watcher
    .on("add", () => {
      cache = engine.getAllPosts()
    })
    .on("change", () => {
      cache = engine.getAllPosts()
    })

  return {
    ...engine,
    getAllPosts: async () => {
      if (cache === undefined) {
        cache = engine.getAllPosts()
      }
      const posts = await cache
      return posts
    },
  }
})

export const createContext = async () => {
  const config = getConfig()
  const engine = createBlogEngineWithCache()
  return { engine, config }
}

export type AppContext = inferAsyncReturnType<typeof createContext>
