export interface HttpResponse {
  headers?: { [index: string]: string }
  status: number
  body: string | Uint8Array
}

export const contentResult = (content: string): HttpResponse => ({
  status: 200,
  body: content,
})

export const imageResult = (
  image: Buffer,
  type: string,
  cache = "no-store, max-age=0",
  headers: Record<string, string> = {},
): HttpResponse => ({
  status: 200,
  headers: {
    ...headers,
    "Content-Type": type,
    "Cache-Control": cache,
  },
  body: image,
})

export const jsonResult = <T>(
  json: T,
  headers: Record<string, string> = {},
): HttpResponse => ({
  status: 200,
  headers: {
    ...headers,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(json),
})

export const badRequest = (msg?: string): HttpResponse => ({
  status: 400,
  body: msg ?? "Bad Request",
})

export const unAuthorized = (): HttpResponse => ({
  status: 403,
  body: "UnAuthorized",
})

export const notFound = (msg?: string): HttpResponse => ({
  status: 404,
  body: msg ?? "Not Found",
})

export const notAllowed = (msg?: string): HttpResponse => ({
  status: 405,
  body: msg ?? "Method not allowed",
})

export const internalServerError = (): HttpResponse => ({
  status: 500,
  body: "Internal Server Error",
})
