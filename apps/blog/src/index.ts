// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./lib.d.ts" />
import { rmSync } from "fs"
import { Server, ServerCredentials } from "@grpc/grpc-js"
import { BlogService } from "@nvd.codes/blog-proto"

import { getConfig } from "./config"
import { BlogServer } from "./server"

const serve = (): void => {
  const configOrNone = getConfig()

  if (configOrNone.isNone()) {
    throw new Error("Invalid configuration!")
  }

  const config = configOrNone.unwrap()
  const server = new Server()

  server.addService(BlogService, new BlogServer(config))
  server.bindAsync(
    config.address,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        throw err
      }
      // eslint-disable-next-line no-console
      console.log(`Listening on ${port}`)
      server.start()
    },
  )

  if (config.address.startsWith("unix://")) {
    process.on("exit", () => rmSync(config.address.replace("unix://", "")))
  }
}

serve()
