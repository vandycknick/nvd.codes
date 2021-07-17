export const getEnvVar = (key: string, defaultz?: string): string => {
  const result = process.env[key]

  if (result == undefined && defaultz != undefined) {
    return defaultz
  } else if (result != undefined) {
    return result
  }

  throw new Error(`Required environment variable '${key}' is not defined!`)
}

export const getEnvVarAsInt = (key: string, defaultz: number): number => {
  const result = getEnvVar(key, "")

  if (result == "") {
    return defaultz
  }

  return parseInt(result, 10)
}

export const getOptionalEnvVar = (key: string, defaultz: string) => {
  const result = process.env[key]

  if (result != undefined) {
    return result
  }

  return defaultz
}
