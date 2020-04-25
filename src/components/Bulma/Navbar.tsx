import React, { MouseEvent, ReactChild } from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import cs from "classnames"

type NavbarProps = {
  isSticky?: boolean
  hasShadow?: boolean
  color?: "dark"
  className?: string
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

const InternalNavbar: React.FC<NavbarProps> = ({
  children,
  className,
  ...props
}) => (
  <nav
    className={cs(
      "navbar",
      {
        "is-fixed-top": props.isSticky,
        "has-shadow": props.hasShadow,
        [`is-${props.color}`]: !!props.color,
      },
      className,
    )}
  >
    {children}
  </nav>
)

const Navbar = styled(InternalNavbar)()

const Brand: React.FC = ({ children, ...props }) => (
  <div className="navbar-brand" {...props}>
    {children}
  </div>
)

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

const MenuWrapper = styled.div`
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
