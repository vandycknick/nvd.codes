import requiredEnvVariable from "./utils/requiredEnvVariable"

type AppConfig = {
  GITHUB_TOKEN: string
}

const config: AppConfig = {
  GITHUB_TOKEN: requiredEnvVariable("GITHUB_TOKEN"),
}

export default config
