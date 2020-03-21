import React from "react"
import { graphql, Link } from "gatsby"
import { FaRegCalendarAlt } from "react-icons/fa"

import Section from "../components/Bulma/Section"
import { Columns, Column } from "../components/Bulma/Columns"
import Time from "../components/Common/Time"
import Layout from "../components/Layout"
import SEO from "../components/Common/SEO"
import { Tags, Tag } from "../components/Bulma/Tag"
import truncate from "../utils/truncate"

const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { published: { eq: true } } }
    ) {
      edges {
        node {
          id
          excerpt
          fields {
            slug
          }
          frontmatter {
            date
            title
            description
            categories
          }
        }
      }
    }
  }
`

interface PostsProps {
  data: any
}

const Posts: React.FC<PostsProps> = ({ data }) => {
  const { allMarkdownRemark } = data
  const posts = allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title="Posts" />
      <Section className="container">
        <Columns centered>
          <Column size="8">
            {posts.map((post: any) => (
              <div className="box" key={post.node.id}>
                <Link to={post.node.fields.slug}>
                  <article className="media">
                    <div className="media-content content has-text-centered">
                      <p className="title is-3">
                        {post.node.frontmatter.title}
                      </p>
                      <p className="subtitle is-6 is-italic">
                        <FaRegCalendarAlt
                          css={`
                            margin-right: 10px;
                            padding-top: 2px;
                          `}
                        />
                        <Time dateTime={post.node.frontmatter.date} />
                      </p>
                      <p
                        css={`
                          color: #4a4a4a;
                        `}
                      >
                        {truncate(post.node.frontmatter.description)}
                      </p>
                      <hr />
                      <Columns>
                        <Column>
                          {post.node.frontmatter.categories.length > 0 && (
                            <Tags centered>
                              {post.node.frontmatter.categories.map(
                                (category: string) => (
                                  <Tag size="small" color="dark" key={category}>
                                    {category}
                                  </Tag>
                                ),
                              )}
                            </Tags>
                          )}
                        </Column>
                      </Columns>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </Column>
        </Columns>
      </Section>
    </Layout>
  )
}

export { pageQuery }
export default Posts
