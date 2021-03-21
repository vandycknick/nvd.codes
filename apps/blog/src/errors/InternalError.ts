import { Metadata, ServiceError, status } from "@grpc/grpc-js"

export class InternalError extends Error implements ServiceError {
  metadata = new Metadata()

  code = status.INTERNAL

  details = this.message
}
