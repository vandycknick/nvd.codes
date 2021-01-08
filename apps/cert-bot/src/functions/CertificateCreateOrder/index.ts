import { Context } from "@azure/functions"

import { getServices } from "../../services/getServices"

type CertificateCreateOrderData = {
  dnsNames: string[]
  issuer: string
}

const certificateCreateOrder = async (
  { log }: Context,
  { dnsNames, issuer }: CertificateCreateOrderData,
) => {
  log.info("Creating Order", dnsNames, issuer)

  const { settings, getAcmeClient } = (await getServices()).unwrapUnsafe()
  const client = (await getAcmeClient()).unwrapUnsafe()

  await client.createAccount({
    termsOfServiceAgreed: true,
    contact: [settings.acmeContactUrl],
  })

  const order = await client.createOrder({
    identifiers: dnsNames.map((name) => ({
      type: "dns",
      value: name,
    })),
  })

  const authorizations = await client.getAuthorizations(order)
  return { order, authorizations }
}

export default certificateCreateOrder
