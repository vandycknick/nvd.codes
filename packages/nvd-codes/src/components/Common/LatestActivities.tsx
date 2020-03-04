import { History } from "grommet-icons"
import React from "react"
import styled, { css } from "styled-components"
import * as timeago from "timeago.js"

import { Activity } from "../../lib/projects"
import { Column, Columns } from "../Bulma/Columns"
import Paragraph from "../Bulma/Paragraph"
import { Title } from "../Bulma/Title"
import { Tag } from "../Bulma/Tag"

type LatestActivitiesProps = {
  activity: Activity
}

const CommitLink = styled.a`
  color: #3d588f !important;
  box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1);
`

const cssFromBackgroundColor = (background: string): any => {
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

const LatestActivities: React.FC<LatestActivitiesProps> = ({ activity }) => (
  <div className="container">
    <Columns className="is-variable is-8 is-marginless">
      <Column size="one-third" className="content">
        <Title as="h5" size="4" className="has-text-centered">
          Latest Commit
        </Title>
        <Columns centered isMultiline className="has-text-centered">
          <Column size="half">
            <History color="black" />
          </Column>
          <Column size="full">
            <CommitLink href={activity.latestCommit.url}>
              {activity.latestCommit.message}
            </CommitLink>
            <Paragraph
              className="is-size-7"
              css={`
                margin-top: 1rem;
              `}
            >
              {timeago.format(activity.latestCommit.pushedDate)}
              &nbsp;in&nbsp;
              {activity.latestCommit.repositoryName}
            </Paragraph>
          </Column>
        </Columns>
      </Column>
      <Column size="two-thirds" className="content">
        <Title as="h5" size="4">
          Latest repos
        </Title>
        <Columns isMultiline className="is-marginless">
          {activity.projects.map(repo => (
            <Column key={repo.id} size="half" className="is-paddingless">
              <Title
                as="h6"
                size="6"
                css={`
                  margin-bottom: 0.5rem !important;
                `}
              >
                <a href={repo.url}>{repo.name}</a>
                <Tag
                  size="small"
                  css={cssFromBackgroundColor(repo.primaryLanguage.color)}
                >
                  {repo.primaryLanguage.name}
                </Tag>
              </Title>
              <Paragraph
                className="is-size-7"
                css={`
                  padding-bottom: 2rem;
                `}
              >
                {repo.description}
              </Paragraph>
            </Column>
          ))}
        </Columns>
      </Column>
    </Columns>
  </div>
)

export default LatestActivities
