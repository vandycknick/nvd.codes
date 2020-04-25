import React from "react"
import { css, Global } from "@emotion/core"

import Header from "./Header"
import Footer from "./Footer"
import "./Layout.scss"

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Global
        styles={css`
          #gatsby-focus-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            padding-top: 3.25rem;
          }
        `}
      />
      <Header />
      <main
        css={css`
          flex: 1;
        `}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}

export default Layout
