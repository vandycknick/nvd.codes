import React from "react"
import { default as NextLink } from "next/link"
import { Post } from "@nvd.codes/core"
import Image from "next/image"
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
>

export type PostsListProps = {
  posts: PostPreview[]
}

export const PostsList: React.FC<PostsListProps> = ({ posts }) => {
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
        <Box key={post.id} boxShadow="lg" borderRadius="md" bg={bg}>
          <NextLink href="/post/[slug]" as={`/post/${post.slug}`} passHref>
            <Link
              textDecoration="none"
              _hover={{ textDecoration: "none" }}
              _focus={{ outline: "hidden" }}
            >
              {post.cover && (
                <Box position="relative">
                  <Image
                    src={post.cover}
                    height={300}
                    width={500}
                    objectFit={"cover"}
                    className="post-card-cover"
                  />
                  <Box position="absolute" bottom={0} p={4} color="white">
                    <Heading as="h3" size="xl">
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
              )}
              <Box p={4}>
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
                <Text>{post.description}</Text>
                <Text>READ MORE</Text>
              </Box>
            </Link>
          </NextLink>
        </Box>
      ))}
    </Grid>
  )
}
