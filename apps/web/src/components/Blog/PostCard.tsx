import React from "react"
import Link from "next/link"
import { Post } from "@nvd.codes/blog-engine"
import { TimeIcon, CalendarIcon } from "components/Common/Icons"

import { HeadingFour, Paragraph, Text } from "components/Common/Typography"
import Time from "components/Common/Time"
import { ImageWithLoader } from "components/Common/Image"

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

export type PostCardProps = {
  post: PostPreview
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="flex flex-col drop-shadow-md rounded-2xl bg-nord-50 dark:bg-nord-700 mb-6">
      <Link href="/post/[slug]" as={`/post/${post.slug}`} passHref>
        <span
          className={"relative truncate block rounded-t-2xl"}
          style={{ height: 210 }}
        >
          <ImageWithLoader
            src={post.cover}
            fill={true}
            placeholder={post.placeholder}
            objectFit="cover"
          />
        </span>
      </Link>
      <div className="flex flex-col p-4 h-full">
        <Link href="/post/[slug]" as={`/post/${post.slug}`} passHref>
          <HeadingFour className="mb-2">{post.title}</HeadingFour>
        </Link>
        <Paragraph className="flex-1 pb-4 text-sm">
          {post.description}
        </Paragraph>
        <div className="flex text-sm font-medium font-md justify-between">
          <div>
            <CalendarIcon className="h-4 w-4 mb-[2px] mr-2 fill-nord-50 dark:fill-nord-700" />
            <Time dateTime={post.date} />
          </div>
          <div>
            {" "}
            <TimeIcon className="h-4 w-4 mb-[2px] mr-2 fill-nord-50 dark:fill-nord-700" />
            <Text>{post.readingTime}</Text>
          </div>
        </div>
      </div>
    </div>
  )
}
