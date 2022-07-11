import { basename, parse } from "node:path"
import { readFile } from "node:fs/promises"
import { createHash } from "crypto"

import type { RawPost } from "./models"

const createSlugFromFilePath = (filePath: string): string => {
  const fullFileName = basename(filePath, ".md")
  const parsed = parse(fullFileName)
  const splitted = parsed.name.split("-")
  const name = splitted.slice(3)

  return name.join("-")
}

export const getRawPost = async (filePath: string): Promise<RawPost> => {
  const contents = await readFile(filePath)
  const hash = createHash("sha256").update(contents)
  const slug = createSlugFromFilePath(filePath)

  return {
    contents,
    sha256: hash.digest("hex"),
    filePath,
    slug,
  }
}
