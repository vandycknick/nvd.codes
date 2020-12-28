export type CdnCustomDomainResponse = {
  properties: Properties
}

export type Properties = {
  customHttpsParameters?: CustomHttpsParameters
}

export type CustomHttpsParameters = {
  certificateSource: string
  certificateSourceParameters: CertificateSourceParameters
  protocolType: string
}

export type CertificateSourceParameters = {
  deleteRule: string
  keyVaultName: string
  oDataType: string
  resourceGroup: string
  secretName: string
  secretVersion: string
  subscriptionID: string
  updateRule: string
}
