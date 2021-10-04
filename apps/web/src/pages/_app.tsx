import React, { useEffect, useState } from "react"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import { Box, ChakraProvider, Flex, Progress } from "@chakra-ui/react"

import { pageView } from "services/gtag"
import { Header } from "components/Common/Header"
import { Footer } from "components/Common/Footer"
import theme from "theme"
import Head from "next/head"

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
      position="fixed"
      width="100%"
      zIndex={999}
      aria-label="Page loader progress bar"
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
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ChakraProvider theme={theme}>
        <PageProgress />
        <Header />
        <Flex width="100%" maxWidth="100%" flex={1} as="main">
          <Box
            px={4}
            flexGrow={1}
            margin="0px auto"
            position="relative"
            width="100%"
            maxW={{ xl: "1200px" }}
            overflowX="hidden"
          >
            <Component {...pageProps} />
          </Box>
        </Flex>
        <Footer />
      </ChakraProvider>
    </>
  )
}
export default App
