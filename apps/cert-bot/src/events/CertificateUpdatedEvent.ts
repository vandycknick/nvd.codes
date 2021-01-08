import { EventGridEvent } from "../az-functions"

export type CertificateUpdatedEvent = EventGridEvent<{
  dnsNames: string[]
  certificateName: string
  revision: string
}>
