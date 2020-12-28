import { Option } from "@nvd.codes/monad"
import { getEnvVar, getOptionalEnvVar } from "../utils"

const defaults = {
  letsencrypt: {
    staging: "https://acme-staging-v02.api.letsencrypt.org/directory",
    production: "https://acme-v02.api.letsencrypt.org/directory",
  },
}

export const getSettings = () =>
  Option.all(
    getEnvVar("AZURE_KEYVAULT_NAME"),
    getEnvVar("AZURE_KEYVAULT_CERTIFICATE_NAME"),
    getEnvVar("AZURE_KEYVAULT_SECRET_NAME"),
    getEnvVar("AZURE_SUBSCRIPTION_ID"),
    getEnvVar("AZURE_RESOURCE_GROUP"),
    getEnvVar("ACME_TOP_LEVEL_DOMAIN_NAME"),
    getEnvVar("ACME_CONTACT_URL"),
    getOptionalEnvVar("ACME_DIRECTORY_URL", defaults.letsencrypt.staging),
    getEnvVar("CLOUDFLARE_ZONE_ID"),
  ).map(
    ([
      azureKeyVaultName,
      azureKeyVaultCertificateName,
      azureKeyVaultSecretName,
      azureSubscriptionId,
      azureResourceGroup,
      acmeTopLevelDomainName,
      acmeContactUrl,
      acmeDirectoryUrl,
      cloudflareZoneId,
    ]) => ({
      azureKeyVaultName,
      azureKeyVaultCertificateName,
      azureKeyVaultSecretName,
      azureSubscriptionId,
      azureResourceGroup,
      acmeTopLevelDomainName,
      acmeContactUrl,
      acmeDirectoryUrl,
      cloudflareZoneId,
    }),
  )
