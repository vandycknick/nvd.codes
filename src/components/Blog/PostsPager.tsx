import clsx from "clsx"
import { clamp } from "@/utils"

import { ArrowSmallLeft, ArrowSmallRight } from "@/components/Icons"

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
    <nav className="flex items-center justify-between border-t border-zinc-200 px-4 sm:px-0 mt-32">
      <div className="-mt-px flex w-0 flex-1">
        <a
          href={getBlogUrl(previous)}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
        >
          <ArrowSmallLeft
            className="mr-3 h-5 w-5 text-zinc-400"
            aria-hidden="true"
          />
          Previous
        </a>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {pages.map((page) => {
          const isCurrentPage = page === currentPage
          const href = getBlogUrl(page)
          return (
            <a
              key={page}
              href={href}
              className={clsx(
                "inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700",
                {
                  "border-teal-500": isCurrentPage,
                  "text-teal-600": isCurrentPage,
                },
              )}
            >
              {page}
            </a>
          )
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <a
          href={getBlogUrl(next)}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
        >
          Next
          <ArrowSmallRight
            className="ml-3 h-5 w-5 text-zinc-400"
            aria-hidden="true"
          />
        </a>
      </div>
    </nav>
  )
}
