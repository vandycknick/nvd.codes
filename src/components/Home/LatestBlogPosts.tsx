import Time from "../Time"
import { Container } from "@/components/Container"

type LatestPost = {
  title: string
  description: string
  date: Date
  slug: string
  cover: {
    src: string
    width: number
    height: number
    format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif"
  }
}

export type LatestBlogPostsProps = {
  className?: string
  posts: LatestPost[]
}

export const LatestBlogPosts = ({ posts }: LatestBlogPostsProps) => (
  <Container.Outer as="section" className="py-16">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
          From my blog
        </h2>
        <p className="mt-2 text-base leading-8 text-zinc-600 dark:text-zinc-400">
          A brief overview of some of the things I wrote recently. But fear not,
          there is more!
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-zinc-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
          >
            <img
              src={post.cover.src}
              alt=""
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/40" />
            <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-zinc-950/10" />

            <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-zinc-300">
              <Time dateTime={post.date} format="slick" className="mr-8" />
              <div className="-ml-4 flex items-center gap-x-4">
                <svg
                  viewBox="0 0 2 2"
                  className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="flex gap-x-2.5">
                  <img
                    src="/images/me.jpg"
                    alt=""
                    className="h-6 w-6 flex-none rounded-full bg-white/10"
                  />
                  Nick Van Dyck
                </div>
              </div>
            </div>
            <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
              <a href={`/post/${post.slug}`}>
                <span className="absolute inset-0" />
                {post.title}
              </a>
            </h3>
          </article>
        ))}
      </div>
    </div>
  </Container.Outer>
)
