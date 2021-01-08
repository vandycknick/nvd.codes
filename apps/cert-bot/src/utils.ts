import { None, Option, Some, Ok, Err } from "@nvd.codes/monad"
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

export const parseAzureResourceId = (resourceId: string) => {
  const resourceIdPattern = /subscriptions\/(.+)\/resourceGroups\/(.+)\/providers\/(.+?)\/(.+?)\/(.+)/gi

  const matches = resourceIdPattern.exec(resourceId)

  if (matches == undefined || matches.length === 0) {
    return Err(`Failed parsing for ${resourceId}, invalid resourceId format!`)
  }

  const chunks = matches[5]?.split("/")
  const resourceName = chunks.pop()
  const resourceType = chunks.pop() ?? matches[4]

  return Ok({
    subscriptionId: matches[1],
    resourceGroupName: matches[2],
    provider: matches[3],
    resourceType,
    resourceName,
    uri: `${matches[4]}/${matches[5]}`,
  })
}

interface MemoizedFunction {
  cache: Map<unknown, unknown>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
): T & MemoizedFunction => {
  if (typeof func !== "function") {
    throw new TypeError("Expected a function!")
  }

  const memoized = Object.assign(
    (...args: unknown[]) => {
      const key = args[0]
      const cache = memoized.cache

      if (cache.has(key)) {
        return cache.get(key)
      }
      const result = func.apply(this, args)
      memoized.cache = cache.set(key, result) || cache
      return result
    },
    {
      cache: new Map<unknown, unknown>(),
    },
  )

  return memoized as T & MemoizedFunction
}
