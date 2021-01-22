import React, { useEffect, useState } from "react"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import { ChakraProvider, Flex, Progress } from "@chakra-ui/react"

import { pageView } from "services/gtag"
import { Header } from "components/Common/Header"
import { Footer } from "components/Common/Footer"
import theme from "theme"

const PageProgress = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onRouteChangeStart = () => setLoading(true)
    const onRouteCompleted = () => setLoading(false)

    router.events.on("routeChangeStart", onRouteChangeStart)
    router.events.on("routeChangeComplete", onRouteCompleted)
    router.events.on("routeChangeError", onRouteCompleted)

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart)
      router.events.off("routeChangeComplete", onRouteCompleted)
      router.events.off("routeChangeError", onRouteCompleted)
    }
  }, [router])

  return (
    <Progress
      colorScheme="teal"
      size="xs"
      isIndeterminate={loading}
      value={100}
    />
  )
}

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string): void => pageView(url)
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => router.events.off("routeChangeComplete", handleRouteChange)
  }, [router])

  return (
    <ChakraProvider theme={theme}>
      <PageProgress />
      <Header />
      <Flex
        direction="column"
        align="center"
        maxW={{ xl: "1200px" }}
        px={4}
        m="0 auto"
        flex={1}
        as="main"
      >
        <Component {...pageProps} />
      </Flex>
      <Footer />
    </ChakraProvider>
  )
}
export default App
