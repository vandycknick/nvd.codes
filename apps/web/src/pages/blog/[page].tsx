import { GetStaticPaths } from "next"
import { getAllPosts } from "services/getAllPosts"
import Blog from "../blog"

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
}

export { getStaticProps } from "../blog"

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts(["title", "slug"])
  const pages = Math.ceil(posts.length / 9)

  return {
    paths: range(2, pages).map((page) => {
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
