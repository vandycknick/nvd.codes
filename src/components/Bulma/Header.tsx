import styled, { css, StyledComponent } from "styled-components"

type HeaderProps = {
  hasTextCentered?: boolean
}

const Header: StyledComponent<
  "header",
  never,
  HeaderProps,
  never
> = styled.header`
  ${(props: HeaderProps) =>
    props.hasTextCentered &&
    css`
      text-align: center !important;
    `}
`

export default Header
