import React from "react"
import { css } from "@emotion/core"
import { useTheme } from "emotion-theming"

import { Heading } from "src/components/Common/Heading"
import { Span } from "src/components/Common/Span"
import { TextRoulette } from "src/components/Common/TextRoulette"
import { OSDetect } from "src/components/Common/OSDetect"
import { Paragraph } from "src/components/Common/Paragraph"
import { spacing, colors, Theme } from "src/components/Tokens"
import { Globe } from "src/components/Home/Globe"
import { Github } from "src/components/Home/Github"
import { Twitter } from "src/components/Home/Twitter"

const Greeting: React.FC = () => {
  const theme = useTheme<Theme>()
  return (
    <section
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Heading weight="normal">Hi 👋</Heading>
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
            <OSDetect windows="🐱‍👓" unix="☕ lover" key="6" />,
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
          margin: ${spacing[5]} 0;
          align-items: center;
        `}
      >
        <Globe width={20} height={20} color={theme.onBackground} />
        <Span
          css={css`
            margin: 0 ${spacing[3]};
          `}
        >
          Web
        </Span>
        <Github width={20} height={20} color={theme.onBackground} />
        <Span
          css={css`
            margin: 0 ${spacing[3]};
          `}
        >
          Github
        </Span>
        <Twitter width={24} height={24} color={theme.onBackground} />
        <Span
          css={css`
            margin: 0 ${spacing[3]};
          `}
        >
          Twitter
        </Span>
      </div>
    </section>
  )
}

export { Greeting }
