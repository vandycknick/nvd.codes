import React from "react"
import { css, cx } from "@emotion/css"
import { useTheme } from "@emotion/react"
import Link from "next/link"
import { Post } from "@nvd.codes/core"
import Image from "next/image"

import { Heading } from "components/Common/Heading"
import { Card } from "components/Common/Card"
import { spacing, borderRadius, fontSize } from "components/Tokens"
import { Paragraph } from "components/Common/Paragraph"
import { fromTablet, fromDesktopWideScreen } from "components/Common/mediaQuery"
import { Tag } from "components/Common/Tag"
import { Span } from "components/Common/Span"
import Time from "components/Common/Time"

type PostPreview = Pick<
  Post,
  | "id"
  | "title"
  | "description"
  | "date"
  | "slug"
  | "readingTime"
  | "categories"
  | "cover"
>

export type PostsListProps = {
  className?: string
  posts: PostPreview[]
}

export const PostsList: React.FC<PostsListProps> = ({ className, posts }) => {
  const theme = useTheme()
  return (
    <section
      className={cx(
        css`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
          padding: ${spacing[8]} 0;
        `,
        className,
      )}
    >
      {posts.map((post) => (
        <div
          className={css`
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            width: 100%;
            padding-bottom: ${spacing[4]};

            ${fromTablet`
                  width: 50%;
                  padding: ${spacing[2]};
              `}

            ${fromDesktopWideScreen`width: 33%`}
          `}
          key={post.id}
        >
          <Card
            as="article"
            className={css`
              padding: 0;
            `}
          >
            <Link href="/post/[slug]" as={`/post/${post.slug}`} passHref>
              <a
                className={css`
                  text-decoration: none;
                  color: ${theme.onSurface};
                `}
              >
                {post.cover && (
                  <div
                    className={css`
                      position: relative;
                    `}
                  >
                    <Image
                      src={post.cover}
                      height={300}
                      width={500}
                      objectFit={"cover"}
                      className={css`
                        border-top-left-radius: ${borderRadius.md};
                        border-top-right-radius: ${borderRadius.md};
                        opacity: 0.5;
                      `}
                    />
                    <div
                      className={css`
                        position: absolute;
                        bottom: 0;
                        padding: ${spacing[4]};
                      `}
                    >
                      <Heading as="h3" size="3xl" weight="bold">
                        {post.title}
                      </Heading>
                      <div
                        className={css`
                          font-size: ${fontSize.sm};
                        `}
                      >
                        <Time dateTime={post.date} />
                        <Span
                          className={css`
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
                  className={css`
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
                    className={css`
                      display: block;
                      box-sizing: border-box;
                      color: ${theme.primaryLight};

                      &:hover {
                        color: ${theme.primaryLighter};
                      }
                    `}
                  >
                    READ MORE
                  </Span>
                </div>
              </a>
            </Link>
          </Card>
        </div>
      ))}
    </section>
  )
}
