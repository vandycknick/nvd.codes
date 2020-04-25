import React from "react"
import cs from "classnames"

type FigureProps = {
  src: string
  alt?: string
  rounded?: boolean
  size?: "16x16" | "24x24" | "32x32" | "48x38" | "64x64" | "96x96" | "128x128"
  className?: string
}

const Figure: React.FC<FigureProps> = ({
  src,
  alt,
  rounded,
  size,
  className,
}) => (
  <figure className={cs("image", { [`is-${size}`]: !!size }, className)}>
    <img src={src} alt={alt} className={cs({ "is-rounded": rounded })} />
  </figure>
)

export default Figure
