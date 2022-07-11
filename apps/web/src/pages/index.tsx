import React from "react"
import { GetStaticProps } from "next"

import SEO from "components/Common/SEO"
import { Greeting } from "components/Home/Greeting"
import { AboutMe } from "components/Home/AboutMe"
import {
  LatestBlogPosts,
  LatestBlogPostsProps,
} from "components/Home/LatestBlogPosts"
import { listPosts } from "services/blog"

type HomeProps = {
  latestPosts: LatestBlogPostsProps["posts"]
}

const Home = ({ latestPosts }: HomeProps) => (
  <div className="w-full flex flex-col flex-1">
    <SEO
      title="Nick Van Dyck | nvd.codes"
      description="Hi, I'm Nick and this is my blog. This is the place where I share about my experiences as I journey through the world of Software Engineering."
      openGraph={{
        type: "website",
        url: "https://nvd.codes",
      }}
    />
    <Greeting
      githubUrl="https://github.com/vandycknick"
      siteUrl="https://nvd.codes"
      twitterUrl="https://twitter.com/vandycknick"
    />
    <AboutMe />
    <LatestBlogPosts posts={latestPosts} />
  </div>
)

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const [posts] = await listPosts({
    page: 1,
    count: 4,
    fields: [
      "title",
      "description",
      "cover",
      "placeholder",
      "date",
      "readingTime",
      "categories",
      "slug",
    ],
  })

  return {
    props: {
      latestPosts: posts,
    },
  }
}

export default Home
