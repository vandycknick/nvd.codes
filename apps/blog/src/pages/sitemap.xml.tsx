import React, { Fragment } from "react"
import { GetServerSideProps } from "next"
import { SitemapStream, streamToPromise } from "sitemap"
import { listPosts } from "services/blog"
import { Readable } from "stream"

const Sitemap = () => <Fragment />

const defaultz = [
  {
    url: "/",
    changefreq: "daily",
  },
  {
    url: "/blog",
    changefreq: "daily",
  },
  {
    url: "/about",
    changefreq: "weekly",
  },
]

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const stream = new SitemapStream({ hostname: "https://nvd.codes" })
  const page = 1

  const [firstPage, pager] = await listPosts({
    page,
    count: 9,
    fields: ["id", "title", "slug"],
  })

  const promises = Array(pager.total)
    .fill(0)
    .map(async (_, index) => {
      if (index === 0) {
        return firstPage
      }

      const [posts] = await listPosts({
        page: page + index,
        count: 9,
        fields: ["id", "title", "slug"],
      })
      return posts
    })

  const pages = await Promise.all(promises)

  Readable.from(defaultz).pipe(stream)

  pages.forEach((posts, index) => {
    if (index > 0) {
      stream.write({ url: `/blog/${index + 1}`, changefreq: "weekly" })
    }

    posts.forEach((post) =>
      stream.write({
        url: `/post/${post.slug}`,
        changefreq: "daily",
        priority: 0.7,
      }),
    )
  })

  res.setHeader("Content-Type", "text/xml")

  const xml = await streamToPromise(stream)

  res.end(xml)

  return {
    props: {},
  }
}

export default Sitemap
