import React from "react"
import { css } from "@emotion/core"

import { PrismTheme } from "src/components/BlogPost/Prism"
import { Heading } from "src/components/Common/Heading"
import { spacing } from "src/components/Tokens"

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

const Post: React.FC<PostProps> = ({ content, title }) => (
  <article
    css={css`
      display: flex;
      flex-direction: column;
    `}
  >
    <header
      css={css`
        display: flex;
        justify-content: center;
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
    </header>
    <PrismTheme dangerouslySetInnerHTML={{ __html: content }} />
  </article>
)

export { Post }
