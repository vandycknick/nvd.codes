import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob"
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

const getBlockBlobClient = (
  container: string,
  filePath: string,
): BlockBlobClient => {
  const config = getConfig()
  const blobService = BlobServiceClient.fromConnectionString(
    config.AZURE_STORAGE_CONNECTION_STRING,
  )
  const containerClient = blobService.getContainerClient(container)
  const blockBlobClient = containerClient.getBlockBlobClient(filePath)
  return blockBlobClient
}

export const downloadFile = async (
  container: string,
  filePath: string,
): Promise<File | undefined> => {
  const blockBlobClient = getBlockBlobClient(container, filePath)
  const file = await blockBlobClient.download(0)

  if (file == undefined || file.readableStreamBody == undefined) {
    return undefined
  }

  const contents = await readStream(file.readableStreamBody)

  return {
    contentType: file.contentType,
    contents,
  }
}
