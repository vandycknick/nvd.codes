import makeServiceWorkerEnv from "service-worker-mock"
import { when } from "jest-when"
import { handleRequest } from "./handler"

describe("handleRequest", () => {
  let fetchMock: jest.MockedFunction<typeof fetch>

  beforeAll(() => {
    Object.assign(global, makeServiceWorkerEnv())
  })

  beforeEach(() => {
    fetchMock = jest.fn()

    Object.assign(global, { fetch: fetchMock })
  })

  it("should proxy a given request", async () => {
    // Given
    const request = new Request("/some/request")

    when(fetchMock).calledWith(request).mockResolvedValue(new Response("data"))

    // When
    const response = await handleRequest(request)

    // Then
    expect(response.body).toMatchInlineSnapshot(`
      Blob {
        "parts": Array [
          "data",
        ],
        "type": "",
      }
    `)
  })
})
