import React from "react"
import { Post } from "@nvd.codes/blog-engine"

import { PostCard } from "components/Blog/PostCard"

type PostPreview = Pick<
  Post,
  | "title"
  | "description"
  | "date"
  | "slug"
  | "readingTime"
  | "categories"
  | "cover"
  | "placeholder"
>

export type PostsListProps = {
  posts: PostPreview[]
}

export const PostsList = ({ posts }: PostsListProps) => (
  <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 py-6">
    {posts.map((post) => (
      <PostCard key={post.slug} post={post} />
    ))}
  </section>
)
