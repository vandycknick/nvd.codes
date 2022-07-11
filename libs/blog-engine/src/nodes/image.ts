import { Tag, Schema, Node } from "@markdoc/markdoc"
import { join, dirname } from "node:path"
import { getImageDimensions } from "../images/getImageDimensions"
import { createPlaceHolders } from "../images/createPlaceholders"
import { resolveImagePath } from "../images/resolveImagePath"

export const createImagePlaceHolderWorkaround = async (
  ast: Node,
  postFilePath: string,
) => {
  for (const node of ast.walk()) {
    if (node.type === "image") {
      const { attributes } = node

      const imageAbsolutePath = join(dirname(postFilePath), attributes.src)
      const placeholders = await createPlaceHolders(imageAbsolutePath)
      const dimensions = await getImageDimensions(imageAbsolutePath)

      node.attributes.placeholder = placeholders.base64
      node.attributes.width = dimensions.width
      node.attributes.height = dimensions.height
    }
  }

  return ast
}

export const image: Schema = {
  attributes: {
    src: { type: String, required: true },
    alt: { type: String },
    title: { type: String },
    placeholder: { type: String },
    width: { type: Number },
    height: { type: Number },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config)
    const children = node.transformChildren(config)
    const { settings } = config as any

    const imageAbsolutePath = join(
      dirname(settings.postFilePath),
      attributes.src,
    )
    const src = resolveImagePath(settings.postsDirectory, imageAbsolutePath)
    return new Tag("Image", { ...attributes, src }, children)
  },
}
