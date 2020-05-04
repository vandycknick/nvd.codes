import React from "react"
import { css } from "@emotion/core"
import { Link } from "gatsby"

import {
  styled,
  spacing,
  fontFamily,
  fontWeight,
  fontSize,
} from "src/components/Tokens"
import { fromTablet } from "src/components/Common/mediaQuery"

const borderSize = "5px"

const NavLinkItem = styled(Link)`
  ${({ theme }) => css`
    font-family: ${fontFamily.headings};
    font-weight: ${fontWeight.bold};
    font-size: ${fontSize.base};
    color: ${theme.onNavigation};
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: ${spacing[4]};
    box-sizing: border-box;

    &:hover {
      color: ${theme.primaryLighter};
      border-bottom: none;
    }

    &.active {
      ${fromTablet`
              padding-bottom: calc(${spacing[4]} - ${borderSize});
              border-bottom: ${borderSize} solid ${theme.primary};
          `}
    }
  `}
`

interface NavLinkProps {
  to: string
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <NavLinkItem to={to} activeClassName="active">
    {children}
  </NavLinkItem>
)

export { NavLink }
