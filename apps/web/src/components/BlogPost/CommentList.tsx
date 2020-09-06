import React from "react"
import useSWR from "swr"
import { css } from "@emotion/core"
import { PostComments } from "@nvd.codes/core"
import * as timeago from "timeago.js"
import { useTheme } from "emotion-theming"

import { fetchJSON } from "utils/async"
import {
  spacing,
  colors,
  fontWeight,
  fontSize,
  Theme,
  styled,
} from "components/Tokens"
import { Image } from "components/Common/Image"
import { Span } from "components/Common/Span"
import { Content } from "components/BlogPost/Content"
import { LinkButton } from "components/Common/Buttons"
import { fromTablet } from "components/Common/mediaQuery"

type CommentListProps = {
  slug: string
}

const WriteComment: React.FC<{ editUrl?: string }> = ({ editUrl }) => {
  const theme = useTheme<Theme>()
  return (
    <div
      css={css`
        padding: ${spacing[4]} 0;
        display: flex;
      `}
    >
      <Image
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAxNiIgdmVyc2lvbj0iMS4xIj48cGF0aCBmaWxsPSJyZ2IoMTc5LDE3OSwxNzkpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDEwLjVMOSAxNEg1bDEtMy41TDUuMjUgOWgzLjVMOCAxMC41ek0xMCA2SDRMMiA3aDEwbC0yLTF6TTkgMkw3IDMgNSAyIDQgNWg2TDkgMnptNC4wMyA3Ljc1TDEwIDlsMSAyLTIgM2gzLjIyYy40NSAwIC44Ni0uMzEuOTctLjc1bC41Ni0yLjI4Yy4xNC0uNTMtLjE5LTEuMDgtLjcyLTEuMjJ6TTQgOWwtMy4wMy43NWMtLjUzLjE0LS44Ni42OS0uNzIgMS4yMmwuNTYgMi4yOGMuMTEuNDQuNTIuNzUuOTcuNzVINWwtMi0zIDEtMnoiPjwvcGF0aD48L3N2Zz4="
        width={40}
        height={40}
        alt="@anonymous"
        css={css`
          display: none;
          padding: 0 ${spacing[4]} 0 0;
          img {
            background-color: ${colors.grey[700]};
          }

          ${fromTablet`display: block;`}
        `}
      />
      <div
        css={css`
          position: relative;
          flex: 1 1 auto;
          min-width: 1px;
          border: 1px solid ${colors.grey[300]};

          &:before,
          &:after {
            position: absolute;
            top: 11px;
            right: 100%;
            left: -16px;
            display: block;
            width: 0;
            height: 0;
            pointer-events: none;
            content: " ";
            border-color: transparent;
            border-style: solid solid outset;
          }

          &:before {
            border-width: 8px;
            border-right-color: ${colors.grey[300]};
          }
        `}
      >
        <header
          css={css`
            background-color: ${colors.grey[800]};
            border-bottom: 1px solid ${colors.grey[300]};
            padding: ${spacing[2]} ${spacing[4]} 0 ${spacing[4]};
            font-size: ${fontSize.sm};
          `}
        >
          <div
            css={css`
              box-sizing: border-box;
              margin-bottom: -1px;
              background: transparent;
            `}
          >
            <Span
              css={css`
                background: ${theme.background};
                display: inline-block;
                padding: ${spacing[2]} ${spacing[4]};
                border: 1px solid ${colors.grey[300]};
                border-bottom: 0;
                border-radius: 3px 3px 0 0;

                &:hover {
                  cursor: pointer;
                }
              `}
            >
              Write
            </Span>
            <Span
              css={css`
                display: inline-block;
                padding: ${spacing[2]} ${spacing[4]};

                &:hover {
                  cursor: pointer;
                }
              `}
            >
              Preview
            </Span>
          </div>
        </header>
        <div
          css={css`
            padding: ${spacing[4]};
          `}
        >
          <textarea
            placeholder="Sign in to comment"
            aria-label="comment"
            disabled
            css={css`
              background: ${colors.grey[800]};
              color: ${colors.white};
              padding: 8px;
              width: 100%;
              min-height: 90px;
              border: 1px solid ${colors.grey[300]};
              border-radius: 3px;
              display: block;
              box-sizing: border-box;
              resize: vertical;
              appearance: none;

              &[disabled] {
                cursor: not-allowed;
              }
            `}
          />
        </div>
        <footer
          css={css`
            display: flex;
            justify-content: flex-end;
            padding: 0 ${spacing[4]} ${spacing[4]} ${spacing[4]};
          `}
        >
          <LinkButton
            href={editUrl}
            target="_blank"
            css={css`
              font-size: ${fontSize.xs};
            `}
            disabled={editUrl == undefined || editUrl === ""}
          >
            Open Github
          </LinkButton>
        </footer>
      </div>
    </div>
  )
}

const CommentWrapper = styled.section`
  max-width: 750px;
  margin: 0 auto;
  padding-bottom: ${spacing[4]};
`

export const CommentList: React.FC<CommentListProps> = ({ slug }) => {
  const theme = useTheme<Theme>()
  const { data, error } = useSWR<PostComments>(
    `${process.env.NEXT_PUBLIC_COMMENTS_API}/api/comments/${slug}`,
    fetchJSON,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    { shouldRetryOnError: false, onErrorRetry: () => {} },
  )

  if (data == undefined && error == undefined) {
    return (
      <CommentWrapper>
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            padding: ${spacing[6]};
          `}
        >
          Loading comments...
        </div>
        <WriteComment />
      </CommentWrapper>
    )
  }

  if (error != undefined) {
    return (
      <CommentWrapper>
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            padding: ${spacing[6]};
          `}
        >
          Oh no, something went wrong trying to load comments for this post.
        </div>
        <WriteComment />
      </CommentWrapper>
    )
  }

  return (
    <CommentWrapper>
      {data?.totalComments === 0 && (
        <div
          css={css`
            font-weight: ${fontWeight.bold};
          `}
        >
          0 Comments
        </div>
      )}
      {(data?.totalComments ?? 0) > 0 && (
        <ul
          css={css`
            margin: 0;
            padding: ${spacing[4]} 0;
          `}
        >
          {data?.comments.map((comment) => (
            <li
              key={comment.id}
              css={css`
                padding: ${spacing[4]} 0;
                display: flex;
              `}
            >
              <Image
                src={comment.author.avatarUrl}
                width={40}
                height={40}
                css={css`
                  display: none;
                  padding: 0 ${spacing[4]} 0 0;

                  ${fromTablet`display: block;`}
                `}
              />
              <article
                css={css`
                  position: relative;
                  flex: 1 1 auto;
                  min-width: 1px;
                  border: 1px solid ${colors.grey[300]};

                  &:before,
                  &:after {
                    position: absolute;
                    top: 11px;
                    right: 100%;
                    left: -16px;
                    display: block;
                    width: 0;
                    height: 0;
                    pointer-events: none;
                    content: " ";
                    border-color: transparent;
                    border-style: solid solid outset;
                  }

                  &:before {
                    border-width: 8px;
                    border-right-color: ${colors.grey[300]};
                  }
                `}
              >
                <div
                  css={css`
                    background-color: ${colors.grey[800]};
                    border-bottom: 1px solid ${colors.grey[300]};
                    padding: ${spacing[2]} ${spacing[4]};
                    font-size: ${fontSize.sm};
                  `}
                >
                  <a
                    href={`https://github.com/${comment.author.login}`}
                    css={css`
                      color: ${theme.onBackground};
                      font-weight: ${fontWeight.bold};
                      text-decoration: none;

                      &:hover {
                        text-decoration: underline;
                      }
                    `}
                  >
                    {comment.author.login}
                  </a>
                  {" commented "}
                  <Span>{timeago.format(comment.createdAt)}</Span>
                </div>
                <Content
                  css={css`
                    padding: ${spacing[2]} ${spacing[4]};
                  `}
                  dangerouslySetInnerHTML={{ __html: comment.body }}
                />
              </article>
            </li>
          ))}
        </ul>
      )}
      <WriteComment editUrl={data?.url} />
    </CommentWrapper>
  )
}
