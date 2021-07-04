import { RouterContext as Context } from "koa-router"
import { HttpResponse, jsonResult } from "@nvd.codes/http"

import getLatestCommit from "../services/getLatestCommit"
import getLatestRepositories from "../services/getLatestRepositories"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getActivities = async (_: Context): Promise<HttpResponse> => {
  const [latestCommit, projects] = await Promise.all([
    getLatestCommit(),
    getLatestRepositories(),
  ])

  // eslint-disable-next-line no-console
  console.log(
    `Found latest commit '${latestCommit.id}' and ${projects.length} projects`,
  )

  return jsonResult({
    latestCommit,
    projects,
  })
}

export default getActivities
