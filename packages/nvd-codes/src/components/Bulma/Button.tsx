import styled, { CSSProp, StyledComponent } from "styled-components"

type ButtonGroupProps = {
  centered?: boolean
  css?: CSSProp
}

type ButtonProps = {
  color?:
    | "white"
    | "light"
    | "dark"
    | "black"
    | "text"
    | "primary"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "danger"
  size?: "small" | "normal" | "medium" | "large"
  fullwidth?: boolean
  outlined?: boolean
  inverted?: boolean
  rounded?: boolean
  loading?: boolean
  css?: CSSProp
}

const buttonAttrs = (props: ButtonProps): { className: string } => {
  let className = "button"

  if (props.color) className = `${className} is-${props.color}`

  if (props.size) className = `${className} is-${props.size}}`

  if (props.fullwidth) className = `${className} is-fullwidth`

  if (props.outlined) className = `${className} is-outlined`

  if (props.inverted) className = `${className} is-inverted`

  if (props.rounded) className = `${className} is-rounded`

  if (props.loading) className = `${className} is-loading`

  return { className }
}

const buttonGroupAttrs = (props: ButtonGroupProps): { className: string } => {
  let className = "buttons"

  if (props.centered) className = `${className} is-centered`

  return { className }
}

// tslint:disable-next-line: max-line-length
const ButtonGroup: StyledComponent<
  "div",
  any,
  ButtonGroupProps,
  never
> = styled.div.attrs<ButtonGroupProps>(buttonGroupAttrs)``

const Button: StyledComponent<
  "button",
  any,
  ButtonProps,
  never
> = styled.button.attrs<ButtonProps>(buttonAttrs)``

const LinkButton = Button.withComponent("a")

export { ButtonGroup, Button, LinkButton }
