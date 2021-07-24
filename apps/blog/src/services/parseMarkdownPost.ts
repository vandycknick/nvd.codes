import { dirname, resolve, join, relative } from "path"
import matter from "gray-matter"
import { unified, Plugin } from "unified"
import remarkParse from "remark-parse"
import remarkSlug from "remark-slug"
import remarkStringify from "remark-stringify"
import { visit } from "unist-util-visit"
import readingTime from "reading-time"

import { createPlaceHolders } from "./parseCoverImage"

export type ParsedPost = {
  id: string
  title: string
  description: string
  date: Date
  draft: boolean
  categories: string[]
  cover: string
  placeholder: string
  placeholderCss: Record<string, string>
  readingTime: string
  editUrl: string
  contents: string
  images: string[]
}

type ImageNode = {
  type: "image"
  url: string
  title: string
  alt: string
}

const remarkImages: Plugin<
  [{ repoRootPath: string; postAbsoluteDirectory: string; images: string[] }]
> = (settings) => async (tree) => {
  const { repoRootPath, postAbsoluteDirectory, images } = settings
  const nodes: ImageNode[] = []
  visit(tree, "image", (node: ImageNode) => nodes.push(node))

  await Promise.all(
    nodes.map(async (node) => {
      const { url } = node
      const imagePath = resolve(postAbsoluteDirectory, url)
      const imageUrl = resolve("/", relative(repoRootPath, imagePath))

      images.push(imageUrl)
      node.url = imageUrl
    }),
  )

  return tree
}

export const parseMarkdownPost = async (
  post: Buffer,
  repositoryUrl: string,
  branch: string,
  postFilePath: string,
  repoRootPath: string,
): Promise<ParsedPost> => {
  const { data, content } = matter(post.toString("utf-8"))

  const images: string[] = []
  const postAbsoluteDirectory = dirname(join(repoRootPath, postFilePath))
  const pipeline = unified()
    .use(remarkParse)
    .use(remarkSlug)
    .use(remarkImages, {
      repoRootPath,
      postAbsoluteDirectory,
      images,
    })
    .use(remarkStringify)

  const contents = (await pipeline.process(content)).toString()
  const coverImagePath = resolve(postAbsoluteDirectory, data["cover"])
  const placeHolders = await createPlaceHolders(coverImagePath)

  const coverUrl = resolve("/", relative(repoRootPath, coverImagePath))

  const metadata = {
    id: data["id"],
    title: data["title"],
    description: data["description"],
    date: new Date(data["date"]),
    draft: !!data["draft"],
    categories: data["categories"],
    cover: coverUrl,
    placeholder: placeHolders.base64,
    placeholderCss: placeHolders.css,
    readingTime: readingTime(contents).text,
    editUrl: `${repositoryUrl}/edit/${branch}${resolve("/", postFilePath)}`,
  }

  return {
    ...metadata,
    contents,
    images,
  }
}
