import React from "react"
import { css } from "@emotion/core"
import { useTheme } from "emotion-theming"
import { Link } from "gatsby"

import { Heading } from "src/components/Common/Heading"
import { Card } from "src/components/Common/Card"
import { spacing, Theme } from "src/components/Tokens"
import { Paragraph } from "src/components/Common/Paragraph"
import { fromTablet } from "src/components/Common/mediaQuery"

type Post = {
  id: string
  slug: string
  date: Date
  title: string
  description: string
  categories: string[]
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
        flex-direction: column;
      `}
    >
      <Heading
        css={css`
          align-self: center;
          padding-bottom: ${spacing[5]};
        `}
        size="4xl"
      >
        Blog
      </Heading>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
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
            `}
            key={post.id}
          >
            <ArticleCard>
              <Link
                to={post.slug}
                css={css`
                  text-decoration: none;
                  color: ${theme.onSurface};
                `}
              >
                <Heading as="h3">{post.title}</Heading>
                <Paragraph>{post.description}</Paragraph>
              </Link>
            </ArticleCard>
          </div>
        ))}
      </div>
    </section>
  )
}

export { Post, PostsList }
