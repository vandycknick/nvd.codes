import { RenderableTreeNode, Node } from "@markdoc/markdoc"

import { z } from "zod"

export const RawPost = z.object({
  slug: z.string(),
  filePath: z.string(),
  contents: z.instanceof(Buffer),
  sha256: z.string(),
})

export type RawPost = z.infer<typeof RawPost>

export const ParsedPost = z
  .object({
    // nodes: z.instanceof(Node),
    nodes: z.any(),
  })
  .merge(RawPost)

export type ParsedPost = { nodes: Node } & Omit<
  z.infer<typeof ParsedPost>,
  "nodes"
>

export const PostMetadata = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  draft: z.boolean().default(false),
  categories: z.array(z.string()),
  cover: z.string(),
})

export type PostMetadata = z.infer<typeof PostMetadata>

export const Post = z
  .object({
    placeholder: z.string(),
    readingTime: z.string(),
    editUrl: z.string(),
  })
  .merge(PostMetadata)
  .merge(RawPost.omit({ contents: true }))

export type Post = z.infer<typeof Post>

export const RenderablePost = z
  .object({
    tree: z.any(),
    // tree: z.union([RenderableTreeNode, z.array(RenderableTreeNode)]),
  })
  .merge(Post)

export type RenderablePost = {
  tree: RenderableTreeNode | RenderableTreeNode[]
} & Omit<z.infer<typeof RenderablePost>, "tree">
