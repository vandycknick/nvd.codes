import { css } from "@emotion/css"
import styled from "@emotion/styled"

import { colors } from "components/Tokens"

type SpanProps = {
  shadow?: "teal" | "yellow" | "red"
}

const Span = styled.span<SpanProps>`
  ${({ shadow }) =>
    shadow &&
    css`
      padding-bottom: 5px;
      box-shadow: inset 0 -2px 0 ${colors[shadow][200]};
    `}
`

export { Span }
