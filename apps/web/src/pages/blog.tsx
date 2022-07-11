import React from "react"
import { GetStaticProps } from "next"

import SEO from "components/Common/SEO"
import { HeadingOne, Paragraph } from "components/Common/Typography"
import { PostsList, PostsListProps } from "components/Blog/PostsList"
import { listPosts } from "services/blog"
import { PostsPager } from "components/Blog/PostsPager"

type BlogProps = {
  posts: PostsListProps["posts"]
  pager: {
    total: number
    current: number
  }
}

const Blog = ({ posts, pager }: BlogProps) => (
  <>
    <SEO title="Blog" />
    <div className="max-w-6xl w-full flex flex-col flex-1 mx-auto px-4 md:px-0 py-14">
      <HeadingOne className="pb-8 text-center">Blog</HeadingOne>
      <Paragraph className="pb-8 text-center">
        Actively writing about technology, life-events and indie hacking. Here
        are some of my most recent thoughts and hacks I&#39;ve published.
      </Paragraph>
      <PostsList posts={posts} />
      <PostsPager {...pager} />
    </div>
  </>
)

const POSTS_PER_PAGE = 9

export const getStaticProps: GetStaticProps<BlogProps> = async ({ params }) => {
  const page =
    params !== undefined
      ? Array.isArray(params.page)
        ? parseInt(params.page[0], 10)
        : parseInt(params.page ?? "1", 10)
      : 1

  const [posts, pager] = await listPosts({
    page,
    count: POSTS_PER_PAGE,
    fields: [
      "title",
      "description",
      "date",
      "slug",
      "readingTime",
      "categories",
      "cover",
      "placeholder",
    ],
  })

  return {
    props: {
      posts,
      pager,
    },
  }
}

export default Blog
