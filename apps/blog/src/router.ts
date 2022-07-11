import * as trpc from "@trpc/server"
import { z } from "zod"
import { clamp } from "@nvd.codes/utils"

import { AppContext } from "./context"
import { getRenderablePostFromCache, saveRenderablePostToCache } from "./cache"

export const blogRouter = trpc
  .router<AppContext>()
  .query("posts/getPostBySlug", {
    input: z.object({ slug: z.string() }),
    resolve: async ({ ctx, input }) => {
      const { engine } = ctx
      const { slug } = input
      const posts = await engine.getAllPosts()
      const post = posts.find((post) => post.slug === slug)
      return post
    },
  })
  .query("posts/getPosts", {
    input: z.object({
      take: z.number(),
      skip: z.number().optional().default(0),
    }),
    resolve: async ({ ctx, input }) => {
      const { engine } = ctx
      const { take, skip } = input
      const posts = await engine.getAllPosts()
      const sorted = posts.sort(
        (l, r) => new Date(r["date"]).getTime() - new Date(l["date"]).getTime(),
      )
      const lower = clamp(skip - 1, 0, posts.length)
      const upper = clamp(take + skip, 0, posts.length)
      return {
        posts: sorted.slice(lower, upper),
        total: posts.length,
      }
    },
  })
  .query("posts/getAllPosts", {
    resolve: async ({ ctx }) => {
      const { engine } = ctx
      const posts = engine.getAllPosts()
      return posts
    },
  })
  .query("posts/getContent", {
    input: z.object({ slug: z.string() }),
    resolve: async ({ ctx, input }) => {
      const { slug } = input
      const { engine, config } = ctx

      const post = (await engine.getAllPosts()).find(
        (post) => post.slug === slug,
      )

      if (post === undefined) {
        return undefined
      }

      const renderableCached = await getRenderablePostFromCache(
        post.slug,
        config.cachePath,
      )

      if (
        renderableCached !== undefined &&
        post.sha256 === renderableCached.sha256
      ) {
        return renderableCached.tree
      }

      const renderable = await engine.getRenderablePost(post.filePath)
      await saveRenderablePostToCache(renderable, config.cachePath)
      return renderable.tree
    },
  })

export type BlogRouter = typeof blogRouter
