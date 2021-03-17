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
  cover?: string
  placeholderCss?: Record<string, string>
  placeholder?: string
  slug: string
  editUrl: string
}
