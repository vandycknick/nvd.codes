import React from "react"
import { css, Global } from "@emotion/core"
import { ThemeProvider } from "emotion-theming"
import normalize from "normalize.css"

import Header from "src/components/Layout/Header"
import { Main } from "src/components/Layout/Main"
import { Container } from "src/components/Common/Container"
import Footer from "src/components/Layout/Footer"
import { darkTheme } from "src/components/Tokens/themes"
import { fontFamily, fontSize } from "src/components/Tokens/fonts"

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Global
        styles={css`
          ${normalize}

          html {
            font-size: 15px;
            line-height: 1.5;
          }

          body {
            font-family: ${fontFamily.body};
            font-size: ${fontSize.base};
          }

          #gatsby-focus-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}
      />
      <ThemeProvider theme={darkTheme}>
        <Header />
        <Main>
          <Container>{children}</Container>
        </Main>
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout
