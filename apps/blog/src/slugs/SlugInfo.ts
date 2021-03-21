/**
 * SlugInfo
 *
 * Maps a url slug to the blog posts markdown file on disk
 */
export type SlugInfo = {
  filePath: string
  relativePath: string
  slug: string
}
