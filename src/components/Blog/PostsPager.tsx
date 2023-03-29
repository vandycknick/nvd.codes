import { clamp } from "../../utils"

import { Text } from "../Typography"
import { ArrowSmallLeft, ArrowSmallRight } from "../Icons"

type PostsPagerProps = {
  total: number
  currentPage: number
}

const getBlogUrl = (page: number) => (page === 1 ? "/blog" : `/blog/${page}`)

export const PostsPager = ({ total, currentPage }: PostsPagerProps) => {
  const pages = Array(total)
    .fill(0)
    .map((_, index) => index + 1)
  const previous = clamp(currentPage - 1, 1, total)
  const next = clamp(currentPage + 1, 1, total)

  return (
    <div className="mt-8 border-t-[2px] border-nord-300 dark:border-nord-700 flex justify-between">
      <a
        href={getBlogUrl(previous)}
        className="text-nord-600 dark:text-nord-100 flex font-bold pt-4 inline-flex align-center"
      >
        <ArrowSmallLeft className="mr-2" />
        Previous
      </a>
      <div className="hidden md:flex justify-center flex-1 mt-[-2px]">
        {pages.map((page) => {
          const isCurrentPage = page === currentPage
          const href = getBlogUrl(page)
          return isCurrentPage ? (
            <Text
              key={page}
              className="pt-4 px-5 border-t-[2px] flex font-bold text-frost-primary dark:text-frost-primary"
            >
              {page}
            </Text>
          ) : (
            <a
              key={page}
              href={href}
              style={{ borderColor: "transparent" }}
              className="text-nord-600 border-t-[2px] border-transparent dark:text-nord-100 pt-4 px-5 flex font-bold"
            >
              {page}
            </a>
          )
        })}
      </div>
      <a
        href={getBlogUrl(next)}
        className="text-nord-600 dark:text-nord-100 flex font-bold pt-4 flex align-center"
      >
        Next
        <ArrowSmallRight className="ml-2" />
      </a>
    </div>
  )
}
