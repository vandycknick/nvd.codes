import { promises } from "fs"
import { join, dirname } from "path"
import { Post } from "@nvd.codes/core"

const { readFile, writeFile, mkdir, unlink } = promises

import { getAllSlugs, watchSlugs } from "services/getAllSlugs"
import { getPostBySlug } from "services/getPostBySlug"
import { noop } from "utils"

export const BLOG_INDEX_CACHE = join(
  process.cwd(),
  ".next/cache",
  "blog-index-cache.json",
)

export const purgePostsCache = async (): Promise<void> => {
  try {
    await unlink(BLOG_INDEX_CACHE)
  } catch (_) {
    //** Not used */
  }
}

export const watchAllPosts = async () => {
  const watcher = watchSlugs()
  process.on("exit", watcher.close)

  while (watcher.open) {
    let posts: Post[] | undefined = undefined
    const slug = await watcher.next()

    try {
      posts = JSON.parse(await readFile(BLOG_INDEX_CACHE, "utf8"))
    } catch (_) {
      // Ignore errors here
      continue
    }
    const post = await getPostBySlug(slug.slug)
    const old = posts?.findIndex((p) => p.slug == post.slug)

    if (old !== undefined && posts !== undefined) {
      // eslint-disable-next-line no-console
      console.log(`Updating post ${post.slug}`)
      posts[old] = post
      await writeFile(BLOG_INDEX_CACHE, JSON.stringify(posts), "utf8").catch(
        noop,
      )
    }
  }
}

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
    await writeFile(BLOG_INDEX_CACHE, JSON.stringify(posts), "utf8").catch(noop)
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
