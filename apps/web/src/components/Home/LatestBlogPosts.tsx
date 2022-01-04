import React from "react"
import { Post } from "@nvd.codes/contracts"

import {
  HeadingTwo,
  Paragraph,
  HeadingFour,
} from "components/Common/Typography"
import Link from "next/link"
import Time from "components/Common/Time"

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
  <section className="max-w-4xl mx-auto px-4 xl:px-0 pt-20 pb-20">
    <HeadingTwo className="text-center">Latest Posts</HeadingTwo>
    <Paragraph className="pb-8 text-center">
      A brief overview of some of the things I wrote recently. But fear not,
      there is more!
    </Paragraph>
    {posts.map((post) => (
      <Link key={post.slug} href={`/post/${post.slug}`}>
        <a className="p-3 flex flex-col bg-nord-50 dark:bg-nord-700 rounded-lg mb-4 drop-shadow-lg border-b-4 border-frost-200 hover:cursor-pointer hover:bg-nord-200 hover:dark:bg-nord-600">
          <div className="flex flex-col md:flex-row flex-1 pb-2">
            <HeadingFour className="flex-1 pb-0">{post.title}</HeadingFour>
            <Time
              className="font-semibold text-sm text-nord-400 md:text-base md:font-bold"
              dateTime={post.date}
            />
          </div>
          <Paragraph className="hidden lg:flex pb-2">
            {post.description}
          </Paragraph>
          <a className="text-frost-secondary font-bold">Read More</a>
        </a>
      </Link>
    ))}
  </section>
)
