import React from "react"
import { HeadingTwo, Text } from "components/Common/Typography"

import SEO from "components/Common/SEO"

const NotFoundPage = () => (
  <>
    <SEO title="404: Not found" />
    <section>
      <HeadingTwo>NOT FOUND</HeadingTwo>
      <Text>You just hit a route that doesn&#39;t exist... 😔.</Text>
    </section>
  </>
)

export default NotFoundPage
