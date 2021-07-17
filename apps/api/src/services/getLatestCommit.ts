import fetch from "node-fetch"
import { Commit } from "@nvd.codes/contracts"

import { getConfig } from "../config"

const query = `
query LatestCommit {
  viewer {
    repositories(first: 1, isFork: false, orderBy: {
      field: PUSHED_AT, direction: DESC
    }, privacy: PUBLIC) {
      nodes {
        object(expression: "HEAD") {
          __typename
          ... on Commit {
            history(first: 1) {
              nodes {
                id: oid
                url: commitUrl
                message
                messageHeadline
                pushedDate
                repositoryName: repository {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
`

type GraphQLResponse = {
  data: {
    viewer: {
      repositories: {
        nodes: {
          object: {
            history: {
              nodes: {
                id: string
                url: string
                message: string
                messageHeadline: string
                pushedDate: string
                repositoryName: {
                  name: string
                }
              }[]
            }
          }
        }[]
      }
    }
  }
}

const getLatestCommit = async (): Promise<Commit> => {
  const config = getConfig()
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `bearer ${config.githubToken}`,
    },
    body: JSON.stringify({
      query,
    }),
  })

  const graph: GraphQLResponse = await response.json()
  const node = graph.data.viewer.repositories.nodes[0].object.history.nodes[0]

  return {
    id: node.id,
    url: node.url,
    message: node.message,
    messageHeadline: node.messageHeadline,
    pushedDate: node.pushedDate,
    repositoryName: node.repositoryName.name,
  }
}

export default getLatestCommit
