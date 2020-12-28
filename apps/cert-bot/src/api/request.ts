import { Err, Ok, Result } from "@nvd.codes/monad"
import fetch, { RequestInit } from "node-fetch"

export type ApiError = {
  statusCode: number
  message: string
  data?: string
}

export const sendJsonRequest = async <T>(
  endpoint: string,
  options: RequestInit,
): Promise<Result<T, ApiError>> => {
  const response = await fetch(endpoint, options)

  if (response.ok) {
    const cloned = response.clone()
    return response
      .json()
      .then((data) => Ok<T, ApiError>(data as T))
      .catch(() =>
        cloned.text().then((data) =>
          Err<T, ApiError>({
            statusCode: -1,
            message: "Failed parsing json response!",
            data,
          }),
        ),
      )
  }

  return response.text().then((data) =>
    Err<T, ApiError>({
      statusCode: response.status,
      message: response.statusText,
      data,
    }),
  )
}
