import { Context } from "@azure/functions"
import { HttpResponse, notFound, jsonResult } from "@nvd.codes/http"

import getCommentsForPost from "./getCommentsForPost"

const getSlug = (context: Context): string | undefined =>
  context.bindingData["slug"]

const getComments = async function (context: Context): Promise<HttpResponse> {
  const { log } = context
  const slug = getSlug(context)

  if (slug == null) {
    log.info("No slug found in bindingData, returning 404")
    return notFound()
  }

  const commentsForPost = await getCommentsForPost(slug)

  return commentsForPost.mapOrElse(
    (comments) => jsonResult(comments),
    (error) => {
      log.error(error)
      return notFound()
    },
  )
}

export default getComments
