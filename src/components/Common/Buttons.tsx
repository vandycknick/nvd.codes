import { Link } from "gatsby"
import { borderRadius, colors, spacing, styled } from "src/components/Tokens"

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

const NavButton = Button.withComponent(Link)

export { Button, LinkButton, NavButton }
