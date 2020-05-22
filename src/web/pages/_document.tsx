import React from "react"
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"
import { extractCritical } from "emotion-server"
import { RenderPageResult } from "next/dist/next-server/lib/utils"

type CriticalStyles = ReturnType<typeof extractCritical>
type DocumentProps = RenderPageResult & CriticalStyles

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps({
    renderPage,
  }: DocumentContext): Promise<DocumentProps> {
    const page = await renderPage()
    const styles = extractCritical(page.html)
    return { ...page, ...styles }
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <style
            data-emotion-css={this.props.ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: this.props.css }}
          />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Sans:normal,700"
            rel="stylesheet"
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
