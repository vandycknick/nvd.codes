import { promises } from "fs"
import { relative, join } from "path"
import { Post } from "@nvd.codes/blog-proto"
import { createHash } from "crypto"

import { AppConfig } from "../config"
import { getPostContents } from "./getPostContents"
import { ParsedPost, parseMarkdownPost } from "./parseMarkdownPost"

const { readFile, writeFile } = promises

const getCacheId = (path: string): string => {
  const hash = createHash("sha256").update(path)
  return hash.digest("hex")
}

type PostCache = {
  post: ParsedPost
  sha256: string
}

export const getPost = async (
  filePath: string,
  config: AppConfig,
): Promise<Post> => {
  const markdown = await getPostContents(filePath)

  const path = relative(join(process.cwd(), config.postsDirectory), filePath)
  const cacheId = getCacheId(path)
  const cachePath = join(process.cwd(), config.cacheDirectory, cacheId)

  let parsed: ParsedPost | undefined = undefined

  try {
    const cache = await readFile(cachePath, "utf8")
    const cachedPost = JSON.parse(cache) as PostCache

    if (cachedPost.sha256 === markdown.sha256) {
      parsed = cachedPost.post
    }
  } catch {
    //noop
  }

  if (parsed === undefined) {
    parsed = await parseMarkdownPost(markdown.contents, filePath, config)
    await writeFile(
      cachePath,
      JSON.stringify({
        post: parsed,
        sha256: markdown.sha256,
      }),
      "utf8",
    )
  }

  const post = new Post()
    .setId(parsed.metadata.id)
    .setTitle(parsed.metadata.title)
    .setDescription(parsed.metadata.description)
    .setDate(parsed.metadata.date)
    .setDraft(parsed.metadata.draft)
    .setCategoriesList(parsed.metadata.categories)
    .setCover(parsed.metadata.cover)
    .setPlaceholder(parsed.metadata.placeholder)
    .setReadingTime(parsed.metadata.readingTime)
    .setEditUrl(parsed.metadata.editUrl)
    .setContent(parsed.contents)
    .setSlug(parsed.metadata.slug)

  for (const [key, value] of Object.entries(parsed.metadata.placeholderCss)) {
    post.getPlaceholderCssMap().set(key, value)
  }

  return post
}
