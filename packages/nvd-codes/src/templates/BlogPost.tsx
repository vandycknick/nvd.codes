import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/Common/SEO"

import Section from "../components/Bulma/Section"
import { Title } from "../components/Bulma/Title"
import styled from "styled-components"
import { Calendar, Edit } from "grommet-icons"
import Time from "../components/Common/Time"

import "../styles/prism-theme.css"

const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        categories
      }
      fields {
        editUrl
      }
    }
  }
`

const BlogPostSubtitle = styled.h2.attrs({ className: "subtitle is-6" })`
  display: inline-flex;
  align-self: center;

  svg {
    height: 1em;
    width: 1em;
    top: 0.125em;
    position: relative;

    margin-right: 10px;
  }

  svg:not(:first-child) {
    margin-left: 10px;
  }

  a {
    color: #4a4a4a;
  }
`

const PostContents = styled.section.attrs({ className: "content" })`
  margin-top: 50px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  code {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  details {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #ebebeb;
  }

  summary {
    margin-bottom: 1rem;
  }
`

interface BlogPostProps {
  data: any
  pageContext: any
}

const BlogPost: React.FC<BlogPostProps> = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const { previous, next } = pageContext

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Section as="article" className="container">
        <header className="has-text-centered">
          <Title>{post.frontmatter.title}</Title>
          <BlogPostSubtitle>
            <Calendar />
            <Time dateTime={post.frontmatter.date} />
            <Edit />
            <a href={post.fields.editUrl}>suggest edit</a>
          </BlogPostSubtitle>
        </header>
        <PostContents dangerouslySetInnerHTML={{ __html: post.html }} />
        {/* <ArticleFooter tags={post.node.frontmatter.categories} /> */}
      </Section>
      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export { pageQuery }
export default BlogPost
