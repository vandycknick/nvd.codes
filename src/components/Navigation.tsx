import type { ComponentPropsWithoutRef } from "react"
import { Fragment } from "react"
import clsx from "clsx"
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react"

import { ChevronDownIcon, CloseIcon } from "./Icons"

const menu = [
  { title: "Home", path: "/" },
  { title: "Blog", path: "/blog", activeLinkMatch: /\/blog[/0-9]*/ },
  { title: "About", path: "/about", activeLinkMatch: /^\/about(\/)?$/ },
  { title: "Uses", path: "/uses", activeLinkMatch: /^\/uses(\/)?$/ },
]

function MobileNavItem({ href, children }: ComponentPropsWithoutRef<"a">) {
  return (
    <li>
      <PopoverButton as="a" href={href} className="block py-2">
        {children}
      </PopoverButton>
    </li>
  )
}

type NavigationProps = {
  path: string
} & ComponentPropsWithoutRef<"nav">

export function MobileNavigation({ className }: NavigationProps) {
  return (
    <Popover className={className}>
      <PopoverButton className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
        Menu
        <ChevronDownIcon className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
      </PopoverButton>
      <Transition>
        <TransitionChild
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <PopoverBackdrop className="fixed inset-0 z-40 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
        </TransitionChild>
        <TransitionChild
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <PopoverPanel
            focus
            className="fixed inset-x-4 top-8 z-40 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <PopoverButton aria-label="Close menu" className="-m-1 p-1">
                <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
              </PopoverButton>
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Navigation
              </h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                {menu.map((item) => (
                  <MobileNavItem key={item.path} href={item.path}>
                    {item.title}
                  </MobileNavItem>
                ))}
              </ul>
            </nav>
          </PopoverPanel>
        </TransitionChild>
      </Transition>
    </Popover>
  )
}

type NavItemProps = {
  currentPath?: string
  activeLinkMatch?: RegExp
  className?: string
} & ComponentPropsWithoutRef<"a">

function NavItem({
  href,
  children,
  currentPath,
  activeLinkMatch,
}: NavItemProps) {
  const isActive = activeLinkMatch
    ? activeLinkMatch?.test(currentPath ?? "")
    : currentPath === href

  return (
    <li>
      <a
        href={href}
        className={clsx(
          "relative block px-3 py-2 transition",
          isActive
            ? "text-teal-500 dark:text-teal-400"
            : "hover:text-teal-500 dark:hover:text-teal-400",
        )}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0" />
        )}
      </a>
    </li>
  )
}

export function DesktopNavigation(props: NavigationProps) {
  return (
    <nav {...props}>
      <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        {menu.map((item) => (
          <NavItem
            key={item.path}
            href={item.path}
            activeLinkMatch={item.activeLinkMatch}
            currentPath={props.path}
          >
            {item.title}
          </NavItem>
        ))}
        <li className="relative block mx-2 my-2 px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 hover:cursor-pointer">
          <svg
            className="absolute block left-0 top-[2px] h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            onClick={() =>
              document.dispatchEvent(new CustomEvent("toggleSearch"))
            }
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </li>
      </ul>
    </nav>
  )
}
