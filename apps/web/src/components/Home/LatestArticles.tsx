import React from "react"
import { default as NextLink } from "next/link"
import { Post } from "@nvd.codes/contracts"
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
import { ImageWithPlaceholder } from "components/Common/Image"
import { CalendarIcon, TimeIcon } from "@chakra-ui/icons"

type LatestPost = Pick<
  Post,
  | "title"
  | "description"
  | "cover"
  | "placeholder"
  | "date"
  | "slug"
  | "readingTime"
  | "categories"
>

export type LatestArticlesProps = {
  className?: string
  posts: LatestPost[]
}

export const LatestArticles = ({ className, posts }: LatestArticlesProps) => {
  const bg = useColorModeValue("gray.50", "gray.900")
  const color = useColorModeValue("gray.700", "gray.200")
  const circleBg = useColorModeValue("black", "white")
  const circleColor = useColorModeValue("white", "black")
  return (
    <VStack className={className} spacing={4} py={4} as="section">
      <Heading as="h4" py={4} size="lg">
        Latest Articles
      </Heading>
      <Text pb={1}>
        While you are here, have a look at some of the latest articles I wrote.
        Or go and have a look at some of my earlier articles!
      </Text>
      <NextLink href="/blog">
        <Link pb={4} colorScheme="teal" fontWeight="bold" fontSize="lg">
          Read More →
        </Link>
      </NextLink>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={6}
        as="ul"
        width="100%"
      >
        {posts.map((post) => (
          <Flex
            maxW={["none", "none", "sm"]}
            boxShadow="md"
            borderWidth="1px"
            borderRadius="lg"
            borderColor="black"
            overflow="hidden"
            as="li"
            width="100%"
            direction="column"
            key={post.slug}
            _hover={{ bg }}
          >
            <NextLink
              href="/post/[slug]"
              as={`/post/${post.slug}`}
              passHref
              prefetch={false}
            >
              <Flex direction="column" as="a" height="full">
                <Box position="relative">
                  <ImageWithPlaceholder
                    src={post.cover}
                    placeholder={post.placeholder}
                    objectFit="cover"
                    width={500}
                    height={280}
                  />
                  <Circle
                    size="30px"
                    bg={circleBg}
                    color={circleColor}
                    position="absolute"
                    top={0}
                    left={0}
                    mt={3}
                    ml={3}
                  >
                    <FireIcon />
                  </Circle>
                </Box>
                <VStack align="stretch" p="2" height="full">
                  <HStack my="2">
                    {post.categories.slice(0, 3).map((category) => (
                      <Tag size="sm" key={category} colorScheme="cyan">
                        {category}
                      </Tag>
                    ))}
                  </HStack>
                  <Heading as="h5" size="l" noOfLines={2} flex="1">
                    {post.title}
                  </Heading>
                  <HStack
                    fontSize="xs"
                    fontWeight="bold"
                    color={color}
                    justifyContent="space-between"
                  >
                    <Text>
                      <CalendarIcon mb="4px" mr="2" />
                      <Time dateTime={post.date} />
                    </Text>
                    <Text>
                      <TimeIcon mb="4px" mr="2" />
                      <Text as="span">{post.readingTime}</Text>
                    </Text>
                  </HStack>
                </VStack>
              </Flex>
            </NextLink>
          </Flex>
        ))}
      </Grid>
    </VStack>
  )
}
