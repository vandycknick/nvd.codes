import { basename, join, dirname } from "path"
import { promises } from "fs"
const { mkdir, copyFile } = promises

const NEXT_BUILD_FOLDER = ".next"
const NEXT_ROOT_URL = "_next"

const copyImage = async (
  image: string,
  destination: string,
): Promise<string> => {
  const imageFileName = basename(image)
  const dropPath = join(destination, imageFileName)
  const dropLocation = join(process.cwd(), NEXT_BUILD_FOLDER, dropPath)

  await mkdir(dirname(dropLocation), { recursive: true })
  await copyFile(image, dropLocation)

  return `/${join(NEXT_ROOT_URL, dropPath)}`
}

export default copyImage
