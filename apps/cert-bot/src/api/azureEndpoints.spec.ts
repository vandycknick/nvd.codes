import { getManagementEndpoint, getVaultEndpoint } from "./azureEndpoints"

describe("getmanagementEndpoint", () => {
  it("should return a url to the azure management api", () => {
    // Given
    const subscriptionId = "123"
    const resourceGroup = "group"

    // When
    const endpoint = getManagementEndpoint(
      subscriptionId,
      resourceGroup,
      "/some/url",
    )

    // Then
    expect(endpoint).toBe(
      "https://management.azure.com/subscriptions/123/resourceGroups/group/some/url",
    )
  })
})

describe("getVaultEndpoint", () => {
  it("should return a url to the azure vault api", () => {
    // Given
    const keyVaultName = "name"

    // When
    const endpoint = getVaultEndpoint(keyVaultName, "/some/url")

    // Then
    expect(endpoint).toBe("https://name.vault.azure.net/some/url")
  })
})
