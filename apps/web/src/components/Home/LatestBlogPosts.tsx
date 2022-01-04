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
  <section className="max-w-6xl mx-auto px-4 xl:px-0 pt-20 pb-20">
    <HeadingTwo className="text-center">Latest Posts</HeadingTwo>
    <Paragraph className="pb-8 text-center">
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
