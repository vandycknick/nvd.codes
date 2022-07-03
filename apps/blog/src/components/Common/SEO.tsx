import React from "react"
import { NextSeo, NextSeoProps } from "next-seo"

interface SEOProps {
  title: string
  description?: string
  openGraph?: NextSeoProps["openGraph"]
  additionalMetaTags?: NextSeoProps["additionalMetaTags"]
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  openGraph,
  additionalMetaTags,
}) => (
  <NextSeo
    title={title}
    description={description}
    twitter={{
      handle: "@vandycknick",
      site: "@vandycknick",
      cardType: "summary_large_image",
    }}
    openGraph={{
      site_name: "Nick Van Dyck | nvd.codes",
      ...openGraph,
    }}
    additionalMetaTags={additionalMetaTags}
  />
)

export default SEO
