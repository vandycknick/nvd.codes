import React from "react"
import { css } from "@emotion/core"
import { useTheme } from "emotion-theming"

import { Heading } from "components/Common/Heading"
import { Span } from "components/Common/Span"
import { TextRoulette } from "components/Common/TextRoulette"
import { OSDetect } from "components/Common/OSDetect"
import { Paragraph } from "components/Common/Paragraph"
import { colors, styled, spacing, Theme } from "components/Tokens"
import { Globe } from "components/Home/Icons/Globe"
import { Github } from "components/Home/Icons/Github"
import { Twitter } from "components/Home/Icons/Twitter"

type GreetingProps = {
  githubUrl: string
  twitterUrl: string
  siteUrl: string
}

const IconLink = styled.a`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${theme.onBackground};
    margin: 0 ${spacing[2]};

    &:hover {
      color: ${theme.primary};

      svg {
        fill: ${theme.primary};
      }
    }
  `}
`

const Greeting: React.FC<GreetingProps> = ({
  githubUrl,
  twitterUrl,
  siteUrl,
}) => {
  const theme = useTheme<Theme>()
  return (
    <section
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Heading
        css={css`
          padding-top: ${spacing[6]};
        `}
        weight="normal"
      >
        Hi 👋
      </Heading>
      <Heading as="h2" size="4xl" weight="extrabold">
        I&#39;m <Span shadow="yellow">Nick</Span>
      </Heading>
      <Heading
        as="h3"
        weight="normal"
        css={css`
          display: flex;
        `}
      >
        And I&#39;m a &nbsp;
        <TextRoulette
          messages={[
            `Software Engineer`,
            `Web aficionado`,
            `⌨️ 🧙‍♂️`,
            <OSDetect windows="Code ninja 🐱‍👤" unix="Code ninja" key="4" />,
            `Web Developer`,
            <OSDetect windows="🐱‍👓" unix="☕    lover" key="6" />,
          ]}
        />
      </Heading>
      <Paragraph
        css={css`
          max-width: 500px;
          text-align: center;
          margin: ${spacing[0]} 0;
          padding: 0 ${spacing[1]};
          color: ${colors.grey[200]};
        `}
      >
        I try to write code and blog about my experiences. Love writing,
        speaking, travelling or making lots of random stuff. Mostly I can be
        found playing around with Python, .NET, TypeScript or JavaScript.
        Occasionally developing CLI tools and apps.
      </Paragraph>
      <div
        css={css`
          display: flex;
          align-items: center;
          padding: ${spacing[5]} ${spacing[2]};
        `}
      >
        <IconLink href={siteUrl}>
          <Globe width={20} height={20} color={theme.onBackground} />
          <Span
            css={css`
              margin: 0 ${spacing[3]};
            `}
          >
            Web&nbsp;&nbsp;&nbsp;&nbsp;
          </Span>
        </IconLink>
        <IconLink href={githubUrl}>
          <Github width={20} height={20} color={theme.onBackground} />
          <Span
            css={css`
              margin: 0 ${spacing[3]};
            `}
          >
            Github&nbsp;
          </Span>
        </IconLink>
        <IconLink href={twitterUrl}>
          <Twitter width={24} height={24} color={theme.onBackground} />
          <Span
            css={css`
              margin: 0 ${spacing[3]};
            `}
          >
            Twitter
          </Span>
        </IconLink>
      </div>
    </section>
  )
}

export { Greeting }
