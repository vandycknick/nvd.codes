import React from "react"
import Link from "next/link"
import { css } from "@emotion/core"
import { useTheme } from "emotion-theming"
import { Post } from "@nvd.codes/domain"

import { Heading } from "components/Common/Heading"
import { Span } from "components/Common/Span"
import { colors, fontWeight, spacing, Theme, fontSize } from "components/Tokens"
import Time from "components/Common/Time"
import { NavButton } from "components/Common/Buttons"
import { fromTablet } from "components/Common/mediaQuery"

type LatestPost = Pick<
  Post,
  "title" | "description" | "date" | "slug" | "readingTime"
>

export type LatestPostsProps = {
  className?: string
  posts: LatestPost[]
}

export const RecentBlogPosts: React.FC<LatestPostsProps> = ({
  className,
  posts,
}) => {
  const theme = useTheme<Theme>()
  return (
    <div
      className={className}
      css={css`
        padding: 0 ${spacing[4]};
      `}
    >
      <Heading
        as="h4"
        size="3xl"
        weight="bold"
        css={css`
          padding: ${spacing[2]} 0;
        `}
      >
        Recent Blog Posts
      </Heading>
      <ul
        css={css`
          list-style-type: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          ${fromTablet`flex-direction: row;`}
        `}
      >
        {posts.map((post) => (
          <li
            key={post.title}
            css={css`
              ${fromTablet`width: 32%;`}
            `}
          >
            <Link href="/post/[slug]" as={`/post/${post.slug}`} passHref>
              <a
                css={css`
                  display: flex;
                  flex-direction: column;
                  margin: ${spacing[4]} 0;
                  text-decoration: none;
                `}
              >
                <Heading
                  as="h5"
                  css={css`
                    font-size: ${fontSize.lg};
                    font-weight: ${fontWeight.bold};
                  `}
                >
                  {post.title}
                </Heading>
                <Span
                  css={css`
                    color: ${colors.grey[300]};
                    font-size: ${fontSize.sm};
                    padding: ${spacing[2]} 0;
                  `}
                >
                  {post.description}
                </Span>
                <div
                  css={css`
                    font-size: ${fontSize.sm};
                    color: ${theme.onBackground};
                  `}
                >
                  <Time dateTime={post.date} />
                  <Span
                    css={css`
                      padding: 0 ${spacing[2]};
                    `}
                  >
                    •
                  </Span>
                  <Span>{post.readingTime}</Span>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <div
        css={css`
          padding: ${spacing[4]} 0;
        `}
      >
        <NavButton href="/blog">All Posts</NavButton>
      </div>
    </div>
  )
}
