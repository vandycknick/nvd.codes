import { readdir } from "node:fs/promises"
import { createReadStream } from "node:fs"
import { resolve, relative, extname } from "node:path"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import AWS from "aws-sdk"
import mime from "mime-types"

const getFiles = async (dir: string): Promise<string[]> => {
  const dirents = await readdir(dir, { withFileTypes: true })

  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name)
      return dirent.isDirectory() ? getFiles(res) : Promise.resolve([res])
    }),
  )
  return Array.prototype.concat(...files)
}

// eslint-disable-next-line no-console
const printf = (message: string) => console.log(message)

const main = async (args: string[]) => {
  const argv = await yargs(hideBin(args))
    .option("directory", {
      alias: "d",
      type: "string",
    })
    .option("bucket", {
      alias: "b",
      type: "string",
    })
    .parseAsync()

  const { directory, bucket } = argv

  if (directory === undefined || bucket === undefined) {
    throw new Error("--directory or --bucket should be set!")
  }

  const s3 = new AWS.S3()

  printf(`Uploading all files from ${directory} to ${bucket}.`)

  const files = await getFiles(
    directory.startsWith("/") ? directory : resolve(process.cwd(), directory),
  )
  let cnt = 0

  const uploads = files.map(async (filePath) => {
    const rel = relative(directory, filePath)
    let contentType = mime.contentType(extname(rel))

    if (contentType === false) {
      contentType = "text/plain; charset=utf-8'"
    }

    const response = await s3
      .upload({
        Key: rel,
        Bucket: bucket,
        Body: createReadStream(filePath),
        ContentType: contentType,
      })
      .promise()
    cnt++
    printf(
      `Uploaded ${rel} as ${contentType}, ${cnt}/${files.length} completed!`,
    )
    return response
  })

  await Promise.all(uploads)
  printf(`Uploaded ${files.length}/${files.length} files.`)
  printf("Done!")
}

main(process.argv)
