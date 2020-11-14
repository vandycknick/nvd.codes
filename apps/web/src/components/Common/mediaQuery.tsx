import { css, CSSInterpolation } from "@emotion/css"
import * as screens from "components/Tokens/screens"

const isMobile = (
  template: TemplateStringsArray,
  ...args: CSSInterpolation[]
): string => css`
  @media screen and (max-width: ${screens.sm}) {
    ${css(template, ...args)}
  }
`

const fromTablet = (
  template: TemplateStringsArray,
  ...args: CSSInterpolation[]
): string => css`
  @media screen and (min-width: ${screens.sm}) {
    ${css(template, ...args)}
  }
`

const fromTabletLandscape = (
  template: TemplateStringsArray,
  ...args: CSSInterpolation[]
): string => css`
  @media screen and (min-width: ${screens.md}) {
    ${css(template, ...args)}
  }
`

const fromDesktop = (
  template: TemplateStringsArray,
  ...args: CSSInterpolation[]
): string => css`
  @media screen and (min-width: ${screens.lg}) {
    ${css(template, ...args)}
  }
`

const fromDesktopWideScreen = (
  template: TemplateStringsArray,
  ...args: CSSInterpolation[]
): string => css`
  @media screen and (min-width: ${screens.xl}) {
    ${css(template, ...args)}
  }
`

export {
  isMobile,
  fromTablet,
  fromTabletLandscape,
  fromDesktop,
  fromDesktopWideScreen,
}
