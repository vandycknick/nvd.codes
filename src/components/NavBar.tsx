import { useState } from "react"
import { motion } from "framer-motion"
import { Drill, Home, Notebook, User, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { navigate } from "astro:transitions/client"

type NavItem = {
  name: string
  url: string
  icon: LucideIcon
  activeLinkMatch?: RegExp
}

type NavBarProps = {
  className?: string
  items: NavItem[]
  currentPath: string
}

const items = [
  { name: "Home", url: "/", icon: Home },
  {
    name: "Blog",
    url: "/blog",
    icon: Notebook,
    activeLinkMatch: /(^\/blog[/0-9]*)|(^\/post[/\w-]*)/,
  },
  {
    name: "About",
    url: "/about",
    icon: User,
    activeLinkMatch: /^\/about(\/)?$/,
  },
  {
    name: "Uses",
    url: "/uses",
    icon: Drill,
    activeLinkMatch: /^\/uses(\/)?$/,
  },
]

const isActiveTab = (path: string, matcher: RegExp | string) => {
  return matcher instanceof RegExp ? matcher.test(path) : path === matcher
}

export const NavBar = ({ className, currentPath }: NavBarProps) => {
  const [currentTab, setCurrentTab] = useState(currentPath)
  return (
    <nav className={cn("pointer-events-auto h-full flex", className)}>
      <div className="flex items-center gap-3 bg-background/5 bg-white dark:bg-black opacity-90 border border-border backdrop-blur-xs py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = isActiveTab(
            currentTab,
            item.activeLinkMatch ?? item.url,
          )

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={(e) => {
                e.preventDefault()
                setCurrentTab(item.url)
                navigate(item.url)
              }}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-2 md:py-1 rounded-full transition-colors",
                "text-foreground/80 hover:text-primary",
                isActive && "bg-muted text-primary",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
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
