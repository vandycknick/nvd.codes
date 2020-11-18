import { promises } from "fs"
import { join, resolve, basename, parse, relative } from "path"
import { watch } from "chokidar"
import { Deferred } from "utils/async"

const { readdir } = promises

const postsDir = join(process.cwd(), "../../", "_posts")

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

export const watchSlugs = () => {
  let open = true
  const watcher = watch(postsDir)
  const fileQueue: SlugInfo[] = []
  const promiseQueue: Deferred<SlugInfo>[] = []

  watcher.on("change", (file: string) => {
    if (!file.endsWith(".md")) return

    const slug = mapFileToSlug(file)

    if (promiseQueue.length > 0) {
      const deferred = promiseQueue.splice(0, 1)[0]
      deferred.resolve(slug)
      return
    }

    fileQueue.push(slug)
  })

  return {
    get open() {
      return open
    },
    next: async () => {
      if (fileQueue.length > 0) {
        return Promise.resolve(fileQueue.splice(0, 1)[0])
      }

      const deferred = new Deferred<SlugInfo>()
      promiseQueue.push(deferred)
      return deferred
    },
    close: () => {
      watcher.close()
      open = false
      promiseQueue.forEach((p) => p.reject(null))
    },
  }
}

const mapFileToSlug = (file: string) => {
  const fullFileName = basename(file, ".md")
  const parsed = parse(fullFileName)
  const splitted = parsed.name.split("-")
  const name = splitted.slice(3)

  return {
    filePath: file,
    relativePath: relative(postsDir, file),
    slug: name.join("-"),
  }
}

export const getAllSlugs = async (): Promise<SlugInfo[]> => {
  const files = await getFiles(postsDir)
  return files.filter((file) => file.endsWith(".md")).map(mapFileToSlug)
}
