import React from "react"

import SEO from "components/Common/SEO"
import { Heading } from "components/Common/Heading"
import { Paragraph } from "components/Common/Paragraph"

const NotFoundPage: React.FC = () => (
  <>
    <SEO title="404: Not found" />
    <section>
      <Heading>NOT FOUND</Heading>
      <Paragraph>You just hit a route that doesn&#39;t exist... 😔.</Paragraph>
    </section>
  </>
)

export default NotFoundPage
