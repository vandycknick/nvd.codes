import React from "react"
import { graphql } from "gatsby"
import { css } from "styled-components"
import { Globe, Github, Twitter } from "grommet-icons"

import Layout from "../components/Layout"
import SEO from "../components/Common/SEO"
import ScrollDownIcon from "../components/Common/ScrollDownIcon"
import { fromTablet } from "../components/Common/mediaQuery"

import Hero from "../components/Bulma/Hero"
import { Columns, Column } from "../components/Bulma/Columns"
import { Title, Subtitle } from "../components/Bulma/Title"
import Paragraph from "../components/Bulma/Paragraph"
import TextRoulette from "../components/Common/TextRoulette"
import { LinkButton } from "../components/Bulma/Button"
import LatestPosts from "../components/Common/LatestPosts"

const heroParagraphStyles = css`
  margin: 1.5rem 0rem;

  ${fromTablet`
        margin-left: 10%;
        margin-right: 10%;
    `}
`

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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
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
  data: any
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const { site, allMarkdownRemark } = data
  const latest = allMarkdownRemark.edges.slice(0, 2)

  return (
    <Layout>
      <SEO title="Home" />
      <Hero size="fullheight-with-navbar">
        <Hero.Body>
          <div className="container has-text-centered">
            <Columns centered>
              <Column size="two-thirds">
                <Subtitle as="h1">Hi, 👋</Subtitle>
                <Title as="h2" size="2" shadow="green" spaced>
                  I&#39;m Nick
                </Title>
                <Subtitle as="h3" size="4">
                  <TextRoulette
                    messages={[
                      `And I'm a Software Engineer`,
                      `Web aficionado`,
                      `Wicked keyboard magician`,
                      `Code ninja ${
                        typeof window !== "undefined" &&
                        navigator.platform === "Win32"
                          ? "🐱‍👤"
                          : "⚡"
                      }`,
                      `Full Stack Web Developer`,
                      `${
                        typeof window !== "undefined" &&
                        navigator.platform === "Win32"
                          ? "🐱‍👓"
                          : "☕"
                      }`,
                    ]}
                  />
                </Subtitle>
                <Paragraph css={heroParagraphStyles}>
                  I try to write code and blog about my experiences. Love
                  writing, speaking, travelling or making lots of random stuff.
                  Mostly I can be found playing around with Python, .NET,
                  TypeScript or JavaScript. Occasionally developing CLI tools
                  and apps.
                </Paragraph>
                <Paragraph hasTextCentered>
                  <LinkButton
                    href={site.siteMetadata.profiles.site.url}
                    size="large"
                    color="white"
                  >
                    <Globe
                      color="black"
                      css={`
                        margin-right: 10px;
                      `}
                    />
                    Web
                  </LinkButton>
                  <LinkButton
                    href={site.siteMetadata.profiles.github.url}
                    size="large"
                    color="white"
                  >
                    <Github
                      color="black"
                      css={`
                        margin-right: 10px;
                      `}
                    />
                    Code
                  </LinkButton>
                  <LinkButton
                    href={site.siteMetadata.profiles.twitter.url}
                    size="large"
                    color="white"
                  >
                    <Twitter
                      color="black"
                      css={`
                        margin-right: 10px;
                      `}
                    />
                    Twitter
                  </LinkButton>
                </Paragraph>
              </Column>
            </Columns>
            <Columns centered>
              <Column size="two-thirds">
                <hr />
              </Column>
            </Columns>
            <Columns centered>
              <Column size="two-thirds">
                <LatestPosts posts={latest} />
              </Column>
            </Columns>
            <Columns
              centered
              css={`
                margin-top: 3rem;
              `}
            >
              <Column size="full">
                <ScrollDownIcon />
              </Column>
            </Columns>
          </div>
        </Hero.Body>
      </Hero>
    </Layout>
  )
}

export default IndexPage
export { pageQuery }
