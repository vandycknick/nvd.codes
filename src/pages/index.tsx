import React from "react"
import { css } from "@emotion/core"
import { graphql } from "gatsby"

import Layout from "src/components/Layout"
import SEO from "src/components/Common/SEO"
import { Greeting } from "src/components/Home/Greeting"
import { RecentBlogPosts, Post } from "src/components/Home/RecentBlogPosts"
import { LatestActivities } from "src/components/Home/LatestActivities"
import { spacing } from "src/components/Tokens"
import { Divider } from "src/components/Common/Divider"

const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        profiles {
          twitter {
            handle
            url
          }
          site {
            url
          }
          linkedin {
            handle
            url
          }
          github {
            handle
            url
          }
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 3
      filter: { fields: { draft: { eq: false } } }
    ) {
      edges {
        node {
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
          }
        }
      }
    }
  }
`

interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        profiles: {
          twitter: {
            handle: string
            url: string
          }
          site: {
            handle: string
            url: string
          }
          linkedin: {
            handle: string
            url: string
          }
          github: {
            handle: string
            url: string
          }
        }
      }
    }
    allMarkdownRemark: {
      edges: {
        node: {
          fields: { slug: string; readingTime: { text: string } }
          frontmatter: { date: string; title: string; description: string }
        }
      }[]
    }
  }
}

const adaptQueryToPosts = (query: IndexPageProps["data"]): Post[] =>
  query.allMarkdownRemark.edges.map((edge) => ({
    slug: edge.node.fields.slug,
    date: new Date(edge.node.frontmatter.date),
    title: edge.node.frontmatter.title,
    description: edge.node.frontmatter.description,
    readingTime: edge.node.fields.readingTime.text,
  }))

const adaptQueryToSocialUrls = (
  query: IndexPageProps["data"],
): { githubUrl: string; siteUrl: string; twitterUrl: string } => ({
  githubUrl: query.site.siteMetadata.profiles.github.url,
  siteUrl: query.site.siteMetadata.profiles.site.url,
  twitterUrl: query.site.siteMetadata.profiles.twitter.url,
})

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      <Greeting {...adaptQueryToSocialUrls(data)} />
      <Divider />
      <RecentBlogPosts
        css={css`
          margin: ${spacing[6]} 0;
        `}
        posts={adaptQueryToPosts(data)}
      />
      <Divider />
      <LatestActivities
        css={css`
          margin: ${spacing[6]} 0;
        `}
      />
    </Layout>
  )
}

export default IndexPage
export { pageQuery }
