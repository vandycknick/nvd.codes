import React, { Fragment } from "react"
import { GetServerSideProps } from "next"
import { Heading, Text, VStack } from "@chakra-ui/react"

import SEO from "components/Common/SEO"
import { PostsList, PostsListProps } from "components/Blog/PostsList"
import { listPosts } from "services/blog"
import { PostsPager } from "components/Blog/PostsPager"

type BlogProps = {
  posts: PostsListProps["posts"]
  pager: {
    total: number
    current: number
  }
}

const Blog = ({ posts, pager }: BlogProps) => (
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
    <PostsList posts={posts} />
    <PostsPager {...pager} />
  </Fragment>
)

const POSTS_PER_PAGE = 9

export const getServerSideProps: GetServerSideProps<BlogProps> = async ({
  params,
}) => {
  const page =
    params !== undefined
      ? Array.isArray(params.page)
        ? parseInt(params.page[0], 10)
        : parseInt(params.page ?? "1", 10)
      : 1

  try {
    const [posts, pager] = await listPosts({
      page,
      count: POSTS_PER_PAGE,
      fields: [
        "id",
        "title",
        "description",
        "date",
        "slug",
        "readingTime",
        "categories",
        "cover",
        "placeholderCss",
      ],
    })

    return {
      props: {
        posts,
        pager,
      },
    }
  } catch (error) {
    // TODO: Improve error handling
    return {
      props: {},
      notFound: true,
    }
  }
}

export default Blog
