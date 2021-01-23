import React from "react"
import { ColorModeScript } from "@chakra-ui/react"
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"

import { GA_TRACKING_ID } from "services/gtag"
import theme from "theme"

type DocumentProps = { html: string }

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps({
    renderPage,
  }: DocumentContext): Promise<DocumentProps> {
    const page = await renderPage()
    return { ...page }
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/favicon.png" />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
