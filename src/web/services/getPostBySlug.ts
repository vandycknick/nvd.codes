import { promises } from "fs"
import { join, basename, dirname } from "path"
import matter from "gray-matter"
import readingTime from "reading-time"
import sharp from "sharp"
import { Post } from "@nvd.codes/domain"
const { readFile, mkdir } = promises

import { getAllSlugs, SlugInfo } from "services/getAllSlugs"
import markdownToHtml from "services/markdownToHtml"

const parseCoverImage = async (
  cover: string,
  slugInfo: SlugInfo,
): Promise<string> => {
  const coverFilePath = join(dirname(slugInfo.filePath), cover)
  const coverFileName = basename(coverFilePath)
  const dropLocation = join(
    process.cwd(),
    ".next",
    "static",
    "images",
    slugInfo.slug,
    coverFileName,
  )

  await mkdir(dirname(dropLocation), { recursive: true })
  await sharp(coverFilePath).resize(500).jpeg().toFile(dropLocation)
  return `/_next/static/images/${slugInfo.slug}/${coverFileName}`
}

const createPost = async (slugInfo: SlugInfo): Promise<Post> => {
  const fileContents = await readFile(slugInfo.filePath, "utf-8")
  const { data, content } = matter(fileContents)
  const html = await markdownToHtml(content)

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
    editUrl: `https://github.com/nickvdyck/nvd.codes/edit/master/content/posts/${slugInfo.relativePath}`,
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
