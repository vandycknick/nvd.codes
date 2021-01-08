import { None, Some } from "@nvd.codes/monad"
import { when } from "jest-when"
import { getEnvVar } from "../utils"
import { getSettings } from "./getSettings"

jest.mock("../utils")

describe("getSettings", () => {
  const getEnvVarMock = getEnvVar as jest.MockedFunction<typeof getEnvVar>

  beforeEach(() => {
    getEnvVarMock.mockRestore()
    getEnvVarMock.mockClear()
  })

  it("returns None when a setting is missing", () => {
    // Given
    when(getEnvVarMock)
      .calledWith("AZURE_KEYVAULT_NAME")
      .mockReturnValue(Some("keyVaultName"))
    // When
    const settings = getSettings()

    // Then
    expect(settings).toStrictEqual(None())
  })

  it("returns Some settings object when all settings are present", () => {
    // Given
    when(getEnvVarMock)
      .calledWith("AZURE_KEYVAULT_NAME")
      .mockReturnValue(Some("keyVaultName"))
      .calledWith("AZURE_KEYVAULT_SECRET_NAME")
      .mockReturnValue(Some("keyVaultNameSecretName"))
      .calledWith("AZURE_SUBSCRIPTION_ID")
      .mockReturnValue(Some("subscriptionId"))
      .calledWith("AZURE_RESOURCE_GROUP")
      .mockReturnValue(Some("resourceGroupName"))
      .calledWith("CLOUDFLARE_ZONE_ID")
      .mockReturnValue(Some("123"))
      .calledWith("ACME_DIRECTORY_URL")
      .mockReturnValue(Some("https://directory"))
      .calledWith("ACME_CONTACT_URL")
      .mockReturnValue(Some("mailto:email"))

    // When
    const settings = getSettings()

    // Then
    expect(settings).toStrictEqual(
      Some({
        azureKeyVaultName: "keyVaultName",
        azureKeyVaultSecretName: "keyVaultSecretName",
        azureKeyVaultCertificateName: "certificateName",
        azureSubscriptionId: "subscriptionId",
        azureResourceGroup: "resourceGroupName",
        cloudflareZoneId: "123",
        acmeDirectoryUrl: "https://directory",
        acmeContacturl: "mailto:email",
      }),
    )
  })

  it("returns a default value for directory url when not provided", () => {
    // Given
    when(getEnvVarMock)
      .calledWith("AZURE_KEYVAULT_NAME")
      .mockReturnValue(Some("keyVaultName"))
      .calledWith("AZURE_KEYVAULT_SECRET_NAME")
      .mockReturnValue(Some("keyVaultNameSecretName"))
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
        azureKeyVaultCertificateName: "certificateName",
        azureSubscriptionId: "subscriptionId",
        azureResourceGroup: "resourceGroupName",
        cloudflareZoneId: "123",
        acmeDirectoryUrl:
          "https://acme-staging-v02.api.letsencrypt.org/directory",
        acmeContacturl: "mailto:email",
      }),
    )
  })
})
