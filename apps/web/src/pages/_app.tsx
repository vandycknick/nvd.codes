import React, { useEffect } from "react"
import { AppProps } from "next/app"
import { useRouter } from "next/router"

import { pageView } from "services/gtag"
import { Header } from "components/Common/Header"
import { Footer } from "components/Common/Footer"
import Head from "next/head"

import "../styles/globals.css"

// const PageProgress = () => {
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     const onRouteChangeStart = () => setLoading(true)
//     const onRouteCompleted = () => setLoading(false)

//     router.events.on("routeChangeStart", onRouteChangeStart)
//     router.events.on("routeChangeComplete", onRouteCompleted)
//     router.events.on("routeChangeError", onRouteCompleted)

//     return () => {
//       router.events.off("routeChangeStart", onRouteChangeStart)
//       router.events.off("routeChangeComplete", onRouteCompleted)
//       router.events.off("routeChangeError", onRouteCompleted)
//     }
//   }, [router])

//   return (
//     <Progress
//       colorScheme="teal"
//       size="xs"
//       isIndeterminate={loading}
//       value={100}
//       position="fixed"
//       width="100%"
//       zIndex={999}
//       aria-label="Page loader progress bar"
//     />
//   )
// }

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string): void => pageView(url)
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => router.events.off("routeChangeComplete", handleRouteChange)
  }, [router])

  return (
    <div className="flex flex-col h-screen dark:text-nord-100">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      <main className="flex flex-col flex-1 w-full max-w-full">
        <div className="w-full flex flex-col flex-1">
          <Component {...pageProps} />
        </div>
        <svg
          className="w-full fill-nord-50 dark:fill-nord-600 transition transition-colors duration-300"
          viewBox="0 0 1440 46"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 .058c117.505 18.386 269.602 22.114 456.294 11.185C562.076 5.051 730.784.911 885.297 3.273 1157.177 7.432 1386.981 21.329 1440 38.39v8.55H0V.058z"></path>
        </svg>
      </main>
      <Footer />
    </div>
  )
}
export default App
