import { promises } from "fs"
import { resolve } from "path"

const { readdir } = promises

export const listFilesRecursive = async (dir: string): Promise<string[]> => {
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
