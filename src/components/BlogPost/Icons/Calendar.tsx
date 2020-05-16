import React from "react"
import { css } from "@emotion/core"

type CalendarProps = {
  className?: string
  width?: number
  height?: number
  color?: string
}

export const Calendar: React.FC<CalendarProps> = ({
  className,
  width,
  height,
  color,
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    width={width}
    height={height}
    css={css`
      ${color && `fill: ${color};`}
    `}
  >
    <path d="M19 4H18V3C18 2.45 17.55 2 17 2C16.45 2 16 2.45 16 3V4H8V3C8 2.45 7.55 2 7 2C6.45 2 6 2.45 6 3V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V9H19V19ZM7 11H9V13H7V11ZM11 11H13V13H11V11ZM15 11H17V13H15V11Z" />
  </svg>
)
