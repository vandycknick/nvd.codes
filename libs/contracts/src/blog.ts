import * as trpc from "@trpc/server"
import { z } from "zod"

export interface Post {
  id: string
  title: string
  description: string
  date: string
  draft: boolean
  content: string
  categories: string[]
  slug: string
  readingTime: string
  cover: string
  placeholder: string
  placeholderCss: Record<string, string>
  editUrl: string
}

export interface Image {
  url: string
  placeholder: string
}

export interface GetPostBySlugRequest {
  slug: string
}

export interface GetPostBySlugResponse extends Post {
  images: Image[]
}

export interface ListPostsRequest {
  skip: number
  take: number
}

export interface ListPostsResponse {
  posts: Post[]
  total: number
}

export interface SyncPostsResponse {
  status?: "Ok" | "Error"
}

export interface BlogController<TContext> {
  getPostBySlug(props: {
    input: GetPostBySlugRequest
    ctx: TContext
  }): Promise<GetPostBySlugResponse>
  listPosts(props: {
    input: ListPostsRequest
    ctx: TContext
  }): Promise<ListPostsResponse>
}

export const createBlogRouter = <TContext>(ctrl: BlogController<TContext>) =>
  trpc
    .router<TContext>()
    .query("blog/posts/getBySlug", {
      input: z.object({ slug: z.string() }),
      resolve: ctrl.getPostBySlug.bind(ctrl),
    })
    .query("blog/posts/list", {
      input: z.object({
        skip: z.number(),
        take: z.number(),
      }),
      resolve: ctrl.listPosts.bind(ctrl),
    })

export type BlogRouter = ReturnType<typeof createBlogRouter>
