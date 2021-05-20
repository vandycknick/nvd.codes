import React, { Fragment } from "react"
import { GetStaticProps, GetStaticPaths } from "next"
import ErrorPage from "next/error"
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
import { Contents } from "components/BlogPost/Content"

import { getPostBySlug, listAllPosts } from "services/posts"
import { Post } from "@nvd.codes/blog-proto"

type BlogPostProps = {
  post?: Pick<
    Post.AsObject,
    | "title"
    | "description"
    | "date"
    | "slug"
    | "readingTime"
    | "content"
    | "editUrl"
  >
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

const notFound = (): { notFound: true } => ({
  notFound: true,
})

export const getStaticProps: GetStaticProps<BlogPostProps, BlogPostParams> =
  async ({ params }) => {
    const slug = params?.slug

    if (slug === undefined) {
      return notFound()
    }

    const post = await getPostBySlug({
      slug,
      fields: [
        "id",
        "title",
        "description",
        "date",
        "slug",
        "readingTime",
        "content",
        "editUrl",
      ],
    })

    if (post === undefined) {
      return notFound()
    }
    return {
      props: {
        post,
      },
    }
  }

export const getStaticPaths: GetStaticPaths<BlogPostParams> = async () => {
  const posts = await listAllPosts(["slug"])

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
