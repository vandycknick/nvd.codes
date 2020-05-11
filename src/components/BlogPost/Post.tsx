import React from "react"
import { css } from "@emotion/core"

import { Content } from "src/components/BlogPost/Content"
import { Heading } from "src/components/Common/Heading"
import { spacing } from "src/components/Tokens"
import Time from "../Common/Time"
import { Span } from "../Common/Span"

type PostProps = {
  title: string
  date: string
  editUrl: string
  readingTime: string
  description: string
  content: string
  nextPage: string | null
  previousPage: string | null
}

const Post: React.FC<PostProps> = ({
  content,
  date,
  editUrl,
  readingTime,
  title,
}) => (
  <article
    css={css`
      display: flex;
      flex-direction: column;
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
        `}
        size="4xl"
      >
        {title}
      </Heading>
      <div>
        <Time dateTime={date} />
        <a href={editUrl}>suggest edit</a>
        <Span>{readingTime}</Span>
      </div>
    </header>
    <Content dangerouslySetInnerHTML={{ __html: content }} />
  </article>
)

export { Post }
