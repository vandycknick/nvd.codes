import { readFile } from "node:fs/promises"
import imageSize from "image-size"

export const getImageDimensions = async (imagePath: string) => {
  const contents = await readFile(imagePath)
  const dim = imageSize(contents)
  return {
    width: dim.width,
    height: dim.height,
  }
}
