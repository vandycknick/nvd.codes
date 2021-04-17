import { SitemapStream, streamToPromise } from "sitemap"
import { Readable } from "stream"
import { join } from "path"
import { promises } from "fs"

import { listAllPosts } from "../services/posts"

const { writeFile } = promises
const DIST = ".dist"

const links = ["/", "/blog", "/about"]
const stream = new SitemapStream({ hostname: "https://nvd.codes" })

const createSitemap = async () => {
  const posts = await listAllPosts()
  const slugs = posts.map((post) => `/post/${post.slug}`)
  const all = ([] as string[]).concat(links, slugs)
  const sitemap = await streamToPromise(Readable.from(all).pipe(stream))
  return sitemap.toString()
}

const main = async () => {
  const sitemap = await createSitemap()
  const filepath = join(process.cwd(), DIST, "sitemap.xml")

  await writeFile(filepath, sitemap)
}

main()
