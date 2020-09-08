import { ConfigBuilder } from "@nvd.codes/config"

const config = new ConfigBuilder().addEnvironmentVariables().build()

const appConfig = {
  GITHUB_TOKEN: config.getString("GITHUB_TOKEN"),
  ISSUE_QUERY: config.getString("ISSUE_QUERY"),
}

export const getConfig = () => appConfig
