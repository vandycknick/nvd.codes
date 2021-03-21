import { basename, parse, relative } from "path"

import { SlugInfo } from "./SlugInfo"

export const createSlugFromFilePath = (
  filePath: string,
  rootDir: string,
): SlugInfo => {
  const fullFileName = basename(filePath, ".md")
  const parsed = parse(fullFileName)
  const splitted = parsed.name.split("-")
  const name = splitted.slice(3)

  return {
    filePath,
    relativePath: relative(rootDir, rootDir),
    slug: name.join("-"),
  }
}
