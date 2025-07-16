import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Home, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  navigate,
  type TransitionBeforeSwapEvent,
} from "astro:transitions/client"

type NavItem = {
  name?: string
  url: string
  icon?: "Home" | "Search"
  activeLinkMatch?: RegExp
}

type NavBarProps = {
  className?: string
  items: NavItem[]
  currentPath: string
}

const resolveIcon = (iconRef: NonNullable<NavItem["icon"]>) => {
  switch (iconRef) {
    case "Home":
      return Home
    case "Search":
      return Search
    default: {
      const exhaustiveCheck: never = iconRef
      throw new Error(`Unhandled color case: ${exhaustiveCheck}`)
    }
  }
}

const isActiveTab = (path: string, matcher: RegExp | string) => {
  return matcher instanceof RegExp ? matcher.test(path) : path === matcher
}

export const NavBar = ({ className, currentPath, items }: NavBarProps) => {
  const [currentTab, setCurrentTab] = useState(currentPath)

  useEffect(() => {
    const routeChanges = (e: TransitionBeforeSwapEvent) =>
      setCurrentTab(e.to.pathname)

    document.addEventListener("astro:before-swap", routeChanges)
    return () => document.removeEventListener("astro:before-swap", routeChanges)
  }, [setCurrentTab])

  return (
    <nav className={cn("pointer-events-auto h-full flex", className)}>
      <div className="flex items-center gap-1 md:gap-2 retina:gap-1 bg-background/5 bg-white dark:bg-black opacity-90 border border-border backdrop-blur-xs py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon ? resolveIcon(item.icon) : undefined
          const isActive = isActiveTab(
            currentTab,
            item.activeLinkMatch ?? item.url,
          )

          return (
            <a
              key={item.url}
              href={item.url}
              onClick={(e) => {
                e.preventDefault()
                if (location.pathname === item.url) return
                setCurrentTab(item.url)
                navigate(item.url)
              }}
              className={cn(
                "relative cursor-pointer text-sm md:text-base retina:text-sm font-semibold px-4 py-2 md:py-1 rounded-full transition-colors",
                "text-foreground/80 hover:text-primary",
                isActive && "bg-muted text-primary",
                "self-stretch",
              )}
            >
              <span className="flex items-center h-full">
                {Icon && (
                  <Icon
                    size={18}
                    strokeWidth={2.5}
                    className={cn(item.name && "md:mr-2")}
                  />
                )}
                {item.name && (
                  <span className={cn(item.icon && "hidden md:inline")}>
                    {item.name}
                  </span>
                )}
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={true}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
