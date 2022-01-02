import React from "react"
import { Post } from "@nvd.codes/contracts"

import {
  HeadingTwo,
  Paragraph,
  HeadingFour,
} from "components/Common/Typography"
import { ImageWithPlaceholder } from "components/Common/Image"

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

export type LatestBlogPostsProps = {
  className?: string
  posts: LatestPost[]
}

export const LatestBlogPosts = ({ posts }: LatestBlogPostsProps) => (
  <section className="pb-20">
    <HeadingTwo>Latest Posts</HeadingTwo>
    <Paragraph className="pb-4">
      A brief overview of some of the things I wrote recently. But fear not,
      there is more!
    </Paragraph>
    <div className="grid grid-cols-1">
      {posts.map((post) => (
        <div
          className="flex flex-col bg-nord-50 dark:bg-nord-700 rounded-lg mb-4 drop-shadow-lg md:flex-row"
          key={post.slug}
        >
          <ImageWithPlaceholder
            src={post.cover}
            placeholder={post.placeholder}
            objectFit="cover"
            width={500}
            height={280}
            className="w-full h-full rounded-t-lg md:w-1/4 md:rounded-l-lg md:rounded-tr-none"
          />
          <div className="p-3 flex-1">
            <HeadingFour>{post.title}</HeadingFour>
            <Paragraph>{post.description}</Paragraph>
            <a className="text-frost-secondary font-bold">Read More</a>
          </div>
        </div>
      ))}
    </div>
  </section>
)

// export const LatestBlogPosts = ({ className, posts }: LatestBlogPostsProps) => {
//   const bg = useColorModeValue("gray.50", "gray.900")
//   const color = useColorModeValue("gray.700", "gray.200")
//   const circleBg = useColorModeValue("black", "white")
//   const circleColor = useColorModeValue("white", "black")
//   return (
//     <VStack className={className} spacing={4} as="section">
//       <Heading as="h4" py={4} size="lg">
//         Latest Blog Posts
//       </Heading>
//       <Text pb={1}>
//         While you are here, have a look at some of the latest articles I wrote.
//         Or go and have a look at some of my earlier articles!
//       </Text>
//       <NextLink href="/blog">
//         <Link pb={4} colorScheme="teal" fontWeight="bold" fontSize="lg">
//           Read More →
//         </Link>
//       </NextLink>
//       <Grid
//         templateColumns={{
//           base: "repeat(1, 1fr)",
//           md: "repeat(2, 1fr)",
//           lg: "repeat(4, 1fr)",
//         }}
//         gap={6}
//         as="ul"
//         width="100%"
//       >
//         {posts.map((post) => (
//           <Flex
//             maxW={["none", "none", "sm"]}
//             boxShadow="md"
//             borderWidth="1px"
//             borderRadius="lg"
//             borderColor="black"
//             overflow="hidden"
//             as="li"
//             width="100%"
//             direction="column"
//             key={post.slug}
//             _hover={{ bg }}
//           >
//             <NextLink
//               href="/post/[slug]"
//               as={`/post/${post.slug}`}
//               passHref
//               prefetch={false}
//             >
//               <Flex direction="column" as="a" height="full">
//                 <Box position="relative">
//                   <ImageWithPlaceholder
//                     src={post.cover}
//                     placeholder={post.placeholder}
//                     objectFit="cover"
//                     width={500}
//                     height={280}
//                   />
//                   <Circle
//                     size="30px"
//                     bg={circleBg}
//                     color={circleColor}
//                     position="absolute"
//                     top={0}
//                     left={0}
//                     mt={3}
//                     ml={3}
//                   >
//                     <FireIcon />
//                   </Circle>
//                 </Box>
//                 <VStack align="stretch" p="2" height="full">
//                   <HStack my="2">
//                     {post.categories.slice(0, 3).map((category) => (
//                       <Tag size="sm" key={category} colorScheme="cyan">
//                         {category}
//                       </Tag>
//                     ))}
//                   </HStack>
//                   <Heading as="h5" size="l" noOfLines={2} flex="1">
//                     {post.title}
//                   </Heading>
//                   <HStack
//                     fontSize="xs"
//                     fontWeight="bold"
//                     color={color}
//                     justifyContent="space-between"
//                   >
//                     <Text>
//                       <CalendarIcon mb="4px" mr="2" />
//                       <Time dateTime={post.date} />
//                     </Text>
//                     <Text>
//                       <TimeIcon mb="4px" mr="2" />
//                       <Text as="span">{post.readingTime}</Text>
//                     </Text>
//                   </HStack>
//                 </VStack>
//               </Flex>
//             </NextLink>
//           </Flex>
//         ))}
//       </Grid>
//     </VStack>
//   )
// }
