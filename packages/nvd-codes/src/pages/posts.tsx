import { graphql, Link } from "gatsby"
import React from "react"
import Section from "../components/Bulma/Section"
import { Columns, Column } from "../components/Bulma/Columns"
import Time from "../components/Common/Time"
import Layout from "../components/Layout"
import SEO from "../components/Common/SEO"

const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
                <article className="media">
                  <div className="media-content content has-text-centered">
                    <p className="title is-3">{post.node.frontmatter.title}</p>
                    <p className="subtitle is-6 is-italic">
                      <Time dateTime={post.node.frontmatter.date} />
                    </p>
                    <p className="description">
                      {post.node.frontmatter.description}
                    </p>
                    <Link to={post.node.fields.slug} className="button is-link">
                      Continue Reading
                    </Link>
                    <hr />
                    <div className="level">
                      <div className="level-left">
                        {post.node.frontmatter.categories.length > 0 && (
                          <span>
                            {/* <Tag /> */}
                            <span>
                              {post.node.frontmatter.categories.join(", ")}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="level-right"></div>
                    </div>
                  </div>
                </article>
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
