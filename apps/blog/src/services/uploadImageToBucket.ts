import { ObjectStorageClient, NodeFSBlob } from "oci-objectstorage"
import { Region, SimpleAuthenticationDetailsProvider } from "oci-common"
import { promises } from "fs"
import { join } from "path"
import { getConfig } from "../config"

const { stat } = promises

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

export const uploadImageToBucket = async (file: string, directory: string) => {
  const config = getConfig()
  const imageLocation = join(directory, file)
  const stats = await stat(imageLocation)
  const nodeFsBlob = new NodeFSBlob(imageLocation, stats.size)
  const objectData = await nodeFsBlob.getData()

  await client.putObject({
    namespaceName: config.bucketNamespace,
    bucketName: config.bucketName,
    putObjectBody: objectData,
    objectName: file,
    contentLength: stats.size,
    // cacheControl: ""
  })
}
