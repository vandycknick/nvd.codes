export interface ManagedIdentity {
  readonly endpoint: string
  readonly secret: string
}

export interface ServicePrincipal {
  readonly clientId: string
  readonly clientSecret: string
  readonly tenantId: string
}

export type AzureCredentials = ManagedIdentity | ServicePrincipal

export interface AzureAuthenticationTokens {
  readonly tokenType: string
  readonly accessToken: string
}

export const isManagedIdentity = (
  identity: unknown,
): identity is ManagedIdentity =>
  typeof identity === "object" &&
  identity != null &&
  "endpoint" in identity &&
  typeof (identity as ManagedIdentity)["endpoint"] === "string" &&
  "secret" in identity &&
  typeof (identity as ManagedIdentity)["secret"] === "string"

export const isServicePrincipal = (
  servicePrincipal: unknown,
): servicePrincipal is ServicePrincipal =>
  typeof servicePrincipal === "object" &&
  servicePrincipal != null &&
  "clientId" in servicePrincipal &&
  typeof (servicePrincipal as ServicePrincipal)["clientId"] === "string" &&
  "clientSecret" in servicePrincipal &&
  typeof (servicePrincipal as ServicePrincipal)["clientSecret"] === "string" &&
  "tenantId" in servicePrincipal &&
  typeof (servicePrincipal as ServicePrincipal)["tenantId"] === "string"
