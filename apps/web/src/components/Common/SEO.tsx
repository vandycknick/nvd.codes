import React from "react"
import { NextSeo, NextSeoProps } from "next-seo"

interface SEOProps {
  title: string
  description?: string
  openGraph?: NextSeoProps["openGraph"]
}

const SEO: React.FC<SEOProps> = ({ title, description, openGraph }) => (
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
  />
)

export default SEO
