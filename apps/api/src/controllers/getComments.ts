import { RouterContext as Context } from "koa-router"
import { HttpResponse, notFound, jsonResult } from "@nvd.codes/http"

import getCommentsForPost from "../services/getCommentsForPost"

const getSlug = (context: Context): string | undefined => context.params.slug

const getComments = async function (context: Context): Promise<HttpResponse> {
  const slug = getSlug(context)

  if (slug == null) {
    return notFound()
  }

  try {
    const commentsForPost = await getCommentsForPost(slug)
    return jsonResult(commentsForPost)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return notFound()
  }
}

export default getComments
