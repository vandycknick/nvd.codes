import React from "react"
import Link, { LinkProps } from "next/link"
import { Button, ButtonProps } from "@chakra-ui/react"

type LinkButtonProps = {
  href?: string
  target?: "_blank"
  rel?: string
} & ButtonProps

export const LinkButton = ({ children, ...rest }: LinkButtonProps) => (
  <Button colorScheme="teal" size="md" variant="solid" {...rest} as="a">
    {children}
  </Button>
)

type NavButtonProps = LinkProps & { children: React.ReactNode }

export const NavButton = ({ children, ...props }: NavButtonProps) => (
  <Link {...props}>
    <LinkButton>{children}</LinkButton>
  </Link>
)
