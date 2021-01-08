export type Endpoint = {
  id: string
  location: string
  name: string
  type: string
  tags: Partial<Record<string, string>>
}

export type CustomDomainListResult = {
  value: CustomDomain[]
  nextLink?: string
}

export type CustomDomain = {
  id: string
  name: string
  type: string
  properties: {
    customHttpsProvisioningState:
      | "Disabled"
      | "Disabling"
      | "Enabled"
      | "Enabling"
      | "Failed"
    customHttpsProvisioningSubstate:
      | "CertificateDeleted"
      | "CertificateDeployed"
      | "DeletingCertificate"
      | "DeployingCertificate"
      | "DomainControlValidationRequestApproved"
      | "DomainControlValidationRequestRejected"
      | "DomainControlValidationRequestTimedOut"
      | "IssuingCertificate"
      | "PendingDomainControlValidationREquestApproval"
      | "SubmittingDomainControlValidationRequest"
    hostName: string
    provisioningState: string
    resourceState: "Disabled" | "Disabling" | "Enabled" | "Enabling" | "Failed"
    validationData: string
  }
}

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
