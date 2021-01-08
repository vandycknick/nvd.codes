import { Context } from "@azure/functions"
import { forge, Order } from "acme-client"
import { pki } from "node-forge"

import { getServices } from "../../services/getServices"
import { convertToPkcs12Certificate } from "../../utils"

type CertificateFinalizeOrderData = {
  dnsNames: string[]
  order: Order
}

const certificateFinalizeOrder = async (
  context: Context,
  { order, dnsNames }: CertificateFinalizeOrderData,
) => {
  const { log } = context
  log.info("Finalizing order", order, dnsNames)

  const { getAcmeClient, azure, settings } = (
    await getServices()
  ).unwrapUnsafe()
  const client = (await getAcmeClient()).unwrapUnsafe()

  const [commonName, ...altNames] = dnsNames
  const [key, csr] = await forge.createCsr({
    commonName,
    altNames,
    keySize: 4096,
  })

  log.verbose("Finalizing order")
  await client.finalizeOrder(order, csr)

  log.verbose("Grabbing the actual cert form letsencrypt!")
  const cert = await client.getCertificate(order)

  const pkcs12Cert = convertToPkcs12Certificate(cert, key.toString())

  const certificateName = dnsNames
    .map((name) => name.replace(/\./g, "-"))
    .reduce((key, name) => `${key}-${name}`, "cert-bot-certificate")

  log.info("Updating vault with new certificate.")
  const idOrError = await azure.vault.setCertificate(
    settings.azureKeyVaultName,
    certificateName,
    pkcs12Cert,
    "pkcs12",
  )

  if (idOrError.isErr()) {
    log.error("Failed storing certificate in vault.", idOrError.unwrapErr())
    throw new Error("Failed storing certificate in vault.")
  }

  log.info("Stored new certificate in azure key vault!")

  const certificate = pki.certificateFromPem(cert)
  const revision = idOrError.unwrap().split("/").pop()

  return {
    certificateName,
    notBefore: certificate.validity.notBefore.toJSON(),
    notAfter: certificate.validity.notAfter.toJSON(),
    revision,
  }
}

export default certificateFinalizeOrder
