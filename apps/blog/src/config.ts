import { getEnvVar, getEnvVarAsInt, memoize } from "./utils"

export const getConfig = memoize(() => {
  return {
    bucketNamespace: getEnvVar("IMAGES_BUCKET_NAMESPACE"),
    bucketName: getEnvVar("IMAGES_BUCKET_NAME"),
    port: getEnvVarAsInt("PORT", 3000),
    dbType: getEnvVar("TYPEORM_CONNECTION") as "oracle",
    dbUser: getEnvVar("TYPEORM_USERNAME"),
    dbPassword: getEnvVar("TYPEORM_PASSWORD"),
    dbDriverConfig: getEnvVar("TYPEORM_DRIVER_EXTRA"),
    ociUser: getEnvVar("OCI_USER"),
    ociTenancy: getEnvVar("OCI_TENANCY"),
    ociFingerprint: getEnvVar("OCI_FINGERPRINT"),
    ociRegion: getEnvVar("OCI_REGION"),
    ociPrivateKey: getEnvVar("OCI_PRIVATE_KEY").replace(/\\n/g, "\n"),
    webhookSecret: getEnvVar("WEBHOOK_SECRET"),
  }
})
