import { resolve } from "node:path"

import { getAllMarkdownFiles } from "./engine/getAllMarkdownFiles"
import { getParsedPost } from "./engine/getParsedPost"
import { getPost } from "./engine/getPosts"
import { getRawPost } from "./engine/getRawPost"
import { getRenderablePost } from "./engine/getRenderablePost"

export { Post, RenderablePost } from "./engine/models"

type BlogEngineOptions = {
  directory: string
  ignoreDirs: string[]
}

const getAllPosts = async (directory: string, ignoreDirs: string[]) => {
  const files = await getAllMarkdownFiles(directory, ignoreDirs)
  const posts = await Promise.all(
    files
      .map((file) => getRawPost(file))
      .map(async (rawPromise) => {
        const raw = await rawPromise
        return getParsedPost(raw)
      })
      .map(async (parsedPromise) => {
        const parsed = await parsedPromise
        return getPost(parsed, directory)
      }),
  )

  return posts
}

export const createBlogEngine = ({
  directory,
  ignoreDirs,
}: BlogEngineOptions) => {
  const absolutePath = resolve(directory)
  return {
    getAllPosts: () => getAllPosts(absolutePath, ignoreDirs),
    getRenderablePost: (filePath: string) =>
      getRenderablePost(filePath, absolutePath),
  }
}
