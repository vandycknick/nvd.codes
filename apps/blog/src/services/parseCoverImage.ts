import { promises } from "fs"
import { getBase64 } from "@plaiceholder/base64"
import { getPixelsCSS } from "@plaiceholder/css"

const { readFile } = promises

export const createPlaceHolders = async (
  imageFilePath: string,
): Promise<{
  base64: string
  css: Record<string, string>
}> => {
  const image = await readFile(imageFilePath)

  const base64 = await getBase64(image)
  const css = await getPixelsCSS(image)

  return {
    base64,
    css,
  }
}
