import { Option, None, Err, Ok, Result, Some } from "@nvd.codes/monad"
import { URLSearchParams } from "url"
import querystring from "querystring"

import {
  AZURE_API,
  getManagementEndpoint,
  getVaultEndpoint,
} from "./azureEndpoints"
import {
  AzureAuthenticationTokens,
  AzureCredentials,
  isManagedIdentity,
  isServicePrincipal,
  ManagedIdentity,
  ServicePrincipal,
} from "../models/auth"
import {
  CdnCustomDomainResponse,
  CustomDomainListResult,
  CustomHttpsParameters,
  Endpoint,
} from "../models/cdn"
import { ApiError, sendJsonRequest } from "./request"
import {
  KeyVaultCertificateRequest,
  KeyVaultCertificateResponse,
  KeyVaultSecretRequest,
  KeyVaultSecretResponse,
} from "../models/keyVault"
import { getEnvVar } from "../utils"
import { ResourceListResult } from "../models/resource"
import { Site } from "../models/webApp"

const getManagedIdentity = (): Option<ManagedIdentity> =>
  Option.all(getEnvVar("MSI_ENDPOINT"), getEnvVar("MSI_SECRET")).map(
    ([msiEndpoint, msiSecret]) => ({
      endpoint: msiEndpoint,
      secret: msiSecret,
    }),
  )

const getServicePrincipal = (): Option<ServicePrincipal> =>
  Option.all(
    getEnvVar("AZURE_CLIENT_ID"),
    getEnvVar("AZURE_CLIENT_SECRET"),
    getEnvVar("AZURE_TENANT_ID"),
  ).map(([clientId, clientSecret, tenantId]) => ({
    clientId,
    clientSecret,
    tenantId,
  }))

export const getAzureCredentials = () =>
  getManagedIdentity().orElse(() => getServicePrincipal())

type TokenResponse = {
  token_type: "Bearer"
  expires_in: string
  ext_expires_in: string
  expires_on: string
  not_before: string
  resource: string
  access_token: string
}

export const getAuthorizationTokens = async (
  resource: string,
  credentials: AzureCredentials,
): Promise<Result<AzureAuthenticationTokens, Error>> => {
  let response: Result<TokenResponse, ApiError>

  if (isManagedIdentity(credentials)) {
    response = await sendJsonRequest<TokenResponse>(
      `${credentials.endpoint}?resource=${resource}&api-version=2017-09-01`,
      {
        headers: {
          Secret: credentials.secret,
        },
      },
    )
  } else if (isServicePrincipal(credentials)) {
    const data = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      resource: resource,
    })
    response = await sendJsonRequest<TokenResponse>(
      `https://login.microsoftonline.com/${credentials.tenantId}/oauth2/token`,
      {
        method: "POST",
        body: data,
      },
    )
  } else {
    return Err(new Error("Invalid credentials!"))
  }

  if (response.isOk()) {
    const token = response.unwrap()

    return Ok({
      tokenType: token.token_type,
      accessToken: token.access_token,
    })
  }
  return Err(new Error("Invalid response from azure identity api!"))
}

const createApiError = (msg: string) => Err<AzureApi, Error>(new Error(msg))

export type AzureApi = {
  // https://docs.microsoft.com/en-us/rest/api/resources/resources/listbyresourcegroup
  listResources: (
    filter: string,
    expand?: string,
    top?: number,
  ) => Promise<Result<ResourceListResult, ApiError>>

  cdn: {
    // https://docs.microsoft.com/en-us/rest/api/cdn/endpoints/get
    getEndpoint: (
      cdnProfileName: string,
      cdnEndpointName: string,
    ) => Promise<Result<Endpoint, ApiError>>

    // https://docs.microsoft.com/en-us/rest/api/cdn/customdomains/listbyendpoint
    listCustomDomains: (
      cdnProfileName: string,
      cdnEndpointName: string,
    ) => Promise<Result<CustomDomainListResult["value"], ApiError>>

    // https://docs.microsoft.com/en-us/rest/api/cdn/customdomains/get
    getCustomDomainCertificate: (
      cdnProfileName: string,
      cdnEndpointName: string,
      cdnCustomDomainName: string,
    ) => Promise<Result<string | undefined, ApiError>>

    // https://docs.microsoft.com/en-us/rest/api/cdn/customdomains/enablecustomhttps
    setCustomDomainCertificate: (
      cdnProfileName: string,
      cdnEndpointName: string,
      cdnCustomDomainName: string,
      keyVaultName: string,
      secretName: string,
      secretVersion: string,
    ) => Promise<Result<CdnCustomDomainResponse, ApiError>>
  }

  vault: {
    // https://docs.microsoft.com/en-us/rest/api/keyvault/getcertificate/getcertificate
    getCertificate: (
      keyVaultName: string,
      certificateName: string,
    ) => Promise<Result<Option<KeyVaultCertificateResponse>, ApiError>>

    // https://docs.microsoft.com/en-us/rest/api/keyvault/importcertificate/importcertificate
    setCertificate: (
      keyVaultName: string,
      certificateName: string,
      certificate: string,
      type: "pem" | "pkcs12",
    ) => Promise<Result<string, ApiError>>

    // https://docs.microsoft.com/en-us/rest/api/keyvault/getsecret/getsecret
    getSecret: (
      keyVaultName: string,
      secretName: string,
    ) => Promise<Result<Option<{ value: string; version: string }>, ApiError>>

    // https://docs.microsoft.com/en-us/rest/api/keyvault/setsecret/setsecret
    setSecret: (
      keyVaultName: string,
      secretName: string,
      secretValue: string,
    ) => Promise<Result<string, ApiError>>
  }

  webApp: {
    getByName: (name: string) => Promise<Result<Site, ApiError>>
  }
}

const createAzureCdnApi = (
  subscriptionId: string,
  resourceGroup: string,
  tokens: AzureAuthenticationTokens,
) => {
  const apiVersion = "2019-12-31"
  const getEndpoint = async (
    cdnProfileName: string,
    cdnEndpointName: string,
  ) => {
    const endpoint = getManagementEndpoint(
      subscriptionId,
      resourceGroup,
      `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}?api-version=${apiVersion}`,
    )
    const response = await sendJsonRequest<Endpoint>(endpoint, {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
      },
    })
    return response
  }

  const listCustomDomains = async (
    cdnProfileName: string,
    cdnEndpointName: string,
  ) => {
    const endpoint = getManagementEndpoint(
      subscriptionId,
      resourceGroup,
      `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}/customDomains?api-version=${apiVersion}`,
    )
    const response = await sendJsonRequest<CustomDomainListResult>(endpoint, {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
      },
    })
    return response
      .map((result) => result.value)
      .orElse<CustomDomainListResult["value"]>((err) =>
        err.statusCode === 404 ? Ok([]) : Err(err),
      )
  }

  const getCustomDomainCertificate = async (
    cdnProfileName: string,
    cdnEndpointName: string,
    cdnCustomDomainName: string,
  ) => {
    const endpoint = getManagementEndpoint(
      subscriptionId,
      resourceGroup,
      `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}/customDomains/${cdnCustomDomainName}?api-version=${apiVersion}`,
    )
    const response = await sendJsonRequest<CdnCustomDomainResponse>(endpoint, {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
      },
    })

    return response.map(
      (customDomainResponse) =>
        customDomainResponse.properties.customHttpsParameters
          ?.certificateSourceParameters.secretVersion,
    )
  }

  const setCustomDomainCertificate = async (
    cdnProfileName: string,
    cdnEndpointName: string,
    cdnCustomDomainName: string,
    vaultName: string,
    secretName: string,
    secretVersion: string,
  ) => {
    const data: CustomHttpsParameters = {
      certificateSource: "AzureKeyVault",
      certificateSourceParameters: {
        deleteRule: "NoAction",
        vaultName,
        "@odata.type":
          "#Microsoft.Azure.Cdn.Models.KeyVaultCertificateSourceParameters",
        resourceGroupName: resourceGroup,
        secretName,
        secretVersion,
        subscriptionId,
        updateRule: "NoAction",
      },
      protocolType: "ServerNameIndication",
    }
    const endpoint = getManagementEndpoint(
      subscriptionId,
      resourceGroup,
      `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}/customDomains/${cdnCustomDomainName}/enableCustomHttps?api-version=${apiVersion}`,
    )

    const response = await sendJsonRequest<CdnCustomDomainResponse>(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    })

    return response
  }

  return {
    getEndpoint,
    listCustomDomains,
    getCustomDomainCertificate,
    setCustomDomainCertificate,
  }
}

const createAzureKeyVaultApi = (tokens: AzureAuthenticationTokens) => {
  const getSecret = async (
    keyVaultName: string,
    secretName: string,
  ): Promise<Result<Option<{ value: string; version: string }>, ApiError>> => {
    const endpoint = getVaultEndpoint(
      keyVaultName,
      `/secrets/${secretName}?api-version=7.1`,
    )
    const response = await sendJsonRequest<KeyVaultSecretResponse>(endpoint, {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
      },
    })

    return response
      .map((result) =>
        Some({
          value: result.value,
          version: result.id.split("/").slice(-1)[0],
        }),
      )
      .orElse((error) => (error.statusCode === 404 ? Ok(None()) : Err(error)))
  }

  const setSecret = async (
    keyVaultName: string,
    secretName: string,
    secretValue: string,
  ) => {
    const endpoint = getVaultEndpoint(
      keyVaultName,
      `/secrets/${secretName}?api-version=7.1`,
    )
    const data: KeyVaultSecretRequest = {
      contentType: "text/plain",
      value: secretValue,
    }
    const response = await sendJsonRequest<KeyVaultSecretResponse>(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
      },
      method: "PUT",
      body: JSON.stringify(data),
    })

    return response.map((secret) => secret.id)
  }

  const getCertificate = async (
    keyVaultName: string,
    certificateName: string,
  ) => {
    const endpoint = getVaultEndpoint(
      keyVaultName,
      `/certificates/${certificateName}?api-version=7.1`,
    )
    const response = await sendJsonRequest<KeyVaultCertificateResponse>(
      endpoint,
      {
        headers: {
          Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
        },
      },
    )

    return response
      .map((result) => Some(result))
      .orElse<Option<KeyVaultCertificateResponse>>((error) =>
        error.statusCode === 404 ? Ok(None()) : Err(error),
      )
  }

  const setCertificate = async (
    keyVaultName: string,
    certificateName: string,
    certificate: string,
    type: "pem" | "pkcs12",
  ) => {
    const endpoint = getVaultEndpoint(
      keyVaultName,
      `/certificates/${certificateName}/import?api-version=7.1`,
    )

    const data: KeyVaultCertificateRequest = {
      value: certificate,
      policy: {
        secret_props: {
          contentType: `application/x-${type}`,
        },
      },
    }

    const response = await sendJsonRequest<KeyVaultCertificateResponse>(
      endpoint,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(data),
      },
    )

    return response.map((cert) => cert.id)
  }

  return {
    getSecret,
    setSecret,
    getCertificate,
    setCertificate,
  }
}

const createWebAppApi = (
  subscriptionId: string,
  resourceGroup: string,
  tokens: AzureAuthenticationTokens,
) => {
  const getByName = async (name: string): Promise<Result<Site, ApiError>> => {
    const endpoint = getManagementEndpoint(
      subscriptionId,
      resourceGroup,
      `/providers/Microsoft.Web/sites/${name}?api-version=2019-08-01`,
    )

    const response = await sendJsonRequest<Site>(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
      },
    })

    return response
  }

  return {
    getByName,
  }
}

export const createAzureApi = async (
  subscriptionId: string,
  resourceGroup: string,
  getCredentials = getAzureCredentials,
  getTokens = getAuthorizationTokens,
): Promise<Result<AzureApi, Error>> => {
  const credentials = getCredentials()

  if (credentials.isNone()) {
    return createApiError("No credentials provided!")
  }

  const managementToken = await getTokens(
    AZURE_API.MANAGEMENT,
    credentials.unwrap(),
  )

  if (managementToken.isErr()) {
    return createApiError("Failed fetching management api token!")
  }

  const keyVaultToken = await getTokens(AZURE_API.VAULT, credentials.unwrap())

  if (keyVaultToken.isErr()) {
    return createApiError("Failed fetching vault api token!")
  }

  const listResources = async (
    filter: string,
    expand?: string,
    top?: number,
  ) => {
    const token = managementToken.unwrap()
    const query = querystring.stringify({
      $filter: filter,
      $expand: expand,
      $top: top,
    })
    const endpoint = getManagementEndpoint(
      subscriptionId,
      resourceGroup,
      `/resources?api-version=2020-06-01&${query}`,
    )
    const response = await sendJsonRequest<ResourceListResult>(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    })

    return response
  }

  return Ok({
    listResources,

    cdn: createAzureCdnApi(
      subscriptionId,
      resourceGroup,
      managementToken.unwrap(),
    ),

    vault: createAzureKeyVaultApi(keyVaultToken.unwrap()),

    webApp: createWebAppApi(
      subscriptionId,
      resourceGroup,
      managementToken.unwrap(),
    ),
  })
}
