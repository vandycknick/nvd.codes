import React from "react"
import { css, Global } from "@emotion/core"
import { ThemeProvider } from "emotion-theming"
import normalize from "normalize.css"

import { Header } from "src/components/Common/Header"
import { Main } from "src/components/Common/Main"
import { Container } from "src/components/Common/Container"
import { Footer } from "src/components/Common/Footer"
import { darkTheme } from "src/components/Tokens/themes"
import { fontFamily, fontSize } from "src/components/Tokens/fonts"
import { Helmet } from "react-helmet"

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Sans:normal,700"
          rel="stylesheet"
        />
      </Helmet>
      <Global
        styles={css`
          ${normalize}

          html {
            font-size: 16px;
            line-height: 1.5;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            -webkit-text-size-adjust: 100%;
          }

          body {
            font-family: ${fontFamily.body};
            font-size: ${fontSize.base};
          }

          blockquote,
          body,
          dd,
          dl,
          dt,
          fieldset,
          figure,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          hr,
          html,
          iframe,
          legend,
          li,
          ol,
          p,
          pre,
          textarea,
          ul {
            margin: 0;
            padding: 0;
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
