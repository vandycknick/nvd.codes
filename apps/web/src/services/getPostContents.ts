import { promises } from "fs"
import { dirname, join, resolve } from "path"
import matter from "gray-matter"
import unified, { Plugin } from "unified"
import remarkParse from "remark-parse"
import remarkSlug from "remark-slug"
import remarkStringify from "remark-stringify"
import visit from "unist-util-visit"

import { SlugInfo } from "./getAllSlugs"
import copyImage from "services/copyImage"

const { readFile } = promises
const IMAGES_DROP_LOCATION_ROOT = "static/images"

type ImageNode = {
  type: "image"
  url: string
  title: string
  alt: string
}

const remarkImages: Plugin<
  [{ sourcePath: string; destinationPath: string }]
> = (settings) => async (tree) => {
  const { sourcePath, destinationPath } = settings
  const nodes: ImageNode[] = []
  visit(tree, "image", (node: ImageNode) => nodes.push(node))

  await Promise.all(
    nodes.map(async (node) => {
      const { url } = node
      const imageFilePath = resolve(sourcePath, url)
      const updatedUrl = await copyImage(imageFilePath, destinationPath)
      node.url = updatedUrl
    }),
  )

  return tree
}

const getPostContents = async (
  slugInfo: SlugInfo,
): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>
  contents: string
}> => {
  const fileContents = await readFile(slugInfo.filePath, "utf-8")
  const { data, content } = matter(fileContents)

  const pipeline = unified()
    .use(remarkParse)
    .use(remarkSlug)
    .use(remarkImages, {
      sourcePath: dirname(slugInfo.filePath),
      destinationPath: join(IMAGES_DROP_LOCATION_ROOT, slugInfo.slug),
    })
    .use(remarkStringify)

  const contents = await pipeline.process(content)

  return {
    metadata: data,
    contents: contents.toString(),
  }
}

export { getPostContents }
