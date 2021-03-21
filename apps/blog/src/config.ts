import { Option } from "@nvd.codes/monad"
import { getEnvVar, getOptionalEnvVar } from "./utils"

export type AppConfig = {
  postsDirectory: string
  cacheDirectory: string
  endpoint: string
  imagesRoot: string
}

export const getConfig = (): Option<AppConfig> =>
  Option.all(
    getEnvVar("BLOG_POSTS_DIRECTORY"),
    getEnvVar("BLOG_CACHE_DIRECTORY"),
    getEnvVar("BLOG_API_ENDPOINT"),
    getOptionalEnvVar("IMAGES_ROOT", "images"),
  ).map(([postsDirectory, cacheDirectory, endpoint, imagesRoot]) => ({
    postsDirectory,
    cacheDirectory,
    endpoint,
    imagesRoot,
  }))
