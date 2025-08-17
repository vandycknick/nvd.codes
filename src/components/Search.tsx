import { getOramaDB, search as searchOrama } from "@orama/plugin-astro/client"
import type { AnyOrama } from "@orama/orama"
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog"
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
} from "@radix-ui/react-popover"
import { ChevronDown, FileText, Hash, SearchIcon } from "lucide-react"
import {
  createContext,
  forwardRef,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import { useHotkeys } from "react-hotkeys-hook"
import scrollIntoView from "scroll-into-view-if-needed"

import { cn } from "@/lib/utils"
import { useAsync } from "@/lib/useAsync"
import { useDebounced } from "@/lib/useDebounced"
import { useOnChange } from "@/lib/useOnChange"
import { navigate } from "astro:transitions/client"
import { mitt } from "@/lib/emitter"

interface SharedProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SearchDialogProps extends SharedProps {
  search: string
  onSearchChange: (v: string) => void
  isLoading?: boolean
  children: ReactNode
}

const Context = createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
  search: string
  onSearchChange: (v: string) => void

  isLoading: boolean
} | null>(null)

export function useSearch() {
  const ctx = useContext(Context)
  if (!ctx) throw new Error("Missing <SearchDialog />")
  return ctx
}

const ListContext = createContext<{
  active: string | null
  setActive: (v: string | null) => void
} | null>(null)

export function useSearchList() {
  const ctx = useContext(ListContext)
  if (!ctx) throw new Error("Missing <SearchDialogList />")
  return ctx
}

type OmniResult = {
  id: string
  title: string
  action: () => void
  type: "page" | "heading" | "text"
  content?: string
}

const omniSearch = async (
  term: string | undefined,
  filter: "posts" | "settings",
) => {
  switch (filter) {
    case "posts": {
      if (term === undefined) return null
      try {
        const db = await getOramaDB<
          {
            typeSchema: {
              title: string
              path: string
              content: string
              h1: string
            }
          } & AnyOrama
        >("posts")
        const results = await searchOrama(db, {
          term,
        })
        return results.hits.map((h) => {
          const [title] = h.document.title.split(" - nvd.sh")
          return {
            id: h.id,
            type: "page",
            title,
            action: () => navigate(h.document.path),
            content: h.document.content,
          } satisfies OmniResult
        })
      } catch (ex) {
        // eslint-disable-next-line no-console
        console.log("Searching posts failed", ex)
        return []
      }
    }
    case "settings": {
      const settings: OmniResult[] = [
        {
          id: "toggle-theme",
          type: "text",
          title: "Change Theme",
          action: () => mitt.emit("toggle-theme"),
        },
      ]
      return term === undefined
        ? settings
        : settings.filter((s) =>
            s.title.toLowerCase().includes(term.toLocaleLowerCase()),
          )
    }
    default: {
      const exhaustiveCheck: never = filter
      throw new Error(`Unhandled color case: ${exhaustiveCheck}`)
    }
  }
}

type Filters = {
  name: string
  description: string
  value: "posts" | "settings"
}[]

const filters: Filters = [
  {
    name: "Posts",
    description: "Show only results about blog posts.",
    value: "posts",
  },
  {
    name: "Settings",
    description: "Show only results about settings.",
    value: "settings",
  },
]

export function Search() {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<"posts" | "settings">("posts")

  useHotkeys(
    "ctrl+k,cmd+k",
    () => setOpen(!open),
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [open],
  )

  useEffect(() => {
    const toggleSearch = () => setOpen(!open)
    mitt.on("toggle-search", toggleSearch)
    return () => mitt.off("toggle-search", toggleSearch)
  }, [open])

  const { value, refetch, reset, loading } = useAsync(omniSearch)
  useEffect(() => {
    reset()
    setSearch("")
    if (filter === "settings") refetch("", filter)
  }, [filter])
  const fetchBounced = useDebounced(refetch, 100)
  const onSearch = useCallback(
    (search: string) => {
      setSearch(search)
      fetchBounced(search, filter)
    },
    [fetchBounced, filter],
  )

  return (
    <SearchDialog
      open={open}
      onOpenChange={setOpen}
      search={search}
      onSearchChange={onSearch}
      isLoading={loading}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
        </SearchDialogHeader>
        <SearchDialogList items={value} />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center ">
          <Filters
            filters={filters}
            selected={filter}
            onChangeFilter={setFilter}
          />
          <div className="text-xs text-nowrap text-search-muted-foreground">
            nvd.sh
          </div>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  )
}

export function SearchDialog({
  open,
  onOpenChange,
  search,
  onSearchChange,
  isLoading = false,
  children,
}: SearchDialogProps) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Context.Provider
        value={useMemo(
          () => ({
            open,
            onOpenChange,
            search,
            onSearchChange,
            active,
            setActive,
            isLoading,
          }),
          [active, isLoading, onOpenChange, onSearchChange, open, search],
        )}
      >
        {children}
      </Context.Provider>
    </Dialog>
  )
}

export function SearchDialogOverlay(
  props: ComponentProps<typeof DialogOverlay>,
) {
  return (
    <DialogOverlay
      {...props}
      className={cn(
        "fixed inset-0 z-150 max-md:backdrop-blur-xs data-[state=open]:animate-search-fade-in data-[state=closed]:animate-search-fade-out",
        props.className,
      )}
    />
  )
}

export function SearchDialogContent({
  children,
  ...props
}: ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      aria-describedby={undefined}
      {...props}
      className={cn(
        "fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-150 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-2xl border bg-search-popover/80 backdrop-blur-xl text-search-popover-foreground shadow-2xl shadow-black/50 overflow-hidden data-[state=closed]:animate-search-dialog-out data-[state=open]:animate-search-dialog-in",
        "*:border-b *:has-[+:last-child[data-empty=true]]:border-b-0 *:data-[empty=true]:border-b-0 *:last:border-b-0",
        props.className,
      )}
    >
      <DialogTitle className="hidden">Title</DialogTitle>
      {children}
    </DialogContent>
  )
}

const SearchDialogHeader = (props: ComponentProps<"div">) => (
  <div
    {...props}
    className={cn("flex flex-row items-center gap-2 p-3", props.className)}
  />
)

const SearchDialogIcon = (props: ComponentProps<"svg">) => {
  const { isLoading } = useSearch()

  return (
    <SearchIcon
      {...props}
      className={cn(
        "size-5 text-search-muted-foreground",
        isLoading && "animate-pulse duration-400",
        props.className,
      )}
    />
  )
}

const SearchDialogInput = (props: ComponentProps<"input">) => {
  const { search, onSearchChange } = useSearch()

  return (
    <input
      {...props}
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search"
      className="w-0 flex-1 bg-transparent text-lg placeholder:text-search-muted-foreground outline-none border-transparent focus:border-transparent focus:ring-0"
    />
  )
}

export function SearchDialogList({
  items = null,
  Empty = () => (
    <div className="py-12 text-center text-sm text-search-muted-foreground">
      No search results found.
    </div>
  ),
  Item = (props) => <SearchDialogListItem {...props} />,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  items: OmniResult[] | null | undefined
  Empty?: () => ReactNode
  Item?: (props: { item: OmniResult; onClick: () => void }) => ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(() =>
    items && items.length > 0 ? items[0].id : null,
  )
  const { onOpenChange } = useSearch()

  const onOpen = ({ action }: OmniResult) => {
    action()
    onOpenChange(false)
  }

  const onKey = (e: KeyboardEvent) => {
    if (!items || e.isComposing) return

    if (e.key === "ArrowDown" || e.key == "ArrowUp") {
      let idx = items.findIndex((item) => item.id === active)
      if (idx === -1) idx = 0
      else if (e.key === "ArrowDown") idx++
      else idx--

      setActive(items.at(idx % items.length)?.id ?? null)
      e.preventDefault()
    }

    if (e.key === "Enter") {
      const selected = items.find((item) => item.id === active)
      if (selected) onOpen(selected)
      e.preventDefault()
    }
  }

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(() => {
      const viewport = element.firstElementChild

      element.style.setProperty(
        "--search-animated-height",
        `${viewport?.clientHeight ?? 100}px`,
      )
    })

    const viewport = element.firstElementChild
    if (viewport) observer.observe(viewport)

    window.addEventListener("keydown", onKey)
    return () => {
      observer.disconnect()
      window.removeEventListener("keydown", onKey)
    }
  }, [onKey])

  useOnChange(items, () => {
    if (items && items.length > 0) {
      setActive(items[0].id)
    }
  })

  return (
    <div
      {...props}
      ref={ref}
      data-empty={items === null}
      className={cn(
        "overflow-hidden h-(--search-animated-height) transition-[height]",
        props.className,
      )}
    >
      <div
        className={cn(
          "w-full flex flex-col overflow-y-auto max-h-[460px] p-1",
          !items && "hidden",
        )}
      >
        <ListContext.Provider
          value={useMemo(
            () => ({
              active,
              setActive,
            }),
            [active],
          )}
        >
          {items?.length === 0 && Empty()}

          {items?.map((item) => (
            <Fragment key={item.id}>
              {Item({ item, onClick: () => onOpen(item) })}
            </Fragment>
          ))}
        </ListContext.Provider>
      </div>
    </div>
  )
}

const icons = {
  text: null,
  heading: <Hash className="size-4 shrink-0 text-search-muted-foreground" />,
  page: (
    <FileText className="size-6 text-search-muted-foreground bg-search-muted border p-0.5 rounded-sm shadow-sm shrink-0" />
  ),
}

export function SearchDialogListItem({
  item,
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  item: OmniResult
}) {
  const { active: activeId, setActive } = useSearchList()
  const active = item.id === activeId

  return (
    <button
      type="button"
      ref={useCallback(
        (element: HTMLButtonElement | null) => {
          if (active && element) {
            scrollIntoView(element, {
              scrollMode: "if-needed",
              block: "nearest",
              boundary: element.parentElement,
            })
          }
        },
        [active],
      )}
      aria-selected={active}
      className={cn(
        "relative flex select-none flex-row items-center gap-2 p-2 text-start text-sm rounded-lg",
        item.type !== "page" && "ps-8",
        item.type === "page" || item.type === "heading"
          ? "font-medium"
          : "text-search-popover-foreground/80",
        active && "bg-search-accent text-search-accent-foreground",
        className,
      )}
      onPointerMove={() => setActive(item.id)}
      {...props}
    >
      {children ?? (
        <>
          {item.type !== "page" && (
            <div
              role="none"
              className="absolute start-4.5 inset-y-0 w-px bg-search-border"
            />
          )}
          {icons[item.type]}
          <p className="min-w-0 truncate">
            {item.title}
            {/* {item.contentWithHighlights */}
            {/*   ? render(item.contentWithHighlights) */}
            {/*   : item.content} */}
          </p>
        </>
      )}
    </button>
  )
}

const SearchDialogFooter = (props: ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn("bg-search-secondary/50 p-3 empty:hidden", props.className)}
    />
  )
}

const Filters = ({
  filters,
  selected,
  onChangeFilter,
}: {
  filters: Filters
  selected?: string
  onChangeFilter: (s: "posts" | "settings") => void
}) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none",
          "gap-1 px-2 py-1.5 text-xs",
          "hover:bg-search-accent hover:text-search-accent-foreground",
          "-m-1.5 me-auto",
        )}
      >
        <span className="text-search-muted-foreground/80 me-2">Search for</span>
        {filters.find((f) => f.value === selected)?.name}
        <ChevronDown className="size-3.5 text-search-muted-foreground" />
      </PopoverTrigger>
      <PopoverContentWrapper
        className="flex flex-col p-1 gap-1 pointer-events-auto"
        align="start"
      >
        {filters.map((f, i) => {
          const isSelected = f.value === selected

          return (
            <button
              key={i}
              onClick={() => {
                onChangeFilter(f.value)
                setOpen(false)
              }}
              className={cn(
                "rounded-lg text-start px-2 py-1.5",
                isSelected
                  ? "text-search-primary bg-search-primary/10"
                  : "hover:text-search-accent-foreground hover:bg-search-accent",
              )}
            >
              <p className="font-medium mb-0.5">{f.name}</p>
              <p className="text-xs opacity-70">{f.description}</p>
            </button>
          )
        })}
      </PopoverContentWrapper>
    </Popover>
  )
}

const PopoverContentWrapper = forwardRef<
  React.ComponentRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPortal>
    <PopoverContent
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      side="bottom"
      className={cn(
        "z-200 origin-(--radix-popover-content-transform-origin) min-w-[240px] max-w-[98vw] rounded-xl border bg-search-popover/60 backdrop-blur-lg p-2 text-sm text-search-popover-foreground shadow-lg focus-visible:outline-none data-[state=closed]:animate-search-popover-out data-[state=open]:animate-search-popover-in",
        className,
      )}
      {...props}
    />
  </PopoverPortal>
))
