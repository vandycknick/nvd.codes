import { BindingDefinition, Context, Logger } from "@azure/functions"

export const createMockContext = (
  bindingDefinitions: unknown[],
): jest.Mocked<Context> => {
  const log = (jest.fn() as unknown) as jest.MockInstance<void, []> & Logger

  log.verbose = jest.fn()
  log.info = jest.fn()
  log.warn = jest.fn()
  log.error = jest.fn()
  return {
    invocationId: "123",
    executionContext: {
      invocationId: "123",
      functionName: "ImageOptimizer",
      functionDirectory: "ImageOptimizer",
    },
    bindings: {},
    bindingData: {},
    traceContext: {
      traceparent: undefined,
      tracestate: undefined,
      attributes: {},
    },
    bindingDefinitions: bindingDefinitions as BindingDefinition[],
    log,
    done: jest.fn(),
  }
}

const sufixes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
export const byteSize = (bytes: number): string => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (
    (!bytes && "0 Bytes") ||
    (bytes / Math.pow(1024, i)).toFixed(2) + " " + sufixes[i]
  )
}
