import React from "react"
import Link, { LinkProps } from "next/link"
import { borderRadius, colors, spacing, styled } from "components/Tokens"

const Button = styled.button`
  color: ${colors.white};
  background-color: ${colors.teal[700]};
  padding: ${spacing[2]};
  border-radius: ${borderRadius.default};
  text-decoration: none;

  &:hover {
    background-color: ${colors.teal[800]};
  }
`

const LinkButton = Button.withComponent("a")

type NavButtonProps = LinkProps
const NavButton: React.FC<NavButtonProps> = ({ children, ...props }) => (
  <Link {...props}>
    <LinkButton>{children}</LinkButton>
  </Link>
)

export { Button, LinkButton, NavButton }
