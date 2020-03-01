import { css, FlattenSimpleInterpolation } from "styled-components"
import { desktop, tablet } from "./variables"

const isMobile = (...args: any[]): FlattenSimpleInterpolation => css`
  @media screen and (max-width: ${tablet}px) {
    ${css(args[0], ...args.slice(1))}
  }
`

const fromTablet = (...args: any[]): FlattenSimpleInterpolation => css`
  @media screen and (min-width: ${tablet}px) {
    ${css(args[0], ...args.slice(1))}
  }
`

const fromDesktop = (...args: any[]): FlattenSimpleInterpolation => css`
  @media screen and (min-width: ${desktop}px) {
    ${css(args[0], ...args.slice(1))}
  }
`

export { isMobile, fromTablet, fromDesktop }
