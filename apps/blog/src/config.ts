import { Option } from "@nvd.codes/monad"
import { getEnvVar, getOptionalEnvVar } from "./utils"

export type AppConfig = {
  postsDirectory: string
  cacheDirectory: string
  address: string
  imagesRoot: string
}

export const getConfig = (): Option<AppConfig> =>
  Option.all(
    getEnvVar("POSTS_DIRECTORY"),
    getEnvVar("CACHE_DIRECTORY"),
    getOptionalEnvVar("ADDRESS", "localhost:8080"),
    getOptionalEnvVar("IMAGES_ROOT", "images"),
  ).map(([postsDirectory, cacheDirectory, address, imagesRoot]) => ({
    postsDirectory,
    cacheDirectory,
    address,
    imagesRoot,
  }))
