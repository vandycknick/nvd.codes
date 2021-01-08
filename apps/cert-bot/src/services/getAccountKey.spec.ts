import { Err, None, Ok, Some } from "@nvd.codes/monad"

import { getAccountKey } from "./getAccountKey"
import { createAzureApiMock } from "../api/azure.mock"

describe("getAccountKey", () => {
  const mockAzureApi = createAzureApiMock()

  beforeEach(() => {
    mockAzureApi.mockRestore()
    mockAzureApi.mockClear()
  })

  it("should return an error when azure key vault returns an error getting the account secret", async () => {
    // Given
    const keyVaultName = "keyVaultName"
    const secretName = "secretName"

    mockAzureApi.vault.getSecret.mockResolvedValue(
      Err({ statusCode: 500, message: "Server Error" }),
    )

    // When
    const resultOrError = await getAccountKey(
      keyVaultName,
      secretName,
      mockAzureApi,
    )

    // Then
    expect(resultOrError).toStrictEqual(
      Err("Got an error fetching current private key from key vault!"),
    )
  })

  it("should return the account key from azure key vault when already present", async () => {
    // Given
    const keyVaultName = "keyVaultName"
    const secretName = "secretName"

    mockAzureApi.vault.getSecret.mockResolvedValue(
      Ok(Some({ value: "key", version: "123" })),
    )

    // When
    const resultOrError = await getAccountKey(
      keyVaultName,
      secretName,
      mockAzureApi,
    )

    // Then
    expect(resultOrError).toStrictEqual(Ok("key"))
  })

  it("should create a new account key when one is not present already in the vault", async () => {
    // Given
    const keyVaultName = "keyVaultName"
    const secretName = "secretName"

    mockAzureApi.vault.getSecret.mockResolvedValue(Ok(None()))
    mockAzureApi.vault.setSecret.mockResolvedValue(Ok("id"))

    // When
    const resultOrError = await getAccountKey(
      keyVaultName,
      secretName,
      mockAzureApi,
    )

    // Then
    expect(mockAzureApi.vault.setSecret).toHaveBeenCalledWith(
      keyVaultName,
      secretName,
      expect.any(String),
    )
    expect(resultOrError).toStrictEqual(Ok(expect.any(String)))
  })

  it("should return an error when can't save a new account key in the vault", async () => {
    // Given
    const keyVaultName = "keyVaultName"
    const secretName = "secretName"

    mockAzureApi.vault.getSecret.mockResolvedValue(Ok(None()))
    mockAzureApi.vault.setSecret.mockResolvedValue(
      Err({
        statusCode: 500,
        message: "Server Error",
      }),
    )

    // When
    const resultOrError = await getAccountKey(
      keyVaultName,
      secretName,
      mockAzureApi,
    )

    // Then
    expect(resultOrError).toStrictEqual(
      Err("Got an error setting a new private key in key vault!"),
    )
  })
})
