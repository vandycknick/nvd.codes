import { resolve } from "path"
import { Plugin } from "unified"
import { selectAll } from "hast-util-select"

import copyImage from "services/parseImage"

type RehypeImageOptimizerSettings = {
  rootpath: string
  destination: string
}

const rehypeImageOptimizer: Plugin<[RehypeImageOptimizerSettings]> = (
  settings,
) => {
  const { rootpath, destination } = settings

  return async (rootNode, file, next) => {
    const images = selectAll("img", rootNode)

    const promises = images.map(async (image) => {
      const src = image.properties["src"]
      const imageFilePath = resolve(rootpath, src)
      const updatedSrc = await copyImage(imageFilePath, destination)
      if (process.env.NODE_ENV === "production") {
        image.properties[
          "src"
        ] = `https://images.nvd.codes${updatedSrc}?w=750&q=75`
      } else {
        image.properties["src"] = `/_next/image/?url=${updatedSrc}&w=750&q=75`
      }
    })

    await Promise.all(promises)

    next?.(null, rootNode, file)
  }
}

export default rehypeImageOptimizer
