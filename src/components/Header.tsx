import React, { useState, useCallback } from "react"

import Navbar from "./Bulma/Navbar"

import NavLink from "./NavLink"
import GlobalEvent from "./Common/GlobalEvent"
import HeaderLogo from "./Common/HeaderLogo"

const Header: React.FC = () => {
  const [isActive, setIsActive] = useState(false)
  const toggleMenu = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsActive(isActive => !isActive)
    },
    [],
  )
  const closeMenu = useCallback(() => setIsActive(false), [])

  return (
    <>
      <GlobalEvent type="click" listener={closeMenu} />
      <Navbar
        as="header"
        isSticky
        color="dark"
        css={`
          box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.75);
        `}
      >
        <div className="container">
          <Navbar.Brand>
            <HeaderLogo />
            <Navbar.Burger isActive={isActive} onClick={toggleMenu} />
          </Navbar.Brand>
          <Navbar.Menu isActive={isActive} color="dark">
            <div className="navbar-end">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/posts">Blog</NavLink>
              <NavLink to="/about">About</NavLink>
            </div>
          </Navbar.Menu>
        </div>
      </Navbar>
    </>
  )
}

export default Header
