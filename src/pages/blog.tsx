import React from "react"
import { graphql } from "gatsby"
import { FluidObject } from "gatsby-image"

import Layout from "src/components/Layout"
import SEO from "src/components/Common/SEO"
import { Post, PostsList } from "src/components/Blog/PostsList"
import { Paragraph } from "src/components/Common/Paragraph"
import { css } from "@emotion/core"
import { Heading } from "src/components/Common/Heading"
import { spacing } from "src/components/Tokens"

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
            readingTime {
              text
            }
          }
          frontmatter {
            date
            title
            description
            featuredImage {
              childImageSharp {
                fluid(maxWidth: 350) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
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
          fields: { slug: string; readingTime: { text: string } }
          frontmatter: {
            date: string
            title: string
            description: string
            featuredImage?: {
              childImageSharp: {
                fluid: FluidObject
              }
            }
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
    cover: edge.node.frontmatter.featuredImage?.childImageSharp?.fluid,
    categories: edge.node.frontmatter.categories,
    readingTime: edge.node.fields.readingTime.text,
  }))

const Blog: React.FC<PostsProps> = ({ data }) => {
  return (
    <Layout>
      <SEO title="Blog" />
      <section
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <Heading
          css={css`
            padding: ${spacing[3]};
          `}
          size="4xl"
        >
          Blog
        </Heading>
        <Paragraph>
          Here I share my personal ramblings about stuff I&#39;m working on,
          life-events, problems I&#39;m solving and out loud thoughts.
        </Paragraph>
      </section>
      <PostsList posts={adaptQueryToPosts(data)} />
    </Layout>
  )
}

export { pageQuery }
export default Blog
