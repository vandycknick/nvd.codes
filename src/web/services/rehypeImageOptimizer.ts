import { resolve } from "path"
import { Plugin } from "unified"
import { selectAll } from "hast-util-select"

import parseImage from "services/parseImage"

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
      const updatedSrc = await parseImage(imageFilePath, destination)

      image.properties["src"] = updatedSrc
    })

    await Promise.all(promises)

    next?.(null, rootNode, file)
  }
}

export default rehypeImageOptimizer
