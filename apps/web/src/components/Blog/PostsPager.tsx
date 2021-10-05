import React from "react"
import { Box, Divider, Flex } from "@chakra-ui/react"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"
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
    <Box pt="8">
      <Divider />
      <Flex direction="row" justifyContent="space-between">
        <Link href={getBlogUrl(1)} passHref>
          <Box
            as="a"
            fontWeight="bold"
            pt="4"
            color="gray.200"
            display="inline-flex"
            alignSelf="center"
            _hover={{
              cursor: current === 1 ? "not-allowed" : "pointer",
            }}
          >
            <ArrowBackIcon mr="2" top=".125em" position="relative" />
            Previous
          </Box>
        </Link>
        <Flex
          display={{ base: "none", md: "flex" }}
          justifyContent="center"
          flex="1"
        >
          {pages.map((page) => {
            const isCurrentPage = page === current
            const href = getBlogUrl(page)
            const onLinkClick = (event: React.MouseEvent) => {
              if (isCurrentPage) {
                event.preventDefault()
                event.stopPropagation()
              }
            }

            return (
              <Link key={page} href={href} passHref>
                <Box
                  as="a"
                  pt="4"
                  px="5"
                  mt="-1px"
                  fontWeight="bold"
                  color={isCurrentPage ? "teal.500" : "gray.200"}
                  borderTop="2px solid"
                  borderTopColor={isCurrentPage ? "teal.500" : "transparent"}
                  _hover={{
                    cursor: isCurrentPage ? "not-allowed" : "pointer",
                  }}
                  onClick={onLinkClick}
                >
                  {page}
                </Box>
              </Link>
            )
          })}
        </Flex>
        <Link href={getBlogUrl(total)} passHref>
          <Box
            as="a"
            fontWeight="bold"
            pt="4"
            color="gray.200"
            display="inline-flex"
            alignSelf="center"
            _hover={{
              cursor: current === total ? "not-allowed" : "pointer",
            }}
          >
            Next
            <ArrowForwardIcon ml="2" top=".125em" position="relative" />
          </Box>
        </Link>
      </Flex>
    </Box>
  )
}
