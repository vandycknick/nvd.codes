import makeServiceWorkerEnv from "service-worker-mock"

import { addSecurityHeaders } from "./addSecurityHeaders"

describe("addSecurityHeaders", () => {
  beforeAll(() => {
    Object.assign(global, makeServiceWorkerEnv())
  })

  it("should not add any headers when the response has no content type", () => {
    // Given
    const response = new Response("data", {
      status: 200,
      statusText: "Ok",
    })

    // When
    const updated = addSecurityHeaders(response)

    // Then
    expect(response).toEqual(updated)
  })

  it("should not add any headers when the content-type is not text/html", () => {
    // Given
    const headers = new Headers({ "Content-Type": "application/json" })
    const response = new Response("data", {
      status: 200,
      statusText: "Ok",
      headers,
    })

    // When
    const updated = addSecurityHeaders(response)

    // Then
    expect(response).toEqual(updated)
  })

  it("should add security headers when the response is html", () => {
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
    const updated = addSecurityHeaders(response)

    // Then
    expect(updated).toEqual(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers({
          "Content-Type": "text/html",
          "x-custom": "123",
          "Content-Security-Policy": "upgrade-insecure-requests",
          "Strict-Transport-Security": "max-age=31536000",
          "X-Xss-Protection": "1; mode=block",
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Report-To": JSON.stringify({
            group: "default",
            max_age: 10886400,
            endpoints: [{ url: "https://nvdcodes.report-uri.com/a/d/g" }],
            include_subdomains: true,
          }),
        }),
      }),
    )
  })
})
