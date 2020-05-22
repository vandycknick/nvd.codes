import { css } from "@emotion/core"

import { styled, spacing } from "components/Tokens"

const Main = styled.main`
  ${({ theme }) => css`
    color: ${theme.onBackground};
    background-color: ${theme.background};
    display: flex;
    flex: 1;
    padding: 0 ${spacing[4]};
  `}
`

export { Main }
