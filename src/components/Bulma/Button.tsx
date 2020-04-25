import React from "react"
import styled from "@emotion/styled"
import cs from "classnames"

type ButtonGroupProps = {
  centered?: boolean
  className?: string
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
  className?: string
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  className,
  children,
  centered,
}) => (
  <div className={cs("buttons", { "is-centered": centered }, className)}>
    {children}
  </div>
)

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => (
  <button
    className={cs(
      "button",
      {
        [`is-${props.color}`]: !!props.color,
        [`is-${props.size}}`]: !!props.size,
        "is-fullwidth": props.fullwidth,
        "is-outlined": props.outlined,
        "is-inverted": props.inverted,
        "is-rounded": props.rounded,
        "is-loading": props.loading,
      },
      className,
    )}
  >
    {children}
  </button>
)

const LinkButton: React.FC<
  ButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({
  className,
  children,
  color,
  size,
  fullwidth,
  outlined,
  inverted,
  rounded,
  loading,
  ...rest
}) => (
  <a
    className={cs(
      "button",
      {
        [`is-${color}`]: !!color,
        [`is-${size}}`]: !!size,
        "is-fullwidth": fullwidth,
        "is-outlined": outlined,
        "is-inverted": inverted,
        "is-rounded": rounded,
        "is-loading": loading,
      },
      className,
    )}
    {...rest}
  >
    {children}
  </a>
)

export { ButtonGroup, Button, LinkButton }
