import {
  styled,
  colors,
  borderRadius,
  fontSize,
  spacing,
} from "src/components/Tokens"

const Tag = styled.span`
  display: inline-flex;
  justify-content: center;
  color: ${colors.white};
  background-color: ${colors.teal[800]};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.xs};
  padding: ${spacing[1]} ${spacing[2]};

  &:not(:last-child) {
    margin-right: ${spacing[2]};
  }
`

export { Tag }
