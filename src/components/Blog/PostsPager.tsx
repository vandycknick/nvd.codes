import { clamp } from "@/utils"

type Props = {
  total: number
  currentPage: number
  className: string
}

const getBlogUrl = (page: number) => (page === 1 ? "/blog" : `/blog/${page}`)

export const PostsPager = ({ total, currentPage, className }: Props) => {
  const previous = clamp(currentPage - 1, 1, total)
  const next = clamp(currentPage + 1, 1, total)

  return (
    <nav className={className}>
      <div className="flex items-center justify-between w-full">
        <a
          href={getBlogUrl(previous)}
          className="group w-fit min-w-[6.5rem] p-1.5 gap-1.5 text-sm flex items-center border rounded hover:bg-black/5 hover:dark:bg-white/10 border-black/15 dark:border-white/20 transition-colors duration-300 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="stroke-current group-hover:stroke-black group-hover:dark:stroke-white"
          >
            <line
              x1="19"
              y1="12"
              x2="5"
              y2="12"
              className="scale-x-0 group-hover:scale-x-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300 ease-in-out"
            ></line>
            <polyline
              points="12 19 5 12 12 5"
              className="translate-x-1 group-hover:translate-x-0 transition-all duration-300 ease-in-out"
            ></polyline>
          </svg>
          <div className="w-full group-hover:text-black group-hover:dark:text-white transition-colors duration-300 ease-in-out">
            Previous
          </div>
        </a>
        <div className="flex flex-1 w-full justify-center text-md uppercase">
          PAGE {currentPage} OF {total}
        </div>
        <a
          href={getBlogUrl(next)}
          className="group w-fit p-1.5 gap-1.5 text-sm flex items-center min-w-[6.5rem] border rounded hover:bg-black/5 hover:dark:bg-white/10 border-black/15 dark:border-white/20 transition-colors duration-300 ease-in-out"
        >
          <div className="w-full group-hover:text-black group-hover:dark:text-white transition-colors duration-300 ease-in-out">
            Next
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="stroke-current group-hover:stroke-black group-hover:dark:stroke-white"
          >
            <line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
              className="scale-x-0 group-hover:scale-x-100 translate-x-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
            ></line>
            <polyline
              points="12 5 19 12 12 19"
              className="translate-x-0 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
            ></polyline>
          </svg>
        </a>
      </div>
    </nav>
  )
}
