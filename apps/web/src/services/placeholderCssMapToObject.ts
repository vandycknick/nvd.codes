import { Post } from "@nvd.codes/blog-proto"

export const placeholderCssMapToObject = (
  cssMap: Post.AsObject["placeholderCssMap"],
): Record<string, string> => {
  const cssRecord: Record<string, string> = {}

  for (const [key, value] of cssMap) {
    cssRecord[key] = value
  }
  return cssRecord
}
