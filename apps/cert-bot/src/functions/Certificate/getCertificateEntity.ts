import { EntityId } from "durable-functions"

export const getCertificateEntity = (dnsNames: string[], issuer: string) => {
  const key = `${dnsNames.join(",")}@${issuer}`
  const entity = new EntityId("Certificate", key)
  return entity
}
