import React from "react"
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"
import { extractCritical } from "@emotion/server"
import { GA_TRACKING_ID } from "services/gtag"

type CriticalStyles = ReturnType<typeof extractCritical>
type DocumentProps = { html: string } & CriticalStyles

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps({
    renderPage,
  }: DocumentContext): Promise<DocumentProps> {
    const page = await renderPage()
    const styles = extractCritical(page.html)
    return { ...page, ...styles }
  }

  render(): JSX.Element {
    const { ids, css } = this.props
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/favicon.png" />
          <style
            data-emotion-css={ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: css }}
          />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Sans:normal,700"
            rel="stylesheet"
          />
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
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
