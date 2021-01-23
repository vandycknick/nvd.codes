import React, { Fragment } from "react"
import { GetStaticProps, GetStaticPaths } from "next"
import ErrorPage from "next/error"
import { Post } from "@nvd.codes/core"
import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"

import SEO from "components/Common/SEO"
import { CommentList } from "components/BlogPost/CommentList"
import Time from "components/Common/Time"
import { Calendar } from "components/BlogPost/Icons/Calendar"
import { Edit } from "components/BlogPost/Icons/Edit"
import { Time as TimeIcon } from "components/BlogPost/Icons/Time"
import { getAllPosts } from "services/getAllPosts"
import { Contents } from "components/BlogPost/Content"

type BlogPostProps = {
  post?: Pick<
    Post,
    | "title"
    | "description"
    | "date"
    | "slug"
    | "readingTime"
    | "content"
    | "editUrl"
  >
  pageContext: {
    previous: string | null
    next: string | null
  }
}

type BlogPostParams = {
  slug: string
}

const BlogPost = ({ post }: BlogPostProps) => {
  const iconColor = useColorModeValue("black", "white")

  if (post == null) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Fragment>
      <SEO title={post.title} description={post.description} />
      <Box as="article" w="100%" pb={4}>
        <VStack mb={8}>
          <Heading size="2xl" textAlign="center" pb={4}>
            {post.title}
          </Heading>
          <HStack spacing={6}>
            <Flex alignItems="center">
              <Calendar color={iconColor} width={5} height={5} mr={2} />
              <Time dateTime={post.date} />
            </Flex>
            <Flex alignItems="center">
              <Edit color={iconColor} width={5} height={5} mr={2} />
              <a href={post.editUrl}>suggest edit</a>
            </Flex>
            <Flex alignItems="center">
              <TimeIcon color={iconColor} width={5} height={5} mr={2} />
              {post.readingTime}
            </Flex>
          </HStack>
        </VStack>
        <Contents>{post.content}</Contents>
      </Box>
      <Divider my={6} />
      <CommentList slug={post.slug} />
    </Fragment>
  )
}

export const getStaticProps: GetStaticProps<
  BlogPostProps,
  BlogPostParams
> = async ({ params }) => {
  if (!params) return { props: { pageContext: { next: null, previous: null } } }

  const posts = await getAllPosts([
    "id",
    "title",
    "description",
    "date",
    "slug",
    "readingTime",
    "content",
    "editUrl",
  ])
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) return { props: { pageContext: { next: null, previous: null } } }

  const index = posts.findIndex((p) => p.id === post.id)

  return {
    props: {
      post,
      pageContext: {
        next: posts[index - 1]?.slug ?? null,
        previous: posts[index + 1]?.slug ?? null,
      },
    },
  }
}

export const getStaticPaths: GetStaticPaths<BlogPostParams> = async () => {
  const posts = await getAllPosts(["slug"])

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      }
    }),
    fallback: false,
  }
}

export default BlogPost
