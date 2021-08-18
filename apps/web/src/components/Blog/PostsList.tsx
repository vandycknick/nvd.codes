import React from "react"
import { Post } from "@nvd.codes/contracts"
import { Grid } from "@chakra-ui/react"

import { PostCard } from "components/Blog/PostCard"

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

export const PostsList = ({ posts }: PostsListProps) => (
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
      <PostCard key={post.id} post={post} />
    ))}
  </Grid>
)
