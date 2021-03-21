import { promises } from "fs"
import { dirname, join, resolve, relative } from "path"
import matter from "gray-matter"
import unified, { Plugin } from "unified"
import remarkParse from "remark-parse"
import remarkSlug from "remark-slug"
import remarkStringify from "remark-stringify"
import visit from "unist-util-visit"
import readingTime from "reading-time"

import { AppConfig } from "../config"
import { createPlaceHolders } from "./parseCoverImage"
import { createSlugFromFilePath } from "../slugs/createSlugFromFilePath"

const { mkdir, copyFile } = promises

export type ParsedPost = {
  metadata: {
    id: string
    title: string
    description: string
    date: string
    draft: boolean
    categories: string[]
    cover: string
    placeholder: string
    placeholderCss: Record<string, string>
    slug: string
    readingTime: string
    editUrl: string
  }
  contents: string
}

type ImageNode = {
  type: "image"
  url: string
  title: string
  alt: string
}

const copyImage = async (
  image: string,
  sourcePath: string,
  destinationPath: string,
  wwwroot: string,
) => {
  const imageSourcePath = resolve(sourcePath, image)
  const imageDestinationPath = resolve(destinationPath, image)

  await mkdir(dirname(imageDestinationPath), { recursive: true })
  await copyFile(imageSourcePath, imageDestinationPath)
  return `/${join(wwwroot, image)}`
}

const remarkImages: Plugin<
  [{ sourcePath: string; destinationPath: string; wwwroot: string }]
> = (settings) => async (tree) => {
  const { sourcePath, destinationPath, wwwroot } = settings
  const nodes: ImageNode[] = []
  visit(tree, "image", (node: ImageNode) => nodes.push(node))

  await Promise.all(
    nodes.map(async (node) => {
      const { url } = node
      node.url = await copyImage(url, sourcePath, destinationPath, wwwroot)
    }),
  )

  return tree
}

export const parseMarkdownPost = async (
  post: Buffer,
  postFilePath: string,
  config: AppConfig,
): Promise<ParsedPost> => {
  const { data, content } = matter(post.toString("utf-8"))

  const repoRelativePath = relative(process.cwd(), postFilePath)

  const sourcePath = dirname(postFilePath)
  const destinationPath = join(config.cacheDirectory, config.imagesRoot)
  const wwwroot = config.imagesRoot

  const pipeline = unified()
    .use(remarkParse)
    .use(remarkSlug)
    .use(remarkImages, {
      sourcePath,
      destinationPath,
      wwwroot,
    })
    .use(remarkStringify)

  const contents = (await pipeline.process(content)).toString()
  const placeHolders = await createPlaceHolders(
    resolve(sourcePath, data["cover"]),
  )

  const coverUrl = await copyImage(
    data["cover"],
    sourcePath,
    destinationPath,
    wwwroot,
  )

  const metadata = {
    id: data["id"],
    title: data["title"],
    description: data["description"],
    date: new Date(data["date"]).toISOString(),
    draft: !!data["draft"],
    categories: data["categories"],
    cover: coverUrl,
    placeholder: placeHolders.base64,
    placeholderCss: placeHolders.css,
    readingTime: readingTime(contents).text,
    slug: createSlugFromFilePath(postFilePath, config.postsDirectory).slug,
    editUrl: `https://github.com/nickvdyck/nvd.codes/edit/main/${repoRelativePath}`,
  }

  return {
    metadata,
    contents,
  }
}
