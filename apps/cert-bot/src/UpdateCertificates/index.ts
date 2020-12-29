import { Context } from "@azure/functions"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateCertificates = async (context: Context, eventGridEvent: any) => {
  const { log } = context

  log.info("JavaScript Event Grid function processed a request.")
  log.info("Subject: " + eventGridEvent.subject)
  log.info("Time: " + eventGridEvent.eventTime)
  log.info("Data: " + JSON.stringify(eventGridEvent.data))
}

export default updateCertificates
