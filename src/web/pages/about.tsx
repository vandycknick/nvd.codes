import React from "react"
import { css } from "@emotion/core"

import SEO from "components/Common/SEO"
import { Paragraph } from "components/Common/Paragraph"
import { LinkButton } from "components/Common/Buttons"
import { Heading } from "components/Common/Heading"
import { Image } from "components/Common/Image"
import { spacing } from "components/Tokens"

const About: React.FC = () => (
  <>
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
          padding: ${spacing[3]};
        `}
        size="4xl"
      >
        About Me
      </Heading>
      <Image src="/images/profile.jpg" />
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
  </>
)

export default About
