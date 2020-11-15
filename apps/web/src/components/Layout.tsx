import React, { Fragment, ReactNode } from "react"
import { css, injectGlobal } from "@emotion/css"
import { ThemeProvider } from "@emotion/react"
import normalize from "!!raw-loader!normalize.css"

import { Header } from "components/Common/Header"
import { Main } from "components/Common/Main"
import { Container } from "components/Common/Container"
import { Footer } from "components/Common/Footer"
import { darkTheme } from "components/Tokens/themes"
import { fontFamily, fontSize } from "components/Tokens/fonts"

injectGlobal`
${normalize}

html {
  font-size: 16px;
  line-height: 1.5;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  -webkit-text-size-adjust: 100%;
  overflow-y: scroll;
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

#__next {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
`

type LayoutProps = {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Fragment>
      <ThemeProvider theme={darkTheme}>
        <Header />
        <Main>
          <Container
            className={css`
              width: 100%;
              max-width: 100%;
              overflow-x: hidden;
            `}
          >
            {children}
          </Container>
        </Main>
        <Footer />
      </ThemeProvider>
    </Fragment>
  )
}

export default Layout
