import { ConfigBuilder, Config } from "@nvd.codes/config"

let config: Config | undefined = undefined

export const getConfig = () => {
  if (config === undefined) {
    config = new ConfigBuilder().addEnvironmentVariables().build()
  }

  return {
    AZURE_STORAGE_CONNECTION_STRING: config.getString(
      "AZURE_STORAGE_CONNECTION_STRING",
    ),
    IMAGES_CONTAINER: config.getString("IMAGES_CONTAINER"),
  }
}
