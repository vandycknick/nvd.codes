import { AzureFunction, Context } from "@azure/functions"

import "./function.json"

import getLatestCommit from "./getLatestCommit"
import getLatestRepositories from "./getLatestRepositories"

const getActivities: AzureFunction = async function (context: Context) {
  const [latestCommit, projects] = await Promise.all([
    getLatestCommit(),
    getLatestRepositories(),
  ])

  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      latestCommit,
      projects,
    },
  }
}

export default getActivities
