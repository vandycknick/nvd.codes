import styled from "@emotion/styled"

type HeaderProps = {
  hasTextCentered?: boolean
}

const Header = styled.header<HeaderProps>`
  ${({ hasTextCentered }) =>
    hasTextCentered && "text-align: center !important;"}
`

export default Header
