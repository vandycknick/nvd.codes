import { Context } from "@azure/functions"

import { getServices } from "../../services/getServices"

type ResourceCdnGetCurrentCertificateInput = {
  profileName: string
  endpointName: string
  domainName: string
}

const resourceCdnGetCurrentCertificate = async (
  { log }: Context,
  {
    profileName,
    endpointName,
    domainName,
  }: ResourceCdnGetCurrentCertificateInput,
) => {
  log.info("Getting certificate for", profileName, endpointName, domainName)

  const { azure } = (await getServices()).unwrapUnsafe()

  const revision = (
    await azure.cdn.getCustomDomainCertificate(
      profileName,
      endpointName,
      domainName.replace(/\./g, "-"),
    )
  ).unwrapUnsafe()

  return revision
}

export default resourceCdnGetCurrentCertificate
