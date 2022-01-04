import React, { useRef, useState, useCallback } from "react"
import { MenuIcon, CloseIcon } from "components/Common/Icons"
import { Drawer } from "components/Common/Drawer"
import { ToggleThemeButton } from "components/Common/ThemeProvider"
import Link from "next/link"

const Header = () => {
  const [isOpen, setOpen] = useState(false)
  const initialFocusRef = useRef<HTMLButtonElement>(null)
  const finalFocusRef = useRef<HTMLButtonElement>(null)
  const closeDrawer = useCallback(() => setOpen(false), [])
  return (
    <header className="flex bg-nord-50 dark:bg-nord-600 transition transition-color duration-300 z-50 drop-shadow-md">
      <div className="m-auto max-w-6xl w-full flex justify-between py-3 px-4 xl:px-0">
        <Link href="/" passHref>
          <a className="flex justify-center items-center">
            <svg
              className="inline-block h-6 w-6 fill-frost-400 dark:fill-frost-100"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M256 256c0-8.188-3.125-16.38-9.375-22.62l-192-192C48.38 35.13 40.19 32 32 32C14.95 32 0 45.73 0 64c0 8.188 3.125 16.38 9.375 22.62L178.8 256l-169.4 169.4C3.125 431.6 0 439.8 0 448c0 18.28 14.95 32 32 32c8.188 0 16.38-3.125 22.62-9.375l192-192C252.9 272.4 256 264.2 256 256zM544 416H256c-17.67 0-32 14.31-32 32s14.33 32 32 32h288c17.67 0 32-14.31 32-32S561.7 416 544 416z"></path>
            </svg>
            {/* <span className="text-2xl font-bold animate-ping text-frost-200 font-sans mt-[2px] pl-2">
              |
            </span> */}
          </a>
        </Link>
        <nav className="hidden lg:flex text-lg font-bold text-nord-500 items-center dark:text-nord-100">
          <Link href="/" passHref>
            <a className="px-4">Home</a>
          </Link>
          <Link href="/blog" passHref>
            <a className="px-4">Blog</a>
          </Link>
          <Link href="/about" passHref>
            <a className="px-4">About</a>
          </Link>
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
              <Link href="/">
                <a className="pb-8">Home</a>
              </Link>
              <Link href="/blog">
                <a className="pb-8">Blog</a>
              </Link>
              <Link href="/about">
                <a className="pb-8">About</a>
              </Link>
              <ToggleThemeButton />
            </nav>
          </div>
        </Drawer>
      </div>
    </header>
  )
}

export { Header }
