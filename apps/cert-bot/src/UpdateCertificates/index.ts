import { Context } from "@azure/functions"

interface EventGridEvent {
  id: string
  type: string
  subject: string
  metadataVersion: string
  eventType: string
  eventTime: Date
  dataVersion: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

const updateCertificates = async (
  context: Context,
  eventGridEvent: EventGridEvent,
) => {
  const { log } = context

  log.info("JavaScript Event Grid function processed a request.")
  log.info(`ID: ${eventGridEvent.id}`)
  log.info(`Type: ${eventGridEvent.type}`)
  log.info(`Subject: ${eventGridEvent.subject}`)
  log.info(`EventType: ${eventGridEvent.eventType}`)
  log.info(`Time: ${eventGridEvent.eventTime}`)
  log.info("Data: " + JSON.stringify(eventGridEvent.data))
  log.info("===")
}

export default updateCertificates
