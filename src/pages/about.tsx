import React from "react"
import { css } from "@emotion/core"

import Layout from "../components/Layout"
import Section from "../components/Bulma/Section"
import Header from "../components/Bulma/Header"
import { Title } from "../components/Bulma/Title"
import Paragraph from "../components/Bulma/Paragraph"
import { LinkButton } from "../components/Bulma/Button"
import Image from "../components/Bulma/Image"
import { graphql } from "gatsby"
import SEO from "../components/Common/SEO"

const pageQuery = graphql`
  query {
    avatar: file(absolutePath: { regex: "/profile.jpg/" }) {
      childImageSharp {
        fixed(width: 150, height: 150) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

interface AboutProps {
  data: {
    avatar: any
  }
}

const About: React.FC<AboutProps> = ({ data }) => (
  <Layout>
    <SEO title="About" />
    <Section className="container" hasContent>
      <Header hasTextCentered>
        <Title shadow="green">About Nick Van Dyck</Title>
        <Image
          src={data.avatar.childImageSharp.fixed.src}
          css={css`
            margin: 2.5rem auto !important;
          `}
          size="128x128"
          rounded
        />
        <Paragraph>
          I’m an enthusiastic and passionate senior software engineer with over
          6 years of experience. I&#39;m fond of all things web and always
          striving to build user friendly, scalable and stable web solutions
          that get users engaged. Trained in the dark arts of full stack
          development I have gained experience in a broad range of technologies
          and languages. Eventually I hope to pursue a role where I can have a
          high impact on the product. In my spare time I like to hack on open
          source or personal projects, read books or watch a good movie.
        </Paragraph>
        <LinkButton
          css={css`
            margin-top: 1rem;
          `}
          href="https://resume.nvd.codes/resume.pdf"
          color="primary"
          rounded
        >
          Resume 👨‍🎓
        </LinkButton>
      </Header>
    </Section>
  </Layout>
)

export { pageQuery }
export default About
