import styled, { CSSProp, StyledComponent } from "styled-components"
import { isMobile } from "../Common/mediaQuery"

type ColumnsProps = {
  centered?: boolean
  css?: CSSProp
  reversedOrder?: "mobile"
  isMultiline?: boolean
}

type ColumnProps = {
  size?:
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
  hasTextCentered?: boolean
  isFlex?: boolean
}

const columnsAttrs = (props: ColumnsProps): { className: string } => {
  let className = "columns"

  if (props.centered) className = `${className} is-centered`

  if (props.isMultiline) className = `${className} is-multiline`

  return { className }
}

const columnAttrs = (props: ColumnProps): { className: string } => {
  let className = "column"

  if (props.size) className = `${className} is-${props.size}`

  if (props.hasTextCentered) className = `${className} has-text-centered`

  if (props.isFlex) className = `${className} is-flex`

  return { className }
}

const Columns: StyledComponent<
  "div",
  {},
  ColumnsProps,
  never
> = styled.div.attrs<ColumnsProps>(columnsAttrs)`
  ${(props: ColumnsProps) =>
    props.reversedOrder === "mobile" &&
    isMobile`
        display: flex;
        flex-direction: column-reverse;
    `}
`

const Column: StyledComponent<"div", {}, ColumnProps, never> = styled.div.attrs<
  ColumnProps
>(columnAttrs)``

export { Columns, Column }
