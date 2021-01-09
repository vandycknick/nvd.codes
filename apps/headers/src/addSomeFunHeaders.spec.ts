import makeServiceWorkerEnv from "service-worker-mock"
import { addSomeFunHeaders } from "./addSomeFunHeaders"

describe("addSomeFunHeaders", () => {
  beforeAll(() => {
    Object.assign(global, makeServiceWorkerEnv())
  })

  it("should add an x-powered-by header to a response", () => {
    // Given
    const headers = new Headers({
      "Content-Type": "text/html",
      "x-custom": "123",
    })
    const response = new Response("data", {
      status: 200,
      statusText: "Ok",
      headers,
    })

    // When
    const updated = addSomeFunHeaders(response)

    // Then
    expect(updated).toEqual(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers({
          "Content-Type": "text/html",
          "x-custom": "123",
          "x-powered-by": "Passion and tiny cute kittens",
          "X-nananana": "Batcache",
        }),
      }),
    )
  })
})
