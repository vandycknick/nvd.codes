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
