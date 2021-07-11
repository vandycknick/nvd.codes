import { basename, parse, relative, join, resolve } from "path"
import { promises } from "fs"

const { readdir } = promises

/**
 * SlugInfo
 *
 * Maps a url slug to the blog posts markdown file on disk
 */
type SlugInfo = {
  filePath: string
  relativePath: string
  slug: string
}

/**
 * listFileRecursive
 * @param dir
 * @returns Promise<string[]>
 *
 * Recursively lists all files inside a directory
 */
const listFilesRecursive = async (dir: string): Promise<string[]> => {
  const dirents = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name)
      return dirent.isDirectory()
        ? listFilesRecursive(res)
        : Promise.resolve([res])
    }),
  )
  return Array.prototype.concat(...files)
}

const createSlugFromFilePath = (
  filePath: string,
  rootDir: string,
): SlugInfo => {
  const fullFileName = basename(filePath, ".md")
  const parsed = parse(fullFileName)
  const splitted = parsed.name.split("-")
  const name = splitted.slice(3)

  return {
    filePath,
    relativePath: relative(rootDir, filePath),
    slug: name.join("-"),
  }
}

// TODO: Should come from config?
const DRAFTS_DIRECTORY = "drafts"

export const getAllSlugs = async (source: string): Promise<SlugInfo[]> => {
  const files = await listFilesRecursive(source)
  return files
    .filter((file) => {
      const drafts = resolve(join(source, DRAFTS_DIRECTORY))
      return !file.startsWith(drafts)
    })
    .filter((file) => !file.endsWith("README.md"))
    .filter((file) => file.endsWith(".md"))
    .map((file) => createSlugFromFilePath(file, source))
}
