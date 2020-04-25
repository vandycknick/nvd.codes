import React from "react"
import cs from "classnames"

type HeroProps = {
  color?:
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "light"
    | "dark"
  size?: "medium" | "large" | "fullheight" | "fullheight-with-navbar"
  hasGradient?: boolean
}

const Hero: React.FC<HeroProps> = ({ children, color, size, hasGradient }) => (
  <section
    className={cs("hero", {
      [`is-${color}`]: !!color,
      [`is-${size}`]: !!size,
      "is-bold": hasGradient,
    })}
  >
    {children}
  </section>
)

const HeroHead: React.FC = ({ children }) => (
  <div className="hero-head">{children}</div>
)
const HeroBody: React.FC = ({ children }) => (
  <div className="hero-body">{children}</div>
)
const HeroFoot: React.FC = ({ children }) => (
  <div className="hero-foot">{children}</div>
)

const HeroWrapper = Object.assign(Hero, {
  Head: HeroHead,
  Body: HeroBody,
  Foot: HeroFoot,
})

export { Hero, HeroBody }
export default HeroWrapper
