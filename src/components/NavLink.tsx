import React from "react"
import { Link } from "gatsby"
import styled from "@emotion/styled"

import { fromDesktop } from "./Common/mediaQuery"

const NavBarItem = styled.span`
  a {
    color: white;

    &:hover {
      color: hsla(0, 0%, 100%, 0.75);
      border-bottom: none;
    }

    &.is-active-nav-link {
      ${fromDesktop`
            border-color: transparent;
            background-color: transparent;
            border-bottom: 3px solid white !important;
            padding-bottom: calc(.5rem - 3px) !important;
        `}
    }
  }
`

interface NavLinkProps {
  to: string
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <NavBarItem>
    <Link
      to={to}
      className="navbar-item is-tab"
      activeClassName="is-active-nav-link"
    >
      {children}
    </Link>
  </NavBarItem>
)

export default NavLink
