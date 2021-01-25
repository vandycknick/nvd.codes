import React, { Fragment, useRef } from "react"
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Text,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { HamburgerIcon, SunIcon, MoonIcon } from "@chakra-ui/icons"
import Link from "next/link"

import Logo from "components/Common/Logo"

type NavMenuItemProps = {
  onMobile: boolean
  to: string
  children: React.ReactNode
  onClick?: () => void
}

const MenuItem = ({ onMobile, children, to, ...rest }: NavMenuItemProps) => {
  return (
    <Text
      mr={onMobile ? 0 : 8}
      fontSize={onMobile ? "2xl" : "lg"}
      fontWeight="bold"
      display="block"
      {...rest}
    >
      <Link href={to}>
        <a>{children}</a>
      </Link>
    </Text>
  )
}

type NavMenuProps = {
  onMobile?: boolean
  onClick?: () => void
}

const NavMenu = ({ onMobile, onClick }: NavMenuProps) => (
  <Fragment>
    <MenuItem onClick={onClick} onMobile={!!onMobile} to="/">
      Home
    </MenuItem>
    <MenuItem onClick={onClick} onMobile={!!onMobile} to="/blog">
      Blog
    </MenuItem>
    <MenuItem onClick={onClick} onMobile={!!onMobile} to="/about">
      About
    </MenuItem>
    <ColorModeSwitch />
  </Fragment>
)

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton
      aria-label="Switch between dark or light theme"
      bg="transparent"
      onClick={toggleColorMode}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    />
  )
}

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  return (
    <Flex as="header" w="100%">
      <Flex
        maxW={{ xl: "1200px" }}
        w="100%"
        p={4}
        align="center"
        justify="space-between"
        wrap="wrap"
        m="0 auto"
      >
        <Flex align="center">
          <Link href="/">
            <a aria-label="HomePage">
              <Logo />
            </a>
          </Link>
        </Flex>
        <IconButton
          aria-label="Toggle menu"
          bg="transparent"
          display={{ base: "block", md: "none" }}
          ref={btnRef}
          onClick={onOpen}
          icon={<HamburgerIcon />}
        />
        <Drawer
          isOpen={isOpen}
          placement="top"
          size="full"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody>
                <VStack
                  height="100%"
                  spacing={8}
                  align="center"
                  justify="center"
                >
                  <NavMenu onClick={onClose} onMobile />
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
        <Box
          display={{ base: "none", md: "block" }}
          flexBasis={{ base: "100%", md: "auto" }}
        >
          <Flex
            align={["center", "center", "center", "center"]}
            justify={["center", "space-between", "flex-end", "flex-end"]}
            direction={["column", "column", "row", "row"]}
            pt={[4, 4, 0, 0]}
          >
            <NavMenu />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  )
}

export { Header }
