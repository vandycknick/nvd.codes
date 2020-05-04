import { css } from "@emotion/core"

import { styled, colors } from "src/components/Tokens"

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
