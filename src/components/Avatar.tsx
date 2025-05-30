import type { ComponentPropsWithoutRef } from "react"
import clsx from "clsx"

export function AvatarContainer({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        className,
        "h-11 w-11 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10",
      )}
      {...props}
    />
  )
}

type AvatarProps = {
  large?: boolean
  className?: string
}

export function Avatar({ large = false, className }: AvatarProps) {
  return (
    <a
      href="/"
      aria-label="Home"
      className={clsx(className, "pointer-events-auto")}
    >
      <img
        src="/images/me.jpg"
        alt=""
        sizes={large ? "4rem" : "2.3rem"}
        className={clsx(
          "rounded-full bg-zinc-100 object-cover dark:bg-zinc-800",
          large ? "h-16 w-16" : "h-full w-full",
        )}
      />
    </a>
  )
}
