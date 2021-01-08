import { orchestrator } from "durable-functions"
import { IOrchestrationFunctionContext } from "durable-functions/lib/src/classes"
import moment from "moment"

import { Certificate } from "../Certificate"
import { getCertificateEntity } from "../Certificate/getCertificateEntity"

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const certificateRenewal = function* (context: IOrchestrationFunctionContext) {
  const { log } = context
  const { dnsNames, issuer } = context.df.getInput() as {
    dnsNames: string[]
    issuer: string
  }

  const certificateEntity = getCertificateEntity(dnsNames, issuer)
  const certificate: Certificate = yield context.df.callEntity(
    certificateEntity,
    "get",
  )

  if (certificate.status !== "Ready") {
    log.error("Certificate is not in a ready state, can't wait for renewal.")
    throw new Error("Certificate is not ready yet!")
  }

  const getSleep = () => {
    const difference = moment
      .utc(certificate.renewalTime)
      .diff(moment.utc(context.df.currentUtcDateTime))
    return clamp(difference, 0, 6)
  }

  let sleep = getSleep()
  log.info(`Sleep calculated as ${sleep} days.`)
  while (sleep > 0) {
    log.info(
      `Current date ${context.df.currentUtcDateTime.toJSON()} < renewalTime ${
        certificate.renewalTime
      } `,
    )
    const deadline = moment.utc(context.df.currentUtcDateTime).add(sleep, "d")
    log.info(`Sleeping until ${deadline.toJSON()}.`)
    yield context.df.createTimer(deadline.toDate())
    sleep = getSleep()
  }

  yield context.df.callEntity(certificateEntity, "renew", issuer)
  log.info(`Certificate Renewal Finished for ${dnsNames.join(",")}`)
}

export default orchestrator(certificateRenewal)
