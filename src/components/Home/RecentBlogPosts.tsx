import React from "react"
import { css } from "@emotion/core"
import { useTheme } from "emotion-theming"

import { Card } from "src/components/Common/Card"
import { Heading } from "src/components/Common/Heading"
import { Span } from "src/components/Common/Span"
import { NavButton } from "src/components/Common/Buttons"
import {
  colors,
  fontWeight,
  spacing,
  Theme,
  fontSize,
} from "src/components/Tokens"
import { getMonthPrefix } from "src/utils/time"

type Post = {
  slug: string
  date: Date
  title: string
  description: string
}

type LatestPostsProps = {
  className?: string
  posts: Post[]
}

const RecentBlogPosts: React.FC<LatestPostsProps> = ({ className, posts }) => {
  const theme = useTheme<Theme>()
  return (
    <Card className={className}>
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
        `}
      >
        {posts.map((post) => (
          <li
            key={post.title}
            css={css`
              display: flex;
              margin: ${spacing[4]} 0;
            `}
          >
            <div
              css={css`
                display: flex;
                font-weight: ${fontWeight.bold};
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: ${spacing[2]};
                border-right: 5px solid ${theme.onSurface};
              `}
            >
              <Span>{getMonthPrefix(post.date)}</Span>
              <Span>{post.date.getDay()}</Span>
              <Span>{post.date.getUTCFullYear()}</Span>
            </div>
            <div
              css={css`
                padding: 0 ${spacing[4]};
                display: flex;
                flex-direction: column;
              `}
            >
              <Span
                css={css`
                  font-size: ${fontSize.lg};
                  font-weight: ${fontWeight.bold};
                  padding-bottom: ${spacing[2]};
                `}
              >
                {post.title}
              </Span>
              <Span
                css={css`
                  color: ${colors.grey[300]};
                  font-size: ${fontSize.sm};
                `}
              >
                {post.description}
              </Span>
            </div>
          </li>
        ))}
      </ul>
      <div
        css={css`
          padding: ${spacing[4]} 0;
        `}
      >
        <NavButton to="/blog">All Articles</NavButton>
      </div>
    </Card>
  )
}

export { RecentBlogPosts, Post }
