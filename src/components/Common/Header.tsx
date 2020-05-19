import React, { useState, useCallback } from "react"
import { css, Global } from "@emotion/core"

import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarMenu,
  Burger,
} from "src/components/Common/Navbar"
import { NavLink } from "src/components/Common/Navlink"
import Logo from "src/components/Common/Logo"
import { GlobalEvent } from "src/components/Common/GlobalEvent"
import { isMobile } from "src/components/Common/mediaQuery"
import { Link } from "gatsby"

const NavbarBrandWithLink = NavbarBrand.withComponent(Link)

const Header: React.FC = () => {
  const [isActive, setIsActive] = useState(false)
  const toggleMenu = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsActive((isActive) => !isActive)
    },
    [],
  )
  const closeMenu = useCallback(() => setIsActive(false), [])

  return (
    <header>
      <GlobalEvent type="click" listener={closeMenu} />
      {isActive && (
        <Global
          styles={css`
            body {
              overflow: hidden;
            }
          `}
        />
      )}
      <Navbar
        css={css`
          ${isActive &&
          css`
            position: fixed;
          `}
        `}
      >
        <NavbarContent>
          <NavbarBrandWithLink to="/">
            <Logo
              css={css`
                width: 160px;
              `}
            />
          </NavbarBrandWithLink>
          <NavbarMenu open={isActive}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/about">About</NavLink>
          </NavbarMenu>
          <Burger
            isActive={isActive}
            onClick={toggleMenu}
            css={css`
              align-self: center;
              display: none;
              ${isMobile`display: block;`}
            `}
          />
        </NavbarContent>
      </Navbar>
    </header>
  )
}

export { Header }
