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

const CERT_BOT_TAG = "cert-bot-issuer"

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

  if (!settings.certBotEnabled) {
    log.info("Cert-bot disabled")
    return Ok("Cert-bot disabled")
  }

  const resourceId = event.subject
  const parsed = parseAzureResourceId(resourceId)

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
    const err = apiOrError.unwrapErr()
    log.error(err)
    return Err(err.message)
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
    const issuer = endpoint.tags[CERT_BOT_TAG]

    if (issuer == undefined) {
      log.info("Endpoint not managed by certbot!")
      return Ok("Endpoint not managed by cert bot!")
    }

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
                resourceId,
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
        log.error(ex)
        return Err(ex)
      }
    })

    const ids = await Promise.all(promises)
    log.info(ids)
    return Ok("finished")
  } else if (provider === "Microsoft.Web") {
    const siteOrError = await azure.webApp.getByName(
      parsed.unwrap().resourceName,
    )

    if (siteOrError.isErr()) {
      const err = siteOrError.unwrapErr()
      log.error(err)
      return Err(`${err.statusCode}: ${err.message}`)
    }

    const site = siteOrError.unwrap()
    log.info(site)

    const issuer = site.tags[CERT_BOT_TAG]
    if (issuer == undefined) {
      log.info("Endpoint not managed by cert bot!")
      return Ok("Endpoint not managed by cert bot!")
    }

    const client = getClient(context)
    const promises = site.properties.hostNames
      .filter((hostname) => !hostname.endsWith("azurewebsites.net"))
      .map(async (hostName) => {
        try {
          const certificateEntity = getCertificateEntity([hostName], issuer)
          const state = await client.readEntityState<Certificate>(
            certificateEntity,
          )
          const certificate = state.entityState
          if (
            isCertificateReady(certificate) &&
            isCertificateValid(certificate)
          ) {
            log.info(
              `Certificate for ${hostName} already exists and is still valid!`,
            )
            await client.startNew(
              "ResourceUpdateCertificateOrchestrator",
              undefined,
              {
                resource: {
                  resourceId,
                  domainName: hostName,
                },
                certificateName: certificate.certificateName,
                revision: certificate.revision,
              },
            )
          } else {
            log.info(`Renewing certificate for ${hostName}!`)
            await client.signalEntity(certificateEntity, "renew")
          }
          return Ok("Finished")
        } catch (ex) {
          log.error(ex)
          return Err(ex)
        }
      })

    const ids = await Promise.all(promises)
    log.info(ids)
    return Ok("finished")
  } else {
    log.error("Unsupported provider!")
    return Err("Unsupported provider")
  }
}

export default resourceUpdatedHandler
