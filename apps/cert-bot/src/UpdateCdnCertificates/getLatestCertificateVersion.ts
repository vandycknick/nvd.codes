import { None, Some } from "@nvd.codes/monad"
import { AzureApi } from "../api/azure"
import { Logger } from "../logger"

export const getLatestCertificateVersion = async (
  vaultName: string,
  certificateName: string,
  azure: AzureApi,
  log: Logger,
) => {
  const latestCertificateOrError = await azure.getKeyVaultCertificate(
    vaultName,
    certificateName,
  )

  if (latestCertificateOrError.isErr()) {
    log.error(
      "[getLatestCertificateVersion] ApiError:",
      latestCertificateOrError.unwrapErr(),
    )
    return None()
  }

  return latestCertificateOrError.unwrap().andThen((cert) => {
    const version = cert.id.split("/").pop()
    return Some<string>(version)
  })
}
