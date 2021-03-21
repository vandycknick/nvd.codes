/* eslint-disable no-console */
import {
  BlogClient,
  GetPostBySlugRequest,
  ListPostsRequest,
  Post,
} from "@nvd.codes/blog-proto"
import { credentials } from "@grpc/grpc-js"
import { getEnvVar } from "../src/utils"

const addressOrNone = getEnvVar("ADDRESS")

if (addressOrNone.isNone()) {
  throw new Error("Required environment variable ADDRESS not defined!")
}

const address = addressOrNone.unwrap()
const client = new BlogClient(address, credentials.createInsecure())

const getPostBySlug = async (slug: string): Promise<Post> => {
  return new Promise((res, rej) => {
    const request = new GetPostBySlugRequest()
    request.setSlug(slug)
    client.getPostBySlug(request, (err, response) => {
      if (err) {
        return rej(err)
      }

      res(response)
    })
  })
}

const listPosts = async (page: number, count: number): Promise<Post[]> => {
  return new Promise((res, rej) => {
    const request = new ListPostsRequest().setPage(page).setCount(count)

    client.listPosts(request, (err, response) => {
      if (err) {
        return rej(err)
      }

      res(response.getPostsList())
    })
  })
}

const main = async (): Promise<void> => {
  const action = process.argv[2] as "get" | "list"

  switch (action) {
    case "get": {
      const slug = process.argv[3]
      if (slug === undefined) {
        throw new Error("No url given!")
      }
      const post = await getPostBySlug(slug)
      console.log(post.toObject())
      break
    }
    case "list": {
      const posts = await listPosts(1, 10)
      posts.forEach((p) => console.log(p.getTitle()))
      break
    }
    default:
      throw new Error("Invalid option")
  }
}

main().catch((err) => console.error(err))
