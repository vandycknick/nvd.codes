import React from "react"
import { css, cx } from "@emotion/css"

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
    className={cx(
      css`
        height: ${height}px;
        width: ${width}px;
      `,
      className,
    )}
  >
    <img
      src={src}
      alt={alt}
      className={css`
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
