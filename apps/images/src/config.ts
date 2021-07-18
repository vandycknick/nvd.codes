import type { LogLevel } from "bunyan"
import { getEnvVar, getEnvVarAsInt, memoize } from "@nvd.codes/utils"

export const getConfig = memoize(() => {
  return {
    bucketNamespace: getEnvVar("IMAGES_BUCKET_NAMESPACE"),
    bucketName: getEnvVar("IMAGES_BUCKET_NAME"),
    port: getEnvVarAsInt("PORT", 3000),
    logLevel: getEnvVar("LOG_LEVEL") as LogLevel,
    ociUser: getEnvVar("OCI_USER"),
    ociTenancy: getEnvVar("OCI_TENANCY"),
    ociFingerprint: getEnvVar("OCI_FINGERPRINT"),
    ociRegion: getEnvVar("OCI_REGION"),
    ociPrivateKey: getEnvVar("OCI_PRIVATE_KEY").replace(/\\n/g, "\n"),
  }
})
