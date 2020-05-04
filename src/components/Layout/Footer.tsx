import React from "react"
import { css } from "@emotion/core"

import { spacing, styled } from "src/components/Tokens"
import { Container } from "src/components/Common/Container"

const FooterWrapper = styled.footer`
  ${({ theme }) => css`
    background-color: ${theme.surface};
    color: ${theme.onSurface};
    padding: ${spacing[2]};
  `}
`

const Footer: React.FC = () => (
  <FooterWrapper>
    <Container>
      <p
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <strong>nvd.codes</strong>&nbsp;is handcrafted with ❤️&nbsp;
        <a href="https://github.com/nickvdyck/nvd.codes">view source</a>
      </p>
    </Container>
  </FooterWrapper>
)

export default Footer
