import React, { Fragment } from "react"
import { GetStaticProps } from "next"
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react"
import NextLink from "next/link"

import SEO from "components/Common/SEO"
import { PostsList, PostsListProps } from "components/Blog/PostsList"
import { getAllPosts } from "services/getAllPosts"

type BlogProps = {
  posts: PostsListProps["posts"]
  pager: {
    pages: number
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
        Page {pager.current} of {pager.pages}
      </Text>
      {pager.current === pager.pages ? (
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

export const getStaticProps: GetStaticProps<BlogProps> = async ({ params }) => {
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
  const pages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const page = params?.page ?? 1
  const current = Array.isArray(page) ? 1 : parseInt(`${page}`, 10)

  const start = (current - 1) * POSTS_PER_PAGE
  const end = current * POSTS_PER_PAGE

  return {
    props: {
      posts: posts
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
        .slice(start, end),
      pager: {
        pages,
        current,
      },
    },
  }
}

export default Blog
