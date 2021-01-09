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
    getEnvVar("AZURE_KEYVAULT_SECRET_NAME"),
    getEnvVar("AZURE_SUBSCRIPTION_ID"),
    getEnvVar("AZURE_RESOURCE_GROUP"),
    getEnvVar("CLOUDFLARE_ZONE_ID"),
    getOptionalEnvVar("ACME_DIRECTORY_URL", defaults.letsencrypt.staging),
    getEnvVar("ACME_CONTACT_URL"),
    getOptionalEnvVar("CERT_BOT_ENABLED", "false"),
  ).map(
    ([
      azureKeyVaultName,
      azureKeyVaultSecretName,
      azureSubscriptionId,
      azureResourceGroup,
      cloudflareZoneId,
      acmeDirectoryUrl,
      acmeContactUrl,
      certBotEnabled,
    ]) => ({
      azureKeyVaultName,
      azureKeyVaultSecretName,
      azureSubscriptionId,
      azureResourceGroup,
      cloudflareZoneId,
      acmeDirectoryUrl,
      acmeContactUrl,
      certBotEnabled: certBotEnabled === "true",
    }),
  )
