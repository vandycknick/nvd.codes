import { readFile } from "node:fs/promises"
import { getBase64 } from "@plaiceholder/base64"

export const createPlaceHolders = async (
  imageFilePath: string,
): Promise<{
  base64: string
  // css: Record<string, string>
}> => {
  const image = await readFile(imageFilePath)
  const base64 = await getBase64(image)

  return {
    base64,
  }
}
