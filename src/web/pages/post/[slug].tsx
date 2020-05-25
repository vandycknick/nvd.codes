import React from "react"
import { css } from "@emotion/core"
import { useTheme } from "emotion-theming"
import { GetStaticProps, GetStaticPaths } from "next"
import ErrorPage from "next/error"
import { Post } from "@nvd.codes/domain"

import SEO from "components/Common/SEO"
import { Content } from "components/BlogPost/Content"
import { CommentList } from "components/BlogPost/CommentList"
import { Heading } from "components/Common/Heading"
import { spacing, Theme } from "components/Tokens"
import Time from "components/Common/Time"
import { Span } from "components/Common/Span"
import { Calendar } from "components/BlogPost/Icons/Calendar"
import { Edit } from "components/BlogPost/Icons/Edit"
import { Time as TimeIcon } from "components/BlogPost/Icons/Time"
import { getAllPosts } from "services/getAllPosts"
import { Divider } from "components/Common/Divider"

type BlogPostProps = {
  post?: Pick<
    Post,
    | "title"
    | "description"
    | "date"
    | "slug"
    | "readingTime"
    | "content"
    | "editUrl"
  >
  pageContext: {
    previous: string | null
    next: string | null
  }
}

type BlogPostParams = {
  slug: string
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const theme = useTheme<Theme>()

  if (post == null) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <SEO title={post.title} description={post.description} />
      <article
        css={css`
          display: flex;
          flex-direction: column;
          padding-bottom: ${spacing[4]};
        `}
      >
        <header
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: ${spacing[16]};
          `}
        >
          <Heading
            css={css`
              padding: ${spacing[3]};
              text-align: center;
            `}
            size="4xl"
          >
            {post.title}
          </Heading>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;

              span {
                display: inline-flex;
                align-items: center;
                padding: 0 ${spacing[1]};
              }
            `}
          >
            <Span>
              <Calendar
                css={css`
                  padding: 0 ${spacing[2]};
                `}
                width={20}
                height={20}
                color={theme.onBackground}
              />
              <Time dateTime={post.date} />
            </Span>
            <Span>
              <Edit
                css={css`
                  padding: 0 ${spacing[2]};
                `}
                width={20}
                height={20}
                color={theme.onBackground}
              />
              <a
                css={css`
                  color: ${theme.onBackground};
                  text-decoration: none;
                `}
                href={post.editUrl}
              >
                suggest edit
              </a>
            </Span>
            <Span>
              <TimeIcon
                css={css`
                  padding: 0 ${spacing[2]};
                `}
                width={20}
                height={20}
                color={theme.onBackground}
              />
              {post.readingTime}
            </Span>
          </div>
        </header>
        <Content dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <Divider />
      <CommentList slug={post.slug} />
    </>
  )
}

export const getStaticProps: GetStaticProps<
  BlogPostProps,
  BlogPostParams
> = async ({ params }) => {
  if (!params) return { props: { pageContext: { next: null, previous: null } } }

  const posts = await getAllPosts([
    "id",
    "title",
    "description",
    "date",
    "slug",
    "readingTime",
    "content",
    "editUrl",
  ])
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) return { props: { pageContext: { next: null, previous: null } } }

  const index = posts.findIndex((p) => p.id === post.id)

  return {
    props: {
      post,
      pageContext: {
        next: posts[index - 1]?.slug ?? null,
        previous: posts[index + 1]?.slug ?? null,
      },
    },
  }
}

export const getStaticPaths: GetStaticPaths<BlogPostParams> = async () => {
  const posts = await getAllPosts(["slug"])

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      }
    }),
    fallback: false,
  }
}

export default BlogPost
