import React from "react"
import styled, { css, CSSProp, StyledComponent } from "styled-components"

type TitleProps = {
  size?: "1" | "2" | "3" | "4" | "5" | "6"
  spaced?: boolean
  shadow?: "green" | "red" | "yellow" | "purple"
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  css?: CSSProp
}

type SubtitleProps = {
  size?: "1" | "2" | "3" | "4" | "5" | "6"
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  css?: CSSProp
}

const titleAttrs = (props: TitleProps): { className: string } => {
  let className = "title"

  if (props.size) className = `${className} is-${props.size}`

  if (props.spaced) className = `${className} is-spaced`

  return { className }
}

const subtitleAttrs = (props: SubtitleProps): { className: string } => {
  let className = "subtitle"

  if (props.size) className = `${className} is-${props.size}`

  return { className }
}

const TitleStyles: StyledComponent<
  "h1",
  any,
  TitleProps,
  never
> = styled.h1.attrs<TitleProps>(titleAttrs)`

    span {
        display: inline-flex;

        ${(props: TitleProps) =>
          props.shadow &&
          css`
            padding-bottom: 5px;
          `}

        ${(props: TitleProps) =>
          props.shadow &&
          props.shadow === "green" &&
          css`
            box-shadow: inset 0 -2px 0 rgba(35, 209, 153, 0.2);
          `}

        ${(props: TitleProps) =>
          props.shadow &&
          props.shadow === "red" &&
          css`
            box-shadow: inset 0 -2px 0 rgba(255, 74, 110, 0.2);
          `}

        ${(props: TitleProps) =>
          props.shadow &&
          props.shadow === "yellow" &&
          css`
            box-shadow: inset 0 -2px 0 rgba(255, 221, 87, 0.2);
          `}

        ${(props: TitleProps) =>
          props.shadow &&
          props.shadow === "purple" &&
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

const SubtitleStyles: StyledComponent<
  "h2",
  any,
  SubtitleProps,
  never
> = styled.h2.attrs<SubtitleProps>(subtitleAttrs)``

const Title: React.FC<TitleProps> = props => (
  <TitleStyles {...props}>
    <span>{props.children}</span>
  </TitleStyles>
)

const Subtitle: React.FC<SubtitleProps> = props => (
  <SubtitleStyles {...props}>
    <span>{props.children}</span>
  </SubtitleStyles>
)

export { Title, Subtitle }
