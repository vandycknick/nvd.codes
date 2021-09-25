import { join } from "path"
import { promises } from "fs"
import { createHash } from "crypto"
import imageSize from "image-size"

import { ImageEntity } from "../entity/Image"
import { createPlaceHolders } from "./parseCoverImage"

const { readFile } = promises

export const parseImage = async (path: string, directory: string) => {
  const contents = await readFile(join(directory, path))
  const hash = createHash("sha256").update(contents)
  const sha256 = hash.digest("hex")
  const placeHolders = await createPlaceHolders(join(directory, path))
  const dimensions = imageSize(contents)

  if (dimensions.width === undefined || dimensions.height == undefined) {
    throw new Error(`Image dimensions for ${path}, can't be read from image.`)
  }

  return new ImageEntity(
    path,
    dimensions.width,
    dimensions.height,
    sha256,
    placeHolders.base64,
  )
}
