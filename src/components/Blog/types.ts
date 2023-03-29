export type PostPreview = {
  title: string
  description: string
  date: Date
  slug: string
  readingTime: string
  categories: string[]
  cover: {
    src: string
    width: number
    height: number
    format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg"
  }
}
