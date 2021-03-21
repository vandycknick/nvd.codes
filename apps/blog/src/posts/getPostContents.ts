import { promises } from "fs"
import { createHash } from "crypto"

const { readFile } = promises

type PostContent = {
  contents: Buffer
  sha256: string
}

export const getPostContents = async (
  filePath: string,
): Promise<PostContent> => {
  const contents = await readFile(filePath)
  const hash = createHash("sha256").update(contents)

  return {
    contents,
    sha256: hash.digest("hex"),
  }
}
