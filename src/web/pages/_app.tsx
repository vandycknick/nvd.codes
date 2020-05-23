import React, { useEffect } from "react"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import { CacheProvider } from "@emotion/core"
import { cache } from "emotion"

import { pageView } from "services/gtag"
import Layout from "components/Layout"

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string): void => pageView(url)
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => router.events.off("routeChangeComplete", handleRouteChange)
  }, [router])

  return (
    <CacheProvider value={cache}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CacheProvider>
  )
}
export default App
