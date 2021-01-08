import { Certificate, CertificateReady } from "./index"

export const isCertificateReady = (
  state?: Certificate,
): state is CertificateReady => state?.status === "Ready"

export const isCertificateValid = (state?: Certificate): boolean => {
  if (isCertificateReady(state)) {
    const renewal = new Date(state.renewalTime)
    const today = new Date()
    return renewal > today
  }

  return false
}
