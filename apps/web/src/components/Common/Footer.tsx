import React from "react"
import { Link, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"

const Footer = () => {
  const bg = useColorModeValue("gray.50", "gray.900")
  return (
    <VStack bg={bg} py={4} as="footer">
      <Text>
        <strong>nvd.codes &nbsp;</strong>is handcrafted with ❤️&nbsp;
        <Link
          href="https://github.com/nickvdyck/nvd.codes"
          isExternal
          rel="noopener noreferrer"
          display="inline-flex"
        >
          view source
          <ExternalLinkIcon mx={1} mt="2px" />
        </Link>
      </Text>
      <Text>all materials © Nick Van Dyck 2021</Text>
    </VStack>
  )
}

export { Footer }
