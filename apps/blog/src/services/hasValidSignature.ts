import crypto from "crypto"
import { getConfig } from "../config"

const config = getConfig()

export const hasValidSignature = (
  payload: string,
  signature: string,
): boolean => {
  const hmac = crypto.createHmac("sha1", config.webhookSecret)
  const payloadDigest = hmac.update(payload).digest("hex")
  const digest = Buffer.from(`sha1=${payloadDigest}`, "utf8")

  console.log(payload, signature, payloadDigest)

  const checksum = Buffer.from(signature, "utf-8")
  return (
    checksum.length === digest.length &&
    crypto.timingSafeEqual(digest, checksum)
  )
}
