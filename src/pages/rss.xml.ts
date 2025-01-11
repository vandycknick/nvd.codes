import type { APIRoute } from "astro"
import rss from "@astrojs/rss"
import { getCollection } from "astro:content"

export const GET: APIRoute = async function get({ site }) {
  const posts = await getCollection("blog", (post) => !post.data.draft)
  const sorted = posts.sort(
    (l, r) => r.data.date.getTime() - l.data.date.getTime(),
  )

  return rss({
    // `<title>` field in output xml
    title: "Nick Van Dyck's Blog",
    // `<description>` field in output xml
    description: "",
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: site?.toString() ?? "",
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/post/${post.id}`,
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
    stylesheet: "/rss/styles.xsl",
  })
}
