function optionalEnvVariable(
  envName: string,
  allowedValues?: null | undefined,
): string | undefined
function optionalEnvVariable<T>(envName: string, allowedValues: T[]): T

function optionalEnvVariable<T>(
  envName: string,
  allowedValues: T[] | null | undefined,
): T {
  // @ts-expect-error
  const value: T = process.env[envName]

  if (allowedValues != null) {
    const isInDomain = value == null || allowedValues.includes(value)
    if (!isInDomain) {
      throw new Error(
        `Env variable ${envName} is set to ${value}, which is not one of the allowed values (${allowedValues})`,
      )
    }
  }

  return value
}

export default optionalEnvVariable
