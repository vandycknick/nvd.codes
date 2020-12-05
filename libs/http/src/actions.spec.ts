import {
  badRequest,
  contentResult,
  imageResult,
  jsonResult,
  notAllowed,
  notFound,
} from "./actions"

describe("badRequest", () => {
  it("should return a 400 Bad Request Http Response", () => {
    // Given, When
    const result = badRequest()

    // Then
    expect(result).toEqual({
      status: 400,
      body: "Bad Request",
    })
  })

  it("should return a 400 with custom message Http Respones", () => {
    // Given
    const msg = "Custom Message"
    // When
    const result = badRequest(msg)

    // Then
    expect(result).toEqual({
      status: 400,
      body: msg,
    })
  })
})

describe("notFound", () => {
  it("should return a 404 Not Found Http Response", () => {
    // Given, When
    const result = notFound()

    // Then
    expect(result).toEqual({
      status: 404,
      body: "Not Found",
    })
  })

  it("should return a 404 with custom message Http Respones", () => {
    // Given
    const msg = "Custom Message"
    // When
    const result = notFound(msg)

    // Then
    expect(result).toEqual({
      status: 404,
      body: msg,
    })
  })
})

describe("notAllowed", () => {
  it("should return a 405 Method not allowed Http Response", () => {
    // Given, When
    const result = notAllowed()

    // Then
    expect(result).toEqual({
      status: 405,
      body: "Method not allowed",
    })
  })

  it("should return a 405 with custom message Http Respones", () => {
    // Given
    const msg = "Custom Message"
    // When
    const result = notAllowed(msg)

    // Then
    expect(result).toEqual({
      status: 405,
      body: msg,
    })
  })
})

describe("contentResult", () => {
  it("should return a 200 text Http Response", () => {
    // Given, When
    const result = contentResult("Content")

    // Then
    expect(result).toEqual({
      status: 200,
      body: "Content",
    })
  })
})

describe("imageResult", () => {
  it("should return a 200 image Http Response", () => {
    // Given
    const image = Buffer.from([1, 2])
    const type = "image/jpeg"

    // When
    const response = imageResult(image, type)

    // Then
    expect(response).toEqual({
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": type,
      },
      body: image,
    })
  })

  it("should return a 200 image Http Response with custom cache control", () => {
    // Given
    const image = Buffer.from([1, 2])
    const type = "image/webp"
    const cache = "public, max-age=1"

    // When
    const response = imageResult(image, type, cache)

    // Then
    expect(response).toEqual({
      status: 200,
      headers: {
        "Cache-Control": cache,
        "Content-Type": type,
      },
      body: image,
    })
  })

  it("should return a 200 image Http Response with custom headers", () => {
    // Given
    const image = Buffer.from([1, 2])
    const type = "image/webp"
    const cache = "public, max-age=1"

    // When
    const response = imageResult(image, type, cache, { "x-user": "1" })

    // Then
    expect(response).toEqual({
      status: 200,
      headers: {
        "Cache-Control": cache,
        "Content-Type": type,
        "x-user": "1",
      },
      body: image,
    })
  })
})

describe("jsonResult", () => {
  it("should return a 200 json response", () => {
    // Given
    const person = {
      name: "nick",
      title: "software engineer",
    }

    // When
    const result = jsonResult(person)

    // Then
    expect(result).toEqual({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
  })

  it("should return a 200 json response with custom headers", () => {
    // Given
    const person = {
      name: "nick",
      title: "software engineer",
    }

    // When
    const result = jsonResult(person, { "x-user-id": "1" })

    // Then
    expect(result).toEqual({
      status: 200,
      headers: {
        "x-user-id": "1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
  })

  it("should return a 200 json response with custom headers but not override content-type", () => {
    // Given
    const person = {
      name: "nick",
      title: "software engineer",
    }

    // When
    const result = jsonResult(person, { "Content-Type": "text/html" })

    // Then
    expect(result).toEqual({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
  })
})
