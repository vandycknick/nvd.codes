export const parseCertificateKey = (
  key: string,
): { dnsNames: string[]; issuer: string } => {
  const [dnsString, issuer] = key.split("@")
  const dnsNames = dnsString.split(",")
  return {
    dnsNames,
    issuer,
  }
}
