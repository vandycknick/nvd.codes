import { Context, Logger } from "@azure/functions"
import { Ok } from "@nvd.codes/monad"
import { Authorization } from "acme-client"

import { createAcmeApi } from "../api/acme"
import { createAzureApi } from "../api/azure"
import { CloudflareDnsApi, createCloudflareDnsApi } from "../api/cloudflare"
import { convertToPkcs12Certificate, parseKeyVaultCertificate } from "../utils"
import { getAccountKey } from "./getAcmePrivateKey"
import { getSettings } from "./getSettings"

const createDnsVerificationRecord = async (
  authz: Authorization,
  key: string,
  cloudflare: CloudflareDnsApi,
  log: Logger,
) => {
  const dnsRecord = `_acme-challenge.${authz.identifier.value}`

  log.info(`Creating TXT record for ${dnsRecord} with ${key}`)
  const dnsIdOrError = await cloudflare.createDnsRecord(dnsRecord, key, "TXT")

  return dnsIdOrError
}

const cleanupDnsVerificationRecord = async (
  authz: Authorization,
  key: string,
  cloudflare: CloudflareDnsApi,
  log: Logger,
) => {
  log.info(authz, key)
  const dnsRecord = `_acme-challenge.${authz.identifier.value}`

  const recordsOrError = await cloudflare.listDnsRecords(dnsRecord, key, "TXT")
  const record = recordsOrError.mapOrElse(
    (value) => value,
    () => [],
  )[0]

  if (record != null) {
    const okOrError = await cloudflare.deleteDnsRecord(record.id)

    if (okOrError.isErr()) {
      log.error(`Can't delete dns record ${dnsRecord}`, okOrError.unwrapErr())
    }
  } else {
    log.error(`Can't find a record with name ${dnsRecord}, skipping deletion.`)
  }

  return Ok<unknown, string>("")
}

const renewCertificates = async (context: Context) => {
  const { log } = context
  log.info("Renewing certificates!")

  const settingsOrNone = getSettings()

  if (settingsOrNone.isNone()) {
    log.error("Missing some required setting, exiting!")
    return
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
    log.error("Can't create azure rest api!", azureApiOrError.unwrapErr())
    return
  }

  if (cloudflareOrError.isErr()) {
    log.error(
      "Can't create cloudflare rest api!",
      cloudflareOrError.unwrapErr(),
    )
    return
  }

  const azure = azureApiOrError.unwrap()
  const cloudflare = cloudflareOrError.unwrap()

  const accountKeyOrError = await getAccountKey(
    settings.azureKeyVaultName,
    settings.azureKeyVaultSecretName,
    azure,
  )

  if (accountKeyOrError.isErr()) {
    log.error(accountKeyOrError.unwrapErr())
    return
  }

  const accountKey = accountKeyOrError.unwrap()

  const acmeOrError = await createAcmeApi(
    accountKey,
    settings.acmeDirectoryUrl,
    settings.acmeContactUrl,
    log,
  )

  if (acmeOrError.isErr()) {
    log.error(acmeOrError.unwrapErr())
    return
  }

  const acme = acmeOrError.unwrap()

  const certificate = await azure.getKeyVaultCertificate(
    settings.azureKeyVaultName,
    settings.azureKeyVaultCertificateName,
  )

  if (certificate.isErr()) {
    log.error(
      "An error occured fetching the certificate stored in key vault!",
      certificate.unwrapErr(),
    )
    return
  }

  const shouldRefreshCertificate = certificate.mapOrElse(
    (value) => {
      if (value.isNone()) {
        return true
      }
      const cert = parseKeyVaultCertificate(value.unwrap())
      const notAfter = cert.validity.notAfter
      const today = new Date(Date.now())
      today.setDate(today.getDate() + 30)

      log.info(
        `Checking certificate validity: ${notAfter} < ${today} = ${
          notAfter < today
        }`,
      )
      return cert.validity.notAfter < today
    },
    () => true,
  )

  if (!shouldRefreshCertificate) {
    log.info("Certificate is still up to date!")
    return
  }

  log.info("Certificate needs to be updated!")

  const certOrError = await acme.getCertificate(
    settings.acmeTopLevelDomainName,
    (authz, keys) => createDnsVerificationRecord(authz, keys, cloudflare, log),
    (authz, keys) => cleanupDnsVerificationRecord(authz, keys, cloudflare, log),
  )

  if (certOrError.isErr()) {
    log.error(
      "Error requesting cert from let's encrypt",
      certOrError.unwrapErr(),
    )
    return
  }

  const { cert, key } = certOrError.unwrap()
  // const keyAsPkcs8 = privateKeyToPkcs8(key)
  const pkcs12Cert = convertToPkcs12Certificate(cert, key)

  log.info("Updating vault with new certificate.")
  const okOrError = await azure.setKeyVaultCertificate(
    settings.azureKeyVaultName,
    settings.azureKeyVaultCertificateName,
    // `${cert}\n${keyAsPkcs8}`.replace(/\r\n/g, "\n"),
    pkcs12Cert,
    "pkcs12",
  )

  if (okOrError.isErr()) {
    log.error("Failed storing certifiate in vault.", okOrError.unwrapErr())
  } else {
    log.info("Stored new certificate in azure key vault!")
  }
}

export default renewCertificates
