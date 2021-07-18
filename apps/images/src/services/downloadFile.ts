import { Region, SimpleAuthenticationDetailsProvider } from "oci-common"
import { ObjectStorageClient } from "oci-objectstorage"

import { getConfig } from "../config"

interface File {
  contentType?: string
  contents: Buffer
}

const readStream = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const data: Uint8Array[] = []

    stream.on("data", (chunk) => {
      data.push(chunk)
    })
    stream.on("end", () => {
      resolve(Buffer.concat(data))
    })
    stream.on("error", (error) => reject(error))
  })
}

const config = getConfig()

const provider = new SimpleAuthenticationDetailsProvider(
  config.ociTenancy,
  config.ociUser,
  config.ociFingerprint,
  config.ociPrivateKey,
  null,
  Region.fromRegionId(config.ociRegion),
)
const client = new ObjectStorageClient({
  authenticationDetailsProvider: provider,
})

export const downloadFile = async (
  filePath: string,
): Promise<File | undefined> => {
  const config = getConfig()
  const response = await client.getObject({
    bucketName: config.bucketName,
    namespaceName: config.bucketNamespace,
    objectName: filePath,
  })

  if (response.value == null) return undefined

  const stream = response.value as NodeJS.ReadableStream

  const contents = await readStream(stream)

  return {
    contentType: response.contentType,
    contents,
  }
}
