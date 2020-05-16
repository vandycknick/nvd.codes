class HttpError extends Error {
  constructor(public statusCode: number, public msg: string) {
    super(msg)
  }
}

const fetchJSON = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText)
  }
  const data = await response.json()
  return data
}

export { fetchJSON }
