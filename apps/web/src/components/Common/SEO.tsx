import React from "react"
import { NextSeo } from "next-seo"

interface SEOProps {
  title: string
  description?: string
}

const SEO: React.FC<SEOProps> = ({ title, description }) => (
  <NextSeo
    title={title}
    description={description}
    twitter={{
      handle: "@handle",
      site: "@site",
      cardType: "summary_large_image",
    }}
  />
)

export default SEO
