import React from "react"
import NextLink from "next/link"
import { Post } from "@nvd.codes/contracts"
import {
  Box,
  Flex,
  Grid,
  Heading,
  Link,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"

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

export type PostsListProps = {
  posts: PostPreview[]
}

export const PostsList = ({ posts }: PostsListProps) => {
  const bg = useColorModeValue("transparent", "gray.700")
  return (
    <Grid
      as="section"
      templateColumns={[
        "repeat(1, 1fr)",
        "repeat(1, 1fr)",
        "repeat(2, 1fr)",
        "repeat(3, 1fr)",
      ]}
      gap={4}
      py={6}
    >
      {posts.map((post) => (
        <Box
          key={post.id}
          boxShadow="lg"
          borderRadius="md"
          bg={bg}
          _hover={{
            transform: "scale(1.02)",
            transitionDuration: ".5s",
            transitionTimingFunction: "cubic-bezier(.4,0,.2,1)",
            transitionProperty:
              "background-color,border-color,color,fill,stroke,opacity,box-shadow,transform",
          }}
        >
          <NextLink href="/post/[slug]" as={`/post/${post.slug}`} passHref>
            <Link
              textDecoration="none"
              _hover={{ textDecoration: "none" }}
              _focus={{ outline: "hidden" }}
            >
              <Box pos="relative">
                <Image
                  src={post.cover || ""}
                  height={300}
                  width={500}
                  objectFit="cover"
                  borderTopRadius="md"
                  placeholderCss={post.placeholderCss}
                  imageClassName="post-card-cover"
                />
                <Box
                  position="absolute"
                  bottom={0}
                  px={4}
                  pt={4}
                  pb={1}
                  color="white"
                >
                  <Heading as="h3" size="xl" pb={2}>
                    {post.title}
                  </Heading>
                  <Text fontSize="sm">
                    <Time dateTime={post.date} />
                    <Text as="span" px={2}>
                      •
                    </Text>
                    {post.readingTime}
                  </Text>
                </Box>
              </Box>
              <Flex p={4} direction="column">
                <Flex wrap="wrap">
                  {post.categories.map((category) => (
                    <Tag
                      key={category}
                      borderRadius="full"
                      variant="solid"
                      colorScheme="green"
                      mr="5px"
                      mt="4px"
                    >
                      {category}
                    </Tag>
                  ))}
                </Flex>
                <Text flex={1}>{post.description}</Text>
                <Text>READ MORE</Text>
              </Flex>
            </Link>
          </NextLink>
        </Box>
      ))}
    </Grid>
  )
}
