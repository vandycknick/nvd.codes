import { Err, Ok, Result } from "@nvd.codes/monad"
import { Client, Authorization, forge } from "acme-client"

import { Logger } from "../logger"
import { delay } from "../utils"

export const createAcmeApi = async (
  accountKey: string,
  directoryUrl: string,
  contactUrl: string,
  log: Logger,
) => {
  const client = new Client({
    directoryUrl,
    accountKey,
  })

  const accountOrError = await client
    .createAccount({
      termsOfServiceAgreed: true,
      contact: [contactUrl],
    })
    .then((account) => Ok(account))
    .catch((err) => Err(err))

  if (accountOrError.isErr()) {
    return Err("Can't create ACME account!")
  }

  const getCertificate = async (
    domainName: string,
    challengeCreate: (
      authz: Authorization,
      key: string,
    ) => Promise<Result<string, Error | string>>,
    challengeCleanup: (
      authz: Authorization,
      key: string,
    ) => Promise<Result<unknown, Error | string>>,
  ): Promise<Result<{ cert: string; key: string }, string>> => {
    try {
      const order = await client.createOrder({
        identifiers: [
          { type: "dns", value: domainName },
          { type: "dns", value: `*.${domainName}` },
        ],
      })

      const authorizations = await client.getAuthorizations(order)

      const promises = authorizations.map(async (authz) => {
        log.info(
          `Starting verification for ${authz.wildcard ? "*." : ""}${
            authz.identifier.value
          }`,
        )
        const { challenges } = authz

        const challenge = challenges.find((ch) => ch.type === "dns-01")

        if (!challenge) {
          throw new Error(
            `Unable to select challenge for "dns-01", no challenge found`,
          )
        }

        const keyAuthorization = await client.getChallengeKeyAuthorization(
          challenge,
        )
        try {
          const challengeSetOrError = await challengeCreate(
            authz,
            keyAuthorization,
          )

          if (challengeSetOrError.isErr()) {
            log.error(
              "An error occured creating the challenge.",
              challengeSetOrError.unwrapErr(),
            )
            return Err("An error occured creating the challenge.")
          }

          // console.log("going to verify challenge")
          // await client.verifyChallenge(authz, challenge)
          await delay(5000)

          log.verbose("Completing challenge.")
          await client.completeChallenge(challenge)

          log.verbose("Waiting for valid status.")
          await client.waitForValidStatus(challenge)
        } catch (ex) {
          log.error("An error occured trying to validate a challenge.", ex)
          return Err("An error occured trying to validate the challenge.")
        } finally {
          log.verbose("Running challenge cleanup")
          await challengeCleanup(authz, keyAuthorization)
        }

        return Ok<unknown, string>(null)
      })

      const results = await Promise.all(promises)
      const failed = results.some((r) => r.isErr())

      if (failed) {
        return Err("Failed verifying authorizations")
      }

      const [key, csr] = await forge.createCsr({
        commonName: `*.${domainName}`,
        altNames: [domainName],
        keySize: 4096,
      })

      log.verbose("Finalizing order")
      await client.finalizeOrder(order, csr)

      log.verbose("Grabbing the actual cert form letsencrypt!")
      const cert = await client.getCertificate(order)

      return Ok({ cert, key: key.toString() })
    } catch (ex) {
      log.error("An unknown error occured.", ex)
      return Err("Can't retrieve certificate from let's encrypt.")
    }
  }

  return Ok({
    getCertificate,
  })
}
