import { join, resolve } from "path"
import { readdir } from "node:fs/promises"

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

export const getAllMarkdownFiles = async (
  directory: string,
  ignore: string[],
): Promise<string[]> => {
  const files = await listFilesRecursive(directory)
  const toIgnore = ignore.map((i) => resolve(join(directory, i)))
  return files
    .filter((file) => !toIgnore.some((ignore) => file.startsWith(ignore)))
    .filter((file) => !file.endsWith("README.md"))
    .filter((file) => file.endsWith(".md"))
}
