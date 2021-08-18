import React from "react"
import NextLink from "next/link"
import { Post } from "@nvd.codes/contracts"
import {
  Box,
  Flex,
  Heading,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { TimeIcon, CalendarIcon } from "@chakra-ui/icons"

import Time from "components/Common/Time"
import { Image } from "components/Common/Image"

type PostPreview = Pick<
  Post,
  | "id"
  | "title"
  | "description"
  | "date"
  | "slug"
  | "readingTime"
  | "categories"
  | "cover"
  | "placeholderCss"
>

export type PostCardProps = {
  post: PostPreview
}

export const PostCard = ({ post }: PostCardProps) => {
  const bg = useColorModeValue("transparent", "gray.700")
  const textColor = useColorModeValue("gray.700", "gray.200")
  return (
    <Flex
      key={post.id}
      direction="column"
      boxShadow="md"
      borderRadius="2xl"
      border="1px"
      borderColor={useColorModeValue("gray.100", "gray.900")}
      bg={bg}
    >
      <NextLink href="/post/[slug]" as={`/post/${post.slug}`} passHref>
        <Link
          textDecoration="none"
          _hover={{ textDecoration: "none" }}
          _focus={{ outline: "hidden" }}
        >
          <Image
            src={post.cover || ""}
            height={280}
            width={500}
            objectFit="cover"
            borderTopRadius="2xl"
            placeholderCss={post.placeholderCss}
            imageClassName="post-card-cover"
          />
        </Link>
      </NextLink>
      <Flex p={4} direction="column" height="full">
        <NextLink href="/post/[slug]" as={`/post/${post.slug}`} passHref>
          <Link
            textDecoration="none"
            _hover={{ textDecoration: "none" }}
            _focus={{ outline: "hidden" }}
          >
            <Heading as="h3" size="md" pb="2">
              {post.title}
            </Heading>
          </Link>
        </NextLink>
        <Text
          pb="4"
          flex="1"
          fontSize="medium"
          fontWeight="light"
          color={textColor}
        >
          {post.description}
        </Text>
        <Flex
          direction="row"
          justifyContent="space-between"
          fontSize="small"
          fontWeight="bold"
        >
          <Box>
            <CalendarIcon mb="4px" mr="2" />
            <Time dateTime={post.date} />
          </Box>
          <Box>
            <TimeIcon mb="4px" mr="2" />
            <Text as="span">{post.readingTime}</Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
