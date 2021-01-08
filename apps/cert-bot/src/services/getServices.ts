import { Err, Ok, Option, Result } from "@nvd.codes/monad"
import { Client } from "acme-client"
import { AzureApi, createAzureApi } from "../api/azure"
import { CloudflareDnsApi, createCloudflareDnsApi } from "../api/cloudflare"

import { memoize } from "../utils"
import { getAccountKey } from "./getAccountKey"
import { getCdnEndpointsWithCustomDomains } from "./getCdnEndpointsWithCustomDomains"
import { getSettings } from "./getSettings"

type ExtractOptionValue<Type> = Type extends Option<infer X> ? X : never

type Settings = ExtractOptionValue<ReturnType<typeof getSettings>>

const getServicesFactory = async (): Promise<
  Result<
    {
      settings: Settings
      azure: AzureApi
      cloudflare: CloudflareDnsApi
      getAcmeClient: () => Promise<Result<Client, string>>
      getCdnEndpointsWithCustomDomains: (
        tagName: string,
      ) => ReturnType<typeof getCdnEndpointsWithCustomDomains>
    },
    string
  >
> => {
  const settingsOrNone = getSettings()

  if (settingsOrNone.isNone()) {
    return Err("Missing some required settings!")
  }

  const settings = settingsOrNone.unwrap()
  const azureApiOrError = await createAzureApi(
    settings.azureSubscriptionId,
    settings.azureResourceGroup,
  )
  const cloudflareOrError = await createCloudflareDnsApi(
    settings.cloudflareZoneId,
  )

  if (azureApiOrError.isErr()) {
    return Err("Can't create azure api!")
  }

  if (cloudflareOrError.isErr()) {
    return Err("Can't create cloudflare rest api!")
  }

  const azure = azureApiOrError.unwrap()
  const cloudflare = cloudflareOrError.unwrap()

  return Ok({
    settings,
    azure,
    cloudflare,
    getAccountKey: (keyVaultName: string, secretName: string) =>
      getAccountKey(keyVaultName, secretName, azure),
    getAcmeClient: async (): Promise<Result<Client, string>> => {
      const accountKeyOrError = await getAccountKey(
        settings.azureKeyVaultName,
        settings.azureKeyVaultSecretName,
        azure,
      )

      if (accountKeyOrError.isErr()) {
        return Err("Can't get account key!")
      }

      const client = new Client({
        directoryUrl: settings.acmeDirectoryUrl,
        accountKey: accountKeyOrError.unwrap(),
      })

      try {
        await client.createAccount({
          termsOfServiceAgreed: true,
          contact: [settings.acmeContactUrl],
        })
        return Ok(client)
      } catch {
        return Err("Can't create account!")
      }
    },

    getCdnEndpointsWithCustomDomains: async (tagName: string) =>
      getCdnEndpointsWithCustomDomains(tagName, azure),
  })
}

export const getServices = memoize(getServicesFactory)
