import Markdoc from "@markdoc/markdoc"

import type { ParsedPost, RawPost } from "./models"

export const getParsedPost = async (raw: RawPost): Promise<ParsedPost> => {
  const contents = raw.contents.toString("utf-8")
  const ast = Markdoc.parse(contents)

  return {
    ...raw,
    nodes: ast,
  }
}
