import React from "react"
import styled, { css } from "styled-components"

type FigureProps = FigureStyleProps & {
  src: string
  alt?: string
  rounded?: boolean
}

type FigureStyleProps = {
  size?: "16x16" | "24x24" | "32x32" | "48x38" | "64x64" | "96x96" | "128x128"
  centered?: boolean
}

const figureStyleAttrs = (props: FigureStyleProps): { className: string } => {
  let className = "image"

  if (props.size) className = `${className} is-${props.size}`

  return { className }
}

const FigureStyle = styled.picture.attrs<FigureStyleProps>(figureStyleAttrs)`
  ${(props: FigureStyleProps) =>
    props.centered &&
    css`
      margin: auto;
    `}
`

const Figure: React.FC<FigureProps> = ({ src, alt, rounded, ...rest }) => (
  <FigureStyle {...rest}>
    <img src={src} alt={alt} className={`${rounded ? "is-rounded" : ""}`} />
  </FigureStyle>
)

export default Figure
