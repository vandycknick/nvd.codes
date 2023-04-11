import { ComponentPropsWithoutRef } from "react"
import { Container } from "../components/Container"

function NavLink({ href, children }: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      href={href}
      className="transition hover:text-teal-500 dark:hover:text-teal-400"
    >
      {children}
    </a>
  )
}

export function Footer() {
  return (
    <footer className="pt-16">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <Container.Inner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/blog">Blog</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/uses">Uses</NavLink>
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center">
                all materials &copy; Nick Van Dyck {new Date().getFullYear()}.
                <br />
                <span>made with ❤️ in Belgium.</span>
              </p>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  )
}
