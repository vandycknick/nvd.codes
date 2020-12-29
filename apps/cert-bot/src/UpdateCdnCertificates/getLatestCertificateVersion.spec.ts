import { Err, None, Ok, Some } from "@nvd.codes/monad"
import { when } from "jest-when"
import { AzureApi } from "../api/azure"
import { Logger } from "../logger"
import { getLatestCertificateVersion } from "./getLatestCertificateVersion"

describe("getLatestCertificateVersion", () => {
  let mockAzureApi: jest.Mocked<AzureApi>
  let mockLogger: jest.Mocked<Logger>

  beforeEach(() => {
    mockAzureApi = {
      listResources: jest.fn(),
      getCdnCustomDomainCertificate: jest.fn(),
      setCdnCustomDomainCertificate: jest.fn(),
      getKeyVaultCertificate: jest.fn(),
      setKeyVaultCertificate: jest.fn(),
      getKeyVaultSecret: jest.fn(),
      setKeyVaultSecret: jest.fn(),
    }

    mockLogger = {
      verbose: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }
  })

  it("should return none when azure key vault api returns an error", async () => {
    // Given
    const vaultName = "vaultName"
    const certificateName = "certificateName"

    when(mockAzureApi.getKeyVaultCertificate)
      .calledWith(vaultName, certificateName)
      .mockResolvedValue(
        Err({
          message: "Server Error",
          statusCode: 500,
        }),
      )

    // When
    const latestVersionOrNone = await getLatestCertificateVersion(
      vaultName,
      certificateName,
      mockAzureApi,
      mockLogger,
    )

    // Then
    expect(latestVersionOrNone).toStrictEqual(None())
    expect(mockLogger.error).toHaveBeenCalledWith(
      "[getLatestCertificateVersion] ApiError:",
      {
        message: "Server Error",
        statusCode: 500,
      },
    )
  })

  it("should return None when no certificate is returned from the vault", async () => {
    // Given
    const vaultName = "vaultName"
    const certificateName = "certificateName"

    when(mockAzureApi.getKeyVaultCertificate)
      .calledWith(vaultName, certificateName)
      .mockResolvedValue(Ok(None()))

    // When
    const latestVersionOrNone = await getLatestCertificateVersion(
      vaultName,
      certificateName,
      mockAzureApi,
      mockLogger,
    )

    // Then
    expect(latestVersionOrNone).toStrictEqual(None())
  })

  //   it("should return None when it can't parse the version from the returned certificate id", async () => {
  //     // Given
  //     const vaultName = "vaultName"
  //     const certificateName = "certificateName"

  //     when(mockAzureApi.getKeyVaultCertificate)
  //       .calledWith(vaultName, certificateName)
  //       .mockResolvedValue(Ok(Some({ id: "some-invalid-id", cer: "cer" })))

  //     // When
  //     const latestVersionOrNone = await getLatestCertificateVersion(
  //       vaultName,
  //       certificateName,
  //       mockAzureApi,
  //       mockLogger,
  //     )

  //     // Then
  //     expect(latestVersionOrNone).toStrictEqual(None())
  //   })

  it("should return Some version from the returned certificate", async () => {
    // Given
    const vaultName = "vaultName"
    const certificateName = "certificateName"

    when(mockAzureApi.getKeyVaultCertificate)
      .calledWith(vaultName, certificateName)
      .mockResolvedValue(
        Ok(Some({ id: "https://name.vault.azure.net/some/123", cer: "cer" })),
      )

    // When
    const latestVersionOrNone = await getLatestCertificateVersion(
      vaultName,
      certificateName,
      mockAzureApi,
      mockLogger,
    )

    // Then
    expect(latestVersionOrNone).toStrictEqual(Some("123"))
  })
})
