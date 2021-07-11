import { ObjectStorageClient, NodeFSBlob } from "oci-objectstorage"
import { ConfigFileAuthenticationDetailsProvider } from "oci-common"
import { promises } from "fs"
import { join } from "path"
import { getConfig } from "../config"

const { stat } = promises

const provider = new ConfigFileAuthenticationDetailsProvider()
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
