import { Context } from "@azure/functions"

import { getServices } from "../../services/getServices"

type ResourceCdnUpdateCertificateInput = {
  resource: {
    profileName: string
    endpointName: string
    domainName: string
  }
  certificateName: string
  revision: string
}

const resourceCdnUpdateCertificate = async (
  { log }: Context,
  { resource, certificateName, revision }: ResourceCdnUpdateCertificateInput,
) => {
  const cdnName = `${resource.profileName}/${resource.endpointName}/${resource.domainName}`
  log.info(`Updating certificate for ${cdnName} to ${revision}`)

  const { azure, settings } = (await getServices()).unwrapUnsafe()

  const updated = await azure.cdn.setCustomDomainCertificate(
    resource.profileName,
    resource.endpointName,
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
