import { Context } from "@azure/functions"
import { HttpResponse, jsonResult } from "@nvd.codes/http"

import getLatestCommit from "./getLatestCommit"
import getLatestRepositories from "./getLatestRepositories"

const getActivities = async function (context: Context): Promise<HttpResponse> {
  const { log } = context

  log.verbose("Fetching latest commit and projects!")
  const [latestCommit, projects] = await Promise.all([
    getLatestCommit(),
    getLatestRepositories(),
  ])

  log.verbose(
    `Found latest commit '${latestCommit.id}' and ${projects.length} projects`,
  )

  return jsonResult({
    latestCommit,
    projects,
  })
}

export default getActivities
