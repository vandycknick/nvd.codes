import React from "react"
import { css } from "@emotion/core"
import styled from "@emotion/styled"
import { graphql, Link } from "gatsby"
import { FaRegCalendarAlt, FaRegEdit, FaRegClock } from "react-icons/fa"
import "./prism-theme.css"

import Layout from "../components/Layout"
import SEO from "../components/Common/SEO"

import Section from "../components/Bulma/Section"
import { Title } from "../components/Bulma/Title"
import Time from "../components/Common/Time"

import { Tags, Tag } from "../components/Bulma/Tag"
import Divider from "../components/Bulma/Divider"
import { Button } from "../components/Bulma/Button"
import { Columns, Column } from "../components/Bulma/Columns"

interface BlogPostBySlugQuery {
  site: { siteMetadata: { title: string } }
  markdownRemark: {
    id: string
    excerpt: string
    html: string
    frontmatter: {
      title: string
      date: string
      description: string
      categories: string[]
    }
    fields: {
      editUrl: string
      readingTime: { text: string }
    }
  }
}

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
        readingTime {
          text
        }
      }
    }
  }
`

const BlogPostSubtitle = styled.h2`
  display: inline-flex;
  align-self: center;

  svg {
    height: 1em;
    width: 1em;
    top: 0.125em;
    position: relative;

    margin-right: 5px;
  }

  svg:not(:first-child) {
    margin-left: 20px;
  }

  a {
    color: #4a4a4a;
  }
`

const PostContents = styled.section`
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

const LinkButton = styled(Button)``.withComponent(Link)

interface BlogPostProps {
  data: BlogPostBySlugQuery
  pageContext: {
    previous?: { fields: { slug: string } }
    next?: { fields: { slug: string } }
  }
}

const BlogPost: React.FC<BlogPostProps> = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const { previous, next } = pageContext
  const contents = `<p>${post.frontmatter.description}</p>${post.html}`

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Section className="container">
        <header className="has-text-centered">
          <Title>{post.frontmatter.title}</Title>
          <BlogPostSubtitle className="subtitle is-6">
            <FaRegCalendarAlt />
            <Time dateTime={post.frontmatter.date} />
            <FaRegEdit />
            <a href={post.fields.editUrl}>suggest edit</a>
            <FaRegClock />
            <span>~{post.fields.readingTime.text}</span>
          </BlogPostSubtitle>
        </header>
        <PostContents
          className="content"
          dangerouslySetInnerHTML={{ __html: contents }}
        />
        <Divider
          text="TAGS"
          css={css`
            margin-top: 4rem;
          `}
        />
        <ArticleTags size="normal">
          {post.frontmatter.categories.map((tag) => (
            <Tag color="dark" key={tag}>
              {tag}
            </Tag>
          ))}
        </ArticleTags>
      </Section>
      <nav
        className="container"
        css={css`
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
