// https://docs.microsoft.com/en-us/rest/api/appservice/webapps/get#site
export type Site = {
  id: string
  kind: string
  location: string
  name: string
  properties: {
    hostNames: string[]
    hostNamesDisabled: boolean
  }
  tags: Record<string, string>
  type: string
}
