import { join, dirname } from "path"
import readingTime from "reading-time"
import { Post } from "@nvd.codes/core"
import fs from "fs"
import { promisify } from "util"

import { getAllSlugs, SlugInfo } from "services/getAllSlugs"
import copyImage from "services/copyImage"
import { getPostContents } from "./getPostContents"

const IMAGES_DROP_LOCATION_ROOT = "static/images"

const parseCoverImage = async (
  coverPath: string,
  slugInfo: SlugInfo,
): Promise<{
  cover: string
  placeholder: string
  placeholderCss: Record<string, string>
}> => {
  const coverFilePath = join(dirname(slugInfo.filePath), coverPath)
  const destination = join(IMAGES_DROP_LOCATION_ROOT, slugInfo.slug)
  const cover = await copyImage(coverFilePath, destination)
  let base64 = ""
  let css = {}

  // TODO: Fix this little hack
  if (process.env["NODE_ENV"] !== "production") {
    const image = await promisify(fs.readFile)(coverFilePath)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getBase64 } = require("@plaiceholder/base64")
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getPixelsCSS } = require("@plaiceholder/css")
    base64 = await getBase64(image)
    css = await getPixelsCSS(image)
  }

  return {
    cover,
    placeholderCss: css,
    placeholder: base64,
  }
}

const createPost = async (slugInfo: SlugInfo): Promise<Post> => {
  const { metadata, contents } = await getPostContents(slugInfo)

  const image =
    metadata["cover"] != null
      ? await parseCoverImage(metadata["cover"], slugInfo)
      : null

  return {
    id: metadata["id"],
    title: metadata["title"],
    description: metadata["description"],
    date: new Date(metadata["date"]).toISOString(),
    draft: !!metadata["draft"],
    categories: metadata["categories"],
    cover: image?.cover,
    placeholderCss: image?.placeholderCss,
    placeholder: image?.placeholder,
    content: contents,
    readingTime: readingTime(contents).text,
    slug: slugInfo.slug,
    editUrl: `https://github.com/nickvdyck/nvd.codes/edit/main/_posts/${slugInfo.relativePath}`,
  }
}

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const slugs = await getAllSlugs()
  const slugInfo = slugs.find((info) => info.slug === slug)

  if (slugInfo == null) {
    throw new Error(`Slug: '${slug}' was not found`)
  }
  const post = await createPost(slugInfo)
  return post
}
