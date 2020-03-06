import React from "react"
import { graphql, Link } from "gatsby"
import { FaRegCalendarAlt, FaRegEdit } from "react-icons/fa"
import "./prism-theme.css"

import Layout from "../components/Layout"
import SEO from "../components/Common/SEO"

import Section from "../components/Bulma/Section"
import { Title } from "../components/Bulma/Title"
import styled from "styled-components"
import Time from "../components/Common/Time"

import { Tags, Tag } from "../components/Bulma/Tag"
import Divider from "../components/Bulma/Divider"
import { Button } from "../components/Bulma/Button"
import { Columns, Column } from "../components/Bulma/Columns"

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

const ArticleTags = styled(Tags)`
  display flex;
  justify-content: center;
`

const LinkButton = Button.withComponent(Link)

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
            <FaRegCalendarAlt />
            <Time dateTime={post.frontmatter.date} />
            <FaRegEdit />
            <a href={post.fields.editUrl}>suggest edit</a>
          </BlogPostSubtitle>
        </header>
        <PostContents dangerouslySetInnerHTML={{ __html: post.html }} />
        <Divider
          text="TAGS"
          css={`
            margin-top: 4rem;
          `}
        />
        <ArticleTags size="normal">
          {post.frontmatter.categories.map((tag: any) => (
            <Tag color="dark" key={tag}>
              {tag}
            </Tag>
          ))}
        </ArticleTags>
      </Section>
      <nav
        className="container"
        css={`
          padding: 0 1.5rem 3rem 1.5rem;
        `}
      >
        <Columns>
          <Column size="1">
            {previous && (
              <LinkButton to={previous.fields.slug} rel="prev">
                Previous
              </LinkButton>
            )}
          </Column>
          <Column size="1" offset="10">
            {next && (
              <LinkButton to={next.fields.slug} rel="next">
                Next
              </LinkButton>
            )}
          </Column>
        </Columns>
      </nav>
    </Layout>
  )
}

export { pageQuery }
export default BlogPost
