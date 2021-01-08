import { Authorization, Order } from "acme-client"
import { orchestrator } from "durable-functions"
import { IOrchestrationFunctionContext } from "durable-functions/lib/src/classes"

import { CertificateUpdatedEvent } from "../../events/CertificateUpdatedEvent"
import { getCertificateEntity } from "../Certificate/getCertificateEntity"

const certificateRequest = function* (context: IOrchestrationFunctionContext) {
  const { log } = context
  const { dnsNames, issuer } = context.df.getInput() as {
    dnsNames: string[]
    issuer: string
  }

  const {
    order,
    authorizations,
  }: {
    order: Order
    authorizations: Authorization[]
  } = yield context.df.callActivity("CertificateCreateOrder", {
    dnsNames,
    issuer,
  })

  context.df.setCustomStatus({ order, authorizations })

  yield context.df.Task.all(
    authorizations.map((authorization) =>
      context.df.callActivity("CertificateCreateChallenge", {
        authorization,
        issuer,
      }),
    ),
  )

  const {
    certificateName,
    notBefore,
    notAfter,
    revision,
  }: {
    certificateName: string
    notBefore: string
    notAfter: string
    revision: string
  } = yield context.df.callActivity("CertificateFinalizeOrder", {
    dnsNames,
    order,
  })

  context.df.setCustomStatus({
    order,
    authorizations,
    certificateName,
    notBefore,
    notAfter,
    revision,
  })

  const certificateEntity = getCertificateEntity(dnsNames, issuer)
  yield context.df.callEntity(certificateEntity, "ready", {
    certificateName,
    notBefore,
    notAfter,
    revision,
    issuer,
  })

  log.info("Certificate Request Finished")
  context.bindings["outputEvent"] = {
    id: context.df.newGuid(),
    subject: `/certificate/${dnsNames.join("-").replace(/\./g, "-")}`,
    dataVersion: "1.0",
    eventType: "CertBot.Certificate.Updated",
    eventTime: new Date().toJSON(),
    data: {
      dnsNames,
      certificateName,
      revision,
    },
  } as CertificateUpdatedEvent
}

export default orchestrator(certificateRequest)
