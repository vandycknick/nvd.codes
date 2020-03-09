import React from "react"
import styled from "styled-components"

const LogoLink = styled.a`
  align-items: center;
  display: flex;
  margin-left: 1rem;
`

const HeaderLogo: React.FC = () => <LogoLink href="/">⚡</LogoLink>

export default HeaderLogo
