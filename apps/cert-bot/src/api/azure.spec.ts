import { Err, None, Ok, Some } from "@nvd.codes/monad"
import { when } from "jest-when"

import {
  AzureCredentials,
  ManagedIdentity,
  ServicePrincipal,
} from "../models/auth"
import { CdnCustomDomainResponse } from "../models/cdn"
import { getEnvVar } from "../utils"
import {
  AzureApi,
  createAzureApi,
  getAuthorizationTokens,
  getAzureCredentials,
} from "./azure"
import {
  AZURE_API,
  getManagementEndpoint,
  getVaultEndpoint,
} from "./azureEndpoints"
import { ApiError, sendJsonRequest } from "./request"

jest.mock("../utils")
jest.mock("./request")

describe("getAzureCredentials", () => {
  const getEnvVarMock = getEnvVar as jest.MockedFunction<typeof getEnvVar>

  beforeEach(() => {
    getEnvVarMock.mockRestore()
    getEnvVarMock.mockClear()
  })

  it("should return a ManagedIdentity when MSI_ENDPOINT and MSI_SECRET env vars are set", () => {
    // Given
    const endpoint = "http://endpoint"
    const secret = "secret"

    when(getEnvVarMock)
      .calledWith("MSI_ENDPOINT")
      .mockReturnValue(Some(endpoint))
      .calledWith("MSI_SECRET")
      .mockReturnValue(Some(secret))

    // When
    const result = getAzureCredentials()

    // Then
    expect(result).toStrictEqual(
      Some<ManagedIdentity>({
        endpoint,
        secret,
      }),
    )
  })

  it("should returns a ServicePrincipal when AZURE_CLIENT_ID, AZURE_CLIENT_SECRET and AZURE_TENANT_ID are set and no managed id vars are set", () => {
    // Given
    const clientId = "123"
    const clientSecret = "secret"
    const tenantId = "456"

    when(getEnvVarMock)
      .calledWith("AZURE_CLIENT_ID")
      .mockReturnValue(Some(clientId))
      .calledWith("AZURE_CLIENT_SECRET")
      .mockReturnValue(Some(clientSecret))
      .calledWith("AZURE_TENANT_ID")
      .mockReturnValue(Some(tenantId))

    // When
    const result = getAzureCredentials()

    // Then
    expect(result).toStrictEqual(
      Some<ServicePrincipal>({
        clientId,
        clientSecret,
        tenantId,
      }),
    )
  })

  it("should returns None() when no MangedIdentity or ServicePrincipal is configured in the environment", () => {
    // Given, When
    const result = getAzureCredentials()

    // Then
    expect(result).toStrictEqual(None())
  })
})

describe("getAuthorizationTokens", () => {
  const sendJsonRequestMock = sendJsonRequest as jest.MockedFunction<
    typeof sendJsonRequest
  >
  beforeEach(() => {
    sendJsonRequestMock.mockRestore()
    sendJsonRequestMock.mockClear()
  })

  it("should return an error when given invalid credentials", async () => {
    // Given
    const credentials = {} as AzureCredentials
    const resource = "https://resource-one"

    // When
    const tokensOrError = await getAuthorizationTokens(resource, credentials)

    // Then
    expect(tokensOrError).toStrictEqual(Err(new Error("Invalid credentials!")))
  })

  it("should return a set of tokens when succesfully authorizing with a ManagedIdentity", async () => {
    // Given
    const credentials: ManagedIdentity = {
      endpoint: "https://endpoint",
      secret: "secret",
    }
    const resource = "https://some-resource"
    const tokenType = "Bearer"
    const accessToken = "123"

    when(sendJsonRequestMock)
      .calledWith(
        `${credentials.endpoint}?resource=${resource}&api-version=2017-09-01`,
        {
          headers: {
            Secret: credentials.secret,
          },
        },
      )
      .mockResolvedValue(
        Ok({
          token_type: tokenType,
          access_token: accessToken,
        }),
      )

    // When
    const result = await getAuthorizationTokens(resource, credentials)

    // Then
    expect(result).toStrictEqual(
      Ok({
        tokenType,
        accessToken,
      }),
    )
  })

  it("should return an error when authorizing with a ManagedIdentity fails", async () => {
    // Given
    const credentials: ManagedIdentity = {
      endpoint: "https://endpoint",
      secret: "secret",
    }
    const resource = "https://some-resource"

    when(sendJsonRequestMock)
      .calledWith(
        `${credentials.endpoint}?resource=${resource}&api-version=2017-09-01`,
        {
          headers: {
            Secret: credentials.secret,
          },
        },
      )
      .mockResolvedValue(
        Err({
          statusCode: 401,
          message: "Not authorized",
        }),
      )

    // When
    const result = await getAuthorizationTokens(resource, credentials)

    // Then
    expect(result).toStrictEqual(
      Err(new Error("Invalid response from azure identity api!")),
    )
  })

  it("should return a set of tokens when succesfully authorizing with a ServicePrincipal", async () => {
    // Given
    const credentials: ServicePrincipal = {
      clientId: "123",
      clientSecret: "secret",
      tenantId: "567",
    }
    const resource = "https://some-resource"
    const tokenType = "Bearer"
    const accessToken = "123"

    when(sendJsonRequestMock)
      .calledWith(
        `https://login.microsoftonline.com/${credentials.tenantId}/oauth2/token`,
        {
          method: "POST",
          body: expect.anything(),
        },
      )
      .mockResolvedValue(
        Ok({
          token_type: tokenType,
          access_token: accessToken,
        }),
      )

    // When
    const result = await getAuthorizationTokens(resource, credentials)

    // Then
    expect(result).toStrictEqual(
      Ok({
        tokenType,
        accessToken,
      }),
    )
  })

  it("should return an erorr when authorizing with a ServicePrincipal fails", async () => {
    // Given
    const credentials: ServicePrincipal = {
      clientId: "123",
      clientSecret: "secret",
      tenantId: "567",
    }
    const resource = "https://some-resource"

    when(sendJsonRequestMock)
      .calledWith(
        `https://login.microsoftonline.com/${credentials.tenantId}/oauth2/token`,
        {
          method: "POST",
          body: expect.anything(),
        },
      )
      .mockResolvedValue(
        Err({
          statusCode: 401,
          message: "Not authorized",
        }),
      )

    // When
    const result = await getAuthorizationTokens(resource, credentials)

    // Then
    expect(result).toStrictEqual(
      Err(new Error("Invalid response from azure identity api!")),
    )
  })
})

describe("createAzureApi", () => {
  let getCredentialsMock: jest.MockedFunction<typeof getAzureCredentials>
  let getAuthorizationTokensMock: jest.MockedFunction<
    typeof getAuthorizationTokens
  >
  const tokenType = "Bearer"
  const accessToken = "123"

  const credentials = {
    endpoint: "http://endpoint",
    secret: "hello",
  }
  beforeEach(() => {
    getCredentialsMock = jest.fn()
    getAuthorizationTokensMock = jest.fn()

    getCredentialsMock.mockReturnValue(Some(credentials))

    when(getAuthorizationTokensMock)
      .calledWith(AZURE_API.MANAGEMENT, credentials)
      .mockResolvedValue(
        Ok({
          tokenType,
          accessToken,
        }),
      )

    when(getAuthorizationTokensMock)
      .calledWith(AZURE_API.VAULT, credentials)
      .mockResolvedValue(
        Ok({
          tokenType,
          accessToken,
        }),
      )
  })

  it("should return an error when no valid credentials are found", async () => {
    //Given
    const subscriptionId = "123"
    const resourceGroup = "group"
    getCredentialsMock.mockReset()
    getCredentialsMock.mockReturnValue(None())

    // When
    const resultOrError = await createAzureApi(
      subscriptionId,
      resourceGroup,
      getCredentialsMock,
      getAuthorizationTokensMock,
    )

    //Then
    expect(resultOrError).toStrictEqual(
      Err(new Error("No credentials provided!")),
    )
  })

  it("should return an error when it can't authenticate with the azure management api", async () => {
    // Given
    const subscriptionId = "123"
    const resourceGroup = "group"
    getAuthorizationTokensMock.mockReset()
    when(getAuthorizationTokensMock)
      .calledWith(AZURE_API.MANAGEMENT, credentials)
      .mockResolvedValue(Err(new Error("some error")))

    // When
    const resultOrError = await createAzureApi(
      subscriptionId,
      resourceGroup,
      getCredentialsMock,
      getAuthorizationTokensMock,
    )

    // Then
    expect(resultOrError).toStrictEqual(
      Err(new Error("Failed fetching management api token!")),
    )
  })

  it("should return an error when it can't authenticate with the azure vault api", async () => {
    // Given
    const subscriptionId = "123"
    const resourceGroup = "group"
    getAuthorizationTokensMock.mockReset()
    when(getAuthorizationTokensMock)
      .calledWith(AZURE_API.MANAGEMENT, credentials)
      .mockResolvedValue(Ok({ tokenType, accessToken }))

    when(getAuthorizationTokensMock)
      .calledWith(AZURE_API.VAULT, credentials)
      .mockResolvedValue(Err(new Error("some error")))
    // When
    const resultOrError = await createAzureApi(
      subscriptionId,
      resourceGroup,
      getCredentialsMock,
      getAuthorizationTokensMock,
    )

    // Then
    expect(resultOrError).toStrictEqual(
      Err(new Error("Failed fetching vault api token!")),
    )
  })

  it("should return an azure api object when successfully authenticated", async () => {
    // Given
    const subscriptionId = "123"
    const resourceGroup = "group"

    // When
    const resultOrError = await createAzureApi(
      subscriptionId,
      resourceGroup,
      getCredentialsMock,
      getAuthorizationTokensMock,
    )

    // Then
    expect(resultOrError).toStrictEqual(
      Ok({
        getCdnCustomDomainCertificate: expect.any(Function),
        setCdnCustomDomainCertificate: expect.any(Function),
        getKeyVaultCertificate: expect.any(Function),
        setKeyVaultCertificate: expect.any(Function),
        getKeyVaultSecret: expect.any(Function),
        setKeyVaultSecret: expect.any(Function),
      }),
    )
  })
})

describe("AzureApi", () => {
  const subscriptionId = "123"
  const resourceGroup = "group"
  const tokenType = "Bearer"
  const accessToken = "123"
  const credentials = {
    endpoint: "http://endpoint",
    secret: "hello",
  }

  let getCredentialsMock: jest.MockedFunction<typeof getAzureCredentials>
  let getAuthorizationTokensMock: jest.MockedFunction<
    typeof getAuthorizationTokens
  >

  let azure: AzureApi

  beforeEach(async () => {
    getCredentialsMock = jest.fn()
    getAuthorizationTokensMock = jest.fn()

    getCredentialsMock.mockReturnValue(Some(credentials))

    when(getAuthorizationTokensMock)
      .calledWith(AZURE_API.MANAGEMENT, credentials)
      .mockResolvedValue(
        Ok({
          tokenType,
          accessToken,
        }),
      )

    when(getAuthorizationTokensMock)
      .calledWith(AZURE_API.VAULT, credentials)
      .mockResolvedValue(
        Ok({
          tokenType,
          accessToken,
        }),
      )

    const resultOrError = await createAzureApi(
      subscriptionId,
      resourceGroup,
      getCredentialsMock,
      getAuthorizationTokensMock,
    )

    if (resultOrError.isErr()) throw resultOrError.unwrapErr()

    azure = resultOrError.unwrap()
  })

  describe("getCdnCustomDomainCertificate", () => {
    const sendJsonRequestMock = sendJsonRequest as jest.MockedFunction<
      typeof sendJsonRequest
    >

    beforeEach(async () => {
      sendJsonRequestMock.mockRestore()
      sendJsonRequestMock.mockClear()
    })

    it("should return the version of the cdn domain certificate", async () => {
      // Given
      const cdnProfileName = "profileName"
      const cdnEndpointName = "endpointName"
      const cdnCustomDomainName = "domainName"

      when(sendJsonRequestMock)
        .calledWith(
          getManagementEndpoint(
            subscriptionId,
            resourceGroup,
            `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}/customDomains/${cdnCustomDomainName}?api-version=2018-04-02`,
          ),
          {
            headers: {
              Authorization: `Bearer 123`,
            },
          },
        )
        .mockResolvedValue(
          Ok<CdnCustomDomainResponse, ApiError>({
            properties: {
              customHttpsParameters: {
                certificateSource: "source",
                protocolType: "type",
                certificateSourceParameters: {
                  secretName: "name",
                  secretVersion: "456",
                  deleteRule: "deleteRule",
                  updateRule: "updateRule",
                  keyVaultName: "keyVaultName",
                  oDataType: "oDataType",
                  resourceGroup,
                  subscriptionID: subscriptionId,
                },
              },
            },
          }),
        )

      // When
      const resultOrError = await azure.getCdnCustomDomainCertificate(
        cdnProfileName,
        cdnEndpointName,
        cdnCustomDomainName,
      )

      // Then
      expect(resultOrError).toStrictEqual(Ok("456"))
    })

    it("should return undefined when no certificate is configured", async () => {
      // Given
      const cdnProfileName = "profileName"
      const cdnEndpointName = "endpointName"
      const cdnCustomDomainName = "domainName"

      when(sendJsonRequestMock)
        .calledWith(
          getManagementEndpoint(
            subscriptionId,
            resourceGroup,
            `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}/customDomains/${cdnCustomDomainName}?api-version=2018-04-02`,
          ),
          {
            headers: {
              Authorization: `Bearer 123`,
            },
          },
        )
        .mockResolvedValue(
          Ok<CdnCustomDomainResponse, ApiError>({
            properties: {},
          }),
        )

      // When
      const resultOrError = await azure.getCdnCustomDomainCertificate(
        cdnProfileName,
        cdnEndpointName,
        cdnCustomDomainName,
      )

      // Then
      expect(resultOrError).toStrictEqual(Ok(undefined))
    })

    it("should forward any api errors", async () => {
      // Given
      const cdnProfileName = "profileName"
      const cdnEndpointName = "endpointName"
      const cdnCustomDomainName = "domainName"

      when(sendJsonRequestMock)
        .calledWith(
          getManagementEndpoint(
            subscriptionId,
            resourceGroup,
            `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}/customDomains/${cdnCustomDomainName}?api-version=2018-04-02`,
          ),
          {
            headers: {
              Authorization: `Bearer 123`,
            },
          },
        )
        .mockResolvedValue(
          Err({
            message: "Some Error",
            statusCode: 500,
          }),
        )

      // When
      const resultOrError = await azure.getCdnCustomDomainCertificate(
        cdnProfileName,
        cdnEndpointName,
        cdnCustomDomainName,
      )

      // Then
      expect(resultOrError).toStrictEqual(
        Err({
          message: "Some Error",
          statusCode: 500,
        }),
      )
    })
  })

  describe("setCdnCustomDomainCertificate", () => {
    const sendJsonRequestMock = sendJsonRequest as jest.MockedFunction<
      typeof sendJsonRequest
    >

    beforeEach(async () => {
      sendJsonRequestMock.mockRestore()
      sendJsonRequestMock.mockClear()
    })

    it("should add a new KeyVault certificate to a CDN resource", async () => {
      // Given
      const cdnProfileName = "profileName"
      const cdnEndpointName = "endpointName"
      const cdnCustomDomainName = "domainName"

      const keyVaultName = "keyVaultName"
      const secretName = "secretName"
      const secretVersion = "secretVersion"

      when(sendJsonRequestMock)
        .calledWith(
          getManagementEndpoint(
            subscriptionId,
            resourceGroup,
            `/providers/Microsoft.Cdn/profiles/${cdnProfileName}/endpoints/${cdnEndpointName}/customDomains/${cdnCustomDomainName}/enableCustomHttps?api-version=2019-12-31`,
          ),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 123`,
            },
            method: "POST",
            body: JSON.stringify({
              certificateSource: "AzureKeyVault",
              certificateSourceParameters: {
                deleteRule: "NoAction",
                keyVaultName,
                oDataType:
                  "#Microsoft.Azure.Cdn.Models.KeyVaultCertificateSourceParameters",
                resourceGroup,
                secretName,
                secretVersion,
                subscriptionID: subscriptionId,
                updateRule: "NoAction",
              },
              protocolType: "ServerNameIndication",
            }),
          },
        )
        .mockResolvedValue(
          Ok({
            properties: {},
          }),
        )

      // When
      const resultOrError = await azure.setCdnCustomDomainCertificate(
        cdnProfileName,
        cdnEndpointName,
        cdnCustomDomainName,
        keyVaultName,
        secretName,
        secretVersion,
      )

      // Then
      expect(resultOrError).toStrictEqual(
        Ok({
          properties: {},
        }),
      )
    })

    it("should forward any api errors", async () => {
      // Given
      const cdnProfileName = "profileName"
      const cdnEndpointName = "endpointName"
      const cdnCustomDomainName = "domainName"

      sendJsonRequestMock.mockResolvedValue(
        Err({
          message: "Some Error",
          statusCode: 500,
        }),
      )

      // When
      const resultOrError = await azure.setCdnCustomDomainCertificate(
        cdnProfileName,
        cdnEndpointName,
        cdnCustomDomainName,
        "keyVaultName",
        "secretName",
        "secretVersion",
      )

      // Then
      expect(resultOrError).toStrictEqual(
        Err({
          message: "Some Error",
          statusCode: 500,
        }),
      )
    })
  })

  describe("getKeyVaultCertificate", () => {
    const sendJsonRequestMock = sendJsonRequest as jest.MockedFunction<
      typeof sendJsonRequest
    >

    beforeEach(async () => {
      sendJsonRequestMock.mockRestore()
      sendJsonRequestMock.mockClear()
    })

    it("should return a key vault certificate", async () => {
      // Given
      const keyVaultName = "keyVaultName"
      const certificateName = "certificateName"

      when(sendJsonRequestMock)
        .calledWith(
          getVaultEndpoint(
            keyVaultName,
            `/certificates/${certificateName}?api-version=7.1`,
          ),
          {
            headers: {
              Authorization: "Bearer 123",
            },
          },
        )
        .mockResolvedValue(
          Ok({
            id: "123",
            cer: "cer",
          }),
        )

      // When
      const resultOrError = await azure.getKeyVaultCertificate(
        keyVaultName,
        certificateName,
      )

      // Then
      expect(resultOrError).toStrictEqual(Ok(Some({ id: "123", cer: "cer" })))
    })

    it("should return None when the api returns a 404", async () => {
      // Given
      const keyVaultName = "keyVaultName"
      const certificateName = "certificateName"

      when(sendJsonRequestMock)
        .calledWith(
          getVaultEndpoint(
            keyVaultName,
            `/certificates/${certificateName}?api-version=7.1`,
          ),
          {
            headers: {
              Authorization: "Bearer 123",
            },
          },
        )
        .mockResolvedValue(
          Err({
            statusCode: 404,
            message: "Not Found",
          }),
        )

      // When
      const resultOrError = await azure.getKeyVaultCertificate(
        keyVaultName,
        certificateName,
      )

      // Then
      expect(resultOrError).toStrictEqual(Ok(None()))
    })

    it("should forward any api errors", async () => {
      // Given
      const keyVaultName = "keyVaultName"
      const certificateName = "certificateName"

      sendJsonRequestMock.mockResolvedValue(
        Err({
          statusCode: 500,
          message: "Server Error",
        }),
      )

      // When
      const resultOrError = await azure.getKeyVaultCertificate(
        keyVaultName,
        certificateName,
      )

      // Then
      expect(resultOrError).toStrictEqual(
        Err({
          statusCode: 500,
          message: "Server Error",
        }),
      )
    })
  })

  describe("setKeyVaultCertificate", () => {
    const sendJsonRequestMock = sendJsonRequest as jest.MockedFunction<
      typeof sendJsonRequest
    >

    beforeEach(async () => {
      sendJsonRequestMock.mockRestore()
      sendJsonRequestMock.mockClear()
    })

    it.each(["pem", "pkcs12"])(
      "should add a %s certificate to the vault and return its id",
      async (type) => {
        // Given
        const keyVaultName = "keyVaultName"
        const certificateName = "certificateName"
        const certificate = "certificate"

        when(sendJsonRequestMock)
          .calledWith(
            getVaultEndpoint(
              keyVaultName,
              `/certificates/${certificateName}/import?api-version=7.1`,
            ),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer 123",
              },
              method: "POST",
              body: JSON.stringify({
                value: certificate,
                policy: {
                  secret_props: {
                    contentType: `application/x-${type}`,
                  },
                },
              }),
            },
          )
          .mockResolvedValue(
            Ok({
              id: "123",
              cer: "cer",
            }),
          )

        // When
        const resultOrError = await azure.setKeyVaultCertificate(
          keyVaultName,
          certificateName,
          certificate,
          type as "pem" | "pkcs12",
        )

        // Then
        expect(resultOrError).toStrictEqual(Ok("123"))
      },
    )

    it("should forward any api errors", async () => {
      // Given
      const keyVaultName = "keyVaultName"
      const certificateName = "certificateName"
      const certificate = "certificate"

      sendJsonRequestMock.mockResolvedValue(
        Err({
          statusCode: 500,
          message: "Server Error",
        }),
      )

      // When
      const resultOrError = await azure.setKeyVaultCertificate(
        keyVaultName,
        certificateName,
        certificate,
        "pem",
      )

      // Then
      expect(resultOrError).toStrictEqual(
        Err({
          statusCode: 500,
          message: "Server Error",
        }),
      )
    })
  })

  describe("getKeyVaultSecret", () => {
    const sendJsonRequestMock = sendJsonRequest as jest.MockedFunction<
      typeof sendJsonRequest
    >

    beforeEach(async () => {
      sendJsonRequestMock.mockRestore()
      sendJsonRequestMock.mockClear()
    })

    it("should return a key vault secret", async () => {
      // Given
      const keyVaultName = "keyVaultName"
      const secretName = "secretName"

      when(sendJsonRequestMock)
        .calledWith(
          getVaultEndpoint(
            keyVaultName,
            `/secrets/${secretName}?api-version=7.1`,
          ),
          {
            headers: {
              Authorization: "Bearer 123",
            },
          },
        )
        .mockResolvedValue(
          Ok({
            id: "https://url/123",
            value: "cer",
          }),
        )

      // When
      const resultOrError = await azure.getKeyVaultSecret(
        keyVaultName,
        secretName,
      )

      // Then
      expect(resultOrError).toStrictEqual(
        Ok(Some({ value: "cer", version: "123" })),
      )
    })

    it("should return None when the api returns a 404", async () => {
      // Given
      const keyVaultName = "keyVaultName"
      const secretName = "certificateName"

      when(sendJsonRequestMock)
        .calledWith(
          getVaultEndpoint(
            keyVaultName,
            `/secrets/${secretName}?api-version=7.1`,
          ),
          {
            headers: {
              Authorization: "Bearer 123",
            },
          },
        )
        .mockResolvedValue(
          Err({
            statusCode: 404,
            message: "Not Found",
          }),
        )

      // When
      const resultOrError = await azure.getKeyVaultSecret(
        keyVaultName,
        secretName,
      )

      // Then
      expect(resultOrError).toStrictEqual(Ok(None()))
    })

    it("should forward any api errors", async () => {
      // Given
      const keyVaultName = "keyVaultName"
      const secretName = "secretName"

      sendJsonRequestMock.mockResolvedValue(
        Err({
          statusCode: 500,
          message: "Server Error",
        }),
      )

      // When
      const resultOrError = await azure.getKeyVaultSecret(
        keyVaultName,
        secretName,
      )

      // Then
      expect(resultOrError).toStrictEqual(
        Err({
          statusCode: 500,
          message: "Server Error",
        }),
      )
    })
  })

  describe("setKeyVaultSecret", () => {
    const sendJsonRequestMock = sendJsonRequest as jest.MockedFunction<
      typeof sendJsonRequest
    >

    beforeEach(async () => {
      sendJsonRequestMock.mockRestore()
      sendJsonRequestMock.mockClear()
    })

    it("should add a secret to the vault and return its id", async () => {
      // Given
      const keyVaultName = "keyVaultName"
      const secretName = "secretName"
      const secretValue = "secretValue"

      when(sendJsonRequestMock)
        .calledWith(
          getVaultEndpoint(
            keyVaultName,
            `/secrets/${secretName}?api-version=7.1`,
          ),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer 123",
            },
            method: "PUT",
            body: JSON.stringify({
              contentType: "text/plain",
              value: secretValue,
            }),
          },
        )
        .mockResolvedValue(
          Ok({
            id: "123",
            cer: "cer",
          }),
        )

      // When
      const resultOrError = await azure.setKeyVaultSecret(
        keyVaultName,
        secretName,
        secretValue,
      )

      // Then
      expect(resultOrError).toStrictEqual(Ok("123"))
    })

    it("should forward any api errors", async () => {
      // Given
      const keyVaultName = "keyVaultName"
      const secretName = "secretName"
      const secretValue = "secretValue"

      sendJsonRequestMock.mockResolvedValue(
        Err({
          statusCode: 500,
          message: "Server Error",
        }),
      )

      // When
      const resultOrError = await azure.setKeyVaultSecret(
        keyVaultName,
        secretName,
        secretValue,
      )

      // Then
      expect(resultOrError).toStrictEqual(
        Err({
          statusCode: 500,
          message: "Server Error",
        }),
      )
    })
  })
})
