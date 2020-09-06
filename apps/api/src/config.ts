import requiredEnvVariable from "./utils/requiredEnvVariable"

type AppConfig = {
  GITHUB_TOKEN: string
  ISSUE_QUERY: string
}

const config: AppConfig = {
  GITHUB_TOKEN: requiredEnvVariable("GITHUB_TOKEN"),
  ISSUE_QUERY: requiredEnvVariable("ISSUE_QUERY"),
}

export default config
