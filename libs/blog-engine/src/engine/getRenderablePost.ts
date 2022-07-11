import Markdoc from "@markdoc/markdoc"

import { getParsedPost } from "./getParsedPost"
import { getPost } from "./getPosts"
import { getRawPost } from "./getRawPost"

import { RenderablePost } from "./models"
import { heading } from "../nodes/heading"
import { createImagePlaceHolderWorkaround, image } from "../nodes/image"
import { fence } from "../nodes/fence"

export const getRenderablePost = async (
  filePath: string,
  directory: string,
): Promise<RenderablePost> => {
  const raw = await getRawPost(filePath)
  const parsed = await getParsedPost(raw)
  const post = await getPost(parsed, directory)
  const nodes = await createImagePlaceHolderWorkaround(parsed.nodes, filePath)

  const renderTree = Markdoc.transform(nodes, {
    nodes: {
      heading,
      image,
      fence,
    },
    variables: {
      metadata: post,
    },
    settings: {
      postFilePath: filePath,
      postsDirectory: directory,
    },
  })

  return {
    ...post,
    // This needs to be here because NextJS is overly strict in dev mode: https://github.com/vercel/next.js/issues/11993
    // a simple toggle to turn this off would be great, but here we are.
    tree: JSON.parse(JSON.stringify(renderTree)),
  }
}
