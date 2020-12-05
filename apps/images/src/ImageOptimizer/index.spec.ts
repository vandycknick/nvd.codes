import imageOptimizer from "./index"
import functionJson from "./function.json"
import { createMockContext } from "../utils"
import { downloadFile } from "./downloadFile"

jest.mock("./downloadFile")
jest.mock("../config.ts", () => ({
  getConfig: jest.fn(() => ({
    AZURE_STORAGE_CONNECTION_STRING: "one",
    IMAGES_CONTAINER: "conainer",
  })),
}))

const createImageOptimizerMockContext = () => {
  return createMockContext(functionJson.bindings)
}

describe("imageOptimizer", () => {
  const downloadFileMock = downloadFile as jest.MockedFunction<
    typeof downloadFile
  >

  beforeEach(() => {
    const buffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP87CPxCQAF3AJL+UURowAAAABJRU5ErkJggg==",
      "base64",
    )
    downloadFileMock.mockReset()
    downloadFileMock.mockResolvedValue({
      contentType: "image/png",
      contents: buffer,
    })
  })

  it("should return a 404 when req is undefined", async () => {
    // Given
    const context = createImageOptimizerMockContext()

    // When
    const response = await imageOptimizer(context)

    // Then
    expect(response).toEqual({
      status: 404,
      body: "Not Found",
    })
  })

  it.each`
    method      | status | body
    ${"POST"}   | ${405} | ${"Method not allowed"}
    ${"DELETE"} | ${405} | ${"Method not allowed"}
    ${"PATCH"}  | ${405} | ${"Method not allowed"}
    ${"PUT"}    | ${405} | ${"Method not allowed"}
    ${"TRACE"}  | ${405} | ${"Method not allowed"}
  `(
    "should return a $status when req is a $method method",
    async ({ method, status, body }) => {
      // Given
      const context = createImageOptimizerMockContext()
      context.req = {
        method,
        url: "/_next/images/one.jpg",
        headers: {},
        query: {},
        params: {},
      }

      // When
      const response = await imageOptimizer(context)

      // Then
      expect(response).toEqual({
        status,
        body,
      })
    },
  )

  it.each`
    imagePath                | status | body
    ${undefined}             | ${404} | ${"Not Found"}
    ${""}                    | ${404} | ${"Not Found"}
    ${"subfolder"}           | ${404} | ${"Not Found"}
    ${"subfolder/subfolder"} | ${404} | ${"Not Found"}
  `(
    "should return a $status when imagePath parameter is '$imagePath'",
    async ({ imagePath, status, body }) => {
      // Given
      const context = createImageOptimizerMockContext()
      context.req = {
        method: "GET",
        url: `/_next/images/${imagePath ?? ""}`,
        headers: {},
        query: {},
        params: { imagePath },
      }

      // When
      const response = await imageOptimizer(context)

      // Then
      expect(response).toEqual({
        status,
        body,
      })
    },
  )

  it("should return a 400 when no width query string is provided", async () => {
    // Given
    const context = createImageOptimizerMockContext()
    const imagePath = "image.jpeg"
    context.req = {
      method: "GET",
      url: `/_next/images/${imagePath ?? ""}`,
      headers: {},
      query: {},
      params: { imagePath },
    }

    // When
    const response = await imageOptimizer(context)

    // Then
    expect(response).toEqual({
      status: 400,
      body: "'w' parameter (width) is required",
    })
  })

  it.each`
    width         | status | body
    ${"OO10"}     | ${400} | ${"'w' parameter (width) must be a number greater than 0"}
    ${"string"}   | ${400} | ${"'w' parameter (width) must be a number greater than 0"}
    ${"Infinity"} | ${400} | ${"'w' parameter (width) must be a number greater than 0"}
    ${"0x10"}     | ${400} | ${"'w' parameter (width) must be a number greater than 0"}
    ${"-32879"}   | ${400} | ${"'w' parameter (width) of -32879 is not allowed"}
    ${"266"}      | ${400} | ${"'w' parameter (width) of 266 is not allowed"}
    ${"644"}      | ${400} | ${"'w' parameter (width) of 644 is not allowed"}
    ${"4000"}     | ${400} | ${"'w' parameter (width) of 4000 is not allowed"}
  `(
    "should return a $status when given $width as width query string",
    async ({ width, status, body }) => {
      // Given
      const context = createImageOptimizerMockContext()
      const imagePath = "image.jpeg"
      context.req = {
        method: "GET",
        url: `/_next/images/${imagePath ?? ""}?w=${width}`,
        headers: {},
        query: { w: width },
        params: { imagePath },
      }

      // When
      const response = await imageOptimizer(context)

      // Then
      expect(response).toEqual({
        status,
        body,
      })
    },
  )

  it("should return a 404 when downloadFile returns undefined", async () => {
    // Given
    downloadFileMock.mockReset()
    downloadFileMock.mockResolvedValue(undefined)
    const context = createImageOptimizerMockContext()
    const imagePath = "image.png"
    const width = "256"
    context.req = {
      method: "GET",
      url: `/_next/images/${imagePath ?? ""}?w=${width}`,
      headers: {},
      query: { w: width },
      params: { imagePath },
    }

    // When
    const response = await imageOptimizer(context)

    // Then
    expect(response).toEqual({
      status: 404,
      body: "Not Found",
    })
  })

  it("should return a 200 image jpeg result when no content-type is given", async () => {
    // Given
    const buffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP87CPxCQAF3AJL+UURowAAAABJRU5ErkJggg==",
      "base64",
    )
    downloadFileMock.mockReset()
    downloadFileMock.mockResolvedValue({
      contents: buffer,
    })
    const context = createImageOptimizerMockContext()
    const imagePath = "image.jpeg"
    const width = "256"
    context.req = {
      method: "GET",
      url: `/_next/images/${imagePath ?? ""}?w=${width}`,
      headers: {},
      query: { w: width },
      params: { imagePath },
    }

    // When
    const response = await imageOptimizer(context)

    // Then
    expect(response).toMatchSnapshot()
  })

  it.each`
    type
    ${"jpeg"}
    ${"png"}
    ${"unknown"}
    ${"webp"}
  `(
    "should return a 200 image $type result when no content-type is given but the filetype is $type",
    async ({ type }) => {
      // Given
      const buffer = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP87CPxCQAF3AJL+UURowAAAABJRU5ErkJggg==",
        "base64",
      )
      downloadFileMock.mockReset()
      downloadFileMock.mockResolvedValue({
        contentType: `image/${type}`,
        contents: buffer,
      })
      const context = createImageOptimizerMockContext()
      const imagePath = "image.jpeg"
      const width = "16"
      context.req = {
        method: "GET",
        url: `/_next/images/${imagePath ?? ""}?w=${width}`,
        headers: {},
        query: { w: width },
        params: { imagePath },
      }

      // When
      const response = await imageOptimizer(context)

      // Then
      expect(response).toMatchSnapshot()
    },
  )

  it("should return a 200 image webp result when the request contains an accept header", async () => {
    // Given
    const context = createImageOptimizerMockContext()
    const imagePath = "image.jpeg"
    const width = "16"
    context.req = {
      method: "GET",
      url: `/_next/images/${imagePath ?? ""}?w=${width}`,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      query: { w: width },
      params: { imagePath },
    }

    // When
    const response = await imageOptimizer(context)

    // Then
    expect(response).toMatchSnapshot()
  })

  it("should return a 404 when download the image file fails", async () => {
    // Given
    downloadFileMock.mockReset()
    downloadFileMock.mockRejectedValue("Not found")
    const context = createImageOptimizerMockContext()
    const imagePath = "image.jpeg"
    const width = "16"
    context.req = {
      method: "GET",
      url: `/_next/images/${imagePath ?? ""}?w=${width}`,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      query: { w: width },
      params: { imagePath },
    }

    // When
    const response = await imageOptimizer(context)

    // Then
    expect(response).toEqual({
      status: 404,
      body: "Not Found",
    })
  })
})
