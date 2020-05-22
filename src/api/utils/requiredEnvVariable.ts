import optionalEnvVariable from "./optionalEnvVariable"

function requiredEnvVariable(
  envName: string,
  allowedValues?: null | undefined,
): string
function requiredEnvVariable<T>(envName: string, allowedValues: T[]): T
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function requiredEnvVariable<T>(
  envName: string,
  allowedValues?: T[] | null | undefined,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const value = optionalEnvVariable<T>(envName, allowedValues)

  if (value == null) {
    throw new Error(`Required env variable ${envName} is not set`)
  }

  return value
}

export default requiredEnvVariable
