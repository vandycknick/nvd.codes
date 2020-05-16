import { css } from "@emotion/core"

import { styled, borderRadius, shadow, spacing } from "src/components/Tokens"

const Card = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: ${theme.surface};
    color: ${theme.onSurface};
    border-radius: ${borderRadius.md};
    box-shadow: ${shadow.md};
    padding: ${spacing[5]};
  `}
`

export { Card }
