const AZURE_MANAGEMENT_API = "https://management.azure.com"
const AZURE_VAULT_API = "https://vault.azure.net"

export const AZURE_API = {
  MANAGEMENT: AZURE_MANAGEMENT_API,
  VAULT: AZURE_VAULT_API,
}

export const getManagementEndpoint = (
  subscriptionId: string,
  resourceGroup: string,
  url: string,
) =>
  `${AZURE_API.MANAGEMENT}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}${url}`

export const getVaultEndpoint = (keyVaultName: string, url: string) =>
  `https://${keyVaultName}.vault.azure.net${url}`
