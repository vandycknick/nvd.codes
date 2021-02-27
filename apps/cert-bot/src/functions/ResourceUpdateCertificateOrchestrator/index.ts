import { orchestrator } from "durable-functions"
import { IOrchestrationFunctionContext } from "durable-functions/lib/src/classes"

const resourceUpdateCertificateOrchestrator = function* (
  context: IOrchestrationFunctionContext,
) {
  const { log } = context

  const { resource, certificateName, revision } = context.df.getInput() as {
    resource: {
      profileName: string
      endpointName: string
      domainName: string
    }
    certificateName: string
    revision: string
  }

  const currentRevision: string = yield context.df.callActivity(
    "ResourceCdnGetCurrentCertificate",
    resource,
  )

  if (revision !== currentRevision) {
    yield context.df.callActivity("ResourceCdnUpdateCertificate", {
      resource,
      certificateName,
      revision,
    })
  }

  log.info("Certificate updated for resource")
}

export default orchestrator(resourceUpdateCertificateOrchestrator)
