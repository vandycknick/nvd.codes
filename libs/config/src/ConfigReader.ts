import { Config, JsonObject, JsonValue } from "./types"

const CONFIG_KEY_PART_PATTERN = /^[a-z][a-z0-9]*(?:[-_][a-z][a-z0-9]*)*$/i

function isObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function typeOf(value: JsonValue | undefined): string {
  if (value === null) {
    return "null"
  } else if (Array.isArray(value)) {
    return "array"
  }
  const type = typeof value
  if (type === "number" && isNaN(value as number)) {
    return "nan"
  }
  if (type === "string" && value === "") {
    return "empty-string"
  }
  return type
}

const errors = {
  type(key: string, context: string, typeName: string, expected: string) {
    return `Invalid type in config for key '${key}' in '${context}', got ${typeName}, wanted ${expected}`
  },
  missing(key: string) {
    return `Missing required config value at '${key}'`
  },
  convert(key: string, context: string, expected: string) {
    return `Unable to convert config value for key '${key}' in '${context}' to a ${expected}`
  },
}

export class ConfigReader implements Config {
  constructor(
    private readonly data: JsonObject,
    private readonly context: string = "empty-config",
    private readonly prefix: string = "",
  ) {}

  has(key: string): boolean {
    const value = this.readValue(key)
    return value !== undefined
  }

  keys(): string[] {
    const localKeys = this.data ? Object.keys(this.data) : []
    return [...new Set(localKeys)]
  }

  get(key?: string | undefined): import("./types").JsonValue {
    const value = this.getOptional(key)
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key ?? "")))
    }
    return value
  }

  getOptional(key?: string | undefined): JsonValue | undefined {
    const value = this.readValue(key)
    return value
  }

  getConfig(key: string): Config {
    const value = this.getOptionalConfig(key)
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key)))
    }
    return value
  }

  getOptionalConfig(key: string): Config | undefined {
    const value = this.getOptional(key)
    const prefix = this.fullKey(key)

    if (isObject(value)) {
      return new ConfigReader(value, this.context, prefix)
    }
    return undefined
  }

  getString(key: string): string {
    const value = this.getOptionalString(key)
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key)))
    }
    return value
  }

  getOptionalString(key: string): string | undefined {
    const value = this.getOptional(key)
    if (value !== undefined && typeof value === "string" && value !== "") {
      return value
    }

    return undefined
  }

  private fullKey(key: string): string {
    return `${this.prefix}${this.prefix ? "." : ""}${key}`
  }

  private readValue(key?: string): JsonValue | undefined {
    const parts = key ? key.split(".") : []
    for (const part of parts) {
      if (!CONFIG_KEY_PART_PATTERN.test(part)) {
        throw new TypeError(`Invalid config key '${key}'`)
      }
    }

    if (this.data === undefined) {
      return undefined
    }

    let value: JsonValue | undefined = this.data
    for (const [index, part] of parts.entries()) {
      if (isObject(value)) {
        value = value[part]
      } else if (value !== undefined) {
        const badKey = this.fullKey(parts.slice(0, index).join("."))
        throw new TypeError(
          errors.type(badKey, this.context, typeOf(value), "object"),
        )
      }
    }

    return value
  }
}
