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
      .calledWith("AZURE_KEYVAULT_CERTIFICATE_NAME")
      .mockReturnValue(Some("certificateName"))
      .calledWith("AZURE_SUBSCRIPTION_ID")
      .mockReturnValue(Some("subscriptionId"))
      .calledWith("AZURE_RESOURCE_GROUP")
      .mockReturnValue(Some("resourceGroupName"))

    // When
    const settings = getSettings()

    // Then
    expect(settings).toStrictEqual(
      Some({
        azureKeyVaultName: "keyVaultName",
        azureKeyVaultCertificateName: "certificateName",
        azureSubscriptionId: "subscriptionId",
        azureResourceGroup: "resourceGroupName",
      }),
    )
  })
})
