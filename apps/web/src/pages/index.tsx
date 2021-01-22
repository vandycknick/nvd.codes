import React, { Fragment } from "react"
import { GetStaticProps } from "next"

import SEO from "components/Common/SEO"
import { Greeting } from "components/Home/Greeting"
import {
  RecentBlogPosts,
  LatestPostsProps,
} from "components/Home/RecentBlogPosts"
import { LatestActivities } from "components/Home/LatestActivities"
import { getLatestPosts } from "services/getLatestPosts"

interface HomeProps {
  latestPosts: LatestPostsProps["posts"]
}

const Home: React.FC<HomeProps> = ({ latestPosts }) => (
  <Fragment>
    <SEO title="Home" />
    <Greeting
      githubUrl="https://github.com/nickvdyck"
      siteUrl="https://nvd.codes"
      twitterUrl="https://twitter.com/vandycknick"
    />
    <RecentBlogPosts posts={latestPosts} />
    <LatestActivities />
  </Fragment>
)

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const latestPosts = await getLatestPosts(3, [
    "title",
    "description",
    "date",
    "readingTime",
    "slug",
    "categories",
  ])

  return {
    props: {
      latestPosts,
    },
  }
}

export default Home
