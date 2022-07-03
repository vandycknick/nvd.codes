import { Option, None, Err, Ok, Result, Some } from "@nvd.codes/monad"
import { URLSearchParams } from "url"

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
import { CdnCustomDomainResponse, CustomHttpsParameters } from "../models/cdn"
import { ApiError, sendJsonRequest } from "./request"
import {
  KeyVaultCertificateRequest,
  KeyVaultCertificateResponse,
  KeyVaultSecretRequest,
  KeyVaultSecretResponse,
} from "../models/keyVault"
import { getEnvVar } from "../utils"

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
  getCdnCustomDomainCertificate: (
    cdnProfileName: string,
    cdnEndpointName: string,
    cdnCustomDomainName: string,
  ) => Promise<Result<string | undefined, ApiError>>

  setCdnCustomDomainCertificate: (
    cdnProfileName: string,
    cdnEndpointName: string,
    cdnCustomDomainName: string,
    keyVaultName: string,
    secretName: string,
    secretVersion: string,
  ) => Promise<Result<CdnCustomDomainResponse, ApiError>>

  getKeyVaultCertificate: (
    keyVaultName: string,
    certificateName: string,
  ) => Promise<Result<Option<KeyVaultCertificateResponse>, ApiError>>

  setKeyVaultCertificate: (
    keyVaultName: string,
    certificateName: string,
    certificate: string,
    type: "pem" | "pkcs12",
  ) => Promise<Result<string, ApiError>>

  getKeyVaultSecret: (
    keyVaultName: string,
    secretName: string,
  ) => Promise<Result<Option<{ value: string; version: string }>, ApiError>>

  setKeyVaultSecret: (
    keyVaultName: string,
    secretName: string,
    secretValue: string,
  ) => Promise<Result<string, ApiError>>
}

export const createAzureApi = async (
  subscriptionID: string,
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

  const getCdnCustomDomainCertificate = async (
    cdnProfileName: string,
    cdnEndpointName: string,
    cdnCustomDomainName: string,
  ) => {
    const tokens = managementToken.unwrap()
    const endpoint = getManagementEndpoint(
      subscriptionID,
      resourceGroup,
      `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}/customDomains/${cdnCustomDomainName}?api-version=2018-04-02`,
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

  const setCdnCustomDomainCertificate = async (
    cdnProfileName: string,
    cdnEndpointName: string,
    cdnCustomDomainName: string,
    keyVaultName: string,
    secretName: string,
    secretVersion: string,
  ) => {
    const token = managementToken.unwrap()
    const data: CustomHttpsParameters = {
      certificateSource: "AzureKeyVault",
      certificateSourceParameters: {
        deleteRule: "NoAction",
        keyVaultName,
        oDataType:
          "#Microsoft.Azure.Cdn.Models.KeyVaultCertificateSourceParameters",
        resourceGroup,
        secretName,
        secretVersion,
        subscriptionID,
        updateRule: "NoAction",
      },
      protocolType: "ServerNameIndication",
    }
    const endpoint = getManagementEndpoint(
      subscriptionID,
      resourceGroup,
      `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}/customDomains/${cdnCustomDomainName}/enableCustomHttps?api-version=2019-12-31`,
    )

    const response = await sendJsonRequest<CdnCustomDomainResponse>(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    })

    return response
  }

  const getKeyVaultCertificate = async (
    keyVaultName: string,
    certificateName: string,
  ) => {
    const endpoint = getVaultEndpoint(
      keyVaultName,
      `/certificates/${certificateName}?api-version=7.1`,
    )
    const token = keyVaultToken.unwrap()
    const response = await sendJsonRequest<KeyVaultCertificateResponse>(
      endpoint,
      {
        headers: {
          Authorization: `${token.tokenType} ${token.accessToken}`,
        },
      },
    )

    return response
      .map((result) => Some(result))
      .orElse<Option<KeyVaultCertificateResponse>>((error) =>
        error.statusCode === 404 ? Ok(None()) : Err(error),
      )
  }

  const setKeyVaultCertificate = async (
    keyVaultName: string,
    certificateName: string,
    certificate: string,
    type: "pem" | "pkcs12",
  ) => {
    const endpoint = getVaultEndpoint(
      keyVaultName,
      `/certificates/${certificateName}/import?api-version=7.1`,
    )
    const token = keyVaultToken.unwrap()

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
          Authorization: `${token.tokenType} ${token.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(data),
      },
    )

    return response.map((cert) => cert.id)
  }

  const getKeyVaultSecret = async (
    keyVaultName: string,
    secretName: string,
  ): Promise<Result<Option<{ value: string; version: string }>, ApiError>> => {
    const endpoint = getVaultEndpoint(
      keyVaultName,
      `/secrets/${secretName}?api-version=7.1`,
    )
    const token = keyVaultToken.unwrap()
    const response = await sendJsonRequest<KeyVaultSecretResponse>(endpoint, {
      headers: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
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

  const setKeyVaultSecret = async (
    keyVaultName: string,
    secretName: string,
    secretValue: string,
  ) => {
    const endpoint = getVaultEndpoint(
      keyVaultName,
      `/secrets/${secretName}?api-version=7.1`,
    )
    const token = keyVaultToken.unwrap()
    const data: KeyVaultSecretRequest = {
      contentType: "text/plain",
      value: secretValue,
    }
    const response = await sendJsonRequest<KeyVaultSecretResponse>(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
      method: "PUT",
      body: JSON.stringify(data),
    })

    return response.map((secret) => secret.id)
  }

  return Ok({
    // https://docs.microsoft.com/en-us/rest/api/cdn/customdomains/get
    getCdnCustomDomainCertificate,

    // https://docs.microsoft.com/en-us/rest/api/cdn/customdomains/enablecustomhttps
    setCdnCustomDomainCertificate,

    // https://docs.microsoft.com/en-us/rest/api/keyvault/getcertificate/getcertificate
    getKeyVaultCertificate,

    // https://docs.microsoft.com/en-us/rest/api/keyvault/importcertificate/importcertificate
    setKeyVaultCertificate,

    // https://docs.microsoft.com/en-us/rest/api/keyvault/getsecret/getsecret
    getKeyVaultSecret,

    // https://docs.microsoft.com/en-us/rest/api/keyvault/setsecret/setsecret
    setKeyVaultSecret,
  })
}
