import React from "react"
import { css } from "@emotion/core"
import { graphql } from "gatsby"

import Layout from "src/components/Layout"
import SEO from "src/components/Common/SEO"
import { Paragraph } from "src/components/Common/Paragraph"
import { LinkButton } from "src/components/Common/Buttons"
import { Heading } from "src/components/Common/Heading"
import { Image } from "src/components/Common/Image"
import { spacing } from "src/components/Tokens"

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
    avatar: {
      childImageSharp: {
        fixed: { src: string }
      }
    }
  }
}

const About: React.FC<AboutProps> = ({ data }) => (
  <Layout>
    <SEO title="About" />
    <section
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Heading
        css={css`
          align-self: center;
          padding-bottom: ${spacing[5]};
        `}
        size="4xl"
      >
        About Me
      </Heading>
      <Image src={data.avatar.childImageSharp.fixed.src} />
      <Paragraph
        css={css`
          text-align: center;
        `}
      >
        I’m an enthusiastic and passionate software engineer with over 6 years
        of experience. I&#39;m fond of all things web and always striving to
        build user friendly, scalable and stable web solutions that get users
        engaged. Trained in the dark arts of full stack development I have
        gained experience in a broad range of technologies and languages.
        Eventually I hope to pursue a role where I can have a high impact on the
        product. In my spare time I like to hack on open source or personal
        projects, read books or watch a good movie.
      </Paragraph>
      <LinkButton href="https://resume.nvd.codes/resume.pdf">
        Resume 👨‍🎓
      </LinkButton>
    </section>
  </Layout>
)

export { pageQuery }
export default About
