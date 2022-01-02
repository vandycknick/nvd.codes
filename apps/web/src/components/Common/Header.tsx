import React, { useEffect, useState } from "react"
import { SunIcon, MoonIcon } from "components/Common/Icons"
import Link from "next/link"

// type NavMenuItemProps = {
//   onMobile: boolean
//   to: string
//   children: React.ReactNode
//   onClick?: () => void
// }

// const MenuItem = ({ onMobile, children, to, ...rest }: NavMenuItemProps) => {
//   return (
//     <Text
//       mr={onMobile ? 0 : 8}
//       fontSize={onMobile ? "2xl" : "lg"}
//       fontWeight="bold"
//       display="block"
//       {...rest}
//     >
//       <Link href={to}>
//         <a>{children}</a>
//       </Link>
//     </Text>
//   )
// }

// type NavMenuProps = {
//   onMobile?: boolean
//   onClick?: () => void
// }

// const NavMenu = ({ onMobile, onClick }: NavMenuProps) => (
//   <Fragment>
//     <MenuItem onClick={onClick} onMobile={!!onMobile} to="/">
//       Home
//     </MenuItem>
//     <MenuItem onClick={onClick} onMobile={!!onMobile} to="/blog">
//       Blog
//     </MenuItem>
//     <MenuItem onClick={onClick} onMobile={!!onMobile} to="/about">
//       About
//     </MenuItem>
//     <ColorModeSwitch />
//   </Fragment>
// )

const ColorModeSwitch = () => {
  const [dark, setDarkMode] = useState(false)
  const toggleColorMode = () => {
    setDarkMode(!dark)
    const event = new Event("themeChanged")
    document.dispatchEvent(event)
  }

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  return (
    <a
      className="flex p-2 rounded-md hover:cursor-pointer hover:bg-nord-200 hover:dark:bg-nord-500"
      aria-label="Switch between dark or light theme"
      onClick={toggleColorMode}
    >
      {dark ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </a>
  )
}

// const Header = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure()
//   const btnRef = useRef(null)

//   return (
//     <Flex as="header" w="100%">
//       <Flex
//         maxW={{ xl: "1200px" }}
//         w="100%"
//         p={4}
//         align="center"
//         justify="space-between"
//         wrap="wrap"
//         m="0 auto"
//       >
//         <Flex align="center">
//           <Link href="/">
//             <a aria-label="HomePage">
//               <Logo />
//             </a>
//           </Link>
//         </Flex>
//         <IconButton
//           aria-label="Toggle menu"
//           bg="transparent"
//           display={{ base: "block", md: "none" }}
//           ref={btnRef}
//           onClick={onOpen}
//           icon={<HamburgerIcon />}
//         />
//         <Drawer
//           isOpen={isOpen}
//           placement="top"
//           size="full"
//           onClose={onClose}
//           finalFocusRef={btnRef}
//         >
//           <DrawerOverlay>
//             <DrawerContent>
//               <DrawerCloseButton />
//               <DrawerBody>
//                 <VStack
//                   height="100%"
//                   spacing={8}
//                   align="center"
//                   justify="center"
//                 >
//                   <NavMenu onClick={onClose} onMobile />
//                 </VStack>
//               </DrawerBody>
//             </DrawerContent>
//           </DrawerOverlay>
//         </Drawer>
//         <Box
//           display={{ base: "none", md: "block" }}
//           flexBasis={{ base: "100%", md: "auto" }}
//         >
//           <Flex
//             align={["center", "center", "center", "center"]}
//             justify={["center", "space-between", "flex-end", "flex-end"]}
//             direction={["column", "column", "row", "row"]}
//             pt={[4, 4, 0, 0]}
//           >
//             <NavMenu />
//           </Flex>
//         </Box>
//       </Flex>
//     </Flex>
//   )
// }

const Header = () => (
  <header className="flex bg-nord-50 dark:bg-nord-600 transition transition-color duration-300 z-50 drop-shadow-md">
    <div className="m-auto max-w-6xl w-full flex justify-between py-3 px-4 xl:px-0">
      <div className="flex">
        <svg
          viewBox="0 0 128 128"
          className="h-9 w-9 fill-nord-500 dark:fill-nord-100"
        >
          <path d="M87.102 118.131L42.667 61.255V45.473l49.247 63.665h26.463V19.492H73.87l-9.623-9.623H128v108.262z"></path>
          <path d="M40.899 9.869l44.434 56.874v15.781L36.087 18.861H9.624v89.646h44.507l9.623 9.623H0V9.869z"></path>
        </svg>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-9 stroke-nord-500 dark:stroke-nord-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg> */}
        <span className="text-3xl font-extrabold text-nord-500 px-2 dark:text-nord-100"></span>
      </div>
      <nav className="text-lg font-bold text-nord-500 flex items-center dark:text-nord-100">
        <Link href="/">
          <a className="px-4">Home</a>
        </Link>
        <Link href="/blog">
          <a className="px-4">Blog</a>
        </Link>
        <Link href="/about">
          <a className="px-4">About</a>
        </Link>
        <ColorModeSwitch />
      </nav>
    </div>
  </header>
)

export { Header }
