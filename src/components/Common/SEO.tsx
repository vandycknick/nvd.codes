import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

type MetaProps = {
  name?: string
  property?: string
  content?: string
}

interface SEOProps {
  description?: string
  lang?: string
  meta?: MetaProps
  title: string
}

const SEO: React.FC<SEOProps> = ({ title, description, lang, meta = [] }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            profiles {
              twitter {
                handle
              }
            }
          }
        }
      }
    `,
  )

  const metaDescription: string = description || site.siteMetadata.description
  const defaultMeta: MetaProps[] = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: site.siteMetadata.profiles.twitter.handle,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: metaDescription,
    },
  ]
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={defaultMeta.concat(meta)}
    />
  )
}

export default SEO
