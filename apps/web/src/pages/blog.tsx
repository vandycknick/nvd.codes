import React, { Fragment } from "react"
import { GetServerSideProps } from "next"
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react"
import NextLink from "next/link"

import SEO from "components/Common/SEO"
import { PostsList, PostsListProps } from "components/Blog/PostsList"
import { listPosts } from "services/blog"

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
    <Box d="flex" justifyContent="center" py={4}>
      {pager.current < 2 ? (
        <Button colorScheme="teal" size="sm" w="70px" disabled>
          Previous
        </Button>
      ) : (
        <NextLink
          href={pager.current === 2 ? "/blog" : "/blog/[page]"}
          as={`/blog/${pager.current === 2 ? "" : pager.current - 1}`}
          passHref
        >
          <Button colorScheme="teal" size="sm" w="70px" as="a">
            Previous
          </Button>
        </NextLink>
      )}

      <Text d="flex" alignItems="center" mx={4}>
        Page {pager.current} of {pager.total}
      </Text>
      {pager.current === pager.total ? (
        <Button colorScheme="teal" size="sm" w="70px" disabled>
          Next
        </Button>
      ) : (
        <NextLink
          href="/blog/[page]"
          as={`/blog/${pager.current + 1}`}
          passHref
        >
          <Button colorScheme="teal" size="sm" w="70px" as="a">
            Next
          </Button>
        </NextLink>
      )}
    </Box>
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
}

export default Blog
