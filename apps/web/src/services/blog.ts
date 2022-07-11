import { createTRPCClient } from "@trpc/client"
import type { BlogRouter } from "@nvd.codes/blog"
import type { Post } from "@nvd.codes/blog-engine"
import { getConfig } from "config"

const config = getConfig()

const client = createTRPCClient<BlogRouter>({
  url: config.blogApiEndpoint,
})

type GetPostBySlugOptions<P> = {
  slug: string
  fields?: P[]
}

const createPartial = <M, P extends keyof M>(
  model: M,
  fields?: P[],
): Pick<M, P> => {
  if (fields === undefined || fields.length === 0) {
    return model
  }

  const partial =
    fields?.reduce((partial, field) => {
      partial[field] = model[field]
      return partial
    }, {} as Pick<M, P>) ?? model

  return partial
}

export const getPostBySlug = async <P extends keyof Post>({
  slug,
  fields = [],
}: GetPostBySlugOptions<P>) => {
  const post = await client.query("posts/getPostBySlug", { slug })

  if (post === undefined) {
    return
  }
  return createPartial(post, fields)
}

export const getAllPosts = async <P extends keyof Post>(
  fields: P[],
): Promise<Pick<Post, P>[]> => {
  const posts = await client.query("posts/getAllPosts")
  return posts.map((p) => createPartial(p, fields))
}

type ListPostsOptions<P> = {
  page?: number
  count?: number
  fields?: P[]
}

export const listPosts = async <P extends keyof Post>(
  { page = 1, count = 10, fields }: ListPostsOptions<P> = {
    page: 1,
    count: 10,
    fields: [],
  },
): Promise<[Pick<Post, P>[], { current: number; total: number }]> => {
  const skip = count * (page - 1)
  const take = count * page

  const response = await client.query("posts/getPosts", {
    take,
    skip,
  })

  const pager = {
    current: page,
    total: Math.ceil(response.total / count),
  }

  const posts = response.posts.map((post) => createPartial(post, fields))
  return [posts, pager]
}

export const getPostContent = (post: Post) =>
  client.query("posts/getContent", { slug: post.slug })
