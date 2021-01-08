import { Context } from "@azure/functions"
import { Authorization } from "acme-client"

import { getServices } from "../../services/getServices"
import { delay } from "../../utils"

type CertificateCreateChallengeData = {
  authorization: Authorization
  issuer: string
}

const certificateCreateChallenge = async (
  { log }: Context,
  { authorization }: CertificateCreateChallengeData,
) => {
  log.info(
    `Starting verification for ${authorization.wildcard ? "*." : ""}${
      authorization.identifier.value
    }`,
  )
  const { challenges } = authorization
  const challenge = challenges.find((ch) => ch.type === "dns-01")

  if (!challenge) {
    throw new Error(
      `Unable to select challenge for "dns-01", no challenge found`,
    )
  }

  const { cloudflare, getAcmeClient } = (await getServices()).unwrapUnsafe()
  const client = (await getAcmeClient()).unwrapUnsafe()

  const keyAuthorization = await client.getChallengeKeyAuthorization(challenge)

  const dnsRecord = `_acme-challenge.${authorization.identifier.value}`

  log.info(`Creating TXT record for ${dnsRecord} with ${keyAuthorization}`)
  const challengeSetOrError = await cloudflare.createDnsRecord(
    dnsRecord,
    keyAuthorization,
    "TXT",
  )

  if (challengeSetOrError.isErr()) {
    log.error(
      "An error occured creating the challenge.",
      challengeSetOrError.unwrapErr(),
    )
    throw new Error("An error occured creating the challenge.")
  }

  await delay(5000)

  try {
    log.verbose("Completing challenge.")
    await client.completeChallenge(challenge)

    log.verbose("Waiting for valid status.")
    await client.waitForValidStatus(challenge)
  } catch (ex) {
    log.error("An error occured trying to validate a challenge.", ex)
    throw new Error("An error occured trying to validate the challenge.")
  } finally {
    log.verbose("Running challenge cleanup")
    const dnsRecord = `_acme-challenge.${authorization.identifier.value}`

    const recordsOrError = await cloudflare.listDnsRecords(
      dnsRecord,
      keyAuthorization,
      "TXT",
    )
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
      log.error(
        `Can't find a record with name ${dnsRecord}, skipping deletion.`,
      )
    }
  }
}

export default certificateCreateChallenge
