import React from "react"
import { Html, Head, Main, NextScript } from "next/document"

import { GA_TRACKING_ID } from "services/gtag"

const Document = (): JSX.Element => {
  return (
    <Html lang="en" className="">
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="author" content="Nick Van Dyck" />
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
      <body className="h-screen bg-nord-100 dark:bg-nord-900 transition transition-colors duration-300">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document