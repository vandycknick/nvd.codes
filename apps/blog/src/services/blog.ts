import { createTRPCClient } from "@trpc/client"
import type { BlogRouter, Post, Image } from "@nvd.codes/contracts"
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
  const partial =
    fields?.reduce((partial, field) => {
      partial[field] = model[field]
      return partial
    }, {} as Pick<M, P>) ?? model

  return partial
}

export const getPostBySlug = async <
  P extends keyof (Post & { images: Image[] }),
>({
  slug,
  fields = [],
}: GetPostBySlugOptions<P>) => {
  const post = await client.query("blog/posts/getBySlug", { slug })
  return createPartial(post, fields)
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

  const response = await client.query("blog/posts/list", {
    skip,
    take,
  })

  const pager = {
    current: page,
    total: Math.ceil(response.total / count),
  }

  const posts = response.posts.map((post) => createPartial(post, fields))
  return [posts, pager]
}
