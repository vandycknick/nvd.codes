import { getAllPosts } from "services/getAllPosts"
import { Post } from "domain/blog"

export const getLatestPosts = async <P extends keyof Post>(
  count = 1,
  fields: P[] = [],
): Promise<Pick<Post, P>[]> => {
  const posts = await getAllPosts(["date", ...fields])
  return posts
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
    .slice(0, count)
}
