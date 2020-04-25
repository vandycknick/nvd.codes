import React from "react"
import cs from "classnames"

type ParagraphProps = {
  hasTextCentered?: boolean
  className?: string
}

const Paragraph: React.FC<ParagraphProps> = ({
  className,
  hasTextCentered,
  children,
}) => (
  <p className={cs({ "has-text-centered": hasTextCentered }, className)}>
    {children}
  </p>
)

export default Paragraph
