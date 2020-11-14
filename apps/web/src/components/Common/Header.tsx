import React, { useState, useCallback } from "react"
import Link from "next/link"
import { css } from "@emotion/css"
import { Global } from "@emotion/react"

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
        className={css`
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
                className={css`
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
            className={css`
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
