import React from "react"
import { default as NextLink } from "next/link"
import { Post } from "@nvd.codes/core"
import {
  Box,
  Circle,
  Flex,
  Grid,
  Heading,
  Link,
  Tag,
  Text,
  useColorModeValue,
  VStack,
  HStack,
} from "@chakra-ui/react"

import Time from "components/Common/Time"
import { FireIcon } from "components/Home/Icons"

type LatestPost = Pick<
  Post,
  "title" | "description" | "date" | "slug" | "readingTime" | "categories"
>

export type LatestPostsProps = {
  className?: string
  posts: LatestPost[]
}

export const RecentBlogPosts = ({ className, posts }: LatestPostsProps) => {
  const bg = useColorModeValue("gray.100", "gray.900")
  const color = useColorModeValue("gray.700", "gray.400")
  const circleBg = useColorModeValue("black", "white")
  const circleColor = useColorModeValue("white", "black")
  return (
    <VStack className={className} spacing={4} mt={4} as="section">
      <Heading as="h4" py={4} size="lg">
        Latest Articles
      </Heading>
      <Text pb={1}>
        While you are here, have a look at some ofthe latest articles I wrote.
        Or go and have a look at some of my earlier articles!
      </Text>
      <NextLink href="/blog">
        <Link pb={4} colorScheme="teal" fontWeight="bold" fontSize="lg">
          Read More →
        </Link>
      </NextLink>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
        gap={6}
        as="ul"
      >
        {posts.map((post) => (
          <Box
            maxW={["none", "none", "sm"]}
            borderWidth="1px"
            borderRadius="lg"
            borderColor="black"
            overflow="hidden"
            position="relative"
            p="4"
            as="li"
            key={post.title}
            _hover={{ bg }}
          >
            <NextLink
              href="/post/[slug]"
              as={`/post/${post.slug}`}
              passHref
              prefetch={false}
            >
              <Flex
                as="a"
                direction="column"
                justifyContent="space-between"
                height="100%"
              >
                <Circle
                  size="30px"
                  bg={circleBg}
                  color={circleColor}
                  position="absolute"
                  top={0}
                  right={0}
                  mt={3}
                  mr={3}
                >
                  <FireIcon />
                </Circle>
                <VStack align="stretch">
                  <Text fontSize="xs" color={color}>
                    <Time dateTime={post.date} />
                  </Text>
                  <Heading as="h5" size="l" flex={1} isTruncated noOfLines={2}>
                    {post.title}
                  </Heading>
                </VStack>
                <VStack align="stretch">
                  <Text fontSize="xs" color={color} py={2}>
                    {post.readingTime}
                  </Text>
                  <HStack>
                    {post.categories.slice(0, 3).map((category) => (
                      <Tag size="md" key={category} colorScheme="cyan">
                        {category}
                      </Tag>
                    ))}
                  </HStack>
                </VStack>
              </Flex>
            </NextLink>
          </Box>
        ))}
      </Grid>
    </VStack>
  )
}
