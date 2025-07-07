export type PostPreview = {
  title: string
  description: string
  date: Date
  slug: string
  readingTime: string
  tags: string[]
  cover: {
    src: string
    width: number
    height: number
    format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif"
  }
}
