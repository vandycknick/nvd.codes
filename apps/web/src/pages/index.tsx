import React, { Fragment } from "react"
import { GetServerSideProps } from "next"

import SEO from "components/Common/SEO"
import { Greeting } from "components/Home/Greeting"
import {
  LatestArticles,
  LatestArticlesProps,
} from "components/Home/LatestArticles"
import { listPosts } from "services/blog"

interface HomeProps {
  latestPosts: LatestArticlesProps["posts"]
}

const Home: React.FC<HomeProps> = ({ latestPosts }) => (
  <Fragment>
    <SEO title="Home" />
    <Greeting
      githubUrl="https://github.com/nickvdyck"
      siteUrl="https://nvd.codes"
      twitterUrl="https://twitter.com/vandycknick"
    />
    <LatestArticles posts={latestPosts} />
  </Fragment>
)

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
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
