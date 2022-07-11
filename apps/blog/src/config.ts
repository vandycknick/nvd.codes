import { getEnvVar, getEnvVarAsInt, memoize } from "@nvd.codes/utils"

export const getConfig = memoize(() => ({
  port: getEnvVarAsInt("PORT", 4000),
  postsDirectory: getEnvVar("BLOG_POSTS_DIRECTORY"),
  postsIgnoreDirs: getEnvVar("BLOG_POSTS_IGNORE_DIRS").split(","),
  cachePath: ".tmp",
}))
