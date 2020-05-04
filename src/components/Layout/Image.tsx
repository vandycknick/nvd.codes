import React from "react"
import { css } from "@emotion/core"

type ImageProps = {
  src: string
  alt?: string
  className?: string
}

const Image: React.FC<ImageProps> = ({ alt, className, src }) => (
  <figure
    className={className}
    css={css`
      height: 128px;
      width: 128px;
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
      `}
    />
  </figure>
)

export { Image }
