export interface EventGridEvent<T> {
  id: string
  topic?: string
  subject: string
  metadataVersion?: string
  eventType: string
  eventTime: string
  dataVersion?: string
  data: T
}
