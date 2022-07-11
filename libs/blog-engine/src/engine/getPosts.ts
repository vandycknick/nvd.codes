import yaml, { JSON_SCHEMA } from "js-yaml"
import readingTime from "reading-time"
import { join, dirname } from "node:path"

import { PostMetadata } from "./models"
import type { ParsedPost, Post } from "./models"
import { createPlaceHolders } from "../images/createPlaceholders"
import { resolveImagePath } from "../images/resolveImagePath"

export const getPost = async (
  parsed: ParsedPost,
  directory: string,
): Promise<Post> => {
  const frontmatter = parsed.nodes.attributes.frontmatter
    ? yaml.load(parsed.nodes.attributes.frontmatter, { schema: JSON_SCHEMA })
    : {}

  const metadata = PostMetadata.parse(frontmatter)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { nodes: _, ...raw } = parsed

  const time = readingTime(raw.contents.toString("utf-8"))

  const coverAbsolutePath = join(dirname(parsed.filePath), metadata.cover)
  const cover = resolveImagePath(directory, coverAbsolutePath)
  const placeholders = await createPlaceHolders(coverAbsolutePath)

  return {
    ...metadata,
    cover,
    slug: raw.slug,
    filePath: raw.filePath,
    sha256: raw.sha256,
    readingTime: time.text,
    editUrl: "",
    placeholder: placeholders.base64,
  }
}
