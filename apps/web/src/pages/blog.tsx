import React, { Fragment } from "react"
import { css } from "@emotion/css"

import SEO from "components/Common/SEO"
import { PostsList, PostsListProps } from "components/Blog/PostsList"
import { Paragraph } from "components/Common/Paragraph"
import { Heading } from "components/Common/Heading"
import { spacing } from "components/Tokens"
import { GetStaticProps } from "next"
import { getAllPosts } from "services/getAllPosts"

type BlogProps = {
  postPreviews: PostsListProps["posts"]
}

const Blog: React.FC<BlogProps> = ({ postPreviews }) => {
  return (
    <Fragment>
      <SEO title="Blog" />
      <section
        className={css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <Heading
          className={css`
            padding: ${spacing[3]};
          `}
          size="4xl"
        >
          Blog
        </Heading>
        <Paragraph>
          Here I share my personal ramblings about stuff I&#39;m working on,
          life-events, problems I&#39;m solving and out loud thoughts.
        </Paragraph>
      </section>
      <PostsList posts={postPreviews} />
    </Fragment>
  )
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const posts = await getAllPosts([
    "id",
    "title",
    "description",
    "date",
    "slug",
    "readingTime",
    "categories",
    "cover",
  ])

  return {
    props: {
      postPreviews: posts.sort((post1, post2) =>
        post1.date > post2.date ? -1 : 1,
      ),
    },
  }
}

export default Blog
