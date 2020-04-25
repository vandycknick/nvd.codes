import { css, SerializedStyles, Interpolation } from "@emotion/core"
import { desktop, tablet } from "./variables"

const isMobile = (
  template: TemplateStringsArray,
  ...args: Array<Interpolation>
): SerializedStyles => css`
  @media screen and (max-width: ${tablet}px) {
    ${css(template, ...args)}
  }
`

const fromTablet = (
  template: TemplateStringsArray,
  ...args: Array<Interpolation>
): SerializedStyles => css`
  @media screen and (min-width: ${tablet}px) {
    ${css(template, ...args)}
  }
`

const fromDesktop = (
  template: TemplateStringsArray,
  ...args: Array<Interpolation>
): SerializedStyles => css`
  @media screen and (min-width: ${desktop}px) {
    ${css(template, ...args)}
  }
`

export { isMobile, fromTablet, fromDesktop }
