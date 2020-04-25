import { css } from "@emotion/core"
import styled from "@emotion/styled"

type TagProps = {
  color?:
    | "black"
    | "dark"
    | "light"
    | "white"
    | "primary"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "danger"
  size?: "small" | "normal" | "medium" | "large"
  rounded?: boolean
  delete?: boolean
}

type TagsProps = {
  size?: "normal"
  centered?: boolean
}

type ColorMap = Record<
  NonNullable<TagProps["color"]> | "default",
  {
    background: string
    color: string
  }
>

const tagColorPallet: ColorMap = {
  black: {
    background: "#0a0a0a",
    color: "white",
  },
  dark: {
    background: "#363636",
    color: "#fff",
  },
  light: {
    background: "whitesmoke",
    color: "rgba(0, 0, 0, 0.7)",
  },
  white: {
    background: "white",
    color: "#0a0a0a",
  },
  primary: {
    background: "#00d1b2",
    color: "#fff",
  },
  link: {
    background: "#3273dc",
    color: "#fff",
  },
  info: {
    background: "#3298dc",
    color: "#fff",
  },
  success: {
    background: "#48c774",
    color: "#fff",
  },
  warning: {
    background: "#ffdd57",
    color: "rgba(0, 0, 0, 0.7)",
  },
  danger: {
    background: "#f14668",
    color: "#fff",
  },
  default: {
    background: "whitesmoke",
    color: "#4a4a4a",
  },
}

const Tag = styled.span<TagProps>`
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  font-size: 0.75rem;
  height: 2em;
  justify-content: center;
  line-height: 1.5;
  padding-left: 0.75em;
  padding-right: 0.75em;
  white-space: nowrap;
  ${({ color }) => {
    const colorPallet = tagColorPallet[color ?? "default"]
    return css`
      background-color: ${colorPallet.background};
      color: ${colorPallet.color};
    `
  }}

  ${({ size }) => {
    switch (size) {
      case "small":
        return css`
          font-size: 0.6rem;
          line-height: 1;
          font-weight: 500;
        `

      case "normal":
      default:
        return css`
          font-size: 0.75rem;
        `

      case "medium":
        return css`
          font-size: 1rem;
        `

      case "large":
        return css`
          font-size: 1.25rem;
        `
    }
  }}

  ${({ rounded }) =>
    rounded &&
    css`
      border-radius: 290486px;
    `}

  ${(props) =>
    props.delete &&
    css`
      margin-left: 1px;
      padding: 0;
      position: relative;
      width: 2em;

      &::before,
      $::after {
        background-color: currentColor;
        content: "";
        display: block;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translateX(-50%) translateY(-50%) rotate(45deg);
        transform-origin: center center;
      }

      &::before {
        height: 1px;
        width: 50%;
      }

      &::after {
        height: 50%;
        width: 1px;
      }

      &:hover,
      &:focus {
        background-color: #e8e8e8;
      }

      &:active {
        background-color: #dbdbdb;
      }
    `}
`

const Tags = styled.span<TagsProps>`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  ${(props: TagsProps) =>
    props.centered &&
    css`
      justify-content: center;
    `}

  ${Tag} {
    margin-bottom: 0.5rem;

    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }

  &:last-child {
    margin-bottom: -0.5rem;
  }

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

export { Tags, Tag }
