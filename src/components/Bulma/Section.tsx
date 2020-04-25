import React from "react"
import styled from "@emotion/styled"
import cs from "classnames"

type SectionProps = {
  hasContent?: boolean
  hasTextCentered?: boolean
  className?: string
}

const Section: React.FC<SectionProps> = ({
  children,
  className,
  hasContent,
  hasTextCentered,
}) => (
  <section
    className={cs(
      "section",
      { content: hasContent, "has-text-centered": hasTextCentered },
      className,
    )}
  >
    {children}
  </section>
)

export default styled(Section)``
