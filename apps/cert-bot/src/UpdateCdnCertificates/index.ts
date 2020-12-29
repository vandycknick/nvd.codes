import { Context } from "@azure/functions"
import { Err, Ok } from "@nvd.codes/monad"
import { createAzureApi } from "../api/azure"
import { getCdnEndpointsWithCustomDomains } from "./getCdnEndpointsWithCustomDomains"
import { getLatestCertificateVersion } from "./getLatestCertificateVersion"
import { getSettings } from "./getSettings"

const updateCdnCertificates = async (context: Context) => {
  const { log } = context

  log.info("Updating CDN certificates to latest version!")

  const settingsOrNone = getSettings()

  if (settingsOrNone.isNone()) {
    log.error("Missing some required settings!")
    return
  }

  const settings = settingsOrNone.unwrap()
  const azureApiOrError = await createAzureApi(
    settings.azureSubscriptionId,
    settings.azureResourceGroup,
  )

  if (azureApiOrError.isErr()) {
    log.error(azureApiOrError.unwrapErr())
    return
  }

  const azure = azureApiOrError.unwrap()

  const cdns = await getCdnEndpointsWithCustomDomains(
    "cert-bot-domain-name",
    azure,
  )

  log.info(
    `Found ${cdns.length} endpoint${
      cdns.length > 1 ? "s" : ""
    } with custom domain name managed by cert-bot.`,
  )

  const latestCertificateVersion = await getLatestCertificateVersion(
    settings.azureKeyVaultName,
    settings.azureKeyVaultCertificateName,
    azure,
    log,
  )

  if (latestCertificateVersion.isNone()) {
    log.error("Latest certificate version not found!")
    return
  }

  const pendingUpdates = cdns.map(async (cdn) => {
    const cdnName = `${cdn.profileName}/${cdn.endpointName}/${cdn.domainName}`
    log.info(
      `Getting version of current certificate of CDN custom domain ${cdnName}`,
    )

    const certOrError = await azure.getCdnCustomDomainCertificate(
      cdn.profileName,
      cdn.endpointName,
      cdn.domainName.replace(/\./g, "-"),
    )

    if (certOrError.isErr()) {
      log.error(
        `Error getting certificate for CDN ${cdnName}:`,
        certOrError.unwrapErr(),
      )
      return Err(certOrError.unwrapErr())
    }

    const certificateVersion = certOrError.unwrap()

    if (latestCertificateVersion.unwrap() === certificateVersion) {
      log.info(`Certificate for CDN ${cdnName} is already up to date!`)
      return Ok("Up to date!")
    }

    log.info(
      `Updating certifiate for CDN ${cdnName} from ${certificateVersion} to ${latestCertificateVersion.unwrap()}`,
    )

    const updated = await azure.setCdnCustomDomainCertificate(
      cdn.profileName,
      cdn.endpointName,
      cdn.domainName.replace(/\./g, "-"),
      settings.azureKeyVaultName,
      settings.azureKeyVaultCertificateName,
      latestCertificateVersion.unwrap(),
    )

    if (updated.isErr()) {
      log.error(
        `Failed updating certificate for CDN ${cdnName}`,
        updated.unwrapErr(),
      )
      return Err(updated.unwrapErr())
    }

    log.info(
      `Updated certificate for CDN ${cdnName} from ${certificateVersion} to ${latestCertificateVersion.unwrap()}`,
    )
    return Ok("Updated")
  })

  const updates = await Promise.all(pendingUpdates)
  const success = updates.filter((u) => u.isOk()).length

  log.info(`Successfully updated ${success}/${updates.length} endpoints!`)
}

export default updateCdnCertificates
