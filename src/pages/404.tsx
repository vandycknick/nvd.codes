import React from "react"

import Layout from "src/components/Layout"
import SEO from "src/components/Common/SEO"
import { Heading } from "src/components/Common/Heading"
import { Paragraph } from "src/components/Common/Paragraph"

const NotFoundPage: React.FC = () => (
  <Layout>
    <SEO title="404: Not found" />
    <section>
      <Heading>NOT FOUND</Heading>
      <Paragraph>You just hit a route that doesn&#39;t exist... 😔.</Paragraph>
    </section>
  </Layout>
)

export default NotFoundPage
