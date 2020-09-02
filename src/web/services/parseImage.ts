import { basename, join, dirname } from "path"
import { promises } from "fs"
import sharp from "sharp"
const { mkdir } = promises

const NEXT_BUILD_FOLDER = ".next"
const NEXT_ROOT_URL = "_next"

const parseImage = async (
  image: string,
  destination: string,
): Promise<string> => {
  const imageFileName = basename(image)
  const dropPath = join(destination, imageFileName)
  const dropLocation = join(process.cwd(), NEXT_BUILD_FOLDER, dropPath)

  await mkdir(dirname(dropLocation), { recursive: true })
  await sharp(image).resize(500).jpeg().toFile(dropLocation)

  return `/${join(NEXT_ROOT_URL, dropPath)}`
}

export default parseImage
