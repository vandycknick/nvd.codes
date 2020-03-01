import React, { Fragment } from "react"
import { Article } from "grommet-icons"
import * as timeago from "timeago.js"

import { Column, Columns } from "../Bulma/Columns"
import Paragraph from "../Bulma/Paragraph"
// import { Tag } from "../Bulma/Tag"
import { Subtitle, Title } from "../Bulma/Title"
import { Link } from "gatsby"

type LatestPostsProps = {
  posts: any[]
}

const LatestsPostsListEmpty: React.FC = () => (
  <Fragment>
    <Paragraph>
      Nothing new to see!
      <br />
      🕵️‍♂️
    </Paragraph>
  </Fragment>
)

const LatestsPostsList: React.FC<LatestPostsProps> = ({ posts }) => (
  <Columns centered>
    {posts.map((l, index) => (
      <Column key={l.node.excerpt} size="one-third">
        <Subtitle
          as="div"
          size="5"
          css={`
            margin-bottom: 5px;
          `}
        >
          <Link to={l.node.fields.slug}>{l.node.frontmatter.title}</Link>
          <Fragment>
            {/* {index === 0 && (
              <Tag
                size="small"
                color="primary"
                css={`
                  margin-left: 10px;
                `}
              >
                Latest
              </Tag>
            )} */}
          </Fragment>
        </Subtitle>
        <Paragraph
          className="is-italic"
          css={`
            margin-bottom: 10px;
            font-size: 0.65rem !important;
          `}
        >
          published {timeago.format(l.node.frontmatter.date)}
        </Paragraph>
        <Paragraph className="is-size-7">
          {l.node.frontmatter.description}
        </Paragraph>
      </Column>
    ))}
  </Columns>
)

const LatestPosts: React.FC<LatestPostsProps> = ({ posts }) => (
  <Fragment>
    <Title as="h3" size="4" shadow="yellow" spaced>
      Latest Writings
      <Article
        color="black"
        css={`
          margin-left: 10px;
        `}
      />
    </Title>
    {posts.length === 0 ? (
      <LatestsPostsListEmpty />
    ) : (
      <LatestsPostsList posts={posts} />
    )}
  </Fragment>
)

export default LatestPosts
