import { Metadata, ServiceError, status } from "@grpc/grpc-js"

export default class NotFoundError extends Error implements ServiceError {
  metadata = new Metadata()

  code = status.NOT_FOUND

  details = this.message
}
