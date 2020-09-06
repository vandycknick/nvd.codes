import React, { useState, useCallback } from "react"
import Link from "next/link"
import { css, Global } from "@emotion/core"

import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarMenu,
  Burger,
} from "components/Common/Navbar"
import { NavLink } from "components/Common/Navlink"
import Logo from "components/Common/Logo"
import { GlobalEvent } from "components/Common/GlobalEvent"
import { isMobile } from "components/Common/mediaQuery"

const NavbarBrandLink = NavbarBrand.withComponent("a")

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
          <Link href="/" passHref>
            <NavbarBrandLink>
              <Logo
                css={css`
                  width: 160px;
                `}
              />
            </NavbarBrandLink>
          </Link>
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
