import React from "react"
import { css } from "@emotion/core"
import { useTheme } from "emotion-theming"
import { Link } from "gatsby"
import { FluidObject } from "gatsby-image"

import { Heading } from "src/components/Common/Heading"
import { Card } from "src/components/Common/Card"
import {
  colors,
  spacing,
  Theme,
  borderRadius,
  fontSize,
} from "src/components/Tokens"
import { Paragraph } from "src/components/Common/Paragraph"
import {
  fromTablet,
  fromDesktopWideScreen,
} from "src/components/Common/mediaQuery"
import { Tag } from "src/components/Common/Tag"
import { Span } from "src/components/Common/Span"
import Time from "../Common/Time"

type Post = {
  id: string
  slug: string
  date: Date
  title: string
  description: string
  cover?: FluidObject | null
  categories: string[]
  readingTime: string
}

type PostsListProps = {
  className?: string
  posts: Post[]
}

const ArticleCard = Card.withComponent("article")

const PostsList: React.FC<PostsListProps> = ({ className, posts }) => {
  const theme = useTheme<Theme>()
  return (
    <section
      className={className}
      css={css`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        padding: ${spacing[8]} 0;
      `}
    >
      {posts.map((post) => (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            width: 100%;
            padding-bottom: ${spacing[4]};

            ${fromTablet`
                  width: 50%;
                  padding-right: ${spacing[2]};

                  &:nth-child(2n) {
                    padding-left: ${spacing[2]};
                  }
              `}

            ${fromDesktopWideScreen`width: 33%`}
          `}
          key={post.id}
        >
          <ArticleCard css={css`padding 0;`}>
            <Link
              to={post.slug}
              css={css`
                text-decoration: none;
                color: ${theme.onSurface};
              `}
            >
              {post.cover && (
                <div
                  css={css`
                    position: relative;
                  `}
                >
                  <img
                    src={post.cover.src}
                    srcSet={post.cover.srcSet}
                    sizes={post.cover.sizes}
                    css={css`
                      object-fit: cover;
                      height: 250px;
                      width: 100%;
                      border-top-left-radius: ${borderRadius.md};
                      border-top-right-radius: ${borderRadius.md};
                      opacity: 0.5;
                    `}
                  />
                  <div
                    css={css`
                      position: absolute;
                      bottom: 0;
                      padding: ${spacing[4]};
                    `}
                  >
                    <Heading as="h3" size="3xl" weight="bold">
                      {post.title}
                    </Heading>
                    <div
                      css={css`
                        font-size: ${fontSize.sm};
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
                  </div>
                </div>
              )}
              <div
                css={css`
                  padding: ${spacing[4]};
                `}
              >
                <div>
                  {post.categories.map((category) => (
                    <Tag key={category}>{category}</Tag>
                  ))}
                </div>
                <Paragraph>{post.description}</Paragraph>
                <Span
                  css={css`
                    display: block;
                    box-sizing: border-box;
                    color: ${colors.teal[600]};

                    &:hover {
                      color: ${colors.teal[800]};
                    }
                  `}
                >
                  READ MORE
                </Span>
              </div>
            </Link>
          </ArticleCard>
        </div>
      ))}
    </section>
  )
}

export { Post, PostsList }
