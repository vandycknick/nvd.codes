import React, { Fragment } from "react"
import { Heading, Text } from "@chakra-ui/react"

import SEO from "components/Common/SEO"

const NotFoundPage = () => (
  <Fragment>
    <SEO title="404: Not found" />
    <section>
      <Heading>NOT FOUND</Heading>
      <Text>You just hit a route that doesn&#39;t exist... 😔.</Text>
    </section>
  </Fragment>
)

export default NotFoundPage
