export type CloudflareApiResult<T> =
  | CloudflareApiSuccessResult<T>
  | CloudflareApiErrorResult

export type CloudflareApiSuccessResult<T> = {
  success: true
  result: T
}

export type CloudflareApiErrorResult = {
  success: false
  errors: string[]
}

export type DnsRecord = {
  id: string
  type: string
  name: string
  content: string
  proxied?: boolean
}
