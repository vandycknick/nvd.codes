import clsx from "clsx"
import { ComponentPropsWithoutRef, ComponentType } from "react"
import type { IconProps } from "@/components/Icons"

type SocialLinkProps = {
  icon: ComponentType<IconProps>
} & ComponentPropsWithoutRef<"a">

export function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: SocialLinkProps) {
  return (
    <li className={clsx(className, "flex")}>
      <a
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </a>
    </li>
  )
}
