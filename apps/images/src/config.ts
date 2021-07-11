import type { LogLevel } from "bunyan"

const getRequiredEnv = (key: string) => {
  const value = process.env[key]

  if (value == undefined)
    throw new Error(`Required environment variable '${key}' is not defined!`)

  return value
}

export const getConfig = () => {
  const port = getRequiredEnv("PORT")
  return {
    bucketNamespace: getRequiredEnv("IMAGES_BUCKET_NAMESPACE"),
    bucketName: getRequiredEnv("IMAGES_BUCKET_NAME"),
    port: parseInt(port, 10),
    logLevel: getRequiredEnv("LOG_LEVEL") as LogLevel,
  }
}
