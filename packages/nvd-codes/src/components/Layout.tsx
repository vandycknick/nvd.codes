import React from "react"
import styled, { createGlobalStyle } from "styled-components"

import Header from "./Header"
import Footer from "./Footer"
import "./Layout.scss"

const GlobalStyle = createGlobalStyle`
    #gatsby-focus-wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding-top: 3.25rem;
    }
`

const Main = styled.main`
  flex: 1;
`

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  )
}

export default Layout
