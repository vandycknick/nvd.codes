import React, { Fragment } from "react"
import { GetServerSideProps } from "next"
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
import { Post, Image } from "@nvd.codes/contracts"

import SEO from "components/Common/SEO"
import { CommentList } from "components/BlogPost/CommentList"
import Time from "components/Common/Time"
import { Calendar } from "components/BlogPost/Icons/Calendar"
import { Edit } from "components/BlogPost/Icons/Edit"
import { Time as TimeIcon } from "components/BlogPost/Icons/Time"
import { Contents } from "components/BlogPost/Content"

import { getPostBySlug } from "services/blog"

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
  > & { images: Image[] }
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
        <Contents
          images={post.images.reduce((map, image) => {
            map[image.url] = image.placeholder
            return map
          }, {} as Record<string, string>)}
        >
          {post.content}
        </Contents>
      </Box>
      <Divider my={6} />
      <CommentList slug={post.slug} />
    </Fragment>
  )
}

const notFound = (): { notFound: true } => ({
  notFound: true,
})

export const getServerSideProps: GetServerSideProps<
  BlogPostProps,
  BlogPostParams
> = async ({ params }) => {
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
      "images",
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

export default BlogPost
