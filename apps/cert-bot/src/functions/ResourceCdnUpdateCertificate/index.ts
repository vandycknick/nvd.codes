import { Context } from "@azure/functions"

import { getServices } from "../../services/getServices"
import { parseAzureResourceId } from "../../utils"

type ResourceCdnUpdateCertificateInput = {
  resource: {
    resourceId: string
    domainName: string
  }
  certificateName: string
  revision: string
}

const resourceCdnUpdateCertificate = async (
  { log }: Context,
  { resource, certificateName, revision }: ResourceCdnUpdateCertificateInput,
) => {
  const parsed = parseAzureResourceId(resource.resourceId)

  if (parsed.isErr()) {
    const msg = "Invalid subject, can't be parsed as an azure resource id"
    log.error(msg)
    return false
  }
  const [, profileName, , endpointName] = parsed.unwrap().uri.split("/")

  const cdnName = `${profileName}/${endpointName}/${resource.domainName}`
  log.info(`Updating certificate for ${cdnName} to ${revision}`)

  const { azure, settings } = (await getServices()).unwrapUnsafe()

  const updated = await azure.cdn.setCustomDomainCertificate(
    profileName,
    endpointName,
    resource.domainName.replace(/\./g, "-"),
    settings.azureKeyVaultName,
    certificateName,
    revision,
  )

  if (updated.isErr()) {
    log.error(
      `Failed updating certificate for CDN ${cdnName}`,
      updated.unwrapErr(),
    )
  }

  return updated.isOk()
}

export default resourceCdnUpdateCertificate
