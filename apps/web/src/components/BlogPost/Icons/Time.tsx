import React from "react"
import { css, cx } from "@emotion/css"

type TimeProps = {
  className?: string
  width?: number
  height?: number
  color?: string
}

export const Time: React.FC<TimeProps> = ({
  className,
  width,
  height,
  color,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={width}
    height={height}
    className={cx(
      css`
        ${color && `fill: ${color};`}
      `,
      className,
    )}
  >
    <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" />
    <path d="M13 7H11V12.414L14.293 15.707L15.707 14.293L13 11.586V7Z" />
  </svg>
)
