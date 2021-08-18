import React from "react"
import { Box, Flex } from "@chakra-ui/react"
import Link from "next/link"

type PostsPagerProps = {
  total: number
  current: number
}

const getBlogUrl = (page: number) => (page === 1 ? "/blog" : `/blog/${page}`)

export const PostsPager = ({ total, current }: PostsPagerProps) => {
  const pages = Array(total)
    .fill(0)
    .map((_, index) => index + 1)

  return (
    <Flex justifyContent="center" my="8">
      {pages.map((page) => {
        const disabled = page === current
        const href = getBlogUrl(page)
        return (
          <Link key={page} href={href} passHref>
            <Box
              as="a"
              borderRadius="full"
              backgroundColor={disabled ? "teal.600" : "teal.300"}
              pt="5px"
              mx="2"
              width="30px"
              height="30px"
              fontWeight="bold"
              textAlign="center"
              // disabled={page === current}
              _hover={{
                bg: disabled ? "teal.600" : "teal.500",
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {page}
            </Box>
          </Link>
        )
      })}
    </Flex>
  )
}
