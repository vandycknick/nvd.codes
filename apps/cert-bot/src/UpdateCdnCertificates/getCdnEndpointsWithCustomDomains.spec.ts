import { Err, Ok } from "@nvd.codes/monad"
import { when } from "jest-when"

import { getCdnEndpointsWithCustomDomains } from "./getCdnEndpointsWithCustomDomains"
import { AzureApi } from "../api/azure"

describe("getCdnEndpointsWithCustomDomains", () => {
  let azureApi: jest.Mocked<AzureApi>

  beforeEach(() => {
    azureApi = {
      listResources: jest.fn(),
      getCdnCustomDomainCertificate: jest.fn(),
      setCdnCustomDomainCertificate: jest.fn(),
      getKeyVaultCertificate: jest.fn(),
      setKeyVaultCertificate: jest.fn(),
      getKeyVaultSecret: jest.fn(),
      setKeyVaultSecret: jest.fn(),
    }
  })

  it("should return an empty array when an error is returned from the api", async () => {
    // Given
    const tagName = "tagName"

    when(azureApi.listResources)
      .calledWith("resourceType eq 'Microsoft.Cdn/profiles/endpoints'")
      .mockResolvedValue(
        Err({
          message: "Server Error",
          statusCode: 500,
        }),
      )

    // When
    const endpoints = await getCdnEndpointsWithCustomDomains(tagName, azureApi)

    // Then
    expect(endpoints).toEqual([])
  })

  it("should only return endpoints that are tagged with the given tagName", async () => {
    // Given
    const tagName = "tagName"

    when(azureApi.listResources)
      .calledWith("resourceType eq 'Microsoft.Cdn/profiles/endpoints'")
      .mockResolvedValue(
        Ok({
          value: [
            {
              id: "123",
              name: "profile-name-1/profile-endpoint-name-1",
              type: "Microsoft.Cdn/profiles/endpoints",
              location: "location",
            },
            {
              id: "456",
              name: "profile-name-2/profile-endpoint-name-2",
              type: "Microsoft.Cdn/profiles/endpoints",
              location: "location",
              tags: {
                tagName: "example.com",
              },
            },
          ],
        }),
      )

    // When
    const endpoints = await getCdnEndpointsWithCustomDomains(tagName, azureApi)

    // Then
    expect(endpoints).toHaveLength(1)
  })

  it("should return a new object for each tagged cdn endpoint", async () => {
    // Given
    const tagName = "tagName"

    when(azureApi.listResources)
      .calledWith("resourceType eq 'Microsoft.Cdn/profiles/endpoints'")
      .mockResolvedValue(
        Ok({
          value: [
            {
              id: "123",
              name: "profile-name-1/profile-endpoint-name-1",
              type: "Microsoft.Cdn/profiles/endpoints",
              location: "location",
              tags: {
                tagName: "www.example.com",
              },
            },
            {
              id: "456",
              name: "profile-name-2/profile-endpoint-name-2",
              type: "Microsoft.Cdn/profiles/endpoints",
              location: "location",
              tags: {
                tagName: "example.com",
              },
            },
          ],
        }),
      )

    // When
    const endpoints = await getCdnEndpointsWithCustomDomains(tagName, azureApi)

    // Then
    expect(endpoints).toEqual([
      {
        profileName: "profile-name-1",
        endpointName: "profile-endpoint-name-1",
        domainName: "www.example.com",
      },
      {
        profileName: "profile-name-2",
        endpointName: "profile-endpoint-name-2",
        domainName: "example.com",
      },
    ])
  })
})
