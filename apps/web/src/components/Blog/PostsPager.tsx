import React from "react"
import Link from "next/link"

import { clamp } from "@nvd.codes/utils"

import { Text } from "components/Common/Typography"
import { ArrowSmallLeft, ArrowSmallRight } from "components/Common/Icons"

type PostsPagerProps = {
  total: number
  current: number
}

const getBlogUrl = (page: number) => (page === 1 ? "/blog" : `/blog/${page}`)

export const PostsPager = ({ total, current }: PostsPagerProps) => {
  const pages = Array(total)
    .fill(0)
    .map((_, index) => index + 1)
  const previous = clamp(current - 1, 1, total)
  const next = clamp(current + 1, 1, total)

  return (
    <div className="mt-8 border-t-[2px] border-nord-300 dark:border-nord-700 flex justify-between">
      <Link href={getBlogUrl(previous)} passHref>
        <a className="text-nord-600 dark:text-nord-100 flex font-bold pt-4 inline-flex align-center">
          <ArrowSmallLeft className="mr-2" />
          Previous
        </a>
      </Link>
      <div className="none md:flex justify-center flex-1 mt-[-2px]">
        {pages.map((page) => {
          const isCurrentPage = page === current
          const href = getBlogUrl(page)
          return isCurrentPage ? (
            <Text
              key={page}
              className="pt-4 px-5 border-t-[2px] flex font-bold text-frost-primary dark:text-frost-primary"
            >
              {page}
            </Text>
          ) : (
            <Link key={page} href={href} passHref>
              <a
                style={{ borderColor: "transparent" }}
                className="text-nord-600 border-t-[2px] border-transparent dark:text-nord-100 pt-4 px-5 flex font-bold"
              >
                {page}
              </a>
            </Link>
          )
        })}
      </div>
      <Link href={getBlogUrl(next)} passHref>
        <a className="text-nord-600 dark:text-nord-100 flex font-bold pt-4 flex align-center">
          Next
          <ArrowSmallRight className="ml-2" />
        </a>
      </Link>
    </div>
  )
}
