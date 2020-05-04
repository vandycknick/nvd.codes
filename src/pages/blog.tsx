import React from "react"
import { graphql } from "gatsby"

import Layout from "src/components/Layout"
import SEO from "src/components/Common/SEO"
import { Post, PostsList } from "src/components/Blog/PostList"

const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { published: { eq: true } } }
    ) {
      edges {
        node {
          id
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
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          id: string
          fields: { slug: string }
          frontmatter: {
            date: string
            title: string
            description: string
            categories: string[]
          }
        }
      }[]
    }
  }
}

const adaptQueryToPosts = (query: PostsProps["data"]): Post[] =>
  query.allMarkdownRemark.edges.map((edge) => ({
    id: edge.node.id,
    slug: edge.node.fields.slug,
    date: new Date(edge.node.frontmatter.date),
    title: edge.node.frontmatter.title,
    description: edge.node.frontmatter.description,
    categories: edge.node.frontmatter.categories,
  }))

const Blog: React.FC<PostsProps> = ({ data }) => {
  return (
    <Layout>
      <SEO title="Blog" />
      <PostsList posts={adaptQueryToPosts(data)} />
    </Layout>
  )
}

export { pageQuery }
export default Blog
