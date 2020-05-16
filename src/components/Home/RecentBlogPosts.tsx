import React from "react"
import { css } from "@emotion/core"
import { useTheme } from "emotion-theming"

import { Heading } from "src/components/Common/Heading"
import { Span } from "src/components/Common/Span"
import {
  colors,
  fontWeight,
  spacing,
  Theme,
  fontSize,
} from "src/components/Tokens"
import Time from "../Common/Time"
import { NavButton } from "../Common/Buttons"
import { fromTablet } from "../Common/mediaQuery"

type Post = {
  slug: string
  date: Date
  title: string
  description: string
  readingTime: string
}

type LatestPostsProps = {
  className?: string
  posts: Post[]
}

const RecentBlogPosts: React.FC<LatestPostsProps> = ({ className, posts }) => {
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
            <a
              href={post.slug}
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
          </li>
        ))}
      </ul>
      <div
        css={css`
          padding: ${spacing[4]} 0;
        `}
      >
        <NavButton to="/blog">All Posts</NavButton>
      </div>
    </div>
  )
}

export { RecentBlogPosts, Post }
