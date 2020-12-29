import { Option } from "@nvd.codes/monad"
import { getEnvVar } from "../utils"

export const getSettings = () =>
  Option.all(
    getEnvVar("AZURE_KEYVAULT_NAME"),
    getEnvVar("AZURE_KEYVAULT_CERTIFICATE_NAME"),
    getEnvVar("AZURE_SUBSCRIPTION_ID"),
    getEnvVar("AZURE_RESOURCE_GROUP"),
  ).map(
    ([
      azureKeyVaultName,
      azureKeyVaultCertificateName,
      azureSubscriptionId,
      azureResourceGroup,
    ]) => ({
      azureKeyVaultName,
      azureKeyVaultCertificateName,
      azureSubscriptionId,
      azureResourceGroup,
    }),
  )
