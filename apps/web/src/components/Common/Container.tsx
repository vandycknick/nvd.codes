import styled from "@emotion/styled"

import * as screens from "components/Tokens/screens"

const Container = styled.div`
  flex-grow: 1;
  margin: 0 auto;
  position: relative;
  width: auto;

  @media screen and (min-width: ${screens.md}) {
    max-width: 668px;
  }

  @media screen and (min-width: ${screens.lg}) {
    max-width: 924px;
  }

  @media screen and (min-width: ${screens.xl}) {
    max-width: 1180px;
  }
`

export { Container }
