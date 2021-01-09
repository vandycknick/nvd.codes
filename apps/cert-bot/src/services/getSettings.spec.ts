import { None, Some } from "@nvd.codes/monad"
import { when } from "jest-when"
import { getEnvVar, getOptionalEnvVar } from "../utils"
import { getSettings } from "./getSettings"

jest.mock("../utils")

describe("getSettings", () => {
  const getEnvVarMock = getEnvVar as jest.MockedFunction<typeof getEnvVar>
  const getOptionalEnvVarMock = getOptionalEnvVar as jest.MockedFunction<
    typeof getOptionalEnvVar
  >
  beforeEach(() => {
    getEnvVarMock.mockRestore()
    getEnvVarMock.mockClear()

    getOptionalEnvVarMock.mockRestore()
    getOptionalEnvVarMock.mockClear()

    getOptionalEnvVarMock.mockImplementation((_key, defaultz) => Some(defaultz))
  })

  it("should return None when a setting is missing", () => {
    // Given
    when(getEnvVarMock)
      .calledWith("AZURE_KEYVAULT_NAME")
      .mockReturnValue(Some("keyVaultName"))
    // When
    const settings = getSettings()

    // Then
    expect(settings).toStrictEqual(None())
  })

  it("should return Some settings object when all settings are present", () => {
    // Given
    when(getEnvVarMock)
      .calledWith("AZURE_KEYVAULT_NAME")
      .mockReturnValue(Some("keyVaultName"))
      .calledWith("AZURE_KEYVAULT_SECRET_NAME")
      .mockReturnValue(Some("keyVaultSecretName"))
      .calledWith("AZURE_SUBSCRIPTION_ID")
      .mockReturnValue(Some("subscriptionId"))
      .calledWith("AZURE_RESOURCE_GROUP")
      .mockReturnValue(Some("resourceGroupName"))
      .calledWith("CLOUDFLARE_ZONE_ID")
      .mockReturnValue(Some("123"))
      .calledWith("ACME_CONTACT_URL")
      .mockReturnValue(Some("mailto:email"))

    when(getOptionalEnvVarMock)
      .calledWith("ACME_DIRECTORY_URL", expect.any(String))
      .mockReturnValue(Some("https://directory"))
      .calledWith("CERT_BOT_ENABLED", expect.any(String))
      .mockReturnValue(Some("false"))
    // When
    const settings = getSettings()

    // Then
    expect(settings).toStrictEqual(
      Some({
        azureKeyVaultName: "keyVaultName",
        azureKeyVaultSecretName: "keyVaultSecretName",
        azureSubscriptionId: "subscriptionId",
        azureResourceGroup: "resourceGroupName",
        cloudflareZoneId: "123",
        acmeDirectoryUrl: "https://directory",
        acmeContactUrl: "mailto:email",
        certBotEnabled: false,
      }),
    )
  })

  it("should return true when cert bot is enabled", () => {
    // Given
    when(getEnvVarMock)
      .calledWith("AZURE_KEYVAULT_NAME")
      .mockReturnValue(Some("keyVaultName"))
      .calledWith("AZURE_KEYVAULT_SECRET_NAME")
      .mockReturnValue(Some("keyVaultSecretName"))
      .calledWith("AZURE_SUBSCRIPTION_ID")
      .mockReturnValue(Some("subscriptionId"))
      .calledWith("AZURE_RESOURCE_GROUP")
      .mockReturnValue(Some("resourceGroupName"))
      .calledWith("CLOUDFLARE_ZONE_ID")
      .mockReturnValue(Some("123"))
      .calledWith("ACME_CONTACT_URL")
      .mockReturnValue(Some("mailto:email"))

    when(getOptionalEnvVarMock)
      .calledWith("ACME_DIRECTORY_URL", expect.any(String))
      .mockReturnValue(
        Some("https://acme-staging-v02.api.letsencrypt.org/directory"),
      )
      .calledWith("CERT_BOT_ENABLED", expect.any(String))
      .mockReturnValue(Some("true"))

    // When
    const settings = getSettings()

    // Then
    expect(settings).toStrictEqual(
      Some({
        azureKeyVaultName: "keyVaultName",
        azureKeyVaultSecretName: "keyVaultSecretName",
        azureSubscriptionId: "subscriptionId",
        azureResourceGroup: "resourceGroupName",
        cloudflareZoneId: "123",
        acmeDirectoryUrl:
          "https://acme-staging-v02.api.letsencrypt.org/directory",
        acmeContactUrl: "mailto:email",
        certBotEnabled: true,
      }),
    )
  })

  it("should return a default value for directory url when not provided", () => {
    // Given
    when(getEnvVarMock)
      .calledWith("AZURE_KEYVAULT_NAME")
      .mockReturnValue(Some("keyVaultName"))
      .calledWith("AZURE_KEYVAULT_SECRET_NAME")
      .mockReturnValue(Some("keyVaultSecretName"))
      .calledWith("AZURE_SUBSCRIPTION_ID")
      .mockReturnValue(Some("subscriptionId"))
      .calledWith("AZURE_RESOURCE_GROUP")
      .mockReturnValue(Some("resourceGroupName"))
      .calledWith("CLOUDFLARE_ZONE_ID")
      .mockReturnValue(Some("123"))
      .calledWith("ACME_CONTACT_URL")
      .mockReturnValue(Some("mailto:email"))

    // When
    const settings = getSettings()

    // Then
    expect(settings).toStrictEqual(
      Some({
        azureKeyVaultName: "keyVaultName",
        azureKeyVaultSecretName: "keyVaultSecretName",
        azureSubscriptionId: "subscriptionId",
        azureResourceGroup: "resourceGroupName",
        cloudflareZoneId: "123",
        acmeDirectoryUrl:
          "https://acme-staging-v02.api.letsencrypt.org/directory",
        acmeContactUrl: "mailto:email",
        certBotEnabled: false,
      }),
    )
  })
})
