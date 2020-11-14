import React from "react"
import { css } from "@emotion/css"
import styled from "@emotion/styled"
import { useTheme } from "@emotion/react"

import { spacing, fontSize } from "components/Tokens"
import { Container } from "components/Common/Container"
import { Span } from "./Span"

const FooterWrapper = styled.footer`
  ${({ theme }) => css`
    background-color: ${theme.navigation};
    color: ${theme.onNavigation};
    padding: ${spacing[4]} 0 ${spacing[2]} 0;
  `}
`

const Footer: React.FC = () => {
  const theme = useTheme()
  return (
    <FooterWrapper>
      <Container
        className={css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <p>
          <strong>nvd.codes</strong>&nbsp;is handcrafted with ❤️&nbsp;
          <a
            className={css`
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
          className={css`
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
