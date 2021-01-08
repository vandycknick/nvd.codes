import { Err, None, Ok, Some } from "@nvd.codes/monad"
import { getEnvVar, getOptionalEnvVar, parseAzureResourceId } from "./utils"

describe("getEnvVar", () => {
  it("should return None when the given env var is not present", () => {
    // Given, When
    const result = getEnvVar("__DOES_NOT_EXIST__")

    // Then
    expect(result).toStrictEqual(None())
  })

  it("should return Some(value) when the given env var is present", () => {
    // Given, When
    const result = getEnvVar("NODE_ENV")

    // Then
    expect(result).toStrictEqual(Some("test"))
  })
})

describe("getOptionalEnvVar", () => {
  it("should return Some(fallback) when the given env var is not present", () => {
    // Given, When
    const result = getOptionalEnvVar("__DOES_NOT_EXIST__", "fallback")

    // Then
    expect(result).toStrictEqual(Some("fallback"))
  })

  it("should return Some(value), when the given env var is present", () => {
    // Given, When
    const result = getOptionalEnvVar("NODE_ENV", "fallback")

    // Then
    expect(result).toEqual(Some("test"))
  })
})

describe("parseAzureResourceId", () => {
  it("should return an error when the given input is not a valid resource id", () => {
    // Given
    const resourceId = "invalidId"

    // When
    const resultOrError = parseAzureResourceId(resourceId)

    // Then
    expect(resultOrError).toStrictEqual(
      Err(`Failed parsing for ${resourceId}, invalid resourceId format!`),
    )
  })

  it.each([
    [
      "/subscriptions/38da7c21-219f-481f-964b-9ef02f0ee81a/resourcegroups/resource-group-name67/providers/Microsoft.Cdn/profiles/profile-name-123/endpoints/endpoint-name-123",
      {
        subscriptionId: "38da7c21-219f-481f-964b-9ef02f0ee81a",
        resourceGroupName: "resource-group-name67",
        provider: "Microsoft.Cdn",
        resourceType: "endpoints",
        resourceName: "endpoint-name-123",
        uri: "profiles/profile-name-123/endpoints/endpoint-name-123",
      },
    ],
    [
      "/subscriptions/f671c3d6-6ae8-4bc2-8ffb-81846c8e777b/resourceGroups/resg-456/providers/Microsoft.Web/serverfarms/some-plan4f9uf743",
      {
        subscriptionId: "f671c3d6-6ae8-4bc2-8ffb-81846c8e777b",
        resourceGroupName: "resg-456",
        provider: "Microsoft.Web",
        resourceType: "serverfarms",
        resourceName: "some-plan4f9uf743",
        uri: "serverfarms/some-plan4f9uf743",
      },
    ],
    [
      "/subscriptions/bef6cf17-a440-4383-87da-95f36ac3e3e3/resourceGroups/resg-21iejd/providers/Microsoft.KeyVault/vaults/vault-name829dj",
      {
        subscriptionId: "bef6cf17-a440-4383-87da-95f36ac3e3e3",
        resourceGroupName: "resg-21iejd",
        provider: "Microsoft.KeyVault",
        resourceType: "vaults",
        resourceName: "vault-name829dj",
        uri: "vaults/vault-name829dj",
      },
    ],
    [
      "/subscriptions/d7436e3a-ea23-4b50-9d37-22418254415f/resourceGroups/resg-3289du/providers/Microsoft.EventGrid/eventSubscriptions/subs8329dj",
      {
        subscriptionId: "d7436e3a-ea23-4b50-9d37-22418254415f",
        resourceGroupName: "resg-3289du",
        provider: "Microsoft.EventGrid",
        resourceType: "eventSubscriptions",
        resourceName: "subs8329dj",
        uri: "eventSubscriptions/subs8329dj",
      },
    ],
  ])("should correclty parse a azure resourceId %s", (resourceId, result) => {
    // Given, When
    const resultOrError = parseAzureResourceId(resourceId)

    // Then
    expect(resultOrError).toStrictEqual(Ok(result))
  })
})
