export type ResourceListResult = {
  value: GenericResource[]
  nextLink?: string
}

export type GenericResource = {
  id: string
  name: string
  type: string
  location: string
  tags?: Record<string, string>
}
