import { promises } from "fs"
import { join, resolve, basename, parse, relative } from "path"

const { readdir } = promises

const postsDir = join(process.cwd(), "../../", "content/posts")

async function getFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name)
      return dirent.isDirectory() ? getFiles(res) : Promise.resolve([res])
    }),
  )
  return Array.prototype.concat(...files)
}

export type SlugInfo = {
  filePath: string
  relativePath: string
  slug: string
}

export const getAllSlugs = async (): Promise<SlugInfo[]> => {
  const files = await getFiles(postsDir)
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const fullFileName = basename(file, ".md")
      const parsed = parse(fullFileName)
      const splitted = parsed.name.split("-")
      const name = splitted.slice(3)

      return {
        filePath: file,
        relativePath: relative(postsDir, file),
        slug: name.join("-"),
      }
    })
}
