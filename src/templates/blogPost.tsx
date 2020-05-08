import React from "react"
import { graphql } from "gatsby"

import Layout from "src/components/Layout"
import SEO from "src/components/Common/SEO"
import { Post } from "src/components/BlogPost/Post"

interface BlogPostBySlugQuery {
  site: { siteMetadata: { title: string } }
  markdownRemark: {
    id: string
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
  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
      />
      <Post
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        editUrl={post.fields.editUrl}
        readingTime={post.fields.readingTime.text}
        description={post.frontmatter.description}
        content={post.html}
        nextPage={next?.fields.slug ?? null}
        previousPage={previous?.fields.slug ?? null}
      />
    </Layout>
  )
}

export { pageQuery }
export default BlogPost
