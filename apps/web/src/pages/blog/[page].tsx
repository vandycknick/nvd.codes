import { GetStaticPaths } from "next"
import { listPosts } from "services/blog"

import Blog from "../blog"

export { getStaticProps } from "../blog"

const POSTS_PER_PAGE = 9

export const getStaticPaths: GetStaticPaths = async () => {
  const [, pager] = await listPosts({
    page: 1,
    count: POSTS_PER_PAGE,
    fields: ["slug"],
  })

  return {
    paths: Array.from(Array(pager.total).keys())
      .map((page) => page + 1)
      .map((page) => ({
        params: { page: `${page}` },
      })),
    fallback: false,
  }
}

export default Blog
