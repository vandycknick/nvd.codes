import { Context } from "@azure/functions"
import { Err, Ok } from "@nvd.codes/monad"
import { getClient } from "durable-functions"

import { createAzureApi } from "../../api/azure"
import { parseAzureResourceId } from "../../utils"
import { getSettings } from "../../services/getSettings"
import { Certificate } from "../Certificate"
import { getCertificateEntity } from "../Certificate/getCertificateEntity"
import {
  isCertificateReady,
  isCertificateValid,
} from "../Certificate/validators"
import { ResourceUpdatedEvent } from "../../events/ResourceUpdatedEvent"

const resourceUpdatedHandler = async (
  context: Context,
  event: ResourceUpdatedEvent,
) => {
  const { log } = context

  log.info(`[ResourceUpdatedHandler] Received new eventGrid event ${event.id}.`)

  const settingsOrNone = getSettings()

  if (settingsOrNone.isNone()) {
    log.error("Not all settings provided!")
    return Err("Not all required settings are provided!")
  }

  const settings = settingsOrNone.unwrap()
  const parsed = parseAzureResourceId(event.subject)

  if (parsed.isErr()) {
    const msg = "Invalid subject, can't be parsed as an azure resource id"
    log.error(msg)
    return Err(msg)
  }

  const apiOrError = await createAzureApi(
    settings.azureSubscriptionId,
    settings.azureResourceGroup,
  )

  if (apiOrError.isErr()) {
    return Err(apiOrError.unwrapErr().message)
  }

  const azure = apiOrError.unwrap()
  const provider = parsed.unwrap().provider

  if (provider === "Microsoft.Cdn") {
    const [, profileName, , endpointName] = parsed.unwrap().uri.split("/")

    log.info(profileName, endpointName)

    const endpointOrError = await azure.cdn.getEndpoint(
      profileName,
      endpointName,
    )

    if (endpointOrError.isErr()) {
      const err = endpointOrError.unwrapErr()
      log.error(err)
      return Err(`${err.statusCode}: ${err.message}`)
    }

    const endpoint = endpointOrError.unwrap()

    if (endpoint.tags["cert-bot-issuer"] == undefined) {
      log.info("Endpoint not managed by certbot!")
      return Ok("Endpoint not managed by cert bot!")
    }
    const issuer = endpoint.tags["cert-bot-issuer"]

    const domainsOrError = await azure.cdn.listCustomDomains(
      profileName,
      endpointName,
    )

    if (domainsOrError.isErr()) {
      const err = domainsOrError.unwrapErr()
      return Err(`${err.statusCode}: ${err.message}`)
    }

    const domains = domainsOrError.unwrap()

    if (domains.length === 0) {
      return Ok(`No domains configured for endpoint ${endpoint.name}`)
    }

    const client = getClient(context)
    const promises = domains.map(async (domain) => {
      try {
        const certificateEntity = getCertificateEntity(
          [domain.properties.hostName],
          issuer,
        )

        const state = await client.readEntityState<Certificate>(
          certificateEntity,
        )
        const certificate = state.entityState
        if (
          isCertificateReady(certificate) &&
          isCertificateValid(certificate)
        ) {
          log.info(
            `Certificate for ${domain.properties.hostName} already exists and is still valid!`,
          )
          await client.startNew(
            "ResourceUpdateCertificateOrchestrator",
            undefined,
            {
              resource: {
                profileName,
                endpointName,
                domainName: domain.properties.hostName,
              },
              certificateName: certificate.certificateName,
              revision: certificate.revision,
            },
          )
        } else {
          log.info(`Renewing certificate for ${domain.properties.hostName}!`)
          await client.signalEntity(certificateEntity, "renew")
        }
        return Ok("Finished")
      } catch (ex) {
        return Err(ex)
      }
    })

    const ids = await Promise.all(promises)
    log.info(ids)
    return Ok("finished")
  } else {
    return Err("Unsupported provider")
  }
}

export default resourceUpdatedHandler
