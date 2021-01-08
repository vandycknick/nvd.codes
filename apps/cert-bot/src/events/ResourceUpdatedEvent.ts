import { EventGridEvent } from "../az-functions"

export type CdnResourceUpdatedEvent = EventGridEvent<{
  correlationId: string
  resourceProvider: string
  resourceUri: string
  operationName: string
  status: string
  subscriptionId: string
  tenantId: string
}>

export type ResourceUpdatedEvent = CdnResourceUpdatedEvent
