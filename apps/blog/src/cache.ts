import { RenderablePost } from "@nvd.codes/blog-engine"
import { join } from "node:path"
import { readFile, writeFile, mkdir } from "node:fs/promises"

export const getRenderablePostFromCache = async (
  slug: string,
  cachePath: string,
): Promise<RenderablePost | undefined> => {
  const filePath = join(cachePath, `${slug}.json`)

  try {
    const contents = await readFile(filePath)

    return RenderablePost.parse(
      JSON.parse(contents.toString("utf-8")),
    ) as RenderablePost
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException
    if (error.code === "ENOENT") {
      return undefined
    }

    throw err
  }
}

export const saveRenderablePostToCache = async (
  post: RenderablePost,
  cachePath: string,
): Promise<void> => {
  const filePath = join(cachePath, `${post.slug}.json`)

  await mkdir(cachePath, { recursive: true })
  await writeFile(filePath, JSON.stringify(post, null, 4))
}
