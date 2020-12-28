export type KeyVaultCertificateResponse = {
  id: string
  cer: string
}

export type KeyVaultCertificateRequest = {
  value: string
  policy?: {
    secret_props?: {
      contentType: string
    }
  }
}

export type KeyVaultSecretResponse = {
  id: string
  value: string
  // attributes: {
  //   enabled: boolean
  //   created: number
  //   updated: number
  //   recoveryLevel: string
  // }
}

export type KeyVaultSecretRequest = {
  value: string
  contentType?: string
}
