import React from "react"
import { css } from "@emotion/core"

import SEO from "components/Common/SEO"
import { Greeting } from "components/Home/Greeting"
import {
  RecentBlogPosts,
  LatestPostsProps,
} from "components/Home/RecentBlogPosts"
import { LatestActivities } from "components/Home/LatestActivities"
import { spacing } from "components/Tokens"
import { Divider } from "components/Common/Divider"
import { GetStaticProps } from "next"
import { getLatestPosts } from "services/getLatestPosts"

interface HomeProps {
  latestPosts: LatestPostsProps["posts"]
}

const Home: React.FC<HomeProps> = ({ latestPosts }) => (
  <>
    <SEO title="Home" />
    <Greeting
      githubUrl="https://github.com/nickvdyck"
      siteUrl="https://nvd.codes"
      twitterUrl="https://twitter.com/vandycknick"
    />
    <Divider />
    <RecentBlogPosts
      css={css`
        margin: ${spacing[6]} 0;
      `}
      posts={latestPosts}
    />
    <Divider />
    <LatestActivities
      css={css`
        margin: ${spacing[6]} 0;
      `}
    />
  </>
)

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const latestPosts = await getLatestPosts(3, [
    "title",
    "description",
    "date",
    "readingTime",
    "slug",
  ])

  return {
    props: {
      latestPosts,
    },
  }
}

export default Home
