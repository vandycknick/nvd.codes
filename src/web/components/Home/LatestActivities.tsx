import React from "react"
import { css, SerializedStyles } from "@emotion/core"
import { useTheme } from "emotion-theming"
import useSWR from "swr"
import * as timeago from "timeago.js"

import {
  colors,
  fontSize,
  spacing,
  Theme,
  borderRadius,
  fontWeight,
} from "components/Tokens"
import { Card } from "components/Common/Card"
import { Heading } from "components/Common/Heading"
import { Commit as CommitIcon } from "components/Home/Icons/Commit"
import { Repository as RepositoryIcon } from "components/Home/Repository"
import { fromTablet, fromDesktop } from "components/Common/mediaQuery"
import { Span } from "components/Common/Span"
import { Tag } from "components/Common/Tag"
import { fetchJSON } from "utils/async"
import truncate from "utils/truncate"

interface Project {
  id: string
  name: string
  description: string
  url: string
  stars: number
  primaryLanguage: RepositoryLanguage
  updatedAt: string
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
  `
}

type OnlineActivityProps = {
  activity: Activity
}

const cardColStyles = css`
  margin-bottom: ${spacing[4]};
  padding: 0;
  min-height: 200px;
  ${fromTablet`width: 49%;`}
  ${fromDesktop`width: 32%;`}
`

const OnlineActivity: React.FC<OnlineActivityProps> = ({ activity }) => {
  const theme = useTheme<Theme>()
  return (
    <>
      <Card css={cardColStyles}>
        <div
          css={css`
            flex: 1;
            display: flex;
            height: 100%;
            align-items: center;
            padding: ${spacing[4]} ${spacing[5]};
          `}
        >
          <Span
            css={css`
              width: 30px;
              display: flex;
              padding: ${spacing[2]};
              background-color: ${colors.teal[800]};
              border-radius: ${borderRadius.md};
            `}
          >
            <CommitIcon width={30} height={30} color={theme.onSurface} />
          </Span>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              padding: 0 ${spacing[5]};
            `}
          >
            <Span
              css={css`
                font-weight: ${fontWeight.bold};
                font-size: ${fontSize.lg};
              `}
            >
              Latest Commit
            </Span>
            <Span
              css={css`
                color: ${colors.grey[300]};
                font-size: ${fontSize.xs};
                padding-bottom: ${spacing[3]};
              `}
            >
              {`created ${timeago.format(
                activity.latestCommit.pushedDate,
              )} in ${activity.latestCommit.repositoryName}`}
            </Span>
            <Span>{activity.latestCommit.messageHeadline}</Span>
          </div>
        </div>
        <a
          href={activity.latestCommit.url}
          css={css`
            display: flex;
            color: ${theme.primaryLight};
            background-color: ${colors.grey[800]};
            padding: ${spacing[3]} ${spacing[5]};
            border-bottom-left-radius: ${borderRadius.md};
            border-bottom-right-radius: ${borderRadius.md};
            text-decoration: none;

            &:hover {
              color: ${theme.primaryLighter};
            }
          `}
        >
          View Commit
        </a>
      </Card>
      {activity?.projects.map((project) => (
        <Card key={project.id} css={cardColStyles}>
          <div
            css={css`
              display: flex;
              flex: 1;
              height: 100%;
              align-items: center;
              padding: ${spacing[3]} ${spacing[5]};
            `}
          >
            <Span
              css={css`
                width: 30px;
                display: flex;
                padding: ${spacing[2]};
                background-color: ${colors.teal[800]};
                border-radius: ${borderRadius.md};
              `}
            >
              <RepositoryIcon width={30} height={30} color={theme.onSurface} />
            </Span>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                padding-left: ${spacing[5]};
                width: 100%;
              `}
            >
              <Span
                css={css`
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                `}
              >
                <Span
                  css={css`
                    font-weight: ${fontWeight.bold};
                    font-size: ${fontSize.lg};
                  `}
                >
                  {project.name}
                </Span>
                <Tag
                  css={css`
                    ${cssFromBackgroundColor(project.primaryLanguage.color)}
                    align-items: center;
                    font-size: 0.5rem;
                  `}
                >
                  {project.primaryLanguage.name}
                </Tag>
              </Span>
              <Span
                css={css`
                  color: ${colors.grey[300]};
                  font-size: ${fontSize.xs};
                `}
              >
                {`last updated ${timeago.format(project.updatedAt)}`}
              </Span>
              <Span
                css={css`
                  font-size: ${fontSize.sm};
                  padding-top: ${spacing[3]};
                `}
              >
                {truncate(project.description || "", 12)}
              </Span>
            </div>
          </div>
          <a
            href={project.url}
            css={css`
              display: flex;
              color: ${theme.primaryLight};
              background-color: ${colors.grey[800]};
              padding: ${spacing[3]} ${spacing[5]};
              border-bottom-left-radius: ${borderRadius.md};
              border-bottom-right-radius: ${borderRadius.md};
              text-decoration: none;

              &:hover {
                color: ${theme.primaryLighter};
              }
            `}
          >
            View Repository
          </a>
        </Card>
      ))}
    </>
  )
}

type RenderOnlineActivity = {
  activity?: Activity
  error?: Error
}

const renderOnlineActivity = ({
  activity,
  error,
}: RenderOnlineActivity): React.ReactElement => {
  if (activity) {
    return <OnlineActivity activity={activity} />
  }

  if (error) {
    return <div />
  }

  return <div>Loading</div>
}

const LatestActivities: React.FC<LatestActivitiesProps> = ({ className }) => {
  const { data: activity, error } = useSWR<Activity>(
    `${process.env.NEXT_PUBLIC_PROJECTS_API}/api/project/activities`,
    fetchJSON,
  )
  return (
    <div
      className={className}
      css={css`
        padding: 0 ${spacing[4]};
      `}
    >
      <Heading as="h4" size="3xl" weight="bold">
        Online Activity
      </Heading>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding: ${spacing[8]} 0 ${spacing[6]} 0;

          ${fromTablet`
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
          `}
        `}
      >
        {renderOnlineActivity({ activity, error })}
      </div>
    </div>
  )
}

export { LatestActivities }
