import { None, Option, Some } from "@nvd.codes/monad"
import { asn1, pkcs12, pki, util } from "node-forge"
import { promisify } from "util"
import { KeyVaultCertificateResponse } from "./models/keyVault"

const generateKeyPair = promisify(pki.rsa.generateKeyPair)

export const getEnvVar = (key: string): Option<string> => {
  const result = process.env[key]
  return result === undefined ? None() : Some(result)
}

export const getOptionalEnvVar = (
  key: string,
  defaultz: string,
): Option<string> => {
  const result = getEnvVar(key)
  return result.isNone() ? Some(defaultz) : result
}

export const createPrivateKey = async (size = 2048) => {
  const keyPair = await generateKeyPair({ bits: size })
  const pemKey = pki.privateKeyToPem(keyPair.privateKey)
  return pemKey
}

export const parseKeyVaultCertificate = (cert: KeyVaultCertificateResponse) => {
  const pem = `-----BEGIN CERTIFICATE-----\n${cert.cer}\n-----END CERTIFICATE-----`
  return pki.certificateFromPem(pem)
}

export const convertToPkcs12Certificate = (cert: string, key: string) => {
  const asn = pkcs12.toPkcs12Asn1(
    pki.privateKeyFromPem(key),
    pki.certificateFromPem(cert),
    null,
  )

  const der = asn1.toDer(asn).getBytes()
  return util.encode64(der)
}

export const privateKeyToPkcs8 = (key: string) => {
  // convert a Forge private key to an ASN.1 RSAPrivateKey
  const forgePrivateKey = pki.privateKeyFromPem(key.toString())

  // convert a Forge private key to an ASN.1 RSAPrivateKey
  const rsaPrivateKey = pki.privateKeyToAsn1(forgePrivateKey)

  // wrap an RSAPrivateKey ASN.1 object in a PKCS#8 ASN.1 PrivateKeyInfo
  const privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey)

  // convert a PKCS#8 ASN.1 PrivateKeyInfo to PEM
  const pem = pki.privateKeyInfoToPem(privateKeyInfo)
  return pem
}

export const delay = (time: number): Promise<void> =>
  new Promise((res) => {
    setTimeout(() => res(), time)
  })
