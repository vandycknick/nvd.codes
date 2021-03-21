import { GetStaticPaths } from "next"

import { listPosts } from "services/posts"
import Blog from "../blog"

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
}

export { getStaticProps } from "../blog"

export const getStaticPaths: GetStaticPaths = async () => {
  const [, pager] = await listPosts({
    page: 1,
    count: 9,
    fields: ["title", "slug"],
  })
  const pages = pager.total

  return {
    paths: range(1, pages).map((page) => {
      return {
        params: {
          page: `${page}`,
        },
      }
    }),
    fallback: false,
  }
}

export default Blog
