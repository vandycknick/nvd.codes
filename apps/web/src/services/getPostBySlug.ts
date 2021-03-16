import { join, dirname } from "path"
import readingTime from "reading-time"
import { Post } from "@nvd.codes/core"
import fs from "fs"
import { promisify } from "util"
import { getPixelsCSS, PixelsCSS } from "@plaiceholder/css"

import { getAllSlugs, SlugInfo } from "services/getAllSlugs"
import copyImage from "services/copyImage"
import { getPostContents } from "./getPostContents"

const IMAGES_DROP_LOCATION_ROOT = "static/images"

const parseCoverImage = async (
  coverPath: string,
  slugInfo: SlugInfo,
): Promise<{ cover: string; placeholderCss: PixelsCSS }> => {
  const coverFilePath = join(dirname(slugInfo.filePath), coverPath)
  const destination = join(IMAGES_DROP_LOCATION_ROOT, slugInfo.slug)
  const cover = await copyImage(coverFilePath, destination)
  const image = await promisify(fs.readFile)(coverFilePath)
  const css = await getPixelsCSS(image)
  return {
    cover,
    placeholderCss: css,
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
    cover: image?.cover ?? null,
    placeholderCss: image?.placeholderCss ?? null,
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
