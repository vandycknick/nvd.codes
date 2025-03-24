import { useEffect, useState, useCallback } from "react"
import { MagnifyingGlassIcon } from "@/components/Icons"
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react"
import clsx from "clsx"
import { useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"

type SearchItem = {
  url: string
  meta: {
    title: string
  }
  excerpt: string
}

type SearchResult = {
  results: {
    data: () => Promise<SearchItem>
  }[]
}

type PagefindSdk = {
  search: (query: string) => Promise<SearchResult>
}

const useAsync = <T,>(
  asyncFn: () => Promise<T>,
  immediate: boolean = false,
) => {
  const [state, setState] = useState<{
    status: "idle" | "pending" | "success" | "error"
    value: T | null
    error: Error | null
    loading: boolean
  }>({
    status: "idle",
    value: null,
    error: null,
    loading: false,
  })

  const refetch = useCallback(async () => {
    setState({
      status: "pending",
      value: null,
      error: null,
      loading: true,
    })

    return asyncFn()
      .then((response) => {
        setState({
          status: "success",
          value: response,
          error: null,
          loading: false,
        })
      })
      .catch((error) => {
        setState({
          status: "error",
          value: null,
          error: error,
          loading: false,
        })
      })
  }, [asyncFn])

  const reset = useCallback(
    () =>
      setState({
        status: "idle",
        value: null,
        error: null,
        loading: false,
      }),
    [],
  )

  // execute the function
  // if asked for immediate
  useEffect(() => {
    if (immediate) {
      refetch()
    }
  }, [refetch, immediate])

  // state values
  const { status, value, error, loading } = state

  return { refetch, status, value, error, loading, reset }
}

const imp = (path: string) => import(/* @vite-ignore */ path)

export const QuickSearch = () => {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const pagefindRef = useRef<PagefindSdk>(null)

  useHotkeys("ctrl+k,cmd+k", () => setOpen(!open), {
    enableOnFormTags: true,
    preventDefault: true,
  })

  useEffect(() => {
    const toggleQuickSearch = () => setOpen(!open)

    document.addEventListener("toggleSearch", toggleQuickSearch)
    return () => document.removeEventListener("toggleSearch", toggleQuickSearch)
  })

  const { loading, value, refetch, reset } = useAsync(async () => {
    if (pagefindRef.current == undefined) {
      pagefindRef.current = (await imp("/pagefind/pagefind.js")) as PagefindSdk
    }
    const pagefind = pagefindRef.current
    const search = await pagefind.search(query)
    const items = await Promise.all(search.results.map((s) => s.data()))

    return items
  })

  const goToUrl = (url?: string) => {
    if (url == undefined) {
      return
    }

    window.location.assign(url)
  }

  return (
    <Dialog
      open={open}
      as="div"
      className="relative z-50"
      onClose={() => {
        setOpen(false)
        setQuery("")
        reset()
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-800/40 dark:bg-black/80 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel className="mt-24 mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
          <Combobox onChange={goToUrl}>
            <div className="grid grid-cols-1">
              <ComboboxInput
                autoFocus
                className="col-start-1 row-start-1 h-12 w-full pl-11 pr-4 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 border-0 sm:text-sm"
                placeholder="Search..."
                onBlur={() => setQuery("")}
                onChange={(event) => {
                  setQuery(event.target.value)
                  refetch()
                }}
              />
              <MagnifyingGlassIcon
                className="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400"
                aria-hidden="true"
              />
            </div>

            {value && value.length > 0 && (
              <ComboboxOptions
                static
                className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
              >
                {value.map((result) => (
                  <ComboboxOption
                    key={result.url}
                    value={result.url}
                    className={({ focus }) =>
                      clsx(
                        "cursor-default select-none px-4 py-2",
                        focus && "bg-zinc-200 text-white",
                      )
                    }
                  >
                    {({ focus }) => (
                      <>
                        <div className="flex-auto">
                          <p
                            className={clsx(
                              "text-sm font-medium",
                              focus ? "text-gray-900" : "text-gray-700",
                            )}
                          >
                            {result.meta.title}
                          </p>
                          <p
                            className={clsx(
                              "text-sm",
                              focus ? "text-gray-700" : "text-gray-500",
                            )}
                            dangerouslySetInnerHTML={{
                              __html: result.excerpt,
                            }}
                          ></p>
                        </div>
                      </>
                    )}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            )}

            {query !== "" && !loading && value?.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No blog posts found.</p>
            )}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
