import React from "react"
import { graphql } from "gatsby"
import "./prism-theme.css"

import Layout from "../components/Layout"
import SEO from "../components/Common/SEO"

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
  console.log(previous, next)

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <div dangerouslySetInnerHTML={{ __html: contents }} />
    </Layout>
  )
}

export { pageQuery }
export default BlogPost
