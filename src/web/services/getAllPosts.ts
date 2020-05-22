import { promises } from "fs"
import { join, dirname } from "path"
const { readFile, writeFile, mkdir, unlink } = promises

import { getAllSlugs } from "services/getAllSlugs"
import { getPostBySlug } from "services/getPostBySlug"
import { Post } from "domain/blog"

export const BLOG_INDEX_CACHE = join(
  process.cwd(),
  ".next/cache",
  "blog-index-cache.json",
)

export const purgePostsCache = async (): Promise<void> =>
  unlink(BLOG_INDEX_CACHE)

export const getAllPosts = async <P extends keyof Post>(
  fields: P[] = [],
): Promise<Pick<Post, P>[]> => {
  const slugs = await getAllSlugs()
  let posts: Post[] | undefined = undefined

  try {
    posts = JSON.parse(await readFile(BLOG_INDEX_CACHE, "utf8"))
  } catch (_) {
    /* not fatal */
  }

  if (posts == undefined) {
    // eslint-disable-next-line no-console
    console.log("Rebuilding posts catalog")
    posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug.slug)))
    await mkdir(dirname(BLOG_INDEX_CACHE), { recursive: true })
    await writeFile(
      BLOG_INDEX_CACHE,
      JSON.stringify(posts),
      "utf8",
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    ).catch(() => {})
  }

  return posts
    .filter((post) => !post.draft)
    .map((post) =>
      fields.reduce((partial, field) => {
        partial[field] = post[field]
        return partial
      }, {} as Pick<Post, P>),
    )
}
