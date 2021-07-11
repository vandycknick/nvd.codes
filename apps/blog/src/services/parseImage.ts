import { join } from "path"
import { promises } from "fs"
import { createHash } from "crypto"

import { ImageEntity } from "../entity/Image"
import { createPlaceHolders } from "./parseCoverImage"

const { readFile } = promises

export const parseImage = async (path: string, directory: string) => {
  const contents = await readFile(join(directory, path))
  const hash = createHash("sha256").update(contents)
  const sha256 = hash.digest("hex")
  const placeHolders = await createPlaceHolders(join(directory, path))

  return new ImageEntity(path, sha256, placeHolders.base64)
}
