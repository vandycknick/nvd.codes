import {
  ServerUnaryCall,
  sendUnaryData,
  ServerWritableStream,
} from "@grpc/grpc-js"
import {
  GetPostBySlugRequest,
  IBlogServer,
  ListPostsRequest,
  ListPostsResponse,
  Post,
} from "@nvd.codes/blog-proto"
import { Empty } from "google-protobuf/google/protobuf/empty_pb"
import { AppConfig } from "./config"
import { ArgumentOutOfRangeError, InternalError } from "./errors"
import NotFoundError from "./errors/NotFoundError"
import { getPost } from "./posts/getPost"
import { getAllSlugs } from "./slugs/getAllSlugs"

export class BlogServer implements IBlogServer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any

  constructor(private readonly appConfig: AppConfig) {}

  async getPostBySlug(
    call: ServerUnaryCall<GetPostBySlugRequest, Post>,
    callback: sendUnaryData<Post>,
  ) {
    try {
      const slug = call.request.getSlug()

      const slugs = await getAllSlugs(this.appConfig.postsDirectory)

      const match = slugs.find((s) => s.slug === slug)

      if (match === undefined) {
        callback(new NotFoundError(`No posts found for ${slug}.`), null)
      } else {
        const post = await getPost(match.filePath, this.appConfig)
        callback(null, post)
      }
    } catch (err) {
      callback(new InternalError(err), null)
    }
  }

  async listAllPosts(call: ServerWritableStream<Empty, Post>) {
    const slugs = await getAllSlugs(this.appConfig.postsDirectory)

    for (const slug of slugs) {
      const post = await getPost(slug.filePath, this.appConfig)
      call.write(post)
    }

    call.end()
  }

  async listPosts(
    call: ServerUnaryCall<ListPostsRequest, ListPostsResponse>,
    callback: sendUnaryData<ListPostsResponse>,
  ) {
    try {
      const request = call.request

      const page = request.getPage()
      const count = request.getCount()

      if (page <= 0) {
        callback(
          new ArgumentOutOfRangeError("Page should be larger than 0."),
          null,
        )
        return
      }

      const slugs = await getAllSlugs(this.appConfig.postsDirectory)
      const promises = slugs.map((slug) =>
        getPost(slug.filePath, this.appConfig),
      )

      const posts = await Promise.all(promises)

      const sorted = posts.sort((post1, post2) =>
        new Date(post1.getDate()) > new Date(post2.getDate()) ? -1 : 1,
      )

      const response = new ListPostsResponse()

      const start = (page - 1) * count
      const end = page * count

      response.setPostsList(sorted.slice(start, end))
      response.setCurrentPage(page)
      response.setTotalPages(Math.ceil(sorted.length / count))
      callback(null, response)
    } catch (err) {
      callback(new InternalError(err), null)
    }
  }
}
