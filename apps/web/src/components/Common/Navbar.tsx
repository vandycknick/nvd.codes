import React from "react"
import { css } from "@emotion/css"
import styled from "@emotion/styled"

import { spacing, shadow } from "components/Tokens"
import { Container } from "components/Common/Container"
import * as borders from "components/Tokens/borders"
import { fromTablet } from "components/Common/mediaQuery"

const navBarHeight = "60px"

const Navbar = styled.div`
  ${({ theme }) => css`
    display: flex;
    background-color: ${theme.navigation};
    box-shadow: ${borders.shadow.lg};
    box-shadow: #000000bf 0px 1px 10px 0px;
    height: ${navBarHeight};
    width: 100%;
    position: relative;
    z-index: 2;
  `}
`

const NavbarContent = styled(Container)`
  display: flex;
  height: 100%;
  padding: 0 ${spacing[4]};
`

const NavbarBrand = styled.div`
  align-items: stretch;
  display: flex;
  flex-shrink: 0;
  min-height: 100%;
`

type NavbarMenuProps = {
  open?: boolean
}

const NavbarMenu = styled.div<NavbarMenuProps>`
  display: none;
  flex-grow: 1;
  flex-shrink: 0;
  justify-content: flex-end;
  margin-left: auto;

  ${({ open, theme }) =>
    open &&
    css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: ${shadow.inner};
      position: fixed;
      top: ${navBarHeight};
      bottom: 0;
      left: 0;
      right: 0;
      background-color: ${theme.navigation};
      z-index: 2;
    `}

  ${fromTablet`
    display: flex;
    position: relative;
  `}
`

type BurgerProps = {
  isActive: boolean
  onClick: (event: React.MouseEvent<Element, MouseEvent>) => void
  className?: string
}

const BurgerButton = styled.a<{ isActive: boolean }>`
  ${({ theme }) =>
    css`
      color: ${theme.onNavigation};
    `}
  cursor: pointer;
  display: block;
  height: 3.25rem;
  width: 3.25rem;
  position: relative;
  margin-left: auto;

  span {
    background-color: currentColor;
    display: block;
    height: 1px;
    left: calc(50% - 8px);
    position: absolute;
    transform-origin: center;
    transition-duration: 86ms;
    transition-property: background-color, opacity, transform;
    transition-timing-function: ease-out;
    width: 16px;
  }

  span:first-of-type {
    top: calc(50% - 6px);
  }

  span:nth-of-type(2) {
    top: calc(50% - 1px);
  }

  span:nth-of-type(3) {
    top: calc(50% + 4px);
  }

  ${({ isActive }) =>
    isActive &&
    css`
      span:first-of-type {
        transform: translateY(5px) rotate(45deg);
      }

      span:nth-of-type(2) {
        opacity: 0;
      }

      span:nth-of-type(3) {
        transform: translateY(-5px) rotate(-45deg);
      }
    `}
`

const Burger: React.FC<BurgerProps> = ({ isActive, onClick, className }) => (
  <BurgerButton
    role="button"
    aria-label="menu"
    aria-expanded="false"
    onClick={onClick}
    isActive={isActive}
    className={className}
  >
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
  </BurgerButton>
)

export { Navbar, NavbarContent, NavbarBrand, NavbarMenu, Burger }
