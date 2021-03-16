export type ISODateString = string

export interface Post {
  id: string
  title: string
  description: string
  date: ISODateString
  draft: boolean
  content: string
  categories: string[]
  readingTime: string
  cover: string | null
  placeholderCss: Record<string, string> | null
  slug: string
  editUrl: string
}
