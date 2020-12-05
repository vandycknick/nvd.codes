import sharp from "sharp"
import {
  HttpResponse,
  notFound,
  notAllowed,
  badRequest,
  imageResult,
} from "@nvd.codes/http"
import { Context } from "@azure/functions"
import { mediaType } from "@hapi/accept"
import { extname } from "path"

import { getConfig } from "../config"
import { downloadFile } from "./downloadFile"
import { byteSize } from "../utils"

const ONE_MINUTE = 60
const ONE_HOUR = 60 * ONE_MINUTE
const MAX_AGE = 31536000

const WEBP = "image/webp"
const PNG = "image/png"
const JPEG = "image/jpeg"
const MODERN_TYPES = [/* AVIF, */ WEBP]
const EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp"]

const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384]
const sizes = [...deviceSizes, ...imageSizes]

const quality = 70

const getSupportedMimeType = (
  header = "",
  preferences: string[] = [],
): string => {
  const mimeType = mediaType(header, preferences)
  return header.includes(mimeType) ? mimeType : ""
}

const imageOptimizer = async function (
  context: Context,
): Promise<HttpResponse> {
  const { req, log } = context

  log.verbose("Starting function ImageOptimizer.")

  if (req === undefined) {
    return notFound()
  }

  if (req.method !== "GET") {
    return notAllowed()
  }

  const { imagePath } = req.params
  const { w } = req.query
  const mimeType = getSupportedMimeType(req.headers["accept"], MODERN_TYPES)

  if (imagePath == undefined || imagePath === "") {
    return notFound()
  }

  if (!EXTENSIONS.includes(extname(imagePath))) {
    return notFound()
  }

  if (!w) {
    return badRequest("'w' parameter (width) is required")
  }

  const width = parseInt(w, 10)

  if (!width || isNaN(width)) {
    return badRequest("'w' parameter (width) must be a number greater than 0")
  }

  if (!sizes.includes(width)) {
    return badRequest(`'w' parameter (width) of ${width} is not allowed`)
  }

  const config = getConfig()
  const filePath = `_next/static/images/${imagePath}`

  try {
    log.info(`Downloading file ${filePath}`)
    const file = await downloadFile(config.IMAGES_CONTAINER, filePath)

    if (file == undefined) {
      return notFound()
    }

    log.info(`Downloaded ${byteSize(file.contents.byteLength)}.`)

    const transformer = sharp(file.contents)
    transformer.rotate() // auto rotate based on EXIF data

    const { width: metaWidth } = await transformer.metadata()

    if (metaWidth && metaWidth > width) {
      transformer.resize(width)
    }

    let contentType: string

    if (mimeType) {
      contentType = mimeType
    } else if (file.contentType) {
      contentType = file.contentType
    } else {
      contentType = JPEG
    }

    if (contentType === WEBP) {
      transformer.webp({ quality })
    } else if (contentType === PNG) {
      transformer.png({ quality })
    } else if (contentType === JPEG) {
      transformer.jpeg({ quality })
    }

    const optimized = await transformer.toBuffer()
    return imageResult(
      optimized,
      contentType,
      `public, max-age=${ONE_HOUR}, s-maxage=${MAX_AGE}`,
    )
  } catch (ex) {
    log.error(ex)
    return notFound()
  }
}

export default imageOptimizer
