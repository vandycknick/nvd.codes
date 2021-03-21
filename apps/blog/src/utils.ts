import { None, Option, Some } from "@nvd.codes/monad"

export const getEnvVar = (key: string): Option<string> => {
  const result = process.env[key]
  return result === undefined ? None() : Some(result)
}

export const getOptionalEnvVar = (
  key: string,
  defaultz: string,
): Option<string> => {
  const result = getEnvVar(key)
  return result.isNone() ? Some(defaultz) : result
}
