import { join, resolve } from "path"

import { listFilesRecursive } from "../files/listFilesRecursive"
import { createSlugFromFilePath } from "./createSlugFromFilePath"
import { SlugInfo } from "./SlugInfo"

const DRAFTS_DIRECTORY = "drafts"

export const getAllSlugs = async (source: string): Promise<SlugInfo[]> => {
  const files = await listFilesRecursive(source)
  return files
    .filter((file) => {
      const drafts = resolve(join(source, DRAFTS_DIRECTORY))
      return !file.startsWith(drafts)
    })
    .filter((file) => file.endsWith(".md"))
    .map((file) => createSlugFromFilePath(file, source))
}
