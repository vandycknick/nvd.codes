import styled, { StyledComponent } from "styled-components"

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

const heroAttrs = (props: HeroProps): { className: string } => {
  let className = "hero"

  if (props.color) className = `${className} is-${props.color}`

  if (props.size) className = `${className} is-${props.size}`

  if (props.hasGradient) className = `${className} is-bold`

  return { className }
}

const Hero: StyledComponent<
  "section",
  any,
  HeroProps,
  never
> = styled.section.attrs<HeroProps>(heroAttrs)``
const HeroHead = styled.div.attrs({ className: "hero-head" })``
const HeroBody = styled.div.attrs({ className: "hero-body" })``
const HeroFoot = styled.div.attrs({ className: "hero-foot" })``

const HeroWrapper = Object.assign(Hero, {
  Head: HeroHead,
  Body: HeroBody,
  Foot: HeroFoot,
})

export { Hero, HeroBody }
export default HeroWrapper
