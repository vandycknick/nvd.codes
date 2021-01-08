import { Context } from "@azure/functions"
import { Err, Ok } from "@nvd.codes/monad"
import { getClient } from "durable-functions"

import { CertificateUpdatedEvent } from "../../events/CertificateUpdatedEvent"
import { getServices } from "../../services/getServices"

const certificateUpdatedHandler = async (
  context: Context,
  event: CertificateUpdatedEvent,
) => {
  const { log } = context

  log.info(
    `[CertificateUpdatedHandler] Received new eventGrid event ${event.id}.`,
  )

  const { getCdnEndpointsWithCustomDomains, azure } = (
    await getServices()
  ).unwrapUnsafe()

  const promises = (
    await getCdnEndpointsWithCustomDomains("cert-bot-issuer")
  ).map(async (endpoint) => {
    const domainsOrError = await azure.cdn.listCustomDomains(
      endpoint.profileName,
      endpoint.endpointName,
    )

    return domainsOrError.map((domains) =>
      domains.map((domain) => ({
        ...endpoint,
        domainName: domain.properties.hostName,
      })),
    )
  })

  const endpoints = (await Promise.all(promises))
    .filter((e) => e.isOk())
    .map((e) => e.unwrapUnsafe())
    .flat()

  log.info(endpoints)

  log.info(
    `Found ${endpoints.length} endpoint${
      endpoints.length > 1 ? "s" : ""
    } with custom domain name managed by cert-bot.`,
  )

  const client = getClient(context)
  const { certificateName, revision, dnsNames } = event.data

  const pendingUpdates = endpoints
    .filter((e) => dnsNames.length === 1 && dnsNames.includes(e.domainName))
    .map(async (endpoint) => {
      try {
        await client.startNew(
          "ResourceUpdateCertificateOrchestrator",
          undefined,
          {
            resource: endpoint,
            certificateName,
            revision,
          },
        )
        return Ok(true)
      } catch (ex) {
        log.error(ex)
        return Err(false)
      }
    })

  const updates = await Promise.all(pendingUpdates)
  const success = updates.filter((u) => u.isOk()).length

  log.info(
    `Successfully scheduled ${success}/${updates.length} endpoint updates!`,
  )
}

export default certificateUpdatedHandler
