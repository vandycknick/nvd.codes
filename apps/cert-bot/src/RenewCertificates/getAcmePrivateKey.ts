import { Err, Ok } from "@nvd.codes/monad"
import { AzureApi } from "../api/azure"
import { createPrivateKey } from "../utils"

export const getAccountKey = async (
  keyVaultName: string,
  secretName: string,
  azureApi: AzureApi,
) => {
  const privateKeyOrError = await azureApi.getKeyVaultSecret(
    keyVaultName,
    secretName,
  )

  if (privateKeyOrError.isErr()) {
    return Err("Got an error fetching current private key from key vault!")
  }

  const privateKeyOrNone = privateKeyOrError.unwrap()

  if (privateKeyOrNone.isNone()) {
    const privateKey = await createPrivateKey(4096)

    const resultOrError = await azureApi.setKeyVaultSecret(
      keyVaultName,
      secretName,
      privateKey,
    )

    if (resultOrError.isErr()) {
      return Err("Got an error setting a new private key in key vault!")
    }

    return Ok(privateKey)
  }

  return Ok(privateKeyOrNone.unwrap().value)
}
