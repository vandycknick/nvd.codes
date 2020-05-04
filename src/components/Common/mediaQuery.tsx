import { css, SerializedStyles, Interpolation } from "@emotion/core"
import * as screens from "src/components/Tokens/screens"

const isMobile = (
  template: TemplateStringsArray,
  ...args: Array<Interpolation>
): SerializedStyles => css`
  @media screen and (max-width: ${screens.sm}) {
    ${css(template, ...args)}
  }
`

const fromTablet = (
  template: TemplateStringsArray,
  ...args: Array<Interpolation>
): SerializedStyles => css`
  @media screen and (min-width: ${screens.sm}) {
    ${css(template, ...args)}
  }
`

const fromDesktop = (
  template: TemplateStringsArray,
  ...args: Array<Interpolation>
): SerializedStyles => css`
  @media screen and (min-width: ${screens.md}) {
    ${css(template, ...args)}
  }
`

export { isMobile, fromTablet, fromDesktop }
