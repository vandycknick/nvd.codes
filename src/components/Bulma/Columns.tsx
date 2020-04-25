import React from "react"
import cs from "classnames"
import styled from "@emotion/styled"

import { isMobile } from "../Common/mediaQuery"

type ColumnsProps = {
  centered?: boolean
  reversedOrder?: "mobile"
  isMultiline?: boolean
  className?: string
}

type Sizes =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "three-quarters"
  | "two-thirds"
  | "half"
  | "one-third"
  | "one-quarter"
  | "full"

type ColumnProps = {
  size?: Sizes
  offset?: Sizes
  hasTextCentered?: boolean
  isFlex?: boolean
  className?: string
}

const InnerColumns: React.FC<ColumnsProps> = ({
  children,
  className,
  centered,
  isMultiline,
}) => (
  <div
    className={cs(
      "columns",
      {
        "is-centered": centered,
        "is-multiline": isMultiline,
      },
      className,
    )}
  >
    {children}
  </div>
)

const Columns = styled(InnerColumns)`
  ${({ reversedOrder }) =>
    reversedOrder === "mobile" &&
    isMobile`
        display: flex;
        flex-direction: column-reverse;
    `}
`

const Column: React.FC<ColumnProps> = ({
  children,
  className,
  size,
  offset,
  hasTextCentered,
  isFlex,
}) => (
  <div
    className={cs(
      "column",
      {
        [`is-${size}`]: !!size,
        [`is-offset-${offset}`]: !!offset,
        "has-text-centered": hasTextCentered,
        "is-flex": isFlex,
      },
      className,
    )}
  >
    {children}
  </div>
)

export { Columns, Column }
