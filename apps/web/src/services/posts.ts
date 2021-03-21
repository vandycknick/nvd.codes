import {
  BlogClient,
  GetPostBySlugRequest,
  ListPostsRequest,
  Post,
} from "@nvd.codes/blog-proto"
import { credentials } from "@grpc/grpc-js"
import { Empty } from "google-protobuf/google/protobuf/empty_pb"

const API = process.env["BLOG_API_ENDPOINT"]

if (API === undefined) {
  throw new Error("BLOG_API_ENDPOINT endpoint not defined!")
}

const client = new BlogClient(API, credentials.createInsecure())

type PartialPost<P extends keyof Post.AsObject> = Pick<Post.AsObject, P>

type GetPostBySlugOptions<P> = {
  slug: string
  fields?: P[]
}

const createPartialPost = <P extends keyof Post.AsObject>(
  post: Post,
  fields?: P[],
): PartialPost<P> => {
  const pObj = post.toObject()
  const partial =
    fields?.reduce((partial, field) => {
      partial[field] = pObj[field]
      return partial
    }, {} as Pick<Post.AsObject, P>) ?? pObj

  return partial
}

export const getPostBySlug = async <P extends keyof Post.AsObject>({
  slug,
  fields = [],
}: GetPostBySlugOptions<P>): Promise<PartialPost<P> | undefined> => {
  return new Promise((res, rej) => {
    const request = new GetPostBySlugRequest().setSlug(slug)
    client.getPostBySlug(request, (err, response) => {
      if (err) {
        return rej(err)
      }
      const partial = createPartialPost(response, fields)
      res(partial)
    })
  })
}

type ListPostsOptions<P> = {
  page?: number
  count?: number
  fields?: P[]
}

export const listAllPosts = async <P extends keyof Post.AsObject>(
  fields?: P[],
): Promise<PartialPost<P>[]> => {
  return new Promise((res, rej) => {
    const stream = client.listAllPosts(new Empty())
    const posts: Pick<Post.AsObject, P>[] = []

    stream.on("data", (post: Post) => {
      const partial = createPartialPost(post, fields)
      posts.push(partial)
    })
    stream.on("error", rej)
    stream.on("end", () => res(posts))
  })
}

export const listPosts = async <P extends keyof Post.AsObject>(
  { page = 1, count = 10, fields }: ListPostsOptions<P> = {
    page: 1,
    count: 10,
    fields: [],
  },
): Promise<[Pick<Post.AsObject, P>[], { current: number; total: number }]> => {
  return new Promise((res, rej) => {
    const request = new ListPostsRequest().setPage(page).setCount(count)

    client.listPosts(request, (err, response) => {
      if (err) {
        return rej(err)
      }

      const posts = response
        .getPostsList()
        .map((post) => createPartialPost(post, fields))

      const pager = {
        current: response.getCurrentPage(),
        total: response.getTotalPages(),
      }

      res([posts, pager])
    })
  })
}
