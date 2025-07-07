import type { ComponentPropsWithoutRef, ComponentType } from "react"
import type { IconProps } from "@/components/Icons"
import { cn } from "@/utils"

type SocialLinkProps = {
  icon: ComponentType<IconProps>
  fill?: string
  stroke?: string
} & ComponentPropsWithoutRef<"a">

export function SocialLink({
  className,
  href,
  children,
  icon: Icon,
  fill,
  stroke,
}: SocialLinkProps) {
  return (
    <li className={cn(className, "flex")}>
      <a
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        {/* <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" /> */}
        <Icon
          className={cn(
            "h-6 w-6 flex-none fill-zinc-400 dark:fill-zinc-500 transition group-hover:fill-teal-500",
            fill,
            stroke,
          )}
        />
        <span className="ml-4">{children}</span>
      </a>
    </li>
  )
}
