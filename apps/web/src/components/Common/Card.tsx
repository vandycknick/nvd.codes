import styled from "@emotion/styled"

import { borderRadius, shadow, spacing } from "components/Tokens"

const Card = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadow.md};
  padding: ${spacing[5]};
`

export { Card }
