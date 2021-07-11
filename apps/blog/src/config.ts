import { getEnvVar, getEnvVarAsInt, memoize } from "./utils"

export const getConfig = memoize(() => {
  return {
    bucketNamespace: getEnvVar("IMAGES_BUCKET_NAMESPACE"),
    bucketName: getEnvVar("IMAGES_BUCKET_NAME"),
    port: getEnvVarAsInt("PORT", 4000),
    dbType: getEnvVar("TYPEORM_CONNECTION") as "oracle",
    dbUser: getEnvVar("TYPEORM_USERNAME"),
    dbPassword: getEnvVar("TYPEORM_PASSWORD"),
    dbDriverConfig: getEnvVar("TYPEORM_DRIVER_EXTRA"),
  }
})
