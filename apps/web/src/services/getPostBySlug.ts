import { promises } from "fs"
import { join, dirname } from "path"
import matter from "gray-matter"
import readingTime from "reading-time"
import { Post } from "@nvd.codes/core"
const { readFile } = promises

import { getAllSlugs, SlugInfo } from "services/getAllSlugs"
import markdownToHtml from "services/markdownToHtml"
import copyImage from "services/parseImage"

const IMAGES_DROP_LOCATION_ROOT = "static/images"

const parseCoverImage = async (
  cover: string,
  slugInfo: SlugInfo,
): Promise<string> => {
  const coverFilePath = join(dirname(slugInfo.filePath), cover)
  const destination = join(IMAGES_DROP_LOCATION_ROOT, slugInfo.slug)
  return copyImage(coverFilePath, destination)
}

const createPost = async (slugInfo: SlugInfo): Promise<Post> => {
  const fileContents = await readFile(slugInfo.filePath, "utf-8")
  const { data, content } = matter(fileContents)
  const html = await markdownToHtml(content, {
    imagesRootPath: dirname(slugInfo.filePath),
    imagesDestinationPath: join(IMAGES_DROP_LOCATION_ROOT, slugInfo.slug),
  })

  const cover =
    data["cover"] != null
      ? await parseCoverImage(data["cover"], slugInfo)
      : null

  return {
    id: data["id"],
    title: data["title"],
    description: data["description"],
    date: new Date(data["date"]).toISOString(),
    draft: !!data["draft"],
    categories: data["categories"],
    cover,
    content: html,
    readingTime: readingTime(content).text,
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
