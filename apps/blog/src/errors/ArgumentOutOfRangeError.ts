import { Metadata, ServiceError, status } from "@grpc/grpc-js"

export class ArgumentOutOfRangeError extends Error implements ServiceError {
  metadata = new Metadata()

  code = status.INVALID_ARGUMENT

  details = this.message
}
