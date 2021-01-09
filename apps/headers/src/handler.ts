import { addSecurityHeaders } from "./addSecurityHeaders"
import { addSomeFunHeaders } from "./addSomeFunHeaders"
import { pipe } from "./utils"

export const handleRequest = async (request: Request): Promise<Response> => {
  const response = await fetch(request)
  return pipe(addSecurityHeaders, addSomeFunHeaders)(response)
}
