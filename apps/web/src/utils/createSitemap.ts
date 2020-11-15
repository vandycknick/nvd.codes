import { SitemapStream, streamToPromise } from "sitemap"
import { Readable } from "stream"
import { join } from "path"
import { promises } from "fs"

import { getAllSlugs } from "../services/getAllSlugs"

const { writeFile } = promises
const DIST = ".dist"

const links = ["/", "/blog", "/about"]
const stream = new SitemapStream({ hostname: "https://nvd.codes" })

const createSitemap = async () => {
  const slugs = await getAllSlugs()
  const posts = slugs.map((s) => `/post/${s.slug}`)
  const all = ([] as string[]).concat(links, posts)
  const sitemap = await streamToPromise(Readable.from(all).pipe(stream))
  return sitemap.toString()
}

const main = async () => {
  const sitemap = await createSitemap()
  const filepath = join(process.cwd(), DIST, "sitemap.xml")

  await writeFile(filepath, sitemap)
}

main()
