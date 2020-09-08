export type JsonObject = { [key in string]?: JsonValue }
export type JsonArray = JsonValue[]
export type JsonValue =
  | JsonObject
  | JsonArray
  | number
  | string
  | boolean
  | null

export type AppConfig = {
  context: string
  data: JsonObject
}

export type Config = {
  has(key: string): boolean

  keys(): string[]

  get(key?: string): JsonValue
  getOptional(key?: string): JsonValue | undefined

  getConfig(key: string): Config
  getOptionalConfig(key: string): Config | undefined

  getString(key: string): string
  getOptionalString(key: string): string | undefined
}
