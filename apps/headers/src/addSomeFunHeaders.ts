export const addSomeFunHeaders = (response: Response): Response => {
  const headers = new Headers(response.headers)

  headers.set("X-Powered-By", "Passion and tiny cute kittens")
  headers.set("X-nananana", "Batcache")

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
