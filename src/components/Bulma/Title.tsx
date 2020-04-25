import React from "react"
import { css } from "@emotion/core"
import styled from "@emotion/styled"
import cs from "classnames"

type TitleProps = {
  size?: "1" | "2" | "3" | "4" | "5" | "6"
  spaced?: boolean
  shadow?: "green" | "red" | "yellow" | "purple"
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  className?: string
}

type SubtitleProps = {
  size?: "1" | "2" | "3" | "4" | "5" | "6"
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  className?: string
}

const InternalTitle = styled.h1<TitleProps>`
    span {
        display: inline-flex;

        ${({ shadow }) =>
          shadow &&
          css`
            padding-bottom: 5px;
          `}

        ${({ shadow }) =>
          shadow === "green" &&
          css`
            box-shadow: inset 0 -2px 0 rgba(35, 209, 153, 0.2);
          `}

        ${({ shadow }) =>
          shadow === "red" &&
          css`
            box-shadow: inset 0 -2px 0 rgba(255, 74, 110, 0.2);
          `}

        ${({ shadow }) =>
          shadow === "yellow" &&
          css`
            box-shadow: inset 0 -2px 0 rgba(255, 221, 87, 0.2);
          `}

        ${({ shadow }) =>
          shadow === "purple" &&
          css`
            box-shadow: inset 0 -2px 0 rgba(184, 107, 255, 0.2);
          `}

        svg {
            align-self: center;
            width: 1em;
            height: 1em;
            top: 0.1em;
            position: relative;
        }
    }
`

const Title: React.FC<TitleProps> = ({ children, ...props }) => (
  <InternalTitle
    className={cs("title", {
      [`is-${props.size}`]: !!props.size,
      "is-spaced": props.spaced,
    })}
    {...props}
  >
    <span>{children}</span>
  </InternalTitle>
)

const Subtitle: React.FC<SubtitleProps> = ({ children, className, size }) => (
  <h2 className={cs("subtitle", { [`is-${size}`]: !!size }, className)}>
    <span>{children}</span>
  </h2>
)

export { Title, Subtitle }
