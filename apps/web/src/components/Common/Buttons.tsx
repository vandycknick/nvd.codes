import React from "react"
import Link, { LinkProps } from "next/link"
import styled from "@emotion/styled"

import { borderRadius, colors, spacing } from "components/Tokens"

export const Button = styled.button`
  color: ${colors.white};
  background-color: ${colors.teal[700]};
  padding: ${spacing[2]};
  border-radius: ${borderRadius.default};
  text-decoration: none;

  &:hover {
    background-color: ${colors.teal[800]};
    cursor: pointer;
  }

  &[disabled] {
    background-color: ${colors.teal[700]};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const LinkButton = Button.withComponent("a")

type NavButtonProps = LinkProps
export const NavButton: React.FC<NavButtonProps> = ({ children, ...props }) => (
  <Link {...props}>
    <LinkButton>{children}</LinkButton>
  </Link>
)
