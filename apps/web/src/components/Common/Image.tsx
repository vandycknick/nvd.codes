import React from "react"
import { css } from "@emotion/core"

type ImageProps = {
  src: string
  width?: number
  height?: number
  alt?: string
  className?: string
}

const Image: React.FC<ImageProps> = ({
  alt,
  className,
  src,
  width = 128,
  height = 128,
}) => (
  <figure
    className={className}
    css={css`
      height: ${height}px;
      width: ${width}px;
    `}
  >
    <img
      src={src}
      alt={alt}
      css={css`
        border-radius: 100%;
        display: block;
        height: auto;
        width: 100%;
        height: 100%;
      `}
    />
  </figure>
)

export { Image }
