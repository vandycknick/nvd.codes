import React, { Fragment } from "react"
import { GetStaticProps } from "next"
import { Heading, Text, VStack } from "@chakra-ui/react"

import SEO from "components/Common/SEO"
import { PostsList, PostsListProps } from "components/Blog/PostsList"
import { getAllPosts } from "services/getAllPosts"

type BlogProps = {
  postPreviews: PostsListProps["posts"]
}

const Blog = ({ postPreviews }: BlogProps) => (
  <Fragment>
    <SEO title="Blog" />
    <VStack as="section" justify="center">
      <Heading size="xl" pb={4}>
        Blog
      </Heading>
      <Text>
        Actively writing about technology, life-events and indie hacking. Here
        are some of my most recent thoughts and hacks I&#39;ve published.
      </Text>
    </VStack>
    <PostsList posts={postPreviews} />
  </Fragment>
)

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const posts = await getAllPosts([
    "id",
    "title",
    "description",
    "date",
    "slug",
    "readingTime",
    "categories",
    "cover",
  ])

  return {
    props: {
      postPreviews: posts.sort((post1, post2) =>
        post1.date > post2.date ? -1 : 1,
      ),
    },
  }
}

export default Blog
