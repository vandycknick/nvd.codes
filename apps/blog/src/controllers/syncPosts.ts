import { Context } from "koa"
import {
  jsonResult,
  badRequest,
  unAuthorized,
  internalServerError,
} from "@nvd.codes/http"
import { hasValidSignature } from "../services/hasValidSignature"
import { startSyncPostsJob } from "../services/startSyncPostsJob"

const isNullOrEmpty = (input: string | undefined | null): boolean =>
  input == undefined || input == ""

const isPushedToDefaultBranch = (event: GithubPushEvent): boolean =>
  event.ref === `refs/heads/${event.repository.default_branch}`

export const syncPosts = async ({ request, log: logger }: Context) => {
  const event = request.get("x-github-event")
  if (event === "installation" || event === "ping") {
    return jsonResult({ status: "Ok" })
  }

  if (event !== "push") {
    return badRequest(
      `Only push events supported but got ${
        isNullOrEmpty(event) ? "undefined" : event
      }.`,
    )
  }

  const payload = request.rawBody
  if (isNullOrEmpty(payload)) {
    logger.info("Payload is empty")
    return badRequest("Empty Body")
  }

  const signature = request.get("x-hub-signature")

  if (isNullOrEmpty(signature)) {
    logger.info("No signature set with x-hub-signature")
    return unAuthorized()
  }

  if (!hasValidSignature(payload, signature)) {
    logger.info("Invalid signature")
    return unAuthorized()
  }

  try {
    const pushEvent = JSON.parse(request.rawBody) as GithubPushEvent

    if (!isPushedToDefaultBranch(pushEvent)) {
      return jsonResult({ status: "Ok", msg: "Not pushed to default branch!" })
    }

    logger.info({
      msg: "Starting sync job.",
      branch: pushEvent.repository.default_branch,
      commit: pushEvent.after,
      repository: pushEvent.repository.url,
    })

    const uuid = await startSyncPostsJob({
      branch: pushEvent.repository.default_branch,
      commit: pushEvent.after,
      repository: pushEvent.repository.url,
    })
    return jsonResult({ status: "Ok", msg: "Job started!", jobId: uuid })
  } catch (ex) {
    logger.error(ex)
    return internalServerError()
  }
}
