import { entity, getClient } from "durable-functions"

import {
  DurableEntityContext,
  DurableOrchestrationClient,
  DurableOrchestrationStatus,
  IEntityFunctionContext,
  OrchestrationRuntimeStatus,
} from "durable-functions/lib/src/classes"
import { isCertificateValid } from "./validators"
import { parseCertificateKey } from "./parseCertificateKey"

export type CertificateUnknown = {
  status: "Unknown"
  dnsNames: string[]
  issuer: string
  message: string
}

export type CertificateIssuing = {
  status: "Issuing"
  dnsNames: string[]
  issuer: string
  message: string
  certificateRequestId: string
}

export type CertificateReady = {
  status: "Ready"
  dnsNames: string[]
  issuer: string
  message: string
  certificateName: string
  certificateRequestId: string
  notAfter: string
  notBefore: string
  renewalTime: string
  revision: string
  renewalRequestId: string
}

export type Certificate =
  | CertificateUnknown
  | CertificateIssuing
  | CertificateReady

const createNewCertificate = (key: string): Certificate => {
  const { dnsNames, issuer } = parseCertificateKey(key)
  return {
    status: "Unknown",
    dnsNames,
    issuer,
    message: "Certificate does not exist",
  }
}

const issueNewCertificate = async (
  state: Certificate,
  client: DurableOrchestrationClient,
): Promise<Certificate> => {
  const certificateRequestId = await client.startNew(
    "CertificateRequest",
    undefined,
    {
      dnsNames: state.dnsNames,
      issuer: state.issuer,
    },
  )

  return {
    status: "Issuing",
    dnsNames: state.dnsNames,
    issuer: state.issuer,
    message: "Issuing a new certificate",
    certificateRequestId,
  }
}

const hasFailedCertificateRequest = (status: DurableOrchestrationStatus) =>
  status.runtimeStatus === OrchestrationRuntimeStatus.Failed ||
  status.runtimeStatus === OrchestrationRuntimeStatus.Canceled ||
  status.runtimeStatus === OrchestrationRuntimeStatus.Terminated

const handleGetCertificate = async (
  state: Certificate,
  df: DurableEntityContext,
) => {
  df.return(state)
}

const handleRenewCertificate = async (
  state: Certificate,
  df: DurableEntityContext,
  client: DurableOrchestrationClient,
) => {
  switch (state.status) {
    case "Unknown": {
      const newState = await issueNewCertificate(state, client)
      df.setState(newState)
      break
    }

    case "Issuing": {
      const status = await client.getStatus(state.certificateRequestId)

      if (hasFailedCertificateRequest(status)) {
        await client.purgeInstanceHistory(state.certificateRequestId)
        const newState = await issueNewCertificate(state, client)
        df.setState(newState)
      }
      break
    }

    case "Ready": {
      if (!isCertificateValid(state)) {
        await client.purgeInstanceHistory(state.certificateRequestId)
        const newState = await issueNewCertificate(state, client)
        df.setState(newState)
      }
      break
    }
  }
}

const handleReadyCertificate = async (
  state: Certificate,
  df: DurableEntityContext,
  client: DurableOrchestrationClient,
) => {
  if (state.status !== "Issuing") {
    return
  }

  const { certificateName, notAfter, notBefore, revision, issuer } =
    df.getInput() as {
      certificateName: string
      notAfter: string
      notBefore: string
      revision: string
      issuer: string
    }

  const notAfterDate = new Date(notAfter)
  notAfterDate.setDate(notAfterDate.getDate() - 30)
  const renewalTime = notAfterDate.toJSON()

  const renewalRequestId = await client.startNew(
    "CertificateRenewal",
    undefined,
    {
      dnsNames: state.dnsNames,
      issuer,
    },
  )

  df.setState({
    ...state,
    status: "Ready",
    message: "Certificate is up to date and has not expired",
    certificateName,
    notAfter,
    notBefore,
    renewalTime,
    revision,
    renewalRequestId,
  } as Certificate)
}

export const certificateEntity = async (context: IEntityFunctionContext) => {
  const state = context.df.getState(() =>
    createNewCertificate(context.df.entityKey),
  ) as Certificate
  switch (context.df.operationName) {
    case "get":
      await handleGetCertificate(state, context.df)
      break
    case "renew":
      await handleRenewCertificate(state, context.df, getClient(context))
      break

    case "ready":
      await handleReadyCertificate(state, context.df, getClient(context))
      break
  }
}

export const index = entity(certificateEntity)
