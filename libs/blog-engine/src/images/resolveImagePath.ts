import { join, relative } from "node:path"

export const resolveImagePath = (
  postsDirectory: string,
  imageAbsolutePath: string,
) => {
  const root = join(postsDirectory, "..")
  return join("/", relative(root, imageAbsolutePath))
}
