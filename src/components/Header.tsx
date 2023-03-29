import React, { useRef, useState, useCallback } from "react"
import cx from "classnames"

import { MenuIcon, CloseIcon } from "./Icons"
import { Drawer } from "./Drawer"
import { ToggleThemeButton } from "./ThemeProvider"
import { Text } from "./Typography"

const menu = [
  { title: "Home", path: "/" },
  { title: "Blog", path: "/blog", activeLinkMatch: /\/blog[/0-9]*/ },
  { title: "About", path: "/about" },
]

type NavItemProps = {
  title: string
  path: string
  currentPath?: string
  activeLinkMatch?: RegExp
  className?: string
}

const NavItem = ({
  title,
  path,
  currentPath,
  activeLinkMatch,
  className,
}: NavItemProps) => {
  const matcher = () => {
    return activeLinkMatch
      ? activeLinkMatch?.test(currentPath ?? "")
      : currentPath === path
  }

  return matcher() ? (
    <Text
      className={cx(
        "line-through decoration-4 decoration-aurora-300",
        className,
      )}
    >
      {title}
    </Text>
  ) : (
    <a key={title} href={path} className={cx(className)}>
      {title}
    </a>
  )
}

type HeaderProps = {
  currentPath: string
}

const Header = ({ currentPath }: HeaderProps) => {
  const [isOpen, setOpen] = useState(false)
  const initialFocusRef = useRef<HTMLButtonElement>(null)
  const finalFocusRef = useRef<HTMLButtonElement>(null)
  const closeDrawer = useCallback(() => setOpen(false), [])
  return (
    <header className="flex bg-nord-50 dark:bg-nord-600 transition transition-color duration-300 z-50 drop-shadow-md">
      <div className="m-auto max-w-6xl w-full flex justify-between py-3 px-4 xl:px-0">
        {/* <Link href="/" passHref>
          <a className="flex justify-center items-center">
            <svg
              className="inline-block h-6 w-6 fill-frost-400 dark:fill-frost-100"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M256 256c0-8.188-3.125-16.38-9.375-22.62l-192-192C48.38 35.13 40.19 32 32 32C14.95 32 0 45.73 0 64c0 8.188 3.125 16.38 9.375 22.62L178.8 256l-169.4 169.4C3.125 431.6 0 439.8 0 448c0 18.28 14.95 32 32 32c8.188 0 16.38-3.125 22.62-9.375l192-192C252.9 272.4 256 264.2 256 256zM544 416H256c-17.67 0-32 14.31-32 32s14.33 32 32 32h288c17.67 0 32-14.31 32-32S561.7 416 544 416z"></path>
            </svg>
          </a>
        </Link> */}
        <div />
        <nav className="hidden lg:flex text-lg font-bold text-nord-500 items-center dark:text-nord-100">
          {menu.map((item) => (
            <NavItem
              className="px-4"
              key={item.title}
              title={item.title}
              path={item.path}
              currentPath={currentPath}
              activeLinkMatch={item.activeLinkMatch}
            />
          ))}
          <ToggleThemeButton />
        </nav>
        <div className="flex lg:hidden items-center">
          <button
            ref={finalFocusRef}
            className="p-2 rounded-md hover:cursor-pointer hover:bg-nord-200 hover:dark:bg-nord-500"
            onClick={() => setOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        <Drawer
          isOpen={isOpen}
          onClose={closeDrawer}
          initialFocusRef={initialFocusRef}
          finalFocusRef={finalFocusRef}
        >
          <div className="h-full w-full p-5 relative overflow-hidden">
            <button
              ref={initialFocusRef}
              className="p-2 rounded-md hover:cursor-pointer hover:bg-nord-200 hover:dark:bg-nord-500 absolute right-5 top-5"
              onClick={closeDrawer}
            >
              <CloseIcon className="h-6 w-6 stroke-nord-500 dark:stroke-nord-50" />
            </button>
            <nav
              className="p-20 h-full flex flex-col justify-center text-3xl font-black text-nord-500 items-center dark:text-nord-100"
              onClick={closeDrawer}
            >
              {menu.map((item) => (
                <NavItem
                  className="pb-8"
                  key={item.title}
                  title={item.title}
                  path={item.path}
                  activeLinkMatch={item.activeLinkMatch}
                />
              ))}
              <ToggleThemeButton />
            </nav>
          </div>
        </Drawer>
      </div>
    </header>
  )
}

export { Header }
