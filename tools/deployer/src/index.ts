import { readdir } from "node:fs/promises"
import { createReadStream } from "node:fs"
import { resolve, relative, extname, join } from "node:path"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { Upload } from "@aws-sdk/lib-storage"
import { S3 } from "@aws-sdk/client-s3"
import {
  CloudFrontClient,
  ListDistributionsCommand,
  GetDistributionConfigCommand,
  UpdateDistributionCommand,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront"
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

async function getDistribution(client: CloudFrontClient, domainName: string) {
  const listCommand = new ListDistributionsCommand({})
  const listResult = await client.send(listCommand)

  const matchingDist = listResult.DistributionList?.Items?.find((dist) =>
    dist.Aliases?.Items?.includes(domainName),
  )

  if (!matchingDist || !matchingDist.Id) {
    throw new Error(`No distribution found with domain name: ${domainName}`)
  }

  const distId = matchingDist.Id

  printf(`Found distribution ID: ${distId}`)
  return distId
}

async function updateOriginPathByDomain(
  client: CloudFrontClient,
  distribution: string,
  newOriginPath: string,
) {
  const getConfigCommand = new GetDistributionConfigCommand({
    Id: distribution,
  })
  const configResult = await client.send(getConfigCommand)

  const distConfig = configResult.DistributionConfig
  const etag = configResult.ETag

  if (
    distConfig == undefined ||
    distConfig.Origins == undefined ||
    distConfig.Origins.Items == undefined ||
    distConfig.Origins.Items.length === 0
  ) {
    throw new Error("❌ No origins found in the distribution.")
  }

  distConfig.Origins.Items[0].OriginPath = newOriginPath

  const updateCommand = new UpdateDistributionCommand({
    Id: distribution,
    IfMatch: etag,
    DistributionConfig: distConfig,
  })

  const updateResult = await client.send(updateCommand)

  printf(`✅ Successfully updated origin path to "${newOriginPath}"`)
  return updateResult
}

export async function invalidateCache(
  client: CloudFrontClient,
  distributionId: string,
  paths: string[] = ["/*"],
): Promise<void> {
  const command = new CreateInvalidationCommand({
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: `${Date.now()}`,
      Paths: {
        Quantity: paths.length,
        Items: paths,
      },
    },
  })

  const result = await client.send(command)
  printf(`🧹 Cach invalidation created: ID ${result.Invalidation?.Id}`)
}

const main = async (args: string[]) => {
  const argv = await yargs(hideBin(args))
    .option("domain", { type: "string", demandOption: true })
    .option("directory", {
      alias: "d",
      type: "string",
      demandOption: true,
    })
    .option("prefix", {
      alias: "p",
      type: "string",
      default: "",
    })
    .parseAsync()

  const { directory, prefix, domain } = argv
  const bucket = domain

  const s3 = new S3()
  const cf = new CloudFrontClient()

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

    const response = await new Upload({
      client: s3,
      params: {
        Key: join(prefix, rel),
        Bucket: bucket,
        Body: createReadStream(filePath),
        ContentType: contentType,
      },
    }).done()
    cnt++
    printf(
      `Uploaded ${join(prefix, rel)} as ${contentType}, ${cnt}/${files.length} completed!`,
    )
    return response
  })

  await Promise.all(uploads)
  printf(`✅ Uploaded ${files.length}/${files.length} files.`)

  const distribution = await getDistribution(cf, domain)

  await updateOriginPathByDomain(
    cf,
    distribution,
    prefix == "" ? "/" : `/${prefix}`,
  )

  await invalidateCache(cf, distribution)

  printf("🎉 Done!")
}

main(process.argv)
