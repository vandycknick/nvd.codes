import styled, { CSSProp, StyledComponent } from "styled-components"

type ParagraphProps = {
  hasTextCentered?: boolean
  css?: CSSProp
  className?: string
}

const paragraphAttrs = (props: ParagraphProps): { className: string } => {
  let className = ""

  if (props.hasTextCentered) className = `${className} has-text-centered`

  return { className }
}

const Paragraph: StyledComponent<
  "p",
  any,
  ParagraphProps,
  never
> = styled.p.attrs<ParagraphProps>(paragraphAttrs)``

export default Paragraph
