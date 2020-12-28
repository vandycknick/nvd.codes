import { None, Some } from "@nvd.codes/monad"
import { getEnvVar, getOptionalEnvVar } from "./utils"

describe("getEnvVar", () => {
  it("should return None when the given env var is not present", () => {
    // Given, When
    const result = getEnvVar("__DOES_NOT_EXIST__")

    // Then
    expect(result).toStrictEqual(None())
  })

  it("should return Some(value) when the given env var is present", () => {
    // Given, When
    const result = getEnvVar("NODE_ENV")

    // Then
    expect(result).toStrictEqual(Some("test"))
  })
})

describe("getOptionalEnvVar", () => {
  it("should return Some(fallback) when the given env var is not present", () => {
    // Given, When
    const result = getOptionalEnvVar("__DOES_NOT_EXIST__", "fallback")

    // Then
    expect(result).toStrictEqual(Some("fallback"))
  })

  it("should return Some(value), when the given env var is present", () => {
    // Given, When
    const result = getOptionalEnvVar("NODE_ENV", "fallback")

    // Then
    expect(result).toEqual(Some("test"))
  })
})
