import { JsonObject, Config } from "./types"
import { ConfigReader } from "./ConfigReader"

export class ConfigBuilder {
  private config: JsonObject = {}

  addEnvironmentVariables(): ConfigBuilder {
    this.config = Object.assign({}, this.config, process.env)
    return this
  }

  build(): Config {
    return new ConfigReader(this.config)
  }
}
