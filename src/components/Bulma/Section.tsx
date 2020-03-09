import styled, { CSSProp, StyledComponent } from "styled-components"

type SectionProps = {
  hasContent?: boolean
  hasTextCentered?: boolean
  css?: CSSProp
}

const sectionProps = (props: SectionProps): { className: string } => {
  let className = "section"

  if (props.hasContent) className = `${className} content`

  if (props.hasTextCentered) className = `${className} has-text-centered`

  return { className }
}

const Section: StyledComponent<
  "section",
  any,
  SectionProps,
  never
> = styled.section.attrs<SectionProps>(sectionProps)``

export default Section
