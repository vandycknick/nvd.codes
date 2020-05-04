import React from "react"
import { css, SerializedStyles } from "@emotion/core"
import { useTheme } from "emotion-theming"
import useSWR from "swr"
import * as timeago from "timeago.js"

import { colors, fontSize, spacing, Theme } from "src/components/Tokens"
import { Card } from "src/components/Common/Card"
import { Heading } from "src/components/Common/Heading"
import { Commit as CommitIcon } from "src/components/Home/Commit"
import { fetchJSON } from "src/utils/async"
import { Paragraph } from "src/components/Common/Paragraph"
import { fromTablet } from "src/components/Common/mediaQuery"

interface Project {
  id: string
  name: string
  description: string
  url: string
  stars: number
  languages: string[]
  primaryLanguage: RepositoryLanguage
}

interface RepositoryLanguage {
  name: string
  color: string
}

interface Activity {
  latestCommit: Commit
  projects: Project[]
}

interface Commit {
  id: string
  url: string
  message: string
  messageHeadline: string
  pushedDate: string
  repositoryName: string
}

type LatestActivitiesProps = {
  className?: string
}

const cssFromBackgroundColor = (background: string): SerializedStyles => {
  let color = background

  if (color.length < 5) {
    color += color.slice(1)
  }
  color =
    parseInt(color.replace("#", "0x"), 16) > 0xffffff / 2 ? "#333" : "#fff"

  return css`
    background-color: ${background};
    color: ${color};
    margin-left: 10px;
  `
}

const LatestActivities: React.FC<LatestActivitiesProps> = ({ className }) => {
  const { data: activity, error } = useSWR<Activity>(
    `${process.env.GATSBY_PROJECT_API}/project/activities`,
    fetchJSON,
  )
  const theme = useTheme<Theme>()
  console.log(activity, error)
  return (
    <div
      className={className}
      css={css`
        display: flex;
        flex-direction: column;

        ${fromTablet`flex-direction: row;`}
      `}
    >
      <Card
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 300px;
          margin-bottom: ${spacing[4]};

          ${fromTablet`margin-right: ${spacing[4]}; margin-bottom: 0;`}
        `}
      >
        <Heading
          as="h5"
          size="3xl"
          weight="bold"
          css={css`
            padding-bottom: ${spacing[3]};
          `}
        >
          Latest Commit
        </Heading>
        {activity && (
          <>
            <CommitIcon width={30} height={30} color={theme.onSurface} />
            <a
              href={activity.latestCommit.url}
              css={css`
                color: ${colors.teal[300]};
                word-break: break-word;
                white-space: pre-wrap;
                margin-top: ${spacing[6]};

                &:hover {
                  color: ${colors.teal[600]};
                }
              `}
            >
              {activity.latestCommit.message}
            </a>
            <Paragraph
              css={css`
                color: ${colors.grey[300]};
                font-size: ${fontSize.sm};
              `}
            >
              {timeago.format(activity.latestCommit.pushedDate)}
              &nbsp;in&nbsp;
              {activity.latestCommit.repositoryName}
            </Paragraph>
          </>
        )}
      </Card>
      <Card
        css={css`
          flex: 1;
        `}
      >
        <Heading
          as="h5"
          size="3xl"
          weight="bold"
          css={css`
            padding-bottom: ${spacing[3]};
          `}
        >
          Latest Projects
        </Heading>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          `}
        >
          {activity?.projects.map((project) => (
            <div
              css={css`
                width: 50%;
              `}
            >
              <Heading as="h6" size="xl">
                {project.name}
              </Heading>
              <Paragraph>{project.description}</Paragraph>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export { LatestActivities }
