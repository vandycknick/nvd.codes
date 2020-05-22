import React from "react"
import { AppProps } from "next/app"
import { CacheProvider } from "@emotion/core"
import { cache } from "emotion"

import Layout from "components/Layout"

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <CacheProvider value={cache}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </CacheProvider>
)

export default App
