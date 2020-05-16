import { css } from "@emotion/core"

import {
  styled,
  fontFamily,
  fontSize,
  fontWeight,
  spacing,
} from "src/components/Tokens"

type Size = keyof typeof fontSize
type Weight = keyof typeof fontWeight
type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

type HeadingProps = {
  size?: Size
  weight?: Weight
  as?: HeadingElement
  className?: string
}

const Heading = styled.h1<HeadingProps>`
  ${({ theme, size, weight }) => css`
    color: ${theme.onBackground};
    font-family: ${fontFamily.headings};
    font-size: ${fontSize[size || "xl"]};
    font-weight: ${fontWeight[weight || "medium"]};
    margin: ${spacing[2]} 0;
  `}
`

export { Heading }
