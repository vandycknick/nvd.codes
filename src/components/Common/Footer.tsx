import React from "react"
import { css } from "@emotion/core"

import { spacing, styled, Theme, fontSize } from "src/components/Tokens"
import { Container } from "src/components/Common/Container"
import { useTheme } from "emotion-theming"
import { Span } from "./Span"

const FooterWrapper = styled.footer`
  ${({ theme }) => css`
    background-color: ${theme.navigation};
    color: ${theme.onNavigation};
    padding: ${spacing[4]} 0 ${spacing[2]} 0;
  `}
`

const Footer: React.FC = () => {
  const theme = useTheme<Theme>()
  return (
    <FooterWrapper>
      <Container
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <p>
          <strong>nvd.codes</strong>&nbsp;is handcrafted with ❤️&nbsp;
          <a
            css={css`
              color: ${theme.onNavigation};

              &:hover {
                color: ${theme.primaryLighter};
              }
            `}
            href="https://github.com/nickvdyck/nvd.codes"
          >
            view source
          </a>
        </p>
        <Span
          css={css`
            font-size: ${fontSize.xs};
            padding: ${spacing[1]} 0;
          `}
        >
          all materials © Nick Van Dyck 2020
        </Span>
      </Container>
    </FooterWrapper>
  )
}

export { Footer }
