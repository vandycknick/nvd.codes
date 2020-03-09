import React, { MouseEvent, ReactChild } from "react"
import styled, { css, CSSProp, StyledComponent } from "styled-components"

type NavbarProps = {
  isSticky?: boolean
  hasShadow?: boolean
  css?: CSSProp
  color?: "dark"
}

type BurgerProps = {
  isActive?: boolean
  onClick?: (event: MouseEvent) => void
}

type MenuProps = {
  isActive?: boolean
  color?: "dark"
  children: ReactChild | ReactChild[]
}

const navAttrs = (props: NavbarProps): { className: string } => {
  let className = "navbar"

  if (props.isSticky) className = `${className} is-fixed-top`

  if (props.hasShadow) className = `${className} has-shadow`

  if (props.color) className = `${className} is-${props.color}`

  return { className }
}

const Navbar: StyledComponent<
  "nav",
  any,
  NavbarProps,
  never
> = styled.nav.attrs<NavbarProps>(navAttrs)``

const Brand: StyledComponent<"div", any, any, never> = styled.div.attrs({
  className: "navbar-brand",
})``

const Burger: React.FC<BurgerProps> = ({ isActive: active, onClick }) => (
  <a
    role="button"
    className={`navbar-burger${active ? " is-active" : ""}`}
    aria-label="menu"
    aria-expanded="false"
    onClick={onClick}
  >
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
  </a>
)

const MenuWrapper: StyledComponent<"div", any, MenuProps, never> = styled.div`
  ${(props: MenuProps) =>
    props.color &&
    props.color === "dark" &&
    css`
      background-color: #363636;
      color: #f5f5f5;
    `}
`

const Menu: React.FC<MenuProps> = ({ isActive, color, children }) => (
  <MenuWrapper
    className={`navbar-menu${isActive ? " is-active" : ""}`}
    color={color}
  >
    {children}
  </MenuWrapper>
)

const NavbarWrapper = Object.assign(Navbar, {
  Brand,
  Burger,
  Menu,
})

export { Navbar }
export default NavbarWrapper
