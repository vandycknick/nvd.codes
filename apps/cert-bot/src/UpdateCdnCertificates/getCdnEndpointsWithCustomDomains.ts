import { AzureApi } from "../api/azure"

export const getCdnEndpointsWithCustomDomains = async (
  tagName: string,
  azure: AzureApi,
) => {
  const resources = await azure.listResources(
    "resourceType eq 'Microsoft.Cdn/profiles/endpoints'",
  )

  return resources.mapOrElse(
    (result) =>
      result.value
        .filter((v) => Object.keys(v.tags ?? {}).includes(tagName))
        .map((v) => {
          const sections = v.name.split("/")

          return {
            profileName: sections[0],
            endpointName: sections[1],
            domainName: (v.tags ?? {})[tagName],
          }
        }),
    () => [],
  )
}
