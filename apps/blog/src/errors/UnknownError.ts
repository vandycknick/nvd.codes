import { Metadata, ServiceError, status } from "@grpc/grpc-js"

export class UnknownError extends Error implements ServiceError {
  metadata = new Metadata()

  code = status.UNKNOWN

  details = this.message
}
