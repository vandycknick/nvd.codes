import { AzureFunction, Context } from "@azure/functions"

import "./function.json"

import getLatestCommit from "./getLatestCommit"
import getLatestRepositories from "./getLatestRepositories"

const getActivities: AzureFunction = async function (
  context: Context,
): Promise<void> {
  const [latestCommit, projects] = await Promise.all([
    getLatestCommit(),
    getLatestRepositories(),
  ])

  context.res = {
    body: {
      latestCommit,
      projects,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }
}

export default getActivities
