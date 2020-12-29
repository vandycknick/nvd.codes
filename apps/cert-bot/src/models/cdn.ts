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
  vaultName: string
  "@odata.type": string
  resourceGroupName: string
  secretName: string
  secretVersion: string
  subscriptionId: string
  updateRule: string
}
