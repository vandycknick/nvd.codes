import React from "react"
import { css } from "@emotion/core"
import { useTheme } from "emotion-theming"

import { Content } from "components/BlogPost/Content"
import { Heading } from "components/Common/Heading"
import { spacing, Theme } from "components/Tokens"
import Time from "components/Common/Time"
import { Span } from "components/Common/Span"
import { Calendar } from "components/BlogPost/Icons/Calendar"
import { Edit } from "components/BlogPost/Icons/Edit"
import { Time as TimeIcon } from "components/BlogPost/Icons/Time"

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
}) => {
  const theme = useTheme<Theme>()
  return (
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
            text-align: center;
          `}
          size="4xl"
        >
          {title}
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
            <Time dateTime={date} />
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
              href={editUrl}
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
            {readingTime}
          </Span>
        </div>
      </header>
      <Content dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}

export { Post }
